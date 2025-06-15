"use client";

import * as React from "react";
import {
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  Plus,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";

interface NavbarProps {
  onMenuClick?: () => void;
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
    items: [
      {
        title: "Add New Student",
        href: "#",
        icon: Users,
        description: "Enroll a new student",
      },
      {
        title: "Student List",
        href: "#",
        icon: Users,
        description: "View all students",
      },
      {
        title: "Attendance",
        href: "#",
        icon: Users,
        description: "Mark attendance",
      },
      {
        title: "Student Reports",
        href: "#",
        icon: FileText,
        description: "Generate student reports",
      },
    ],
  },
  {
    category: "Teachers",
    items: [
      {
        title: "Add New Teacher",
        href: "#",
        icon: GraduationCap,
        description: "Add a new teacher",
      },
      {
        title: "Teacher List",
        href: "#",
        icon: GraduationCap,
        description: "View all teachers",
      },
      {
        title: "Teacher Schedule",
        href: "#",
        icon: Calendar,
        description: "Manage schedules",
      },
      {
        title: "Performance Review",
        href: "#",
        icon: FileText,
        description: "Teacher evaluations",
      },
    ],
  },
  {
    category: "Classes",
    items: [
      {
        title: "Create Class",
        href: "#",
        icon: Calendar,
        description: "Create new class",
      },
      {
        title: "Class Schedule",
        href: "#",
        icon: Calendar,
        description: "View timetable",
      },
      {
        title: "Class Reports",
        href: "#",
        icon: FileText,
        description: "Class performance",
      },
      {
        title: "Curriculum",
        href: "#",
        icon: FileText,
        description: "Manage curriculum",
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        title: "Settings",
        href: "#",
        icon: Settings,
        description: "System settings",
      },
      {
        title: "User Management",
        href: "#",
        icon: Users,
        description: "Manage users",
      },
      {
        title: "Reports",
        href: "#",
        icon: FileText,
        description: "Generate reports",
      },
      {
        title: "Backup",
        href: "#",
        icon: Settings,
        description: "System backup",
      },
    ],
  },
];

export function Navbar({
  onMenuClick,
  onSearch,
  searchResults = [],
}: NavbarProps) {
  const { setTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSearchResults, setShowSearchResults] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Quick Access Mega Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="gap-2">
                <Plus className="h-4 w-4" />
                Quick Access
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[800px] gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
                  {quickAccessItems.map((category) => (
                    <div key={category.category} className="space-y-3">
                      <h4 className="text-sm font-medium leading-none">
                        {category.category}
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <a
                            key={item.title}
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <item.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search navigation, students, teachers..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-auto">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, index) => (
                    <a
                      key={index}
                      href={result.href}
                      className="block px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.category}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-1">
                <DropdownMenuItem>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      New student enrollment
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alice Johnson has been enrolled in Grade 10
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Fee payment received</p>
                    <p className="text-xs text-muted-foreground">
                      Payment of $500 received from Bob Smith
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Teacher absence</p>
                    <p className="text-xs text-muted-foreground">
                      Ms. Davis will be absent tomorrow
                    </p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </header>
  );
}
