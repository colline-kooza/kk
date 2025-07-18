"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Plus,
  Users,
  Calendar,
  FileText,
  Settings,
  Zap,
  TrendingUp,
  BookOpen,
  DollarSign,
  User,
  LogOut,
  Shield,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/store/auth";
import { logoutUser } from "@/actions/logout";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchResults?: Array<{
    title: string;
    href: string;
    category: string;
  }>;
}

const quickAccessItems = [
  {
    category: "Students",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    items: [
      {
        title: "Add New Student",
        href: "/dashboard/students/new",
        icon: Users,
        description: "Quickly enroll a new student",
        badge: "New",
      },
      {
        title: "Mark Attendance",
        href: "/dashboard/students/attendance",
        icon: Activity,
        description: "Take daily attendance",
      },
      {
        title: "Student Reports",
        href: "/dashboard/students/reports",
        icon: FileText,
        description: "Generate comprehensive reports",
      },
      {
        title: "Bulk Import",
        href: "/dashboard/students/import",
        icon: Users,
        description: "Import multiple students",
      },
    ],
  },
  {
    category: "Academic",
    icon: BookOpen,
    color: "from-green-500 to-green-600",
    items: [
      {
        title: "Create Assignment",
        href: "/dashboard/assignments/new",
        icon: FileText,
        description: "Create new assignment",
      },
      {
        title: "Grade Book",
        href: "/dashboard/grades",
        icon: BookOpen,
        description: "Manage student grades",
        badge: "Updated",
      },
      {
        title: "Schedule Exam",
        href: "/dashboard/exams/schedule",
        icon: Calendar,
        description: "Schedule examinations",
      },
      {
        title: "Curriculum",
        href: "/dashboard/curriculum",
        icon: BookOpen,
        description: "Manage curriculum",
      },
    ],
  },
  {
    category: "Finance",
    icon: DollarSign,
    color: "from-purple-500 to-purple-600",
    items: [
      {
        title: "Collect Fees",
        href: "/dashboard/finance/collection",
        icon: DollarSign,
        description: "Process fee payments",
        badge: "Priority",
      },
      {
        title: "Generate Invoice",
        href: "/dashboard/finance/invoice",
        icon: FileText,
        description: "Create fee invoices",
      },
      {
        title: "Payment Analytics",
        href: "/dashboard/finance/analytics",
        icon: TrendingUp,
        description: "View payment insights",
      },
      {
        title: "Expense Tracker",
        href: "/dashboard/finance/expenses",
        icon: DollarSign,
        description: "Track school expenses",
      },
    ],
  },
  {
    category: "Quick Actions",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    items: [
      {
        title: "Send Notice",
        href: "/dashboard/notices/new",
        icon: Bell,
        description: "Broadcast school notice",
      },
      {
        title: "Create Event",
        href: "/dashboard/events/new",
        icon: Calendar,
        description: "Schedule school event",
      },
      {
        title: "System Backup",
        href: "/dashboard/settings/backup",
        icon: Settings,
        description: "Backup system data",
        badge: "Admin",
      },
      {
        title: "Custom Report",
        href: "/dashboard/reports/custom",
        icon: FileText,
        description: "Generate custom report",
      },
    ],
  },
];

