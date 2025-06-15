"use client";

import * as React from "react";
import {
  Plus,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickAccessItem {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}

const quickAccessItems: QuickAccessItem[] = [
  {
    icon: Users,
    label: "Add Student",
    href: "#",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    icon: GraduationCap,
    label: "Add Teacher",
    href: "#",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    icon: Calendar,
    label: "Schedule Class",
    href: "#",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    icon: FileText,
    label: "Generate Report",
    href: "#",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    color: "bg-gray-500 hover:bg-gray-600",
  },
];

export function QuickAccessMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Access Items */}
      <div
        className={cn(
          "flex flex-col gap-3 mb-4 transition-all duration-300 ease-in-out",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {quickAccessItems.map((item, index) => (
          <Card
            key={item.label}
            className={cn(
              "transition-all duration-300 ease-in-out shadow-lg",
              isOpen ? "scale-100" : "scale-0"
            )}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-0">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 px-4 py-3 text-white border-0",
                  item.color
                )}
                asChild
              >
                <a href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main FAB Button */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 ease-in-out",
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-45"
            : "bg-primary hover:bg-primary/90 rotate-0"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
