"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  Crown,
  Shield,
  UserCheck,
  GraduationCap,
  Star,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSchool } from "@/components/providers/SchoolProvider";
import { useAuthStore } from "@/store/auth";
import { useSchoolStore } from "@/store/school";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { loginUser, createLoginLog } from "@/actions/auth";
import MainLogo from "../home/main-logo";
import { School, User } from "@/types/auth2";
import { buildSubdomainUrl, rootDomain } from "@/utils/utils";
import { Avatar, AvatarImage } from "../ui/avatar";

interface CarouselImage {
  url: string;
  alt: string;
}

interface QuickLoginUser {
  role: string;
  email: string;
  password: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.input<typeof loginSchema>;

const carouselImages: CarouselImage[] = [
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751458501/concentrated-schoolgirl-with-green-pencil_1098-3802_wxn9qq.avif",
    alt: "Concentrated schoolgirl with green pencil",
  },
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751458526/diverse-elementary-schoolchildren-sitting-desks-raising-hand_hhqwis.avif",
    alt: "Diverse elementary schoolchildren sitting at desks raising hands",
  },
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751461842/beige-simple-happy-birthday-photo-collage-11_1308217-677_w3xkeq.avif",
    alt: "Happy students celebration",
  },
  {
    url: "https://res.cloudinary.com/dirpuqqib/image/upload/v1751458540/smiling-student-leaning-stacked-books_1098-3789_uirnzl.avif",
    alt: "Smiling student leaning on stacked books",
  },
];

