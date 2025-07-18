import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface LoadingSkeletonProps {
  rows?: number;
}

export function DepartmentsLoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="flex items-center border-b border-slate-200 pb-6 justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#940cf4] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
              <div className="h-5 w-80 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        {/* Table Skeleton */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-lg">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <div className="flex items-center py-4 px-6">
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-slate-300 rounded animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-16 bg-slate-300 rounded animate-pulse" />
                  </div>
                  <div className="w-[60px]" />
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 bg-slate-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center py-4 px-6 hover:bg-slate-50/80 transition-all duration-200">
      {/* Department Column */}
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Head of Department Column */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
          <div className="flex flex-col gap-1">
            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Created Column */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Actions Column */}
      <div className="w-[60px] flex justify-end">
        <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
