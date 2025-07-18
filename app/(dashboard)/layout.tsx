"use server";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getSchool, getServerUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function DLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  // console.log(user)
  if (!user) {
    redirect("/auth/login");
  }
  const school = await getSchool();
  return <DashboardLayout school={school} user={user}>{children}</DashboardLayout>;
}
