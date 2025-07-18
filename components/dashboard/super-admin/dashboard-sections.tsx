"use client"

import { cn } from "@/lib/utils"
import { type ElementType, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  DollarSign,
  School,
  FileText,
  CalendarCheck,
  CheckCircle,
  XCircle,
  Eye,
  BookOpen,
  Award,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Bar,
  BarChart,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useDashboardOverviewStats, useRecentSchools } from "@/hooks/use-dashboard-data"
import { useSchoolApplications } from "@/hooks/use-school-applications" // Assuming this hook exists and provides stats
import { ApplicationStatsCardSkeleton, OverallAnalyticsCardSkeleton, RecentSchoolsTableSkeleton, StatCardSkeleton, TotalValueCardSkeleton } from "./admin-skeletons"
import { TotalValueCard } from "./TotalValueCard"
import Link from "next/link"


// Define types for props
interface StatCardProps {
  icon: ElementType
  title: string
  value: string
  change: string
  trend: "up" | "down"
  iconBgColor: string
  iconColor: string
}

interface RevenueSalesData {
  month: string
  revenue: number
  sales: number
}

interface StudentProgressItem {
  status: string
  value: number
  color: string
}

interface StudentProgressData {
  totalStudents: number
  breakdown: StudentProgressItem[]
}

interface SchoolData {
  id: string
  logo: string | null
  name: string
  status: "Active" | "Inactive" | "Pending"
  students: number
}

interface ApplicationStats {
  pending: number
  rejected: number
}

interface SubscriptionData {
  activeSubscriptions: number
  monthlyRecurringRevenue: string
  nextRenewalDate: string
}

interface OverallAnalyticsData {
  totalUsers: number
  totalCourses: number
  averageEngagement: string
}

// Dummy Data (for parts not fetched from DB)
const revenueSalesChartData: RevenueSalesData[] = [
  { month: "Jan", revenue: 15000, sales: 1000 },
  { month: "Feb", revenue: 17000, sales: 1200 },
  { month: "Mar", revenue: 16000, sales: 1100 },
  { month: "Apr", revenue: 19000, sales: 1500 },
  { month: "May", revenue: 22000, sales: 1800 },
  { month: "Jun", revenue: 25000, sales: 2000 },
  { month: "Jul", revenue: 28000, sales: 2300 },
  { month: "Aug", revenue: 26000, sales: 2100 },
  { month: "Sep", revenue: 29000, sales: 2400 },
  { month: "Oct", revenue: 31000, sales: 2500 },
  { month: "Nov", revenue: 29500, sales: 2350 },
  { month: "Dec", revenue: 30000, sales: 2400 },
]

const totalRevenueData = {
  title: "Total Revenue",
  value: "$31,071",
  change: "13%",
  trend: "up",
  description: "+$3k today",
}

const totalSalesData = {
  title: "Total Sales",
  value: "2,500",
  change: "5.7%",
  trend: "up",
  description: "+300 today",
}

const studentProgressData: StudentProgressData = {
  totalStudents: 200,
  breakdown: [
    { status: "Passed", value: 50, color: "#8B5CF6" },
    { status: "Failed", value: 10, color: "#F97316" },
    { status: "Overdue", value: 5, color: "#22C55E" },
    { status: "In Progress", value: 25, color: "#A78BFA" },
    { status: "Not Started", value: 10, color: "#E5E7EB" },
  ],
}

const subscriptionMonitorData: SubscriptionData = {
  activeSubscriptions: 150,
  monthlyRecurringRevenue: "$15,000",
  nextRenewalDate: "2025-08-01",
}

const overallAnalyticsDummyData: OverallAnalyticsData = {
  totalUsers: 0, // This will be replaced by fetched data
  totalCourses: 500, // Dummy
  averageEngagement: "75%", // Dummy
}

// StatCard Component (remains the same, but data will be passed from fetched stats)
function StatCard({ icon: Icon, title, value, change, trend, iconBgColor, iconColor }: StatCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500"
  return (
    <Card className="flex flex-col relative overflow-hidden shadow-2xs gap-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-1 rounded-md", iconBgColor)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        <p className={cn("text-xs", trendColor)}>
          <TrendIcon className="inline-block h-3 w-3 mr-1" />
          {change} from last month
        </p>
      </CardContent>
      <div className="absolute -bottom-0 -right-0 opacity-[0.08]">
        <Users className="h-16 w-16 text-purple-600" />
      </div>
    </Card>
  )
}

// TotalValueCard Component (remains the same, but data will be passed from fetched stats)
interface TotalValueCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
}


