import { useEffect, useState, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Shared set of notified message IDs across the application session
// to ensure no duplicates occur across rerenders, reconnects, or refetches
const notifiedMessageIds = new Set<string>();

export const registerLoadedMessageIds = (messagesOrConversations: any[]) => {
  if (!Array.isArray(messagesOrConversations)) return;
  messagesOrConversations.forEach((item) => {
    if (item?.id) notifiedMessageIds.add(item.id);
    if (Array.isArray(item?.messages)) {
      item.messages.forEach((m: any) => {
        if (m?.id) notifiedMessageIds.add(m.id);
      });
    }
  });
};

export const useChitNotifications = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  });

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return "unsupported";
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return Notification.permission;
    }
  }, []);

  const triggerNotification = useCallback(
    (senderPortfolio: string, messageBody: string, conversationId: string) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      const trimmedBody =
        messageBody.length > 180 ? `${messageBody.slice(0, 177)}...` : messageBody;

      try {
        const notification = new Notification("New Chit Received", {
          body: `From: ${senderPortfolio} — ${trimmedBody}`,
          icon: "/logo2026.png",
          badge: "/logo2026.png",
          tag: `chit-${conversationId}-${Date.now()}`,
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          if (conversationId) {
            navigate(`/chit/${conversationId}`);
          }
          notification.close();
        };
      } catch (err) {
        console.error("Failed to display browser notification:", err);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!socket || !authUser) return;

    // 1. Direct incoming chit / new conversation
    const handleNewMessage = (raw: string) => {
      try {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        const conversationId = data.id || data.conversationId;
        const msg = Array.isArray(data.messages) ? data.messages[0] : data;

        if (!msg || !msg.id) return;
        if (notifiedMessageIds.has(msg.id)) return;
        notifiedMessageIds.add(msg.id);

        // Never notify sender about their own outgoing chits
        const senderId = msg.sender?.id || msg.senderId;
        if (senderId && senderId === authUser.id) return;

        const senderPortfolio =
          msg.sender?.portfolio || data.sender?.portfolio || "Executive Board";
        const content = msg.body || "";

        triggerNotification(senderPortfolio, content, conversationId);
      } catch (err) {
        console.error("Error handling newMessage for notification:", err);
      }
    };

    // 2. Reply to existing conversation
    const handleReply = (raw: string) => {
      try {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        const messageId = data.id;
        if (!messageId) return;

        if (notifiedMessageIds.has(messageId)) return;
        notifiedMessageIds.add(messageId);

        // Never notify sender of their own reply
        const senderId = data.senderId || data.sender?.id;
        if (senderId && senderId === authUser.id) return;

        const senderPortfolio = data.sender?.portfolio || "Executive Board";
        const content = data.body || "";
        const conversationId = data.conversationId;

        triggerNotification(senderPortfolio, content, conversationId);
      } catch (err) {
        console.error("Error handling reply for notification:", err);
      }
    };

    // 3. Status update (e.g. EB approved chit arriving for recipient delegate)
    const handleStatusUpdated = (raw: string) => {
      try {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const latest = data.messages[data.messages.length - 1];
          if (!latest || !latest.id) return;
          if (notifiedMessageIds.has(latest.id)) return;
          notifiedMessageIds.add(latest.id);

          const senderId = latest.sender?.id || latest.senderId;
          if (senderId && senderId === authUser.id) return;

          const senderPortfolio = latest.sender?.portfolio || "Executive Board";
          triggerNotification(senderPortfolio, latest.body || "", data.id);
        } else if (data.id && data.body) {
          if (notifiedMessageIds.has(data.id)) return;
          notifiedMessageIds.add(data.id);

          const senderId = data.sender?.id || data.senderId;
          if (senderId && senderId === authUser.id) return;

          const senderPortfolio = data.sender?.portfolio || "Executive Board";
          triggerNotification(senderPortfolio, data.body || "", data.conversationId);
        }
      } catch (err) {
        console.error("Error handling status update notification:", err);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("reply", handleReply);
    socket.on("messageStatusUpdated", handleStatusUpdated);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("reply", handleReply);
      socket.off("messageStatusUpdated", handleStatusUpdated);
    };
  }, [socket, authUser, triggerNotification]);

  return {
    permission,
    requestPermission,
    registerExistingMessages: registerLoadedMessageIds,
  };
};
