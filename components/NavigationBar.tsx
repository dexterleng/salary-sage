"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "./ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import UpdateSettingsDialog from "@/app/dashboard/UpdateSettingsDialog";
import Image from "next/image";

type NavigationBarProps = {
  user: User | null;
  userData: any;
};

export function NavigationBar({ user, userData }: NavigationBarProps) {
  const pathname = usePathname();

  const unauthenticatedLandingPageMenu = () => (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            Log In
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={"/sign-up"} className={buttonVariants({ size: "sm" })}>
            Sign Up
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  const authenticatedLandingPageMenu = () => (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <Link href={"/dashboard"} className={buttonVariants({ size: "sm" })}>
            Dashboard
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  const dashboardMenu = () => (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <PersonIcon className="h-4 w-4 relative flex shrink-0 overflow-hidden rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {`${userData?.firstName} ${userData?.lastName}`}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsUpdateSettingsDialogOpen(true);
                }}
              >
                Update Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form
                  action="/auth/sign-out"
                  method="post"
                  className="w-full h-full"
                >
                  <button type="submit" className="w-full h-full text-left">
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  const leftMenu = () => {
    if (
      user &&
      (pathname.startsWith("/dashboard") ||
        pathname.startsWith("/negotiations"))
    ) {
      return (
        <>
          <NavigationMenuItem>
            <Link
              href="/dashboard/"
              className={cn(
                "text-sm",
                pathname.startsWith("/dashboard")
                  ? "text-foreground font-semibold"
                  : "text-foreground/60 hover:text-foreground/80"
              )}
            >
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/negotiations/"
              className={cn(
                "text-sm",
                pathname.startsWith("/negotiations")
                  ? "text-foreground font-semibold"
                  : "text-foreground/60 hover:text-foreground/80"
              )}
            >
              Negotiations
            </Link>
          </NavigationMenuItem>
        </>
      );
    }
  };

  const rightMenu = () => {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/negotiations")
    ) {
      return dashboardMenu();
    }
    return user
      ? authenticatedLandingPageMenu()
      : unauthenticatedLandingPageMenu();
  };

  const {
    yearsOfExperience,
    currentMonthlyIncome,
    minExpectedMonthlyIncome,
    maxExpectedMonthlyIncome,
  } = userData || {};

  const isOnboarded =
    yearsOfExperience !== null &&
    currentMonthlyIncome !== null &&
    minExpectedMonthlyIncome !== null &&
    maxExpectedMonthlyIncome !== null;
  const [isUpdateSettingsDialogOpen, setIsUpdateSettingsDialogOpen] =
    React.useState(!isOnboarded);

  return (
    <div className="flex items-center justify-between shadow-glass w-full sticky top-0 px-4 md:px-18 lg:px-24 z-40 h-14 supports-backdrop-blur:bg-card/60 bg-card/95">
      <NavigationMenu>
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <Link href={user ? "/dashboard/" : "/"} className="font-bold">
              <div className="flex gap-2">
              <Image
                  className="inline"
                  src="/app-icon.svg"
                  alt="Salary Sage icon"
                  width="24"
                  height="24"
                />
              Salary Sage
              </div>
            </Link>
          </NavigationMenuItem>
          {leftMenu()}
        </NavigationMenuList>
      </NavigationMenu>

      {rightMenu()}

      <UpdateSettingsDialog
        open={isUpdateSettingsDialogOpen}
        userData={userData}
      />
    </div>
  );
}
