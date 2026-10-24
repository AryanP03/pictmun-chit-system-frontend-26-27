import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendChit } from "../../hooks/useSendChit";
import { useFetchRecipients } from "../../hooks/useFetchReceipents";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

const ChitEntry = () => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [isViaEb, setIsViaEb] = useState<boolean>(false);
  const { sendChit, isLoading } = useSendChit();
  const { recipients, loading: recipientsLoading } = useFetchRecipients();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log({ message, isViaEb, recipientId });
      await sendChit(message, isViaEb, recipientId);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setRecipientId("");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-start px-5 sm:px-8 md:px-12 lg:px-16 pt-2 sm:pt-2.5 md:pt-3 pb-2 w-full h-full overflow-y-auto">
      <Card className="max-w-2xl w-full bg-transparent border-0 shadow-none p-0">
        <CardHeader className="px-0 py-0 pb-1.5 sm:pb-2">
          <CardTitle className="text-2xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Create New Chit
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="px-0 space-y-2 sm:space-y-2.5">
            {/* Via EB Checkbox */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-muted/30 rounded-lg border-l-4 border-l-primary">
              <Checkbox
                id="via-eb"
                className="size-4.5 sm:size-5"
                checked={isViaEb}
                onCheckedChange={() => setIsViaEb(!isViaEb)}
              />
              <Label
                htmlFor="via-eb"
                className="text-sm sm:text-base font-medium cursor-pointer select-none"
              >
                Send message via EB
              </Label>
            </div>

            {/* Recipient Selection */}
            <div className="space-y-1">
              <Label
                htmlFor="recipient"
                className="text-sm sm:text-base font-semibold text-foreground"
              >
                Recipient
              </Label>
              <Select onValueChange={setRecipientId} value={recipientId}>
                <SelectTrigger className="h-9.5 sm:h-10 text-sm sm:text-base">
                  <SelectValue
                    className="w-full"
                    placeholder={
                      recipientsLoading
                        ? "Loading recipients..."
                        : "Select a recipient"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.portfolio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <Label
                htmlFor="message"
                className="text-sm sm:text-base font-semibold text-foreground"
              >
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Enter your message..."
                className="h-24 sm:h-28 md:h-30 max-h-40 resize-none [field-sizing:fixed] overflow-y-auto p-2.5 sm:p-3 text-sm sm:text-base leading-relaxed"
              />
            </div>
          </CardContent>

          <CardFooter className="px-0 pt-2 sm:pt-2.5">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-9.5 sm:h-10 text-sm sm:text-base px-8 font-semibold w-full"
            >
              {isLoading ? "Sending..." : "Submit Chit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ChitEntry;
