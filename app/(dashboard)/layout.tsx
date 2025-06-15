import { ProtectedRoute } from "@/components/providers/AuthProvider";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getServerUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function DLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
{
  /* <LogoutButton /> */
}
