import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { formatMessageTime } from "../../lib/utils";
import { SendIcon, XIcon } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useReplyMessage } from "../../hooks/useReplyMessage";
import { toast } from "sonner";
import useListenMessages from "../../hooks/useListenMessages";

const ChitModal = ({
  messages,
}: {
  messages: any;
  onUpdate?: (message: any) => void;
}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { loading, replyMessage } = useReplyMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef<boolean>(true);
  const initialScrollDoneRef = useRef<boolean>(false);
  useListenMessages();

  // Auto-resize textarea height as content changes (ChatGPT-style)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // User is near the bottom if within 60px of the bottom edge
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
  };

  // Scroll to bottom on initial mount or when messages change, unless user has scrolled up
  useEffect(() => {
    if (messages?.length > 0 && messagesContainerRef.current) {
      if (!initialScrollDoneRef.current) {
        scrollToBottom("auto");
        initialScrollDoneRef.current = true;
      } else if (isAtBottomRef.current) {
        scrollToBottom("smooth");
      }
    }
  }, [messages?.length, scrollToBottom]);

  const handleReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (message.trim() === "") return toast.error("Message cannot be empty");
    replyMessage(message, messages[0].conversationId);
    setMessage(""); // Clear input field after sending
    isAtBottomRef.current = true;
    setTimeout(() => {
      scrollToBottom("smooth");
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && message.trim() !== "") {
        handleReply();
      }
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-full max-h-full flex flex-col min-h-0 overflow-hidden bg-background">
      {/* Region 1: Fixed Conversation Header */}
      <header className="flex-shrink-0 px-5 sm:px-6 py-3.5 border-b border-[#A67C52]/25 flex justify-between items-center z-10 bg-background/95 backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Chit</h2>
        <div className="flex items-center gap-3 sm:gap-4">
          {messages[0]?.isViaEB && (
            <div className="py-1 px-3 rounded-full text-primary bg-slate-800 text-xs sm:text-sm font-medium">
              Via EB
            </div>
          )}

          <Button
            onClick={handleClose}
            className="size-8 rounded-lg"
            variant={"outline"}
            size={"icon"}
            aria-label="Close conversation"
          >
            <XIcon className="size-4 sm:size-5" />
          </Button>
        </div>
      </header>

      {/* Region 2: Scrollable Conversation/Message History */}
      <div
        id="message-history"
        data-testid="message-history"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-4"
      >
        {messages.map((msg: any, index: number) => (
          <div
            key={index}
            className="flex flex-col justify-start pb-3.5 border-b border-[#A67C52]/15 last:border-b-0"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-full size-10 sm:size-11 bg-primary/10 dark:bg-primary/20 text-primary font-bold flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                  {msg?.sender?.portfolio?.charAt(0) || "?"}
                </div>
                <p className="font-semibold text-base sm:text-lg text-primary">
                  {msg?.sender?.portfolio || "Unknown"}
                </p>
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                {formatMessageTime(msg?.createdAt)}
              </div>
            </div>
            <div className="mt-2 text-foreground text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap pl-[52px]">
              {msg?.body}
            </div>
          </div>
        ))}
      </div>

      {/* Region 3: Fixed-Position Chat Composer Anchored to Bottom */}
      <footer
        id="chat-composer"
        data-testid="chat-composer"
        className="flex-shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-t border-[#A67C52]/30 bg-background z-20"
      >
        <form onSubmit={handleReply} className="w-full">
          <div className="relative flex items-end w-full rounded-2xl bg-background border border-[#A67C52] focus-within:border-[#A67C52] focus-within:ring-2 focus-within:ring-[#A67C52]/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Reply to this chit..."
              aria-label="Send reply"
              className="w-full bg-transparent text-[#F2E9DB] placeholder:text-[#F2E9DB]/40 text-sm sm:text-base py-3 pl-4 pr-12 sm:pr-14 outline-none resize-none min-h-[46px] max-h-40 leading-relaxed rounded-2xl"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Send reply"
              title="Send reply"
              className={`absolute right-2 sm:right-2.5 bottom-2 sm:bottom-2.5 size-8 sm:size-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                message.trim() && !loading
                  ? "bg-gradient-to-r from-[#8C6239] via-[#C89F6B] to-[#8C6239] text-[#0B2B26] shadow-[0_0_12px_rgba(166,124,82,0.4)] hover:brightness-110 active:scale-95 cursor-pointer"
                  : "bg-[#A67C52]/15 text-[#F2E9DB]/40 border border-[#A67C52]/30 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <SendIcon className="size-4 sm:size-4.5 translate-x-px" />
              )}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ChitModal;

