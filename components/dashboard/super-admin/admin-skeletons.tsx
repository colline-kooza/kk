import { CardDescription } from "@/components/ui/card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StatCardSkeleton() {
  return (
    <Card className="flex flex-col relative overflow-hidden shadow-2xs gap-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-24" />
        </CardTitle>
        <Skeleton className="h-6 w-6 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          <Skeleton className="h-6 w-32" />
        </div>
        <p className="text-xs">
          <Skeleton className="h-3 w-40 mt-1" />
        </p>
      </CardContent>
    </Card>
  )
}

export function TotalValueCardSkeleton() {
  return (
    <Card className="flex flex-col relative overflow-hidden shadow-2xs gap-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-28" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          <Skeleton className="h-6 w-32" />
        </div>
        <p className="text-xs">
          <Skeleton className="h-3 w-40 mt-1" />
        </p>
      </CardContent>
    </Card>
  )
}

export function RecentSchoolsTableSkeleton() {
  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Schools</CardTitle>
        <Skeleton className="h-8 w-24" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 flex-1" />
        </div>
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
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </TableCell>
                <TableCell className="font-medium text-xs">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="text-xs">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function ApplicationStatsCardSkeleton() {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <Skeleton className="h-4 w-20" />
            </span>
          </div>
          <Skeleton className="h-7 w-12 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <span className="text-sm font-semibold">
              <Skeleton className="h-4 w-20" />
            </span>
          </div>
          <span className="text-xl font-bold">
            <Skeleton className="h-7 w-12" />
          </span>
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}

export function OverallAnalyticsCardSkeleton() {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <span className="text-sm font-semibold">
              <Skeleton className="h-4 w-24" />
            </span>
          </div>
          <span className="text-lg font-semibold">
            <Skeleton className="h-5 w-16" />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <span className="text-sm font-semibold">
              <Skeleton className="h-4 w-24" />
            </span>
          </div>
          <span className="text-lg font-semibold">
            <Skeleton className="h-5 w-16" />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <span className="text-sm font-semibold">
              <Skeleton className="h-4 w-24" />
            </span>
          </div>
          <span className="text-lg font-semibold">
            <Skeleton className="h-5 w-16" />
          </span>
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}