// Refactored Stat Cards Section
export function StatCardsSection() {
  const { stats, isLoading } = useDashboardOverviewStats()

  const statCardsData: StatCardProps[] = [
    {
      icon: School,
      title: "Total Schools",
      value: isLoading ? "..." : stats.totalSchools.toLocaleString(),
      change: "1.5%", // Dummy
      trend: "up", // Dummy
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Users,
      title: "Active Students",
      value: isLoading ? "..." : stats.activeStudents.toLocaleString(),
      change: "0.8%", // Dummy
      trend: "up", // Dummy
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: FileText,
      title: "Pending Applications",
      value: isLoading ? "..." : stats.pendingApplications.toLocaleString(),
      change: "2.0%", // Dummy
      trend: "up", // Dummy
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
      {isLoading ? (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      ) : (
        statCardsData.map((data, index) => <StatCard key={index} {...data} />)
      )}
    </div>
  )
}



// Total Value Cards Section (Total Students will be fetched)
export function TotalValueCardsSection() {
  const { stats, isLoading } = useDashboardOverviewStats()

  const totalStudentsData = {
    title: "Total Students",
    value: isLoading ? "..." : stats.totalUsers.toLocaleString(), // Assuming totalUsers includes all students
    change: "2.5%", // Dummy
    trend: "up", // Dummy
    description: "+500 this month", // Dummy
  }

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
      {isLoading ? (
        <>
          <TotalValueCardSkeleton />
          <TotalValueCardSkeleton />
          <TotalValueCardSkeleton />
        </>
      ) : (
        <>
          <TotalValueCard {...totalRevenueData} />
          <TotalValueCard {...totalSalesData} />
          <TotalValueCard {...totalStudentsData} />
        </>
      )}
    </div>
  )
}

