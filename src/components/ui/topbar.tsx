"use client";

import { useRouter } from "next/navigation";

import { Circle, CircleCheck, CircleMinus, CircleX, Clock5, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";


// import ThemeToggleButton from "~/shared/custom/theme-toggle-button";
import { Button } from "./button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./dropdown-menu";

// import { BranchSelection } from "~/app/(with-dashboard-layout)/components/dashboard-layout/components/topbar/combo";
import { FaBasketball } from "react-icons/fa6";
import { cn } from "~/lib/utils";

// import MobileSideBar from "./components/MobileSideBar";

const USER_STATUS = [
  { status: "Offline", icon: <CircleX className={cn("h-4 w-4")} /> },
  { status: "Available", icon: <CircleCheck className={cn("h-4 w-4 text-green-600")} /> },
  { status: "Busy", icon: <CircleMinus className={cn("h-4 w-4 text-red-600")} /> },
  { status: "Do not disturb", icon: <Circle className={cn("h-4 w-4 text-red-600")} /> },
  { status: "Be Right Back", icon: <Clock5 className={cn("h-4 w-4 text-yellow-500")} /> }
];
const TopBar = () => {
  const router = useRouter();
  const userId = useSession()?.data?.user?.id;
  return (
    <header
      data-testid={"topbar"}
      className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="flex h-16 items-center px-4 sm:justify-between sm:space-x-0 sm:px-[1rem]">
        {/* <MobileSideBar /> */}
        <div className="flex items-center justify-center gap-2">
            <FaBasketball className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold">
            Turfinity
            </h1>
          </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-4">
            {/* <ThemeToggleButton /> */}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <User className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log("Logout");
                  signOut({
                    redirect: false
                  })
                    .then(() => {
                      void router.push("/auth/signin");
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
