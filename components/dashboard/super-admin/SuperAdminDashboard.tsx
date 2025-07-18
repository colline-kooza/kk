"use client";
import { cn } from "@/lib/utils";
import { type ComponentProps, type ElementType, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  School,
  FileText,
  CalendarCheck,
  BarChart3,
  Bell,
  GraduationCap,
  BookOpen,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Dummy Data (for components that remain dummy)
interface RevenueSalesData {
  month: string;
  revenue: number;
  sales: number;
}
interface StudentProgressItem {
  status: string;
  value: number;
  color: string;
}
interface StudentProgressData {
  totalStudents: number;
  breakdown: StudentProgressItem[];
}
interface SubscriptionData {
  activeSubscriptions: number;
  monthlyRecurringRevenue: string;
  nextRenewalDate: string;
}

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
];

const studentProgressData: StudentProgressData = {
  totalStudents: 200,
  breakdown: [
    { status: "Passed", value: 50, color: "#8B5CF6" },
    { status: "Failed", value: 10, color: "#F97316" },
    { status: "Overdue", value: 5, color: "#22C55E" },
    { status: "In Progress", value: 25, color: "#A78BFA" },
    { status: "Not Started", value: 10, color: "#E5E7EB" },
  ],
};

const subscriptionMonitorData: SubscriptionData = {
  activeSubscriptions: 150,
  monthlyRecurringRevenue: "$15,000",
  nextRenewalDate: "2025-08-01",
};

// Quick Access Button Component (remains the same)
interface QuickAccessButtonProps
  extends Omit<ComponentProps<typeof Button>, "icon"> {
  icon: ElementType;
  label: string;
    link?: string | null;

  showPlus?: boolean;
  iconBgColor: string;
  iconColor: string;
}

export function QuickAccessButton({
  icon: Icon,
  label,
  link,
  showPlus = false,
  className,
  iconBgColor,
  iconColor,
  ...props
}: QuickAccessButtonProps) {
  const content = (
    <Button
      variant="outline"
      className={cn(
        "flex items-center gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 h-9 text-sm font-medium",
        className
      )}
      {...props}
    >
      <div className={cn("p-1 rounded-md", iconBgColor)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      {label}
      {showPlus && <Plus className="h-3 w-3 ml-1" />}
    </Button>
  );

  if (link) {
    return (
      <Link href={link} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
// RevenueSalesChart Component (remains dummy data)
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileAlert } from "./ProfileAlert";
import {
  ApplicationStatsCard,
  OverallAnalyticsCard,
  SchoolsTable,
  StatCardsSection,
  TotalValueCardsSection,
} from "./dashboard-sections";
import Link from "next/link";

function RevenueSalesChart({ data }: { data: RevenueSalesData[] }) {
  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader>
        <CardTitle>Revenue & Sales</CardTitle>
        <CardDescription>Monthly performance overview.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "#8B5CF6",
            },
            sales: {
              label: "Sales",
              color: "#F97316",
            },
          }}
          className="min-h-[250px] w-full"
        >
          <RechartsLineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={true}
            />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="#F97316"
              strokeWidth={3}
              dot={false}
            />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// StudentProgressCard Component (remains dummy data)
function StudentProgressCard({ data }: { data: StudentProgressData }) {
  const totalPercentage = data.breakdown.reduce(
    (sum, item) => sum + item.value,
    0
  );
  return (
    <Card className="col-span-12 lg:col-span-4 ">
      <CardHeader>
        <CardTitle>Students Progress</CardTitle>
        <CardDescription>Overall student status breakdown.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2 text-3xl font-bold">
          {data.totalStudents}
          <span className="text-sm font-normal text-muted-foreground">
            students
          </span>
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
            <div
              key={item.status}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.status}
              </div>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full bg-transparent">
          View Details
        </Button>
        <p className="text-xs text-muted-foreground">
          This analysis was calculated since last month
        </p>
      </CardContent>
    </Card>
  );
}

// SubscriptionMonitorCard Component (remains dummy data)
function SubscriptionMonitorCard({ data }: { data: SubscriptionData }) {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 font-inter">
      <CardHeader>
        <CardTitle>Subscription Monitor</CardTitle>
        <CardDescription>Key subscription metrics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-blue-500" />
            <span className="text-base font-medium">Active Subscriptions:</span>
          </div>
          <span className="text-sm font-medium">
            {data.activeSubscriptions}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-base font-medium">
              Monthly Recurring Revenue:
            </span>
          </div>
          <span className="text-sm font-medium">
            {data.monthlyRecurringRevenue}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Next Renewal:</span>
          <span className="font-medium">{data.nextRenewalDate}</span>
        </div>
        <Progress
          value={(data.activeSubscriptions / 200) * 100}
          className="h-2"
        />
        <p className="text-xs text-muted-foreground">
          Targeting 200 active subscriptions by end of year.
        </p>
      </CardContent>
    </Card>
  );
}