// StudentProgressCard Component (remains dummy data)
function StudentProgressCard({ data }: { data: StudentProgressData }) {
  const totalPercentage = data.breakdown.reduce((sum, item) => sum + item.value, 0)
  return (
    <Card className="col-span-12 lg:col-span-4">
      <CardHeader>
        <CardTitle>Students Progress</CardTitle>
        <CardDescription>Overall student status breakdown.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2 text-2xl font-bold">
          {data.totalStudents}
          <span className="text-sm font-normal text-muted-foreground">students</span>
        </div>
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
          {data.breakdown.map((item, index) => (
            <div
              key={item.status}
              className="h-full"
              style={{
                width: `${(item.value / totalPercentage) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.status}: ${item.value}%`}
            />
          ))}
        </div>
        <div className="grid gap-2">
          {data.breakdown.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.status}
              </div>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full bg-transparent">
          View Details
        </Button>
        <p className="text-xs text-muted-foreground">This analysis was calculated since last month</p>
      </CardContent>
    </Card>
  )
}

// ApplicationStatsCard Component (uses fetched stats from useSchoolApplications)
export function ApplicationStatsCard() {
  const { stats, isLoading } = useSchoolApplications() // Assuming this hook provides stats

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <CardTitle>School Applications</CardTitle>
        <CardDescription>Overview of new school applications.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <ApplicationStatsCardSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-semibold">Pending:</span>
              </div>
              <Badge variant="destructive" className="text-xl font-bold bg-yellow-100 text-yellow-800 animate-pulse">
                {stats.pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-semibold">Rejected:</span>
              </div>
              <span className="text-xl font-bold">{stats.rejected}</span>
            </div>
            <Button className="w-full text-sm">See All Applications</Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// SchoolsTable Component (uses fetched data with filters)
export function SchoolsTable() {
  const [statusFilter, setStatusFilter] = useState<"Active" | "Inactive" | "Pending" | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { schools, isLoading } = useRecentSchools({
    status: statusFilter === "all" || statusFilter === "Pending" ? undefined : statusFilter, // Only pass Active/Inactive to API
    search: searchQuery || undefined,
  })

  // Client-side filter for "Pending" if needed, or if the API doesn't support it directly
  const filteredSchools = schools.filter((school) => {
    if (statusFilter === "Pending") {
  
      return school.status === "Inactive" && school.students === 0
    }
    return true
  })

  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Schools</CardTitle>
        <Button variant="outline" size="sm">
          <Link href="/dashboard/schools">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Select
            value={statusFilter}
            onValueChange={(value: "Active" | "Inactive" | "Pending" | "all") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search school name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <RecentSchoolsTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-black">Logo</TableHead>
                <TableHead className="font-black">School Name</TableHead>
                <TableHead className="font-black">Status</TableHead>
                <TableHead className="font-black">Students</TableHead>
                <TableHead className="text-right font-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>
                      <img
                        src={school.logo || "/placeholder.svg?height=48&width=48"}
                        alt={`${school.name} logo`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-xs">{school.name}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          school.status === "Active" && "bg-green-100 text-green-800",
                          school.status === "Inactive" && "bg-red-100 text-red-800",
                          school.status === "Pending" && "bg-yellow-100 text-yellow-800",
                        )}
                      >
                        {school.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{school.students}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No schools found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

// SubscriptionMonitorCard Component (remains dummy data)
function SubscriptionMonitorCard({ data }: { data: SubscriptionData }) {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <CardTitle>Subscription Monitor</CardTitle>
        <CardDescription>Key subscription metrics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-blue-500" />
            <span className="text-base font-semibold">Active Subscriptions:</span>
          </div>
          <span className="text-xl font-semibold">{data.activeSubscriptions}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold">Monthly Recurring Revenue:</span>
          </div>
          <span className="text-lg font-semibold">{data.monthlyRecurringRevenue}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Next Renewal:</span>
          <span className="font-medium">{data.nextRenewalDate}</span>
        </div>
        <Progress value={(data.activeSubscriptions / 200) * 100} className="h-2" />
        <p className="text-xs text-muted-foreground">Targeting 200 active subscriptions by end of year.</p>
      </CardContent>
    </Card>
  )
}

// Overall Analytics Card (Total Users fetched, others dummy)
export function OverallAnalyticsCard() {
  const { stats, isLoading } = useDashboardOverviewStats()

  const data: OverallAnalyticsData = {
    totalUsers: isLoading ? 0 : stats.totalUsers,
    totalCourses: overallAnalyticsDummyData.totalCourses, // Dummy
    averageEngagement: overallAnalyticsDummyData.averageEngagement, // Dummy
  }

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <CardTitle>Overall Platform Analytics</CardTitle>
        <CardDescription>Key performance indicators across all schools.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <OverallAnalyticsCardSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold">Total Users:</span>
              </div>
              <span className="text-lg font-semibold">{data.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold">Total Courses:</span>
              </div>
              <span className="text-lg font-semibold">{data.totalCourses.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-semibold">Avg. Engagement:</span>
              </div>
              <span className="text-lg font-semibold">{data.averageEngagement}</span>
            </div>
            <Button variant="outline" className="w-full bg-transparent text-xs">
              View Full Analytics
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// School Type Distribution Chart Component (remains dummy data)
function SchoolTypeDistributionChart() {
  const chartData = [
    { type: "Public", schools: 450, fill: "#8ec5ff" },
    { type: "Private", schools: 280, fill: "#2b7fff" },
    { type: "Charter", schools: 120, fill: "#155dfc" },
    { type: "Online", schools: 90, fill: "#1447e6" },
    { type: "Other", schools: 60, fill: "#193cb8" },
  ]
  const chartConfig = {
    schools: {
      label: "Schools",
    },
    public: {
      label: "Public",
      color: "#8B5CF6",
    },
    private: {
      label: "Private",
      color: "#F97316",
    },
    charter: {
      label: "Charter",
      color: "#3B82F6",
    },
    online: {
      label: "Online",
      color: "#22C55E",
    },
    other: {
      label: "Other",
      color: "#EF4444",
    },
  }
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>School Type Distribution</CardTitle>
        <CardDescription>Breakdown of schools by type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="schools" label nameKey="type" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex-col gap-2 text-sm p-6 pt-0">
        <div className="flex items-center gap-2 leading-none font-medium">
          Overall growth by 3.5% this quarter <TrendingUp className="h-4 w-4 text-red-600" />
        </div>
      </div>
    </Card>
  )
}

// New Bar Chart for Resource Utilization (remains dummy data)
function ResourceUtilizationChart() {
  const chartData = [
    { resource: "CPU", utilization: 75, fill: "#3B82F6" },
    { resource: "Memory", utilization: 60, fill: "#3B82F6" },
    { resource: "Storage", utilization: 80, fill: "#3B82F6" },
    { resource: "Network", utilization: 45, fill: "#3B82F6" },
    { resource: "CPU", utilization: 75, fill: "#3B82F6" },
    { resource: "Memory", utilization: 60, fill: "#3B82F6" },
    { resource: "Storage", utilization: 80, fill: "#3B82F6" },
    { resource: "Network", utilization: 45, fill: "#3B82F6" },
  ]
  const chartConfig = {
    utilization: {
      label: "Utilization",
      color: "#3B82F6",
    },
  }
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-8 flex flex-col">
      <CardHeader>
        <CardTitle>Resource Utilization Patterns</CardTitle>
        <CardDescription>Average File utilization across all schools</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="resource"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="utilization" fill="#3B82F6" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Monitoring key resource metrics for optimal performance. <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing average utilization for key resources</div>
      </CardContent>
    </Card>
  )
}
