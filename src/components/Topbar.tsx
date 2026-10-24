import { useAuthContext } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { MobileNavbar } from "./MobileNavbar";
import { getDelegateFlag } from "../lib/flagMapping";

export const Topbar = () => {
  const { authUser } = useAuthContext();
  const flagInfo = getDelegateFlag(authUser?.role, authUser?.portfolio);

  return (
    <header className="px-5 md:px-8 py-2.5 bg-[#0B2B26] border-b border-[#A67C52]/35 w-full flex items-center justify-between sticky top-0 z-40 backdrop-blur-md shadow-lg transition-colors">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative size-10 md:size-11 rounded-full p-[2px] bg-gradient-to-tr from-[#A67C52] via-[#F5DEB3] to-[#8C6239] shadow-md flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <div className="w-full h-full rounded-full bg-[#0B2B26] overflow-hidden flex items-center justify-center">
            <img
              src="/logo2026.png"
              alt="PICT MUN 2026 Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-base md:text-lg text-[#F2E9DB] tracking-wider group-hover:text-[#FFF4D6] transition-colors">
            PICT MUN <span className="text-[#A67C52]">2026</span>
          </span>
          <span className="text-[10px] md:text-xs text-[#A67C52] tracking-[0.2em] uppercase font-medium">
            Chit Portal
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-3 md:gap-4">
        {authUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10 cursor-pointer border-2 border-[#A67C52]/60 hover:border-[#A67C52] hover:shadow-[0_0_12px_rgba(166,124,82,0.4)] transition-all overflow-hidden rounded-full">
                {flagInfo ? (
                  <AvatarImage
                    src={flagInfo.flagUrl}
                    alt={flagInfo.name}
                    className="size-full object-contain"
                  />
                ) : null}
                <AvatarFallback className="text-base font-bold bg-[#174A3A] text-[#F2E9DB]">
                  {authUser.portfolio.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0B2B26] border border-[#A67C52]/40 text-[#F2E9DB] p-2 shadow-2xl">
              <DropdownMenuItem className="focus:bg-[#174A3A] cursor-default">
                <div className="flex flex-col gap-0.5 w-full">
                  <p className="font-semibold text-base text-[#F2E9DB] truncate">
                    {authUser.portfolio}
                  </p>
                  <p className="text-xs text-[#A67C52] uppercase tracking-wider font-medium">
                    {authUser.committee} • {authUser.role}
                  </p>
                </div>
              </DropdownMenuItem>
              <div className="h-px bg-[#A67C52]/25 my-1" />
              <DropdownMenuItem className="focus:bg-transparent p-0 pt-1">
                <LogoutButton classList="w-full bg-[#702F3B] hover:bg-[#883545] text-[#F2E9DB] border-0" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <MobileNavbar />
      </div>
    </header>
  );
};
