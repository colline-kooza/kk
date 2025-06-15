import { Card, CardContent } from "@/components/ui/card"
import { School } from "lucide-react"

interface WelcomeBannerProps {
  userName: string
  schoolName: string
}

export function WelcomeBanner({ userName, schoolName }: WelcomeBannerProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-blue-100 mb-1">{currentDate}</p>
            <p className="text-blue-100 flex items-center gap-2">
              <School className="h-4 w-4" />
              {schoolName}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <School className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
