"use client"

import * as React from "react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"
import { PersonIcon } from "@radix-ui/react-icons"

export function DashboardNavigationBar() {
  return (
    <div className="flex items-center justify-end border-b w-full sticky top-0 px-10 z-50 h-14 supports-backdrop-blur:bg-background/60 bg-background/95">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <Button variant="ghost" className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200">
              <PersonIcon className="h-4 w-4 relative flex shrink-0 overflow-hidden rounded-full" />
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
