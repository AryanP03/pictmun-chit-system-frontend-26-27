import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { useFetchOneEbMessage } from "../../hooks/useFetchOneEbMessage";
import { EBMessage } from "../../components/EBMessage";
import { Button } from "../../components/ui/button";
import { RefreshCcw, XIcon } from "lucide-react";
import { useConversation } from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { TooltipContent } from "../../components/ui/tooltip";
import { Tooltip } from "../../components/ui/tooltip";
import { TooltipProvider } from "../../components/ui/tooltip";
import { TooltipTrigger } from "../../components/ui/tooltip";

const BoardModal = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchMessages, loading, message } = useFetchOneEbMessage();
  const { addMessagesToEBConversation } = useConversation();
  const { socket } = useSocketContext();
  const [newMessages, setNewMessages] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) fetchMessages(id);
  }, [id]);
  useEffect(() => {
    if (!socket || !message?.conversationId) return;

    const handleReply = (msg: any) => {
      if (msg) {
        setNewMessages(true);
      }
    };

    socket.on("reply", handleReply);
    return () => {
      socket.off("reply", handleReply);
    };
  }, [socket, message, addMessagesToEBConversation]);
  const handleClose = () => {
    navigate("/eb-board");
  };

  if (loading) {
    return <Loading classes="w-full h-full" />;
  }

  if (!message) {
    return <NoMessage />;
  }
  //Add functionality that refresh after every 45 second
  return (
    <div className="w-full h-full max-h-full flex flex-col min-h-0 overflow-hidden bg-background p-5 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-semibold">Chit Details</h2>

        <div className="flex items-center gap-2">
          {newMessages && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setNewMessages(false);
                      window.location.reload();
                    }}
                    variant={"outline"}
                    size={"icon"}
                  >
                    <RefreshCcw className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh to see new messages.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button
            onClick={handleClose}
            className="size-8"
            variant={"outline"}
            size={"icon"}
          >
            <XIcon className="size-5" />
          </Button>
        </div>
      </div>

      <div
        id="eb-chit-details-list"
        data-testid="eb-chit-details-list"
        className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col gap-3"
      >
        {message.messages?.map((messge: any, index: number) => (
          <EBMessage
            key={index}
            message={messge}
            conversationId={message.conversationId}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardModal;
