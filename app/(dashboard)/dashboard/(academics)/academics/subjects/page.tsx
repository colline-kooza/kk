import { getServerUser } from "@/actions/auth";
import { DepartmentsLoadingSkeleton } from "@/components/dashboard/departments-loading";
import SubjectsPage from "@/components/dashboard/subjects-page";
import React, { Suspense } from "react";

export default async function page() {
  const user = await getServerUser();
  if (!user) {
    return <p>user not available</p>;
  }
  return (
    <div>
      <Suspense fallback={<DepartmentsLoadingSkeleton />}>
        <SubjectsPage userId={user.id} />
      </Suspense>
    </div>
  );
}
