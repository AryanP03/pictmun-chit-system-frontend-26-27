import { Mail, Menu, Send, Plus, ChartBarIncreasing, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

import { Link } from "react-router-dom";
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
      name: "Inbox",
      path: "/eb-board",
      icon: <Mail className="size-5" />,
    },
    {
      name: "Chit Marks",
      icon: <ChartBarIncreasing className="size-5" />,
      path: "/marks",
    },
    {
      name: "CreateUser",
      path: "/create-user",
      icon: <Plus className="size-5" />,
    },
  ];
  const { authUser } = useAuthContext();
  const url = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden" asChild>
        <Button variant={"outline"} size={"icon"} className="size-8">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="sr-only">
          <SheetTitle>Are you absolutely sure?</SheetTitle>
        </SheetHeader>

        <SheetDescription className="py-8 h-screen">
          <ul className="mt-20 flex flex-col items-start gap-5">
            {authUser?.role == "DELEGATE" &&
              sidebarLinks.slice(0, 3).map((link, index) => (
                <li
                  key={index}
                  className={`${
                    url === link.path ? "bg-muted font-semibold" : ""
                  } text-lg  text-primary p-3 rounded-lg w-full`}
                >
                  <Link
                    onClick={() => setIsOpen(false)}
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
                  } text-lg  text-primary p-3 rounded-lg w-full`}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-start gap-2"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            {authUser?.role == "ADMIN" && (
              <li
                className={`${
                  url === "/create-user" ? "bg-muted font-semibold" : ""
                } text-lg  text-primary p-3 rounded-lg w-full`}
              >
                <Link
                  to="/create-user"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-start gap-2"
                >
                  <Plus className="size-5" />
                  Create User
                </Link>
              </li>
            )}
            {/* Profile link for all authenticated users */}
            {authUser && (
              <li
                className={`${
                  url === "/profile" ? "bg-muted font-semibold" : ""
                } text-lg  text-primary p-3 rounded-lg w-full`}
              >
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-start gap-2"
                >
                  <User className="size-5" />
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
