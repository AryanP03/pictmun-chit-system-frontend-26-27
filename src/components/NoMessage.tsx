import { Card, CardDescription, CardTitle } from "./ui/card";

interface NoMessageProps {
  className?: string;
  title?: string;
  description?: string;
}

export const NoMessage: React.FC<NoMessageProps> = ({
  className = "",
  title = "No messages found",
  description = "It looks like you haven’t received any messages yet. Once you do, they will appear here.",
}) => {
  return (
    <Card
      className={`mx-auto mt-[6vh] md:mt-[8vh] max-h-[30vh] p-6 max-w-xl text-center shadow-none mb-8 ${className}`}
    >
      <CardTitle className="text-2xl mb-2 font-semibold">{title}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </CardDescription>
    </Card>
  );
};
