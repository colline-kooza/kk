import { getServerUser } from "@/actions/auth";
import { PageProtection } from "@/config/page-protection";
import { redirect } from "next/navigation";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default async function SuperAdminLayout({
  children,
}: SuperAdminLayoutProps) {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }

  await PageProtection.superAdminOnly(user);

  return (
    <div className="min-h-screen">
        {children}
    </div>
  );
}
