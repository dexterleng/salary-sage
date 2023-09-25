"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { buttonVariants } from "./ui/button"
import { User } from "@supabase/auth-helpers-nextjs"

type LandingPageNavigationBarProps = {
  user: User | null
}

export function LandingPageNavigationBar({ user }: LandingPageNavigationBarProps) {
  const unauthenticatedMenuItems = () => (
    <NavigationMenuList className="gap-1">
      <NavigationMenuItem>
        <Link href={"/login"} className={buttonVariants({ variant: "secondary", size: "sm" })}>Log In</Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href={"/sign-up"} className={buttonVariants({ size: "sm" })}>Sign Up</Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  );

  const authenticatedMenuItems = () => (
    <NavigationMenuList className="gap-1">
      <NavigationMenuItem>
        <Link href={"/dashboard"} className={buttonVariants({ size: "sm" })}>Dashboard</Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  );

  return (
    <div className="flex items-center justify-end shadow-glass w-full sticky top-0 px-10 z-50 h-14 supports-backdrop-blur:bg-card/60 bg-card/95">
      <NavigationMenu>
        {user ? authenticatedMenuItems() : unauthenticatedMenuItems()}
      </NavigationMenu>
    </div>
  )
}
