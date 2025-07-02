"use client";

import * as React from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Navbar } from "./navbar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { School } from "lucide-react";
import { User } from "@/types/login";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

// Navigation items for search functionality
const navigationItems = [
  { title: "Dashboard", href: "/dashboard", category: "Navigation" },
  { title: "All Students", href: "#", category: "Students" },
  { title: "Student Enrollment", href: "#", category: "Students" },
  { title: "Student Attendance", href: "#", category: "Students" },
  { title: "Student Grades", href: "#", category: "Students" },
  { title: "All Teachers", href: "#", category: "Teachers" },
  { title: "Teacher Schedules", href: "#", category: "Teachers" },
  { title: "Teacher Performance", href: "#", category: "Teachers" },
  { title: "All Classes", href: "#", category: "Classes" },
  { title: "Class Timetable", href: "#", category: "Classes" },
  { title: "Curriculum", href: "#", category: "Classes" },
  { title: "Fee Management", href: "#", category: "Finance" },
  { title: "Payments", href: "#", category: "Finance" },
  { title: "Financial Reports", href: "#", category: "Finance" },
  { title: "Academic Reports", href: "#", category: "Reports" },
  { title: "Attendance Reports", href: "#", category: "Reports" },
  { title: "Calendar", href: "#", category: "Navigation" },
  { title: "School Settings", href: "#", category: "Settings" },
  { title: "User Management", href: "#", category: "Settings" },
  { title: "System Settings", href: "#", category: "Settings" },
];

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [searchResults, setSearchResults] = React.useState<
    typeof navigationItems
  >([]);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = navigationItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="#"
                      className="flex items-center gap-2"
                    >
                      <School className="h-4 w-4" />
                      School Management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1">
              <Navbar onSearch={handleSearch} searchResults={searchResults} />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
