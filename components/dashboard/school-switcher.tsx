"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChevronsUpDown, Plus, SchoolIcon, Check, Crown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import type { School } from "@/types/login"
import MainLogo from "../home/main-logo"

interface SchoolSwitcherProps {
  schools: School[]
}

export function SchoolSwitcher({ schools }: SchoolSwitcherProps) {
  const { isMobile, state } = useSidebar()
  const [activeSchool, setActiveSchool] = React.useState<School | null>(
    schools.find((school) => school.isActive) || schools[0] || null,
  )
  const isCollapsed = state === "collapsed"

  if (!activeSchool && schools.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-white/20">
              <Crown className="size-5" />
            </div>
            {!isCollapsed && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold font-inter">System Admin</span>
                <span className="truncate text-xs opacity-90">Multi-School Management</span>
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-purple-50 data-[state=open]:text-purple-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 rounded-xl"
            >
              <motion.div
                className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {activeSchool?.logo ? (
                  <MainLogo
                    src={activeSchool.logo}
                    alt={activeSchool.name}
                    // width={24}
                    // height={24}
                    className="rounded-lg"
                  />
                ) : (
                 <MainLogo
                
                    width={24}
                    height={24}
                    className="rounded-lg"
                  />
                )}
              </motion.div>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold font-inter">{activeSchool?.name || "Select School"}</span>
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs text-purple-600 font-medium">
                      {activeSchool?.code || "No school selected"}
                    </span>
                    {activeSchool?.isActive && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className="ml-auto size-4 text-purple-500" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl border-purple-100 shadow-xl"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-purple-600 font-semibold font-inter px-4 py-3">
              Available Schools
            </DropdownMenuLabel>
            {schools.map((school, index) => (
              <DropdownMenuItem
                key={school.id}
                onClick={() => setActiveSchool(school)}
                className="gap-3 p-4 hover:bg-purple-50 focus:bg-purple-50 rounded-lg mx-2 my-1 cursor-pointer"
              >
                <div className="flex size-8 items-center justify-center rounded-lg border border-purple-200 bg-gradient-to-br from-purple-100 to-purple-200">
                  {school.logo ? (
                
                    <img src={school.logo} className="object-cover " alt="" />
                  ) : (
                   <h2>j</h2>
                  )}
                </div>
                <div className="grid flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm font-inter">{school.name}</span>
                    {school.isActive && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        Active
                      </Badge>
                    )}
                    {activeSchool?.id === school.id && <Check className="size-3 text-purple-600" />}
                  </div>
                  <span className="text-xs text-purple-500 font-medium">{school.code}</span>
                </div>
                <DropdownMenuShortcut className="text-purple-500 font-medium">⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-purple-100 mx-2" />
            <DropdownMenuItem className="gap-3 p-4 hover:bg-purple-50 focus:bg-purple-50 rounded-lg mx-2 my-1 cursor-pointer">
              <div className="flex size-8 items-center justify-center rounded-lg border border-purple-200 bg-gradient-to-br from-purple-100 to-purple-200">
                <Plus className="size-4 text-purple-600" />
              </div>
              <div className="font-medium text-purple-700 font-inter">Add New School</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
