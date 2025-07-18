"use server";
import { getServerUser } from "@/actions/auth";
import { DepartmentsLoadingSkeleton } from "@/components/dashboard/departments-loading";
import DepartmentsPage from "@/components/dashboard/departments-page";
import React, { Suspense } from "react";

export default async function page() {
  const user = await getServerUser();
  if (!user) {
    return <div>User not available</div>;
  }
  return (
    <Suspense fallback={<DepartmentsLoadingSkeleton />}>
      <DepartmentsPage userId={user.id} />
    </Suspense>
  );
}
