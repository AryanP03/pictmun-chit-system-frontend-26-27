import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useConversation } from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setConversations, conversations } = useConversation();

  useEffect(() => {
    if (!socket) return;

    // 1. New Message Handler
    const handleNewMessage = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        setConversations((prevConversations: any[]) => {
          // Check if conversation already exists
          const existingConvIndex = prevConversations.findIndex(
            (conv) => conv.id === parsedMessage.id
          );

          if (existingConvIndex !== -1) {
            // Update existing conversation
            const updatedConversations = [...prevConversations];
            updatedConversations[existingConvIndex] = {
              ...updatedConversations[existingConvIndex],
              messages: [
                ...updatedConversations[existingConvIndex].messages,
                ...parsedMessage.messages,
              ],
            };
            return updatedConversations;
          } else {
            // Add new conversation
            return [parsedMessage, ...prevConversations];
          }
        });
      } catch (error) {
        console.error("Error parsing new message:", error);
      }
    };

    // 2. Reply Handler
    const handleReply = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        const newMessage = {
          id: parsedMessage.id,
          body: parsedMessage.body,
          createdAt: parsedMessage.createdAt,
          updatedAt: parsedMessage.updatedAt,
          senderId: parsedMessage.senderId,
          conversationId: parsedMessage.conversationId,
          isViaEB: parsedMessage.isViaEB,
          status: parsedMessage.status,
          score: parsedMessage.score,
          sender: {
            id: parsedMessage.sender.id,
            username: parsedMessage.sender.username,
            portfolio: parsedMessage.sender.portfolio,
          },
        };
        // Immutable state update
        if (parsedMessage.isViaEB) {
          setConversations((prevConversations: any[]) =>
            prevConversations.map((conversation) =>
              conversation.conversationId === parsedMessage.conversationId
                ? {
                    ...conversation,
                    messages: [...conversation.messages, newMessage], // Create a new array with the new message
                  }
                : conversation
            )
          );
        } else {
          setConversations((prevConversations: any[]) =>
            prevConversations.map((conversation) =>
              conversation.id === parsedMessage.conversationId
                ? {
                    ...conversation,
                    messages: [...conversation.messages, newMessage], // Create a new array with the new message
                  }
                : conversation
            )
          );
        }
      } catch (error) {
        console.error("Error parsing reply:", error);
      }
    };

    // 3. Status Update Handler
    const handleStatusUpdate = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);

        // Case A: Payload is a conversation object with messages array
        if (parsedMessage.messages && Array.isArray(parsedMessage.messages)) {
          setConversations((prevConversations: any[]) => {
            const index = prevConversations.findIndex(
              (conv) => conv.id === parsedMessage.id
            );
            if (index !== -1) {
              const updated = [...prevConversations];
              updated[index] = {
                ...updated[index],
                ...parsedMessage,
              };
              return updated;
            }
            return [parsedMessage, ...prevConversations];
          });
        } else if (parsedMessage.conversationId && parsedMessage.id) {
          // Case B: Payload is an individual message update { id, status, score, conversationId, ... }
          setConversations((prevConversations: any[]) =>
            prevConversations.map((conv) => {
              if (
                conv.id === parsedMessage.conversationId ||
                conv.conversationId === parsedMessage.conversationId
              ) {
                const messageExists = conv.messages?.some(
                  (m: any) => m.id === parsedMessage.id
                );
                return {
                  ...conv,
                  messages: messageExists
                    ? conv.messages.map((m: any) =>
                        m.id === parsedMessage.id
                          ? { ...m, status: parsedMessage.status, score: parsedMessage.score }
                          : m
                      )
                    : [...(conv.messages || []), parsedMessage],
                };
              }
              return conv;
            })
          );
        }
      } catch (error) {
        console.error("Error parsing status update:", error);
      }
    };

    // Attach listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("reply", handleReply);
    socket.on("messageStatusUpdated", handleStatusUpdate);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("reply", handleReply);
      socket.off("messageStatusUpdated", handleStatusUpdate);
    };
  }, [socket, setConversations, conversations]);

  return null;
};

export default useListenMessages;
