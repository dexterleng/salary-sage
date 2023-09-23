"use client"

import * as React from "react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"
import { PersonIcon } from "@radix-ui/react-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "@supabase/auth-helpers-nextjs"
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu"

type DashboardNavigationBarProps = {
  user: User
}

export function DashboardNavigationBar({ user }: DashboardNavigationBarProps) {
  return (
    <div className="flex items-center justify-end border-b w-full sticky top-0 px-10 z-50 h-14 supports-backdrop-blur:bg-background/60 bg-background/95">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200">
                  <PersonIcon className="h-4 w-4 relative flex shrink-0 overflow-hidden rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user!.email}</p>
                    {/* <p className="text-xs leading-none text-muted-foreground">
                      m@example.com
                    </p> */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action="/auth/sign-out" method="post" className="w-full h-full">
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
    </div>
  )
}
