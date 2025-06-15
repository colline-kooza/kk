import { Suspense } from "react";
import { getServerUser } from "@/actions/auth";
import { getUserLogs } from "@/actions/user-logs";

import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { UserLogsList } from "@/components/dashboard/user-logs/UserLogsListing";

// Loading component for Suspense
function UserLogsLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Activity Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component that fetches and displays logs
async function UserLogsContainer() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await getUserLogs(user?.id, 90);
  console.log(data);
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Activity Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Failed to fetch logs: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <UserLogsList userLogs={data} />;
}

export default function Page() {
  return (
    <div>
      <Suspense fallback={<UserLogsLoading />}>
        <UserLogsContainer />
      </Suspense>
    </div>
  );
}
