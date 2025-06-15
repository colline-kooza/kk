"use client";

import * as React from "react";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  School,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  isActive?: boolean;
  children?: {
    title: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Students",
    href: "#",
    icon: Users,
    children: [
      { title: "All Students", href: "#" },
      { title: "Enrollment", href: "#" },
      { title: "Attendance", href: "#" },
      { title: "Grades", href: "#" },
    ],
  },
  {
    title: "Teachers",
    href: "#",
    icon: GraduationCap,
    children: [
      { title: "All Teachers", href: "#" },
      { title: "Schedules", href: "#" },
      { title: "Performance", href: "#" },
    ],
  },
  {
    title: "Classes",
    href: "#",
    icon: BookOpen,
    children: [
      { title: "All Classes", href: "#" },
      { title: "Timetable", href: "#" },
      { title: "Curriculum", href: "#" },
    ],
  },
  {
    title: "Finance",
    href: "#",
    icon: DollarSign,
    children: [
      { title: "Fee Management", href: "#" },
      { title: "Payments", href: "#" },
      { title: "Reports", href: "#" },
    ],
  },
  {
    title: "Reports",
    href: "#",
    icon: FileText,
    children: [
      { title: "Academic Reports", href: "#" },
      { title: "Attendance Reports", href: "#" },
      { title: "Financial Reports", href: "#" },
    ],
  },
  {
    title: "Calendar",
    href: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
    children: [
      { title: "School Settings", href: "#" },
      { title: "User Management", href: "#" },
      { title: "System Settings", href: "#" },
    ],
  },
];

interface DashSidebarProps {
  className?: string;
}

export function DashSidebar({ className }: DashSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <School className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Oakwood Elementary</span>
          <span className="text-xs text-muted-foreground">
            School Management
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <p>© 2024 School Management</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

function NavItemComponent({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = React.useState(item.isActive);

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 h-auto font-normal"
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-90"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.children.map((child) => (
            <Button
              key={child.title}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 pl-9 font-normal text-muted-foreground hover:text-foreground"
              asChild
            >
              <a href={child.href}>{child.title}</a>
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant={item.isActive ? "secondary" : "ghost"}
      className="w-full justify-start gap-2 px-3 py-2 h-auto font-normal"
      asChild
    >
      <a href={item.href}>
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </a>
    </Button>
  );
}
