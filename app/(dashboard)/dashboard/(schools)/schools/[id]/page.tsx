import { getServerUser } from "@/actions/auth";
import SchoolDetailPage from "@/components/dashboard/school/SchoolDetailPage";
import { PageProtection } from "@/config/page-protection";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }

  await PageProtection.superAdminOnly(user);
  return (
    <div>
      <SchoolDetailPage />
    </div>
  );
}
