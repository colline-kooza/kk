"use client";

import { easeOut } from "framer-motion";
import type * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NavUser } from "@/components/dashboard/nav-user";
import { SchoolSwitcher } from "@/components/dashboard/school-switcher";
import type { User, School } from "@/types/login";
import {
  getNavigationForRole,
  UserRole,
  type NavigationItem,
} from "@/config/navigation";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import SideBarLogo from "../home/sidebarlogo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
  schools?: School[];
}

export function AppSidebar({ user, schools = [], ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { school } = useAuthStore();
  const navigationItems = getNavigationForRole(user.role as UserRole);
  const isCollapsed = state === "collapsed";

  // Check if current path should be active, with special handling for super admin dashboard
  const isItemActive = (item: NavigationItem): boolean => {
    if (item.url === "/dashboard" && user.role === UserRole.SUPER_ADMIN) {
      // For super admin, dashboard is active if on dashboard or root
      return pathname === "/dashboard/super-admin" || pathname === "/";
    }
    return pathname === item.url;
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: easeOut },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring" as const, stiffness: 500, damping: 30 },
    },
  };

  const NavMainContent = ({ items }: { items: NavigationItem[] }) => (
    <SidebarGroup className="px-0">
      <SidebarMenu className="space-y-0.5">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.02 }}
              className="sidebar-item"
            >
              {item.items ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.items.some(
                    (subItem) => pathname === subItem.url
                  )}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`group relative ${
                          isCollapsed ? "px-2.5 py-2 mx-1" : "px-4 py-2 mx-2"
                        } rounded-lg font-medium text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 data-[state=open]:bg-gradient-to-r data-[state=open]:from-purple-100 data-[state=open]:to-purple-50 data-[state=open]:text-purple-700 transition-all duration-200 ease-out`}
                      >
                        <motion.div
                          className="flex items-center justify-between w-full"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <item.icon className="h-4 w-4 transition-colors duration-200 flex-shrink-0" />
                            </div>
                            <span className="font-inter truncate text-gray-500 text-sm font-medium">
                              {item.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <motion.div
                                variants={badgeVariants}
                                initial="hidden"
                                animate="visible"
                              >
                                <Badge
                                  variant="secondary"
                                  className="h-5 px-2 text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 font-medium"
                                >
                                  {item.badge}
                                </Badge>
                              </motion.div>
                            )}
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 flex-shrink-0" />
                          </div>
                        </motion.div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden">
                      <SidebarMenuSub className="ml-4 mt-1 space-y-0.5">
                        {item.items?.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.title}
                            initial={{ opacity: 0, y: -3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: subIndex * 0.03 }}
                          >
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                className="px-3 py-1.5 mx-2 text-sm font-medium text-gray-500 hover:text-purple-600 hover:bg-purple-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-100 data-[active=true]:to-purple-50 data-[active=true]:text-purple-700 data-[active=true]:font-semibold transition-all duration-150 font-inter rounded-md"
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex items-center justify-between w-full"
                                >
                                  <span className="truncate">
                                    {subItem.title}
                                  </span>
                                  {subItem.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 px-1.5 text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 font-medium"
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </motion.div>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isItemActive(item)}
                    className={`group relative ${
                      isCollapsed ? "px-2.5 py-2 mx-1" : "px-4 py-2 mx-2"
                    } rounded-lg font-medium text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500 data-[active=true]:to-purple-600 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-purple-200/50 transition-all duration-200 ease-out`}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center justify-between w-full"
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="relative">
                          <item.icon className="h-4 w-4 transition-colors duration-200 flex-shrink-0" />
                        </div>
                        <span className="font-medium truncate font-inter text-sm">
                          {item.title}
                        </span>
                      </motion.div>

                      {item.badge && (
                        <motion.div
                          variants={badgeVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Badge
                            variant="secondary"
                            className="h-5 px-2 text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 font-medium"
                          >
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-purple-100 bg-gradient-to-b from-white via-purple-50/20 to-white shadow-sm overflow-x-hidden"
      {...props}
    >
      <SidebarHeader className="border-b border-purple-100 bg-white/90 backdrop-blur-sm p-3">
        {user.role === UserRole.SUPER_ADMIN && schools.length > 0 ? (
          <SchoolSwitcher schools={schools} />
        ) : (
          <motion.div
            className="flex items-center px-0 h-14 "
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* <SideBarLogo src={school?.logo ?? undefined} /> */}
            <Avatar className="h-16 w-16">
              <AvatarImage
                className="object-cover"
                src={school?.logo || "/images/lecify-1.png"}
              />
            </Avatar>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="flex flex-col ml-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm font-semibold text-gray-900 font-inter line-clamp-1">
                    {school?.name || "School Portal"}
                  </span>
                  <span className="text-xs text-purple-600 font-medium capitalize">
                    {user.role.replace("_", " ").toLowerCase()}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-purple-50/30 via-transparent to-purple-50/20 custom-scrollbar py-2">
        <NavMainContent items={navigationItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-purple-100 bg-white/90 backdrop-blur-sm p-3">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail className="bg-gradient-to-b from-purple-200/40 to-purple-300/40" />
    </Sidebar>
  );
}
