"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  MapPin,
  FileText,
  MessageSquare,
  Upload,
  CheckCircle,
  XCircle,
  Clock3,
  Plus,
  Edit,
  ArrowLeft,
  Activity,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useSchoolApplicationDetail } from "@/hooks/use-school-applications";
import {
  formatDate,
  getCountryFlag,
  getRoleDisplayName,
  getStatusColor,
} from "@/lib/application-utils";
import { StatusUpdateDialog } from "@/components/dashboard/StatusUpdateDialog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ApplicationDetailContentProps {
  applicationId: string;
}

export function ApplicationDetailContent({
  applicationId,
}: ApplicationDetailContentProps) {
  const router = useRouter();
  const { application, isLoading, error } =
    useSchoolApplicationDetail(applicationId);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-20" />
          <span>{">"}</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Application Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              {error || "The requested application could not be found."}
            </p>
            <Button onClick={() => router.back()}>Back to Applications</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = {
    PENDING: Clock3,
    APPROVED: CheckCircle,
    REJECTED: XCircle,
  }[application.status];
    const handleAddClick = () => {
    router.push("/dashboard/super-admin/schools/new")
  }
  return (
    <div className="container mx-auto px-3 py-2 space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Applications
        </Button>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Application Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Application By {application.applicantName}
          </h1>
          <p className="text-muted-foreground text-sm">
            Application submitted on {formatDate(application.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 flex-row-reverse">
          <Button
            variant="outline"
            className=" text-black text-xs border-[1px] border-gray-200 shadow-none"
            onClick={() => setStatusDialogOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Update Status
          </Button>
          {/* {application.status === "APPROVED" && !application.generatedSchoolId && ( */}

          <Link href="">
          
          </Link>
          <Button onClick={()=>handleAddClick()} className="text-xs">
            <Plus className="h-4 w-4 mr-2" />
            Create School
          </Button>
          {/* )} */}
        </div>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-200 border-0 bg-gradient-to-br from-slate-50 to-slate-100/50 h-28">
          <CardContent className="px-4 py-3 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -bottom-0 -right-2 opacity-[0.08]">
              <User className="h-16 w-16 text-slate-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-medium text-slate-600 mb-1 tracking-wide uppercase">
                Applicant
              </div>
              <div className="font-semibold text-slate-900 text-sm leading-tight">
                {application.applicantName}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-200 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 h-28">
          <CardContent className="px-4 py-3 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08]">
              <GraduationCap className="h-16 w-16 text-blue-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-medium text-blue-700 mb-1 tracking-wide uppercase">
                School
              </div>
              <div className="font-semibold text-slate-900 text-sm leading-tight">
                {application.schoolName}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-200 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 h-28">
          <CardContent className="p-5 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08]">
              <Globe className="h-16 w-16 text-emerald-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-medium text-emerald-700 mb-2 tracking-wide uppercase">
                Country
              </div>
              <div className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <span className="text-base">
                  {getCountryFlag(application.country)}
                </span>
                {application.country}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow duration-200 border-0  cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100/50 h-28">
          <CardContent className="px-4 py-3 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08]">
              <Briefcase className="h-16 w-16 text-purple-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-medium text-purple-700 mb-1 tracking-wide uppercase">
                Role
              </div>
              <div className="font-semibold text-slate-900 text-sm leading-tight">
                {getRoleDisplayName(application.role)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow duration-200 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 h-28">
          <CardContent className="px-4 py-3 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08]">
              <Users className="h-16 w-16 text-orange-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-medium text-orange-700 mb-1 tracking-wide uppercase">
                Students
              </div>
              <div className="font-semibold text-slate-900 text-sm">
                {application.numberOfStudents.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow duration-200 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/50 h-28 cursor-pointer">
          <CardContent className="px-4 py-3 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -top-2 -right-2 opacity-[0.08]">
              <Activity className="h-16 w-16 text-indigo-600" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-medium text-indigo-700 mb-1 tracking-wide uppercase">
                Status
              </div>
              <Badge className={getStatusColor(application.status)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {application.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Timeline */}
      <Card className="shadow-sm ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-sm">Submitted</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(application.createdAt)}
            </div>
          </div>

          {application.status !== "PENDING" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    application.status === "APPROVED"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="font-medium text-sm">
                  {application.status === "APPROVED" ? "Approved" : "Rejected"}
                </span>
              </div>
              {application.processedAt && (
                <div className="text-sm text-muted-foreground">
                  {formatDate(application.processedAt)}
                </div>
              )}
              
            </div>
          )}

          {application.rejectionReason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">
                Rejection Reason
              </h4>
              <p className="text-red-700 text-sm">
                {application.rejectionReason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    School Name
                  </label>
                  <p className="font-medium">{application.schoolName}</p>
                </div>
                {application.schoolWebsite && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Website
                    </label>
                    <p className="font-medium">
                      <a
                        href={application.schoolWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        {application.schoolWebsite}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Number of Students
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {application.numberOfStudents.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {getCountryFlag(application.country)} {application.country}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pain Points & Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Challenges
                  </label>
                  <p className="mt-2 text-sm leading-relaxed">
                    {application.painPoints}
                  </p>
                </div>
                {application.hearAboutUs && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground">
                      How they heard about us
                    </label>
                    <p className="mt-2 text-sm">{application.hearAboutUs}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="font-medium">{application.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <p className="font-medium">
                    {getRoleDisplayName(application.role)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <p className="font-medium">
                    <a
                      href={`mailto:${application.workEmail}`}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      {application.workEmail}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </label>
                  <p className="font-medium">
                    <a
                      href={`tel:${application.phoneNumber}`}
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      {application.phoneNumber}
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {application.productInterests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

       
      </Tabs>

      <StatusUpdateDialog
        application={application}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
}
