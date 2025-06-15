import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }[changeType]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeColor}`}>{change}</p>
      </CardContent>
    </Card>
  )
}

export function MetricCards() {
  const metrics = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Active Teachers",
      value: "89",
      change: "+2 new this month",
      changeType: "positive" as const,
      icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Classes",
      value: "45",
      change: "No change",
      changeType: "neutral" as const,
      icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "+2.1% from last week",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}
