import { Card, CardDescription, CardTitle } from "./ui/card";

interface NoMessageProps {
  className?: string;
}

export const NoMessage: React.FC<NoMessageProps> = ({ className = "" }) => {
  return (
    <Card
      className={`mx-auto mt-[6vh] md:mt-[8vh] max-h-[30vh] p-6 max-w-xl text-center shadow-none mb-8 ${className}`}
    >
      <CardTitle className="text-2xl mb-2 font-semibold">No messages found</CardTitle>
      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
        It looks like you haven’t received any messages yet. Once you do, they
        will appear here.
      </CardDescription>
    </Card>
  );
};
