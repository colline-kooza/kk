"use client"

import * as React from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Navbar } from "@/components/dashboard/navbar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { School } from "lucide-react"
import type { User, School as SchoolType } from "@/types/login"
import { UserRole } from "@/config/navigation"
interface School {
  id: string;
  name: string;
  code: string;
  subdomain: string | null;
  logo: string | null;
  isActive: boolean;
}
interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  school:School | null
}

// Mock schools data - replace with actual data fetching
const mockSchools: SchoolType[] = [
  {
    id: "1",
    name: "Oakwood Elementary",
    code: "OAK001",
    subdomain: "oakwood",
    logo: "https://media.istockphoto.com/id/942120510/vector/book-icon.jpg?s=612x612&w=0&k=20&c=-HNe0bmyamfDsufecTkVLFZtmmVDheiQv0l3UDoa7xk=",
    isActive: true,
  },
  {
    id: "2",
    name: "Maple High School",
    code: "MAP002",
    subdomain: "maple",
    logo: "https://media.istockphoto.com/id/942120510/vector/book-icon.jpg?s=612x612&w=0&k=20&c=-HNe0bmyamfDsufecTkVLFZtmmVDheiQv0l3UDoa7xk=",
    isActive: true,
  },
  {
    id: "3",
    name: "Pine Valley Academy",
    code: "PIN003",
    subdomain: "pinevalley",
    logo: null,
    isActive: false,
  },
]

// Navigation items for search functionality
const navigationItems = [
  { title: "Dashboard", href: "/dashboard", category: "Navigation" },
  { title: "All Students", href: "/dashboard/students", category: "Students" },
  { title: "Student Enrollment", href: "/dashboard/students/enrollment", category: "Students" },
  { title: "Student Attendance", href: "/dashboard/students/attendance", category: "Students" },
  { title: "Student Grades", href: "/dashboard/students/grades", category: "Students" },
  { title: "All Teachers", href: "/dashboard/teachers", category: "Teachers" },
  { title: "Teacher Schedules", href: "/dashboard/teachers/schedules", category: "Teachers" },
  { title: "Teacher Performance", href: "/dashboard/teachers/performance", category: "Teachers" },
  { title: "All Classes", href: "/dashboard/classes", category: "Classes" },
  { title: "Class Timetable", href: "/dashboard/classes/timetable", category: "Classes" },
  { title: "Curriculum", href: "/dashboard/classes/curriculum", category: "Classes" },
  { title: "Fee Management", href: "/dashboard/finance/fees", category: "Finance" },
  { title: "Payments", href: "/dashboard/finance/payments", category: "Finance" },
  { title: "Financial Reports", href: "/dashboard/finance/reports", category: "Finance" },
  { title: "Academic Reports", href: "/dashboard/reports/academic", category: "Reports" },
  { title: "Attendance Reports", href: "/dashboard/reports/attendance", category: "Reports" },
  { title: "Calendar", href: "/dashboard/calendar", category: "Navigation" },
  { title: "School Settings", href: "/dashboard/settings/school", category: "Settings" },
  { title: "User Management", href: "/dashboard/settings/users", category: "Settings" },
  { title: "System Settings", href: "/dashboard/settings/system", category: "Settings" },
]

export function DashboardLayout({ children, user , school }: DashboardLayoutProps) {
  const [searchResults, setSearchResults] = React.useState<typeof navigationItems>([])

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults([])
      return
    }
    const filtered = navigationItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(filtered)
  }

  // Get schools based on user role
  const availableSchools = user.role === UserRole.SUPER_ADMIN ? mockSchools : []

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={user} schools={availableSchools} />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1 hover:bg-purple-50 hover:text-purple-700" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-purple-200" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/dashboard"
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold"
                    >
                      <School className="h-4 w-4" />
                      {user.role === UserRole.SUPER_ADMIN ? "Lectify" : school?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-purple-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-purple-700 font-medium">Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1">
              <Navbar onSearch={handleSearch} searchResults={searchResults} />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-2">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
