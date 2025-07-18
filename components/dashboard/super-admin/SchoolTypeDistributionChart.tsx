"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Dummy data for school types
const chartData = [
  { type: "Public", schools: 450, fill: "var(--color-public)" },
  { type: "Private", schools: 280, fill: "var(--color-private)" },
  { type: "Charter", schools: 120, fill: "var(--color-charter)" },
  { type: "Online", schools: 90, fill: "var(--color-online)" },
  { type: "Other", schools: 60, fill: "var(--color-other)" },
]

const chartConfig = {
  schools: {
    label: "Schools",
  },
  public: {
    label: "Public",
    color: "hsl(var(--chart-1))", // Primary-like purple
  },
  private: {
    label: "Private",
    color: "hsl(var(--chart-2))", // Green
  },
  charter: {
    label: "Charter",
    color: "hsl(var(--chart-3))", // Orange
  },
  online: {
    label: "Online",
    color: "hsl(var(--chart-4))", // Blue
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))", // Gray
  },
} satisfies ChartConfig

export function SchoolTypeDistributionChart() {
  return (
    <Card className="flex flex-col">
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Overall growth by 3.5% this quarter <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing distribution of all registered schools</div>
      </CardFooter>
    </Card>
  )
}
