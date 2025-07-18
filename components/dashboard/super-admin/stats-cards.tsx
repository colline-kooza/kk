
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, User, Users, DollarSign } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  bgColor: string
  iconBgColor: string
}

function StatsCard({ title, value, icon, bgColor, iconBgColor }: StatsCardProps) {
  return (
    <Card className={`${bgColor} border-0 shadow-sm`}>
      <CardContent className="px-6 py-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`${iconBgColor} p-3 rounded-full`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SuperAdminDashboard() {
  const statsData = [
    {
      title: "Students",
      value: "15.00K",
      icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
      bgColor: "bg-purple-50",
      iconBgColor: "bg-purple-100",
    },
    {
      title: "Teachers",
      value: "2.00K",
      icon: <User className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Parents",
      value: "5.6K",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      bgColor: "bg-orange-50",
      iconBgColor: "bg-orange-100",
    },
    {
      title: "Earnings",
      value: "$19.3K",
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-100",
    },
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColor={stat.bgColor}
              iconBgColor={stat.iconBgColor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
