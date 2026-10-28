import { Mail, Menu, Send, Plus, ChartBarIncreasing, Download, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useLocation, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

export const MobileNavbar = () => {
  const sidebarLinks = [
    {
      name: "Inbox",
      path: "/",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Sent Chits",
      path: "/sent-chits",
      icon: <Send className="size-5" />,
    },
    {
      name: "Create a Chit",
      path: "/chit-entry",
      icon: <Plus className="size-5" />,
    },
    {
      name: "EB Inbox",
      path: "/eb-board",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Chit Marks",
      icon: <ChartBarIncreasing className="size-5" />,
      path: "/marks",
    },
    {
      name: "Download All Chits",
      icon: <Download className="size-5" />,
      path: "/eb-download",
    },
    {
      name: "Create User",
      path: "/create-user",
      icon: <Plus className="size-5" />,
    },
    {
      name: "Accounts Directory",
      path: "/all-users",
      icon: <User className="size-5" />,
    },
  ];
  const { authUser } = useAuthContext();
  const url = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);

  const renderMobileItem = (link: { name: string; path: string; icon: React.ReactNode }, index: number) => {
    const isActive = url === link.path;
    return (
      <li key={index} className="w-full">
        <Link
          onClick={() => setIsOpen(false)}
          to={link.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all border ${
            isActive
              ? "bg-[#174A3A] text-[#FFF4D6] border-[#A67C52]/60 font-semibold shadow-md"
              : "text-[#F2E9DB]/80 border-transparent hover:bg-[#174A3A]/40 hover:text-[#F2E9DB]"
          }`}
        >
          <span className={isActive ? "text-[#FFF4D6]" : "text-[#A67C52]"}>
            {link.icon}
          </span>
          {link.name}
        </Link>
      </li>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden" asChild>
        <Button variant={"outline"} size={"icon"} className="size-9 bg-[#174A3A]/40 border-[#A67C52]/40 text-[#F2E9DB] hover:bg-[#174A3A] hover:border-[#A67C52]">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-[#0B2B26] border-l border-[#A67C52]/40 text-[#F2E9DB] p-6">
        <SheetHeader className="text-left pb-4 border-b border-[#A67C52]/25">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#A67C52] via-[#F5DEB3] to-[#8C6239] shadow-sm overflow-hidden flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0B2B26] overflow-hidden flex items-center justify-center">
                <img src="/logo2026.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <SheetTitle className="font-serif font-bold text-lg text-[#F2E9DB]">
              PICT MUN <span className="text-[#A67C52]">2026</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <SheetDescription className="py-6" asChild>
          <ul className="flex flex-col items-start gap-2.5 w-full">
            {authUser?.role === "DELEGATE" &&
              sidebarLinks.slice(0, 3).map((link, index) => renderMobileItem(link, index))}
            {authUser?.role === "EB" &&
              sidebarLinks.slice(3, 6).map((link, index) => renderMobileItem(link, index))}
            {authUser?.role === "ADMIN" &&
              sidebarLinks.slice(6, 8).map((link, index) => renderMobileItem(link, index))}

            {authUser && (
              <li className="w-full pt-4 mt-2 border-t border-[#A67C52]/20">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all border ${
                    url === "/profile"
                      ? "bg-[#174A3A] text-[#FFF4D6] border-[#A67C52]/60 font-semibold"
                      : "text-[#F2E9DB]/80 border-transparent hover:bg-[#174A3A]/40 hover:text-[#F2E9DB]"
                  }`}
                >
                  <User className="size-5 text-[#A67C52]" />
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};
