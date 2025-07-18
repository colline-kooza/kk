"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo } from "react"
import { useSchoolStore } from "@/store/school"
import type { School } from "@/types/auth2" 
import { extractSubdomainFromHost } from "@/utils/utils"
import { useCurrentSchool, useSchoolCache } from "@/hooks/useSchoolQueries"

interface SchoolContextType {
  school: School | null | undefined
  subdomain: string | null
  isLoading: boolean
  error: string | null
  refreshSchool: () => Promise<void>
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined)

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const { setSchool: setStoreSchool } = useSchoolStore()
  const { invalidateSchool } = useSchoolCache()
  
  const subdomain = useMemo(() => {
    if (typeof window === "undefined") return null
    return extractSubdomainFromHost(window.location.host)
  }, [])

  const { 
    data: school, 
    isLoading, 
    error: queryError,
    refetch,
    isFetching,
    isInitialLoading
  } = useCurrentSchool()

  const error = queryError ? 
    (queryError instanceof Error ? queryError.message : "Failed to load school data") : 
    null

  useEffect(() => {
    if (school) {
      setStoreSchool(school)
    } else if (!isLoading && !isFetching && !error) {
      setStoreSchool(null)
    }
  }, [school, isLoading, isFetching, error, setStoreSchool])

  const refreshSchool = async () => {
    await refetch()
    if (subdomain) {
      invalidateSchool(subdomain)
    }
  }

  const contextValue = useMemo(() => ({
    school,
    subdomain,
    isLoading: isLoading || isFetching || isInitialLoading,
    error,
    refreshSchool,
  }), [school, subdomain, isLoading, isFetching, isInitialLoading, error, refreshSchool])

  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  )
}

export function useSchool() {
  const context = useContext(SchoolContext)
  if (context === undefined) {
    throw new Error("useSchool must be used within a SchoolProvider")
  }
  return context
}