const recentNotifications = [
  {
    id: 1,
    title: "New Student Enrollment",
    description: "Alice Johnson enrolled in Grade 10-A",
    time: "2 min ago",
    type: "enrollment",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    title: "Fee Payment Received",
    description: "$500 payment from Bob Smith",
    time: "15 min ago",
    type: "payment",
    unread: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    title: "Teacher Leave Request",
    description: "Ms. Davis requested leave",
    time: "1 hour ago",
    type: "leave",
    unread: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export function Navbar({ onSearch, searchResults = [] }: NavbarProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [unreadCount] = React.useState(
    recentNotifications.filter((n) => n.unread).length
  );
  const { user } = useAuthStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    onSearch?.(query);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const searchVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Enhanced Quick Access Menu */}
        {/* <MegaMenu/> */}

        <NavigationMenu className="hidden lg:flex z-50">
          {" "}
          {/* Added z-50 for stacking context */}
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 data-[state=open]:from-purple-700 data-[state=open]:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus className="h-4 w-4" />
                </motion.div>
                Quick Access
              </NavigationMenuTrigger>
              <NavigationMenuContent className="!z-[1000000] bg-red-800">
                {" "}
                {/* Kept user's z-index */}
                <div className="grid w-[950px] gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
                  {quickAccessItems.map((category) => (
                    <div key={category.category} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r ${category.color} text-white shadow-md`}
                        >
                          <category.icon className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 font-inter">
                          {category.category}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <motion.a
                            key={item.title}
                            href={item.href}
                            className="group block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:shadow-md focus:bg-purple-50 focus:shadow-md border border-transparent hover:border-purple-200"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 text-purple-600 group-hover:text-purple-700" />
                                <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                                  {item.title}
                                </div>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed text-gray-600 group-hover:text-gray-700">
                              {item.description}
                            </p>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Enhanced Search */}
        <div className="flex-1 max-w-lg relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
            <Input
              placeholder="Search students, teachers, classes..."
              className="pl-11 pr-4 py-2.5 w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl bg-purple-50/50 font-inter"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            />
          </div>

          {/* Enhanced Search Results */}
          <AnimatePresence>
            {showSearchResults && (
              <motion.div
                variants={searchVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-200 rounded-xl shadow-xl z-50 max-h-96 overflow-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="p-3">
                    {searchResults.map((result, index) => (
                      <motion.a
                        key={index}
                        href={result.href}
                        className="block px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 border border-transparent hover:border-purple-200"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="font-medium font-inter">
                          {result.title}
                        </div>
                        <div className="text-xs text-purple-500 mt-1">
                          {result.category}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-30 text-purple-300" />
                    <p className="font-inter">
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          {/* Enhanced Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-purple-50 hover:text-purple-700 rounded-xl"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="h-5 w-5" />
                </motion.div>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-purple-500 to-purple-600 border-0 flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-96 border-purple-200 rounded-xl"
            >
              <DropdownMenuLabel className="text-purple-700 font-semibold font-inter px-4 py-3">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-purple-100" />
              <div className="max-h-80 overflow-y-auto">
                {recentNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem className="p-4 hover:bg-purple-50 focus:bg-purple-50 cursor-pointer">
                      <div className="flex items-start gap-3 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            className="object-cover"
                            src={notification.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {notification.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium font-inter">
                              {notification.title}
                            </p>
                            {notification.unread && (
                              <div className="h-2 w-2 rounded-full bg-purple-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {notification.description}
                          </p>
                          <p className="text-xs text-purple-500 font-medium">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-purple-100" />
              <DropdownMenuItem className="text-center text-purple-600 hover:bg-purple-50 focus:bg-purple-50 font-medium font-inter p-3">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-xl hover:bg-purple-50"
              >
                <Avatar className="h-9 w-9 border-2 border-purple-200">
                  <AvatarImage
                    className="object-cover"
                    src={user?.image || "/placeholder.svg"}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 border-purple-200 rounded-xl"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-purple-200">
                      <AvatarImage
                        className="object-cover"
                        src={user?.image || "/placeholder.svg"}
                        alt={user?.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold font-inter text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        {user?.role?.replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-inter">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-purple-100" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-purple-50  p-3 cursor-pointer">
                  <User className="mr-3 h-4 w-4 text-purple-600" />
                  <span className="font-inter">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-50  p-3 cursor-pointer">
                  <Shield className="mr-3 h-4 w-4 text-purple-600" />
                  <span className="font-inter">Privacy & Security</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-500 p-3 cursor-pointer">
                  <Settings className="mr-3 h-4 w-4 text-purple-600" />
                  <span className="font-inter">Account Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-purple-100" />
              <DropdownMenuItem
                className="hover:bg-red-50 focus:bg-red-50 text-red-600 hover:text-black p-3 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-inter font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </header>
  );
}
