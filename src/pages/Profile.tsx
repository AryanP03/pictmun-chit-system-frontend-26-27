import { useAuthContext } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { User } from "lucide-react";

const Profile = () => {
  const { authUser } = useAuthContext();

  if (!authUser) {
    return null;
  }

  // Get first letter of portfolio for avatar fallback
  const avatarFallback = authUser.portfolio
    ? authUser.portfolio[0].toUpperCase()
    : "U";

  return (
    <div className="flex  min-h-screen px-6 py-8">
      <Card className="w-full lg:max-w-lg p-4">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="size-20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                  authUser.portfolio || authUser.username
                }`}
                alt={authUser.portfolio || authUser.username}
              />
              <AvatarFallback className="text-2xl lg:text-3xl font-bold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl lg:text-2xl font-bold text-foreground">
            Profile
          </CardTitle>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-2"></div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-base font-semibold text-foreground flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={authUser.username || ""}
              readOnly
              className="h-12 text-base bg-muted/50 border-muted-foreground/20"
            />
          </div>

          {/* Portfolio */}
          <div className="space-y-2">
            <Label
              htmlFor="portfolio"
              className="text-base font-semibold text-foreground"
            >
              Portfolio
            </Label>
            <Input
              id="portfolio"
              type="text"
              value={authUser.portfolio || ""}
              readOnly
              className="h-12 text-base bg-muted/50 border-muted-foreground/20"
            />
          </div>

          {/* Committee */}
          <div className="space-y-2">
            <Label
              htmlFor="committee"
              className="text-base font-semibold text-foreground"
            >
              Committee
            </Label>
            <Input
              id="committee"
              type="text"
              value={authUser.committee || "Not Assigned"}
              readOnly
              className="h-12 text-base bg-muted/50 border-muted-foreground/20"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-base font-semibold text-foreground"
            >
              Role
            </Label>
            <Input
              id="role"
              type="text"
              value={authUser.role || ""}
              readOnly
              className="h-12 text-base bg-muted/50 border-muted-foreground/20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
