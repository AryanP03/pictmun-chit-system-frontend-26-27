import { useState } from "react";
import { Link } from "react-router-dom";
import { formatMessageTime } from "../../lib/utils";
import { useSentConversation } from "../../hooks/useFetchSentMessages";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useListenMessages from "../../hooks/useListenMessages";

const ITEMS_PER_PAGE = 15;

const SentMessages = () => {
  const { conversations, loading } = useSentConversation();
  const [currentPage, setCurrentPage] = useState(1);
  useListenMessages();

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
    <div className="p-5 w-full h-full max-h-full flex flex-col min-h-0 overflow-hidden">
      {/* Fixed Heading / Introduction */}
      <div className="mb-5 flex flex-col items-start justify-center gap-1.5 flex-shrink-0">
        <h2 className="text-2xl md:text-3xl font-semibold">Sent Chits</h2>
        <p className="text-muted-foreground text-sm">
          {sortedConversations?.length > 0
            ? `You have ${sortedConversations.length} sent chits`
            : "You have sent no chits"}
        </p>
      </div>

      {/* Vertically scrollable listing area */}
      <div
        id="conversation-list"
        data-testid="conversation-list"
        className="flex-1 min-h-0 overflow-y-auto pr-1"
      >
        {sortedConversations?.length === 0 && (
          <div className="w-full flex flex-col items-center">
            <NoMessage description="It looks like you haven’t sent any chits yet. Once you do, they will appear here." />
            <div
              id="golden-divider"
              data-testid="golden-divider"
              className="border border-border rounded-lg w-[90%] md:w-full max-w-5xl"
            />
          </div>
        )}

        {sortedConversations?.length > 0 && (
          <ul className="border border-border rounded-lg mx-auto w-[90%] md:w-full divide-y divide-y-muted-foreground max-w-5xl">
            {paginatedConversations.map((conversation, index: number) => {
              const latestMessage = conversation.messages?.sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )[0];

              return (
                <li key={index}>
                  <Link
                    to={`/chit/${conversation.id}`}
                    className="flex items-center p-4 hover:bg-muted cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold mr-4">
                      {conversation.messages[0]?.sender?.portfolio?.charAt(0) || "?"}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-primary text-xl">
                            {conversation.messages[0]?.sender?.portfolio ||
                              "Unknown Sender"}
                          </span>
                          {latestMessage?.isViaEB && (
                            <>
                              <span
                                data-testid="via-eb-badge"
                                className="py-0.5 px-2.5 rounded-full text-primary bg-slate-800 text-xs font-medium"
                              >
                                Via EB
                              </span>
                              {latestMessage?.status === "PENDING" && (
                                <span
                                  data-testid="eb-status-badge"
                                  className="py-0.5 px-2.5 rounded-full text-amber-300 bg-amber-950/60 border border-amber-600/40 text-xs font-medium"
                                >
                                  Pending
                                </span>
                              )}
                              {latestMessage?.status === "APPROVED" && (
                                <span
                                  data-testid="eb-status-badge"
                                  className="py-0.5 px-2.5 rounded-full text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 text-xs font-medium"
                                >
                                  Approved
                                </span>
                              )}
                              {latestMessage?.status === "REJECTED" && (
                                <span
                                  data-testid="eb-status-badge"
                                  className="py-0.5 px-2.5 rounded-full text-rose-300 bg-rose-950/60 border border-rose-600/40 text-xs font-medium"
                                >
                                  Rejected
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {latestMessage?.createdAt
                            ? formatMessageTime(latestMessage.createdAt)
                            : "No Date"}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="font-semibold text-muted-foreground text-sm line-clamp-2">
                          {latestMessage?.body || "No message available"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Fixed Pagination Controls if > ITEMS_PER_PAGE */}
      {sortedConversations.length > ITEMS_PER_PAGE && (
        <div className="flex-shrink-0 flex items-center w-full mx-auto max-w-5xl justify-end gap-4 pt-4">
          <Button
            variant={"outline"}
            size={"icon"}
            className="bg-muted rounded-lg text-primary disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-sm">{currentPage}</span>
          <Button
            variant={"outline"}
            size={"icon"}
            className="bg-muted rounded-lg text-primary disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SentMessages;
