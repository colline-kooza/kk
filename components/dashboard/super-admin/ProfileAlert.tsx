"use client"

import * as React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Info } from "lucide-react"

export function ProfileAlert() {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    // Auto-dismiss after 3 minutes (180000 milliseconds)
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000) // 3 minutes

    // Cleanup timer if component unmounts or alert is manually dismissed
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Alert className="absolute -top-[0%] left-0 right-0 z-50 mb-0 bg-blue-50 border-blue-200 text-blue-800 rounded-none border-x-0 border-t-0">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Heads up!</AlertTitle>
      <AlertDescription className="text-blue-700 text-xs">
        You can make adjustments to your profile and settings in the 'Settings' section.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-blue-600 hover:bg-blue-100"
        onClick={handleDismiss}
        aria-label="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  )
}