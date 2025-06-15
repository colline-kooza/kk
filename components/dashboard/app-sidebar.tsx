"use client";

import type * as React from "react";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  Settings,
  Users,
  FileText,
  DollarSign,
  School,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { SchoolSwitcher } from "@/components/dashboard/school-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "@/store/auth";

// School management system data
const data = {
  user: {
    name: "Sarah Johnson",
    email: "sarah.johnson@oakwoodschool.edu",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Administrator",
  },
  schools: [
    {
      name: "Oakwood Elementary",
      logo: School,
      type: "Elementary School",
    },
    {
      name: "Maple High School",
      logo: GraduationCap,
      type: "High School",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Students",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Students",
          url: "#",
        },
        {
          title: "Enrollment",
          url: "#",
        },
        {
          title: "Attendance",
          url: "#",
        },
        {
          title: "Grades",
          url: "#",
        },
      ],
    },
    {
      title: "Teachers",
      url: "#",
      icon: GraduationCap,
      items: [
        {
          title: "All Teachers",
          url: "#",
        },
        {
          title: "Schedules",
          url: "#",
        },
        {
          title: "Performance",
          url: "#",
        },
      ],
    },
    {
      title: "Classes",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Classes",
          url: "#",
        },
        {
          title: "Timetable",
          url: "#",
        },
        {
          title: "Curriculum",
          url: "#",
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Fee Management",
          url: "#",
        },
        {
          title: "Payments",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Academic Reports",
          url: "#",
        },
        {
          title: "Attendance Reports",
          url: "#",
        },
        {
          title: "Financial Reports",
          url: "#",
        },
      ],
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "My Activity",
          url: "/dashboard/settings/activity",
        },
        {
          title: "School Settings",
          url: "#",
        },
        {
          title: "User Management",
          url: "#",
        },
        {
          title: "System Settings",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SchoolSwitcher schools={data.schools} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
