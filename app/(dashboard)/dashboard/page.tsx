import { Suspense } from "react";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { StudentsTable } from "@/components/dashboard/students-table";
import {
  WelcomeBannerSkeleton,
  MetricCardsSkeleton,
  StudentsTableSkeleton,
} from "@/components/dashboard/loading-skeleton";
import { getServerUser } from "@/actions/auth";
import { redirect } from "next/navigation";

// Simulate async data loading
async function DashboardContent() {
  // Simulate loading delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }
  return (
    <div className="space-y-6">
      <WelcomeBanner
        userName={user.name.split(" ")[0]}
        schoolName="Oakwood Elementary School"
      />
      <MetricCards />
      <StudentsTable />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <WelcomeBannerSkeleton />
          <MetricCardsSkeleton />
          <StudentsTableSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