// School Type Distribution Chart Component (remains dummy data)
function SchoolTypeDistributionChart() {
  const chartData = [
    { type: "Public", schools: 450, fill: "#8ec5ff" },
    { type: "Private", schools: 280, fill: "#2b7fff" },
    { type: "Charter", schools: 120, fill: "#155dfc" },
    { type: "Online", schools: 90, fill: "#1447e6" },
    { type: "Other", schools: 60, fill: "#193cb8" },
  ];
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
  };
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
          Overall growth by 3.5% this quarter{" "}
          <TrendingUp className="h-4 w-4 text-red-600" />
        </div>
      </div>
    </Card>
  );
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
  ];
  const chartConfig = {
    utilization: {
      label: "Utilization",
      color: "#3B82F6",
    },
  };
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-8 flex flex-col">
      <CardHeader>
        <CardTitle>Resource Utilization Patterns</CardTitle>
        <CardDescription>
          Average File utilization across all schools
        </CardDescription>
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="utilization" fill="#3B82F6" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Monitoring key resource metrics for optimal performance.{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing average utilization for key resources
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Components for Suspense
function StatCardSkeleton() {
  return <div className="bg-gray-100 rounded-lg animate-pulse h-24"></div>;
}

function TotalValueCardSkeleton() {
  return <div className="bg-gray-100 rounded-lg animate-pulse h-24"></div>;
}

function RecentSchoolsTableSkeleton() {
  return <div className="bg-gray-100 rounded-lg animate-pulse h-48"></div>;
}

function ApplicationStatsCardSkeleton() {
  return <div className="bg-gray-100 rounded-lg animate-pulse h-24"></div>;
}

function OverallAnalyticsCardSkeleton() {
  return <div className="bg-gray-100 rounded-lg animate-pulse h-24"></div>;
}

export default function SuperAdminDashboard2() {
  return (
    <div className="flex flex-col gap-6 p-2 md:p-2 lg:p-3 bg-gray-50 min-h-screen relative py-8">
      {/* Profile Adjustment Alert */}
      <ProfileAlert />
      {/* Dashboard Header (Static - not affected by loaders) */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            Welcome back, Super Admin! <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Everything you need to manage your multi-school platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="relative hover:bg-transparent hover:text-black text-white bg-[#960df7]"
          >
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          <Link href="/dashboard/schools" className="inline-block">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm bg-transparent shadow-2xs border-[1px] border-gray-200 !px-6"
            >
              <School className="h-4 w-4" />
              View Schools
            </Button>
          </Link>
        </div>
      </div>
      {/* Quick Access Buttons (Static - not affected by loaders) */}
      <div className="flex flex-wrap gap-3">
        <QuickAccessButton
          icon={GraduationCap}
          label="Add Schools"
          showPlus
          link="/dashboard/super-admin/schools/new"
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <QuickAccessButton
          icon={BookOpen}
          label="Applications"
          showPlus
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <QuickAccessButton
          icon={FileText}
          label="Digital Downloads"
          showPlus
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <QuickAccessButton
          icon={BarChart3}
          label="Webinar"
          showPlus
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <QuickAccessButton
          icon={Users}
          label="Bundles"
          showPlus
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Vertically Aligned Stat Cards */}
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCardsSection />
        </Suspense>
        {/* Revenue & Sales Chart with Total Value Cards */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-3">
          <RevenueSalesChart data={revenueSalesChartData} /> {/* Dummy Data */}
          <Suspense fallback={<TotalValueCardSkeleton />}>
            <TotalValueCardsSection />
          </Suspense>
        </div>
        {/* Schools Table */}
        <Suspense fallback={<RecentSchoolsTableSkeleton />}>
          <SchoolsTable />
        </Suspense>
        {/* Student Progress Card */}
        <StudentProgressCard data={studentProgressData} /> {/* Dummy Data */}
        {/* Application Stats Card */}
        <Suspense fallback={<ApplicationStatsCardSkeleton />}>
          <ApplicationStatsCard />
        </Suspense>
        {/* Subscription Monitor Card */}
        <SubscriptionMonitorCard data={subscriptionMonitorData} />{" "}
        {/* Dummy Data */}
        {/* Overall Analytics Card */}
        <Suspense fallback={<OverallAnalyticsCardSkeleton />}>
          <OverallAnalyticsCard />
        </Suspense>
        {/* School Type Distribution Pie Chart */}
        <SchoolTypeDistributionChart /> {/* Dummy Data */}
        {/* Resource Utilization Bar Chart */}
        <ResourceUtilizationChart /> {/* Dummy Data */}
      </div>
    </div>
  );
}