// Updated quick login users - removed Super Admin from demo school
const getQuickLoginUsers = (isMainHighSchool: boolean): QuickLoginUser[] => {
  const demoUsers: QuickLoginUser[] = [
    {
      role: "Admin",
      email: "admin@admin.com",
      password: "Admin@2025",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
    },
    {
      role: "Teacher",
      email: "john.smith@stmarysacademy.edu",
      password: "Teacher@2025",
      icon: UserCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      role: "Student",
      email: "arjun.kumar@student.stmarysacademy.edu",
      password: "Student@2025",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
  ];

  const mainUsers: QuickLoginUser[] = [
    {
      role: "Super Admin",
      email: "superadmin@admin.com",
      password: "SuperAdmin@2025",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
    },
  ];

  return isMainHighSchool ? demoUsers : mainUsers;
};

export default function LoginForm() {
  const { school  , subdomain} = useSchool();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { deviceInfo } = useDeviceInfo();
  const { setUser, setTokens, setSchool: setAuthSchool } = useAuthStore();
  const { setSchool: setStoreSchool } = useSchoolStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-fill Super Admin credentials when no school is present
  useEffect(() => {
    if (!school && !subdomain) {
      form.setValue("email", "superadmin@admin.com");
      form.setValue("password", "SuperAdmin@2025");
    }
  }, [school, subdomain, form]);

  const handleQuickLogin = async (user: QuickLoginUser) => {
    form.setValue("email", user.email);
    form.setValue("password", user.password);

    if (user.role === "Admin") {
      const adminData = {
        email: user.email,
        password: user.password,
        rememberMe: false,
      };

      try {
        const result = await loginUser(adminData, subdomain || undefined);
        if (result.success && result.data?.school?.subdomain) {
          // const subdomainUrl = buildSubdomainUrl(
          //   result.data.school.subdomain,
          //   "/dashboard"
          // );
          // window.open(subdomainUrl, "_blank", "noopener,noreferrer");
          toast.success("Admin Login", {
            description: `Opened ${result.data.school.name} in new tab`,
          });
        } else {
          toast.error("Login Failed", {
            description: result.error || "Could not log in as admin",
          });
        }
      } catch (error) {
        toast.error("Login Error", {
          description: "Could not process admin login",
        });
      }
    } else {
      toast.success("Demo Credentials Filled", {
        description: `Filled ${user.role} login credentials`,
      });
    }
  };

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      console.log("Starting login process...");

      const credentials = {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      };

      const result = await loginUser(credentials, subdomain || undefined);

      console.log("Login result:", {
        success: result.success,
        hasData: !!result.data,
        error: result.error,
      });

      if (!result.success || !result.data) {
        toast.error("Login Failed", {
          description: result.error || "Please check your credentials",
        });
        return;
      }
      // Update Zustand stores
      try {
        console.log("Updating Zustand stores...");

        // Set user and tokens in auth store
        setUser(result.data.user);
        setTokens(result.data.accessToken, result.data.refreshToken);

        // Set school in both stores if available
        if (result.data.school && result.data.user.role !== "SUPER_ADMIN") {
          console.log("Setting school in stores:", result.data.school);
          setAuthSchool(result.data.school);
          setStoreSchool(result.data.school);
        }

        console.log("Zustand stores updated successfully");
      } catch (storeError) {
        console.error("Error updating Zustand stores:", storeError);
        // Don't fail the login process for store errors
      }

      // Create login log
      try {
        await createLoginLog(result.data.user.id, result.data.user.name, {
          device: deviceInfo.userAgent || "Unknown Device",
          ipAddress: deviceInfo.platform || "Unknown IP",
        });
      } catch (logError) {
        console.error("Error creating login log:", logError);
      }

      toast.success("Login Successful", {
        description: `Welcome back, ${result.data.user.name}!`,
      });

      // Handle redirect
      handleUserRedirect(result.data.user, result.data.school);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleUserRedirect(user: User, school: School | null) {
    if (user.role === "SUPER_ADMIN") {
      router.push("/dashboard/super-admin");
    } else if (school?.subdomain) {
      const subdomainUrl = buildSubdomainUrl(school.subdomain, "/dashboard");
      const currentHost = window.location.host;
      const expectedHost =
        process.env.NODE_ENV === "production"
          ? `${school.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : `${school.subdomain}.localhost:3000`;

      if (currentHost !== expectedHost) {
        window.location.href = subdomainUrl;
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
  }

  const handleForgotPassword = () => {
    toast.info("Forgot Password", {
      description: "Password reset functionality coming soon!",
    });
  };

  const handleRegisterClick = () => {
    router.push("/auth/enquiry");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // FIXED: Handle join school button click with proper URL
  const handleJoinSchool = () => {
    window.location.href = `http://main-high-school.${rootDomain}/auth/login`;
  };

  // Check if we're on the main-high-school subdomain
  const isMainHighSchool = subdomain === "main-high-school";
  
  // Check if school is available (for padding adjustment)
  const hasSchool = !!school;

  // Get appropriate quick login users based on context
  const quickLoginUsers = getQuickLoginUsers(isMainHighSchool);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Decorative Elements - Hidden on mobile for cleaner look */}
        <div className="hidden sm:block">
          <div className="absolute top-20 left-20 text-primary/40 animate-pulse">
            <Star
              className="h-6 w-6 animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
          </div>
          <div className="absolute top-32 right-24 text-primary/40 animate-pulse">
            <BookOpen
              className="h-8 w-8 animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
            />
          </div>
          <div className="absolute bottom-40 left-16 text-primary/40 animate-pulse">
            <Users
              className="h-7 w-7 animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "3.5s" }}
            />
          </div>
          <div className="absolute bottom-24 right-20 text-primary/40 animate-pulse">
            <Award
              className="h-6 w-6 animate-bounce"
              style={{ animationDelay: "1.5s", animationDuration: "2s" }}
            />
          </div>
          <div className="absolute top-1/2 left-12 text-primary/40 animate-pulse">
            <GraduationCap
              className="h-5 w-5 animate-bounce"
              style={{ animationDelay: "2s", animationDuration: "4s" }}
            />
          </div>
        </div>

        {/* Back to Home Link - Responsive positioning */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-primary/70 hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* UPDATED: Conditional padding based on school availability */}
        <div className={`w-full max-w-sm sm:max-w-md ${hasSchool ? 'pt-0' : 'pt-2 lg:pt-[0%]'}`}>
          {/* Logo and Header - Responsive sizing */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-2 justify-center sm:justify-start">
              {school ? (
                <Avatar className="h-26 w-26">
                  <AvatarImage
                    className="object-cover"
                    src={school?.logo || "/images/lecify-1.png"}
                  />
                </Avatar>
              ) : (
                <MainLogo />
              )}
            </div>
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 text-center sm:text-left">
              {school ? (
                <>
                  {school.name} <span className="text-primary">Portal</span>
                </>
              ) : (
                <>
                  School <span className="text-primary">Pro</span>
                </>
              )}
            </h1>
            <p className="text-gray-600 text-sm text-center sm:text-left">
              {!school && !subdomain 
                ? "Super Admin Panel - Credentials auto-filled"
                : "Sign in to your account"
              }
            </p>
          </div>

          {/* Login Form - Responsive spacing */}
          <div className="space-y-3 sm:space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Email Address"
                            className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-primary rounded-lg transition-colors duration-200 text-sm pr-12"
                            {...field}
                          />
                          <Mail className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-primary focus:ring-primary rounded-lg pr-16 sm:pr-20 transition-colors duration-200 text-sm"
                            {...field}
                          />
                          <Lock className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Remember Me and Forgot Password - Responsive layout */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-600 text-xs sm:text-sm font-normal cursor-pointer">
                            Remember Me
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary hover:text-primary/55 p-0 h-auto font-normal text-xs sm:text-sm justify-start sm:justify-center ml-0"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-primary hover:bg-primary/85 text-white font-semibold rounded-sm shadow-lg transition-all duration-200 text-sm sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span className="sm:hidden">Sign In</span>
                      <span className="hidden sm:inline">
                        {!school && !subdomain ? "Access Super Admin" : "Sign In to your account"}
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* UPDATED: Conditional rendering based on school availability */}
            {!school && !subdomain && (
              <>
                <div className="text-center">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Not a member yet?{" "}
                    <Button
                      variant="link"
                      className="text-primary hover:text-primary/70 p-0 h-auto font-medium underline text-xs sm:text-sm"
                      onClick={handleRegisterClick}
                    >
                      Enquire Now
                    </Button>
                  </p>
                </div>

                {/* Demo School Button - Only shown when no school is available */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 sm:h-12 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 text-sm"
                    onClick={handleJoinSchool}
                  >
                    Join Demo School
                  </Button>
                </div>
              </>
            )}

            {/* UPDATED: Quick Login Buttons - Show Super Admin only when no school, Demo users only for main-high-school */}
            {(isMainHighSchool || (!school && !subdomain)) && (
              <div className="pt-2">
                <p className="text-center text-gray-500 text-xs sm:text-sm mb-3">
                  {isMainHighSchool ? "Quick Demo Login" : "Quick Login"}
                </p>
                <div className={`grid ${isMainHighSchool ? 'grid-cols-3' : 'grid-cols-1'} gap-2 sm:gap-3`}>
                  {quickLoginUsers.map((user, index) => {
                    const IconComponent = user.icon;
                    return (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        className={`
                        h-14 sm:h-14 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200
                        ${user.bgColor} ${user.hoverColor} border-gray-200 hover:border-gray-300 hover:shadow-md
                      `}
                        onClick={() => handleQuickLogin(user)}
                      >
                        <IconComponent
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${user.color} mb-1`}
                        />
                        <span className={`text-xs font-medium ${user.color}`}>
                          {user.role}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Responsive spacing */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-xs">© 2026 All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Carousel - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(1.1) contrast(1.05)",
                minHeight: "100%",
                minWidth: "100%",
              }}
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent"></div>

        <h2 className="text-4xl font-medium mb-4 drop-shadow-2xl text-start text-white max-w-lg absolute bottom-20 left-20">
          Empowering
          <br />
          Student's Journey
          <br />
          From Scratch To Heroes
        </h2>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end justify-center p-8">
          <div className="text-start text-white max-w-lg">
            <div className="flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white shadow-lg"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background - Only visible on mobile */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-green-50 to-primary/10"></div>
      </div>
    </div>
  );
}