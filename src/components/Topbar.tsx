import { useAuthContext } from "../context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/mode-toggle";
import LogoutButton from "./LogoutButton";
import { MobileNavbar } from "./MobileNavbar";

export const Topbar = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="px-6 py-2 border-b-2 w-full mx-auto flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img src="/logo.webp" alt="logo" className="w-12" />
      </Link>
      <div className="flex items-center gap-4">
        {authUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-12 cursor-pointer">
                <AvatarFallback className="text-xl">
                  {authUser.portfolio.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <div className="flex flex-col gap-0">
                  <p className="font-semibold text-lg">
                    {authUser.portfolio.length > 10
                      ? `${authUser.portfolio.substring(0, 10)}...`
                      : authUser.portfolio}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase">
                    {authUser.committee}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-transparent">
                <LogoutButton classList="w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ModeToggle />
        <MobileNavbar />
      </div>
    </div>
  );
};
