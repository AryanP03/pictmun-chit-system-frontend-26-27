import { Link, useLocation } from "react-router-dom";
import {
  ChartBarIncreasing,
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
      icon: <Send />,
    },
    {
      name: "Create a Chit",
      path: "/chit-entry",
      icon: <Plus />,
    },
    {
      name: "Inbox",
      path: "/eb-board",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Chit Marks",
      path: "/marks",
      icon: <ChartBarIncreasing className="size-5" />,
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
  return (
    <div className="hidden sticky left-0 top-0 md:flex flex-col w-1/6 p-4 border-r h-[calc(100vh-40px)] max-h-[calc(100vh-40px)]">
      <ul className="flex flex-col items-start gap-5">
        {authUser?.role == "DELEGATE" &&
          sidebarLinks.slice(0, 3).map((link, index) => (
            <li
              key={index}
              className={`${
                url === link.path ? "bg-muted font-semibold" : ""
              } text-lg text-primary p-3 rounded-lg w-full`}
            >
              <Link
                to={link.path}
                className="flex items-center justify-start gap-2"
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}

        {authUser?.role == "EB" &&
          sidebarLinks.slice(3, 5).map((link, index) => (
            <li
              key={index}
              className={`${
                url === link.path ? "bg-muted font-semibold" : ""
              } text-lg text-primary p-3 rounded-lg w-full`}
            >
              <Link
                to={link.path}
                className="flex items-center justify-start gap-2"
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}

        {authUser?.role == "ADMIN" &&
          sidebarLinks.slice(5, 7).map((link, index) => (
            <li
              key={index}
              className={`${
                url === link.path ? "bg-muted font-semibold" : ""
              } text-lg text-primary p-3 rounded-lg w-full`}
            >
              <Link
                to={link.path}
                className="flex items-center justify-start gap-2"
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}

        {/* Profile link for all authenticated users */}
        {authUser && (
          <li
            className={`${
              url === "/profile" ? "bg-muted font-semibold" : ""
            } text-lg text-primary p-3 rounded-lg w-full mt-4 border-t border-muted-foreground/20 pt-4`}
          >
            <Link
              to="/profile"
              className="flex items-center justify-start gap-2"
            >
              <User className="size-5" />
              Profile
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
