import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TotalValueCardProps {
  title: string
  value: string
  change: string
  trend: any
  description: string
}

export function TotalValueCard({ title, value, change, trend, description }: TotalValueCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500"

  return (
    <Card className="relative flex flex-col gap-2 shadow-2xs">
      <CardHeader >
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-xl font-bold">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-xs font-medium", trendColor)}>
          <TrendIcon className="inline-block h-3 w-3 mr-1" />
          {change} {description}
        </div>
      </CardContent>
       <div className="absolute -bottom-0 -right-0 opacity-[0.06]">
        <Activity className="h-16 w-16 text-orange-600" />
      </div>
    </Card>
  )
}