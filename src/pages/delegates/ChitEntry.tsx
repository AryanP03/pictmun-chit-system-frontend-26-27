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
    <div className="flex justify-start px-6 md:px-12 lg:px-16 mt-8 md:mt-12 lg:mt-16">
      <Card className="max-w-2xl w-full bg-transparent border-0 shadow-none p-0">
        <CardHeader className="px-0 pb-6">
          <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
            New Chit
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="px-0 space-y-6">
            {/* Via EB Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
              <Checkbox
                id="via-eb"
                className="size-5"
                checked={isViaEb}
                onCheckedChange={() => setIsViaEb(!isViaEb)}
              />
              <Label
                htmlFor="via-eb"
                className="text-base font-medium cursor-pointer"
              >
                Send message via EB
              </Label>
            </div>

            {/* Recipient Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="recipient"
                className="text-base font-semibold text-foreground"
              >
                Recipient
              </Label>
              <Select onValueChange={setRecipientId} value={recipientId}>
                <SelectTrigger className="h-12 text-base">
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
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-base font-semibold text-foreground"
              >
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Enter your message..."
                className="min-h-32 resize-none p-4 text-base leading-relaxed"
              />
            </div>
          </CardContent>

          <CardFooter className="px-0 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="text-base px-8 py-3 font-semibold min-w-40 md:w-full"
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
