"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  MapPin,
  ArrowLeft,
  Activity,
  GraduationCap,
  Briefcase,
  DollarSign,
  BookOpen,
  Eye,
  BarChart,
  Download,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Clock,
  Shield,
  FileText,
  Camera,
  Edit,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react"

// Enhanced dummy data for the school
const dummySchool = {
  id: "521455",
  name: "Noyakhali Zilla School",
  address: "Gudaraghat, Saghata, Barishal",
  establishedYear: 1996,
  logo: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=800",
  principal: {
    name: "Fatah Uddin Siddq",
    title: "Principal",
    profileImage: "/placeholder.svg?height=100&width=100",
    experience: "12 years",
    qualification: "M.Ed, B.Ed",
  },
  stats: {
    totalStudents: 2101,
    totalTeachers: 250,
    teacherStudentRatio: "1:8.4",
    applicationsReceived: 250,
    visitorReview: 7,
    resultRating: 6,
    totalEarnings: 1250000,
    passRate: 92,
    attendanceRate: 89,
    graduationRate: 95,
    satisfactionScore: 4.2,
  },
  generalInfo: {
    division: "Barishal",
    district: "Barishal",
    thana: "Niketon Para",
    union: "Sitalpur",
    mpoCode: "112012121",
    einNumber: "521455",
    institutionCategory: "Secondary",
    type: "Combined",
    locationType: "Pouro",
    siteLink: "noyali.emis.com",
    siteStatus: "live",
    country: "Bangladesh",
    accreditation: "A+",
    infrastructure: "Excellent",
    digitalReadiness: "Advanced",
  },
  contactInfo: {
    fullName: "Fatah Uddin Siddq",
    role: "Principal",
    email: "principal@noyakhali.emis.com",
    phoneNumber: "+8801712345678",
    alternatePhone: "+8801812345678",
    fax: "+8801912345678",
  },
  programsOffered: [
    "Science Stream",
    "Arts Stream",
    "Commerce Stream",
    "Vocational Training",
    "Computer Science",
    "Mathematics Olympiad",
    "Language Studies",
    "Sports Program",
  ],
  facilities: [
    "Library",
    "Computer Lab",
    "Science Lab",
    "Sports Ground",
    "Auditorium",
    "Medical Room",
    "Canteen",
    "Transport",
    "Hostel",
    "Prayer Room",
    "Art Room",
    "Music Room",
  ],
  achievements: [
    "Best School Award 2023",
    "Excellence in Education 2022",
    "Digital Innovation Award 2023",
    "Sports Championship 2022",
  ],
  recentActivities: [
    { date: "2024-01-15", activity: "Annual Science Fair", type: "event" },
    { date: "2024-01-12", activity: "New Computer Lab Inauguration", type: "infrastructure" },
    { date: "2024-01-08", activity: "Teacher Training Program", type: "development" },
    { date: "2024-01-05", activity: "Student Achievement Recognition", type: "award" },
  ],
  status: "ACTIVE",
  lastUpdated: "2024-01-20T10:30:00Z",
}

