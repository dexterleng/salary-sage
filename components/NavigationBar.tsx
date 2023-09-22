"use client"

import * as React from "react"
import Link from "next/link"
 
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { buttonVariants } from "./ui/button"

export function NavigationBar() {
  return (
    <div className="flex items-center justify-end border-b w-full sticky top-0 px-10 z-50 h-14 supports-backdrop-blur:bg-background/60 bg-background/95">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <Link href={"/"} className={buttonVariants({ variant: "outline", size: "sm" })}>Log In</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href={"/"} className={buttonVariants({ size: "sm" })}>Sign Up</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
