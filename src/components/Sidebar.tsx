import { Link, useLocation } from "react-router-dom";
import {
  ChartBarIncreasing,
  Download,
  Mail,
  Plus,
  Send,
  Upload,
  UserPlus,
  User,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

export const Sidebar = () => {
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
      path: "/marks",
      icon: <ChartBarIncreasing className="size-5" />,
    },
    {
      name: "Download All Chits",
      path: "/eb-download",
      icon: <Download className="size-5" />,
    },
    {
      name: "Create User",
      path: "/create-user",
      icon: <UserPlus className="size-5" />,
    },
    {
      name: "CSV Upload",
      path: "/csv-upload",
      icon: <Upload className="size-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="size-5" />,
    },
  ];
  const { authUser } = useAuthContext();
  const url = useLocation().pathname;

  const renderLinkItem = (link: { name: string; path: string; icon: React.ReactNode }, index: number) => {
    const isActive = url === link.path;
    return (
      <li key={index} className="w-full">
        <Link
          to={link.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
            isActive
              ? "bg-[#174A3A] text-[#FFF4D6] border-[#A67C52]/60 shadow-[0_2px_12px_rgba(166,124,82,0.2)] font-semibold"
              : "text-[#F2E9DB]/75 border-transparent hover:bg-[#174A3A]/40 hover:text-[#F2E9DB] hover:border-[#A67C52]/20"
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
    <aside className="hidden md:flex flex-col w-64 p-5 bg-[#0B2B26] border-r border-[#A67C52]/30 h-full max-h-full flex-shrink-0 shadow-xl justify-between overflow-y-auto">
      <ul className="flex flex-col items-start gap-2.5 w-full">
        <li className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A67C52]/70">
          Navigation
        </li>

        {authUser?.role === "DELEGATE" &&
          sidebarLinks.slice(0, 3).map((link, index) => renderLinkItem(link, index))}

        {authUser?.role === "EB" &&
          sidebarLinks.slice(3, 6).map((link, index) => renderLinkItem(link, index))}

        {authUser?.role === "ADMIN" &&
          sidebarLinks.slice(6, 8).map((link, index) => renderLinkItem(link, index))}
      </ul>

      {authUser && (
        <div className="pt-4 border-t border-[#A67C52]/25">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
              url === "/profile"
                ? "bg-[#174A3A] text-[#FFF4D6] border-[#A67C52]/60 shadow-md font-semibold"
                : "text-[#F2E9DB]/75 border-transparent hover:bg-[#174A3A]/40 hover:text-[#F2E9DB] hover:border-[#A67C52]/20"
            }`}
          >
            <span className={url === "/profile" ? "text-[#FFF4D6]" : "text-[#A67C52]"}>
              <User className="size-5" />
            </span>
            Profile
          </Link>
        </div>
      )}
    </aside>
  );
};