export default function SchoolDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const school = dummySchool

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }:any) => (
    <Card
      className={`cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-br ${color} h-32 group`}
    >
      <CardContent className="p-4 relative overflow-hidden">
        <div className="absolute -top-2 -right-2 opacity-[0.08] transition-opacity group-hover:opacity-[0.12]">
          <Icon className="h-16 w-16" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="text-xs font-medium text-slate-600 mb-1 tracking-wide uppercase">{title}</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-bold text-slate-900 text-lg leading-tight">{value}</div>
              {subtitle && <div className="text-xs text-slate-600 mt-1">{subtitle}</div>}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-inter">
      {/* Header with Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {/* This div will contain the image, overlay, and gradient, and will be clipped */}
        <div className="absolute inset-0" style={{ clipPath: "url(#wavy-clip)" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/15"></div> {/* Gradient */}
          <img
            src={"https://res.cloudinary.com/dirpuqqib/image/upload/v1752572514/wmremove-transformed_xiwa6m.jpg"}
            alt="School cover"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        {/* SVG definition for the clip-path */}
        <svg className="absolute bottom-0 left-0 w-full h-auto" viewBox="0 0 1440 192" preserveAspectRatio="none">
          <defs>
            <clipPath id="wavy-clip">
              {/* Path for a wave at the bottom, keeping the top straight */}
              <path d="M0,0 L1440,0 L1440,192 C1200,172 960,212 720,192 C480,172 240,212 0,192 Z" />
            </clipPath>
          </defs>
        </svg>
        {/* Content that should appear on top of the clipped image/gradient */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-28">
            <Button
              variant="outline"
              className="bg-white/10 border-white/80 text-white hover:bg-white/20 mb-4"
              onClick={() => {
                /* Navigate back */
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-10">
        {/* School Header Card */}
        <Card className="mb-8  border-0 bg-white/95 backdrop-blur-sm rounded">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={"https://media.istockphoto.com/id/2190493437/vector/owl-mascot-logo-design-template.jpg?s=612x612&w=0&k=20&c=mZrUQgkEvKDQ-eeuumUymzMv472nEhF6xzW2fFIjbEI="} alt={school.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                      {school.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{school.name}</h1>
                  <div className="flex items-center gap-2 text-slate-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{school.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      Est. {school.establishedYear}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Grade {school.generalInfo.accreditation}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Shield className="h-3 w-3 mr-1" />
                      {school.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex-1"></div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={"https://media.istockphoto.com/id/2217185028/video/teenage-boy-making-video-call-looking-at-camera.avif?s=640x640&k=20&c=_-qprG-r5gMDYqckn8JdqeU-2aWTmV9eXFdPnPE74W4="}
                        alt={school.principal.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {school.principal.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{school.principal.name}</p>
                      <p className="text-xs text-slate-600">{school.principal.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {school.principal.experience} • {school.principal.qualification}
                  </p>
                </div>
                <div className="flex gap-3 flex-col">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Students"
            value={school.stats.totalStudents.toLocaleString()}
            icon={Users}
            color="from-blue-50 to-blue-100/70"
            trend="+12%"
            subtitle="All levels"
          />
          <StatCard
            title="Teachers"
            value={school.stats.totalTeachers.toLocaleString()}
            icon={GraduationCap}
            color="from-green-50 to-green-100/70"
            trend="+5%"
            subtitle="Certified"
          />
          <StatCard
            title="Student-Teacher Ratio"
            value={school.stats.teacherStudentRatio}
            icon={Target}
            color="from-purple-50 to-purple-100/70"
            subtitle="Optimal"
          />
          <StatCard
            title="Pass Rate"
            value={`${school.stats.passRate}%`}
            icon={Award}
            color="from-orange-50 to-orange-100/70"
            trend="+8%"
            subtitle="Last year"
          />
          <StatCard
            title="Attendance"
            value={`${school.stats.attendanceRate}%`}
            icon={Clock}
            color="from-red-50 to-red-100/70"
            trend="+3%"
            subtitle="Monthly avg"
          />
          <StatCard
            title="Satisfaction"
            value={`${school.stats.satisfactionScore}/5`}
            icon={Star}
            color="from-yellow-50 to-yellow-100/70"
            trend="+0.3"
            subtitle="Parent rating"
          />
        </div>

        {/* Main Content with Enhanced Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academics">Academics</TabsTrigger>
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="space-y-6">
                  <TabsContent value="overview" className="space-y-6">
                    {/* Performance Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-blue-600" />
                            Academic Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Pass Rate</span>
                                <span className="font-medium">{school.stats.passRate}%</span>
                              </div>
                              <Progress value={school.stats.passRate} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Graduation Rate</span>
                                <span className="font-medium">{school.stats.graduationRate}%</span>
                              </div>
                              <Progress value={school.stats.graduationRate} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Attendance Rate</span>
                                <span className="font-medium">{school.stats.attendanceRate}%</span>
                              </div>
                              <Progress value={school.stats.attendanceRate} className="h-2" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-green-600" />
                            Recent Achievements
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {school.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                <span className="text-sm font-medium">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    {/* School Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          School Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">Division</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.division}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">District</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.district}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Thana</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.thana}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Union</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.union}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">MPO Code</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.mpoCode}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">EIN Number</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.einNumber}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Institution Category</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.institutionCategory}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Type</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.type}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">Location Type</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.locationType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Website</label>
                              <p className="font-medium">
                                <a
                                  href={`https://${school.generalInfo.siteLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <Globe className="h-4 w-4" />
                                  {school.generalInfo.siteLink}
                                </a>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Infrastructure</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.infrastructure}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Digital Readiness</label>
                              <p className="font-medium text-slate-900">{school.generalInfo.digitalReadiness}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="academics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Programs Offered
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {school.programsOffered.map((program, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                {program}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Academic Standards
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Accreditation</span>
                            <Badge className="bg-green-100 text-green-800">{school.generalInfo.accreditation}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Pass Rate</span>
                            <span className="font-medium">{school.stats.passRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Result Rating</span>
                            <span className="font-medium">{school.stats.resultRating}/10</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="facilities" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Available Facilities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {school.facilities.map((facility, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="staff" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Principal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">Full Name</label>
                              <p className="font-medium text-slate-900">{school.contactInfo.fullName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Role</label>
                              <p className="font-medium text-slate-900">{school.contactInfo.role}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Experience</label>
                              <p className="font-medium text-slate-900">{school.principal.experience}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Qualification</label>
                              <p className="font-medium text-slate-900">{school.principal.qualification}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">Email</label>
                              <p className="font-medium">
                                <a
                                  href={`mailto:${school.contactInfo.email}`}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                >
                                  <Mail className="h-4 w-4" />
                                  {school.contactInfo.email}
                                </a>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Phone</label>
                              <p className="font-medium">
                                <a
                                  href={`tel:${school.contactInfo.phoneNumber}`}
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                >
                                  <Phone className="h-4 w-4" />
                                  {school.contactInfo.phoneNumber}
                                </a>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Alternate Phone</label>
                              <p className="font-medium">{school.contactInfo.alternatePhone}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Fax</label>
                              <p className="font-medium">{school.contactInfo.fax}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="financials" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Financial Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">Total Earnings</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900">
                              ৳{school.stats.totalEarnings.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-700 mt-1">Current fiscal year</p>
                          </div>
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-800">Revenue per Student</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                              ৳{Math.round(school.stats.totalEarnings / school.stats.totalStudents).toLocaleString()}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">Average per student</p>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">
                            Financial data provides insights into the school's operational efficiency and resource
                            allocation. This information helps in strategic planning and budget optimization.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  View Gallery
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact School
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply for Admission
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Curriculum
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {school.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "event" && <Calendar className="h-4 w-4 text-blue-500" />}
                      {activity.type === "infrastructure" && <Building2 className="h-4 w-4 text-green-500" />}
                      {activity.type === "development" && <Briefcase className="h-4 w-4 text-purple-500" />}
                      {activity.type === "award" && <Award className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{activity.activity}</p>
                      <p className="text-xs text-slate-500">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews & Ratings */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Visitor Review</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(school.stats.visitorReview / 2)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold text-slate-900">{school.stats.visitorReview}/10</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Result Rating</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(school.stats.resultRating / 2)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold text-slate-900">{school.stats.resultRating}/10</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Based on aggregated feedback and academic performance metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 text-center text-sm text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
          <p className="mt-1">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
