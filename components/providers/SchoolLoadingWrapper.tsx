"use client"

import type React from "react"
import { memo } from "react"
import { useSchool } from "@/components/providers/SchoolProvider"
import { BookLoader } from "../home/BookLoader"

interface SchoolLoadingWrapperProps {
  children: React.ReactNode
}

// Memoize error component to prevent unnecessary re-renders
const ErrorDisplay = memo(({ error }: { error: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
      <p className="text-gray-600">{error}</p>
    </div>
  </div>
))

ErrorDisplay.displayName = "ErrorDisplay"

// Memoize not found component
const NotFoundDisplay = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">School Not Found</h2>
      <p className="text-gray-600">The requested school could not be found.</p>
    </div>
  </div>
))

NotFoundDisplay.displayName = "NotFoundDisplay"

// Memoize loading component
const LoadingDisplay = memo(() => <BookLoader />)

LoadingDisplay.displayName = "LoadingDisplay"

export const SchoolLoadingWrapper = memo(({ children }: SchoolLoadingWrapperProps) => {
  const { school, isLoading, error, subdomain } = useSchool()

  // Show loading if we're still loading OR if we have no school data yet but have a valid subdomain
  if (isLoading || (subdomain && !school && !error)) {
    return <LoadingDisplay />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  // Only show not found if we have a subdomain but no school and we're not loading
  if (subdomain && !school && !isLoading) {
    return <NotFoundDisplay />
  }

  // If no subdomain and no school, just render children (for non-school routes)
  if (!subdomain && !school) {
    return <>{children}</>
  }

  return <>{children}</>
})

SchoolLoadingWrapper.displayName = "SchoolLoadingWrapper"