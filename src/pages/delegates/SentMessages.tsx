import { useState } from "react";
import { Link } from "react-router-dom";
import { formatMessageTime } from "../../lib/utils";
import { useSentConversation } from "../../hooks/useFetchSentMessages";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ITEMS_PER_PAGE = 15;

const SentMessages = () => {
  const { conversations, loading } = useSentConversation();
  const [currentPage, setCurrentPage] = useState(1);

  const sortedConversations = Array.isArray(conversations)
    ? [...conversations]
        .filter((conversation) => conversation.messages?.length > 0)
        .sort((a, b) => {
          const latestMessageA = a.messages.reduce(
            (latest: any, message: any) =>
              new Date(message.createdAt).getTime() >
              new Date(latest.createdAt).getTime()
                ? message
                : latest,
            a.messages[0]
          );

          const latestMessageB = b.messages.reduce(
            (latest: any, message: any) =>
              new Date(message.createdAt).getTime() >
              new Date(latest.createdAt).getTime()
                ? message
                : latest,
            b.messages[0]
          );

          return (
            new Date(latestMessageB?.createdAt).getTime() -
            new Date(latestMessageA?.createdAt).getTime()
          );
        })
    : [];

  const totalPages = Math.ceil(sortedConversations.length / ITEMS_PER_PAGE);

  const paginatedConversations = sortedConversations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <Loading classes="w-full h-full" />;
  }

  return (
    <div className="p-5 w-full">
      <div className="mb-5 flex flex-col items-start justify-center gap-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Sent Chits</h2>
        <p className="text-muted-foreground text-sm">
          {sortedConversations?.length > 0
            ? `You have ${sortedConversations.length} conversations in your inbox`
            : "You have no conversations in your inbox"}
        </p>
      </div>
      {sortedConversations?.length === 0 && <NoMessage />}

      <ul className="border rounded-lg mx-auto w-[90%] md:w-full divide-y divide-y-muted-foreground max-w-4xl">
        {paginatedConversations.map((conversation, index: number) => (
          <li key={index}>
            <Link
              to={`/chit/${conversation.id}`}
              className="flex items-center p-4 hover:bg-muted cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold mr-4">
                {conversation.messages[0]?.sender?.portfolio?.charAt(0) || "?"}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary text-xl">
                    {conversation.messages[0]?.sender?.portfolio ||
                      "Unknown Sender"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(conversation.messages[0]?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground text-sm line-clamp-2">
                    {conversation.messages[0]?.body || "No message available"}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {sortedConversations.length > ITEMS_PER_PAGE && (
        <div className="flex items-center w-full mx-auto max-w-4xl justify-end gap-4 mt-4">
          <Button
            variant={"outline"}
            size={"icon"}
            className=" bg-muted rounded-lg text-primary disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className=" h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-sm">{currentPage}</span>
          <Button
            variant={"outline"}
            size={"icon"}
            className=" bg-muted rounded-lg text-primary disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowRight className=" h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SentMessages;
