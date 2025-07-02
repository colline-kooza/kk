"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  Star,
  BookOpen,
  Users,
  Award,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
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
import { useAuthStore } from "@/store/auth";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import MainLogo from "../home/main-logo";
import { LoginCredentials } from "@/types/login";
import { createLoginLog, loginUser } from "@/actions/login";

interface CarouselImage {
  url: string;
  alt: string;
}

// Fixed validation schema - remove transform to avoid type conflicts
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

// Use input type for the form (matches the schema exactly)
type LoginFormValues = z.input<typeof loginSchema>;

// Carousel images for the background
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

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const router = useRouter();
  const { deviceInfo } = useDeviceInfo();
  const { setUser, setSchool, setTokens } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev: number) => (prev + 1) % carouselImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function onSubmit(data: LoginFormValues): Promise<void> {
    try {
      setIsLoading(true);

      // Prepare login credentials - ensure rememberMe is boolean
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false, // Fallback to false if undefined
      };

      // Attempt login
      const result = await loginUser(credentials);

      if (!result.success || !result.data) {
        toast.error("Login Failed", {
          description: result.error || "Please check your credentials",
        });
        return;
      }

      // Set client-side auth state
      setUser(result.data.user);
      setTokens(result.data.accessToken, result.data.refreshToken);

      // Set school if available (not for SUPER_ADMIN) - use result.data.school instead of result.school
      if (result.data.school && result.data.user.role !== "SUPER_ADMIN") {
        console.log("Setting school data:", result.data.school); // Debug log
        setSchool(result.data.school);
      }

      // Create login log with proper device info mapping
      const deviceLogInfo = {
        device: deviceInfo.userAgent || "Unknown Device",
        ipAddress: deviceInfo.platform || "Unknown IP",
      };

      await createLoginLog(
        result.data.user.id,
        result.data.user.name,
        deviceLogInfo
      );

      // Show success message
      toast.success("Login Successful", {
        description: `Welcome back, ${result.data.user.name}!`,
      });

      // Route based on user role and context
      handleUserRedirect(result.data.user.role, result.data.user.schoolId);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle user redirection based on role and school context
  function handleUserRedirect(role: string, schoolId: string | null): void {
    switch (role) {
      case "SUPER_ADMIN":
        // Super admin goes to onboarding if no schools exist, otherwise dashboard
        router.push("/dashboard");
        break;

      case "ADMIN":
      
        router.push("/dashboard");

        break;

      case "TEACHER":
      case "RECEPTIONIST":
      case "ACCOUNTANT":
      case "LIBRARIAN":
      case "STUDENT":
      case "PARENT":
        // All other roles go directly to dashboard
        router.push("/dashboard");
        break;

      default:
        // Fallback to dashboard
        router.push("/dashboard");
        break;
    }
  }

  const handleForgotPassword = (): void => {
    toast.info("Forgot Password", {
      description: "Password reset functionality coming soon!",
    });
  };

  const handleRegisterClick = (): void => {
    router.push("/register");
  };

  const handleBackToHome = (): void => {
    router.push("/");
  };

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

        <div className="w-full max-w-sm sm:max-w-md pt-2 lg:pt-[12%]">
          {/* Logo and Header - Responsive sizing */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-2 justify-center sm:justify-start">
              <MainLogo />
            </div>
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 text-center sm:text-left">
              School<span className="text-primary">Portal</span>
            </h1>
            <p className="text-gray-600 text-sm text-center sm:text-left">
              Sign in to your account
            </p>
          </div>

          {/* Login Form - Responsive spacing */}
          <div className="space-y-4 sm:space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
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
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
                  className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/85 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 text-sm sm:text-base"
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
                        Sign In to your account
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Register Link - Responsive text */}
            <div className="text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                Not a member yet?{" "}
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/70 p-0 h-auto font-medium underline text-xs sm:text-sm"
                  onClick={handleRegisterClick}
                >
                  Register Now
                </Button>
              </p>
            </div>
          </div>

          {/* Footer - Responsive spacing */}
          <div className="mt-8 sm:mt-12 text-center">
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
