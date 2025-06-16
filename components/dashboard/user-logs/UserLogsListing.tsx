// components/logs/UserLogsList.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Activity, Calendar, Globe, Monitor, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserLog } from "@/actions/user-logs";
import { getNormalDate } from "@/lib/getNormalDate";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserLogsListProps {
  userLogs: UserLog[];
  showUserInfo?: boolean;
}
function groupLogsByDate(logs: UserLog[]) {
  const grouped = logs.reduce((acc, log) => {
    const date = getNormalDate(log.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, UserLog[]>);

  // Sort dates in descending order
  return Object.entries(grouped).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
}
export function UserLogsList({
  userLogs,
  showUserInfo = false,
}: UserLogsListProps) {
  const [displayDays, setDisplayDays] = useState(90);

  // Filter logs based on selected days
  const filteredLogs = userLogs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - displayDays);
    return logDate >= cutoffDate;
  });
  const groupedLogs = groupLogsByDate(filteredLogs);
  const handleDaysChange = (value: string) => {
    setDisplayDays(parseInt(value));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Activity Logs</span>
          </CardTitle>
          <Select
            value={displayDays.toString()}
            onValueChange={handleDaysChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity logs found for the selected period.</p>
          </div>
        ) : (
          // <div className="space-y-4">
          //   {filteredLogs.map((log) => (
          //     <LogItem key={log.id} log={log} showUserInfo={showUserInfo} />
          //   ))}
          // </div>
          <ScrollArea className="h-[400px] pr-4">
            {groupedLogs.map(([date, dateLogs]) => (
              <div key={date} className="mb-6">
                <h3 className="text-lg font-semibold text-blue-700 px-4 mb-3 sticky top-0 bg-blue-50 py-2">
                  {date}
                </h3>
                <div className="space-y-4">
                  {dateLogs.map((log) => (
                    <LogItem
                      key={log.id}
                      log={log}
                      showUserInfo={showUserInfo}
                    />
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// Individual Log Item Component
interface LogItemProps {
  log: UserLog;
  showUserInfo?: boolean;
}

function LogItem({ log, showUserInfo }: LogItemProps) {
  const getActivityIcon = (activity: string) => {
    if (activity.toLowerCase().includes("login")) {
      return <User className="h-4 w-4 text-green-600" />;
    } else if (activity.toLowerCase().includes("logout")) {
      return <User className="h-4 w-4 text-red-600" />;
    } else {
      return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActivityBadgeColor = (activity: string) => {
    if (activity.toLowerCase().includes("login")) {
      return "bg-green-100 text-green-800";
    } else if (activity.toLowerCase().includes("logout")) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-1">{getActivityIcon(log.activity)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {log.name}
          </h4>
          <Badge
            variant="secondary"
            className={`text-xs ${getActivityBadgeColor(log.activity)}`}
          >
            Activity
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-2">{log.activity}</p>

        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}</span>
          </div>

          {log.device && (
            <div className="flex items-center space-x-1">
              <Monitor className="h-3 w-3" />
              <span>{log.device}</span>
            </div>
          )}

          {log.ipAddress && (
            <div className="flex items-center space-x-1">
              <Globe className="h-3 w-3" />
              <span>{log.ipAddress}</span>
            </div>
          )}
        </div>

        {showUserInfo && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>User: {log.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
