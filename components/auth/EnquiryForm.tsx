"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  ChevronDown,
  ArrowLeft,
  LogIn,
  Star,
  BookOpen,
  Users,
  Award,
  GraduationCap,
} from "lucide-react";
import {
  type EnquiryFormData,
  ApplicationUserRole,
  ProductInterest,
} from "@/types/form";
import { submitEnquiry } from "@/actions/enquiry";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { countries, getCountryByCode } from "@/lib/countries";

const enquirySchema = z.object({
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  workEmail: z.string().email("Please enter a valid email address"),
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  role: z.nativeEnum(ApplicationUserRole),
  schoolWebsite: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  numberOfStudents: z.number().min(1, "Number of students must be at least 1"),
  productInterests: z
    .array(z.nativeEnum(ProductInterest))
    .min(1, "Please select at least one product interest"),
  painPoints: z
    .string()
    .min(10, "Please describe your pain points (minimum 10 characters)"),
  hearAboutUs: z.string().optional(),
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must agree to the terms and conditions"
    ),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

const roleOptions = [
  { value: ApplicationUserRole.PRINCIPAL, label: "Principal" },
  {
    value: ApplicationUserRole.SCHOOL_ADMINISTRATOR,
    label: "School Administrator",
  },
  { value: ApplicationUserRole.IT_MANAGEMENT, label: "IT Management" },
  { value: ApplicationUserRole.TEACHER, label: "Teacher" },
  { value: ApplicationUserRole.PARENT, label: "Parent" },
  { value: ApplicationUserRole.STUDENT, label: "Student" },
  { value: ApplicationUserRole.CONSULTANT, label: "Consultant" },
  { value: ApplicationUserRole.RESELLER, label: "Reseller" },
  { value: ApplicationUserRole.OTHER, label: "Other" },
];

const productOptions = [
  { value: ProductInterest.ADMISSIONS, label: "Student Admissions" },
  { value: ProductInterest.ASSIGNMENTS, label: "Assignment Management" },
  { value: ProductInterest.ATTENDANCE, label: "Attendance Tracking" },
  { value: ProductInterest.BILLING, label: "Fee Management & Billing" },
  { value: ProductInterest.FUNDRAISING, label: "Fundraising Tools" },
  { value: ProductInterest.GRADEBOOK, label: "Digital Gradebook" },
  {
    value: ProductInterest.LEARNING_MANAGEMENT,
    label: "Learning Management System",
  },
  { value: ProductInterest.LESSON_PLANS, label: "Lesson Planning" },
  { value: ProductInterest.LUNCH_COUNT, label: "Meal Management" },
  { value: ProductInterest.MASTER_SCHEDULER, label: "Master Scheduler" },
  {
    value: ProductInterest.PARENT_PORTAL,
    label: "Parent Communication Portal",
  },
  { value: ProductInterest.SCHEDULER, label: "Class Scheduling" },
];

const hearAboutUsOptions = [
  "Google Search",
  "Social Media",
  "Referral from colleague",
  "Educational conference",
  "Email marketing",
  "Advertisement",
  "Other",
];

export default function EnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductInterest[]>([
    ProductInterest.ADMISSIONS,
  ]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      role: ApplicationUserRole.PRINCIPAL,
      numberOfStudents: 1,
      productInterests: [ProductInterest.ADMISSIONS],
      agreeToTerms: false,
    },
  });

  const watchedRole = watch("role");
  const watchedCountry = watch("country");
  const watchedAgreeToTerms = watch("agreeToTerms");
  const handleBack = () => router.back();
  const handleLogin = () => router.push("/auth/login");
  const onSubmit = async (data: EnquiryFormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);

    try {
      const formData: EnquiryFormData = {
        applicantName: data.applicantName,
        country: data.country,
        workEmail: data.workEmail,
        schoolName: data.schoolName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        schoolWebsite: data.schoolWebsite || null,
        numberOfStudents: data.numberOfStudents,
        productInterests: data.productInterests,
        painPoints: data.painPoints,
        hearAboutUs: data.hearAboutUs || null,
      };

      const result = await submitEnquiry(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductInterestChange = (
    product: ProductInterest,
    checked: boolean
  ) => {
    let newProducts: ProductInterest[];
    if (checked) {
      newProducts = [...selectedProducts, product];
    } else {
      newProducts = selectedProducts.filter((p) => p !== product);
    }
    setSelectedProducts(newProducts);
    setValue("productInterests", newProducts);
  };

  const selectedCountry = watchedCountry
    ? getCountryByCode(watchedCountry)
    : null;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Hero with Image and Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dirpuqqib/image/upload/v1751538852/wmremove-transformed_twdmsi.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/95 via-purple-600/30 via-40% to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-10 text-white">
          <div className="space-y-6 mb-8">
            <h1 className="text-3xl xl:text-3xl font-bold leading-tight">
              Transform Your School
              <br />
              Management Experience
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleBack}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-400 text-white hover:bg-purple-400 hover:text-white px-8 py-3 font-semibold bg-transparent shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                LOGIN
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form with ScrollArea */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col overflow-hidden">
        {/* Mobile Back/Login Buttons - Fixed at top */}
        <div className="md:hidden flex justify-between items-center p-4 border-b bg-white">
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-semibold rounded-lg"
                    onClick={handleBack}

          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 font-semibold rounded-lg bg-transparent"
                    onClick={handleLogin}

          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-4xl mx-auto p-1 md:px-8 md:py-2">
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
            <Card className="w-full shadow-none border-0 p-0">
              <CardContent className="p-6 lg:p-8">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="space-y-3 text-center lg:text-left">
                    <h2 className="text-base font-medium text-gray-700">
                      MuitSchool | Multi-School Administration System
                    </h2>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      Make an <span className="text-purple-500">Enquiry</span>
                    </h1>
                    <p className="text-gray-600 text-sm lg:text-sm">
                      Fill out the form to gain Access to the Full System For
                      Your School
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="applicantName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="applicantName"
                        placeholder="John Lewis"
                        {...register("applicantName")}
                        className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm"
                      />
                      {errors.applicantName && (
                        <p className="text-xs text-red-500">
                          {errors.applicantName.message}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="role"
                        className="text-sm font-medium text-gray-700"
                      >
                        Your Role <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("role", value as ApplicationUserRole)
                        }
                        defaultValue={ApplicationUserRole.PRINCIPAL}
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm">
                          <SelectValue
                            className="text-sm"
                            placeholder="Select your role in the school"
                          >
                            {watchedRole &&
                              roleOptions.find((r) => r.value === watchedRole)
                                ?.label}
                          </SelectValue>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-sm text-red-500">
                          {errors.role.message}
                        </p>
                      )}
                    </div>

                    {/* Product Interests - Multiple Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        System Features of Interest{" "}
                        <span className="text-red-400">*</span>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border border-gray-300 rounded-lg">
                        {productOptions.map((product) => (
                          <div
                            key={product.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={product.value}
                              checked={selectedProducts.includes(product.value)}
                              onCheckedChange={(checked) =>
                                handleProductInterestChange(
                                  product.value,
                                  checked as boolean
                                )
                              }
                              className="border-gray-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            <Label
                              htmlFor={product.value}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {product.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.productInterests && (
                        <p className="text-sm text-red-500">
                          {errors.productInterests.message}
                        </p>
                      )}
                    </div>

                    {/* Email and Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="workEmail"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="workEmail"
                          type="email"
                          placeholder="john@school.edu"
                          {...register("workEmail")}
                          className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm"
                        />
                        {errors.workEmail && (
                          <p className="text-xs text-red-500">
                            {errors.workEmail.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phoneNumber"
                          className="text-sm font-medium text-gray-700"
                        >
                          Mobile <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+1 234 567 8900"
                          {...register("phoneNumber")}
                          className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm "
                        />
                        {errors.phoneNumber && (
                          <p className="text-xs text-red-500">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* School Name and Number of Students */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="schoolName"
                          className="text-sm font-medium text-gray-700"
                        >
                          School Name <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="schoolName"
                          placeholder="Springfield Elementary"
                          {...register("schoolName")}
                          className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm"
                        />
                        {errors.schoolName && (
                          <p className="text-xs text-red-500">
                            {errors.schoolName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="numberOfStudents"
                          className="text-sm font-medium text-gray-700"
                        >
                          Number of Students{" "}
                          <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="numberOfStudents"
                          type="number"
                          min="1"
                          placeholder="500"
                          {...register("numberOfStudents", {
                            valueAsNumber: true,
                          })}
                          className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm"
                        />
                        {errors.numberOfStudents && (
                          <p className="text-xs text-red-500">
                            {errors.numberOfStudents.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-sm font-medium text-gray-700"
                      >
                        Country <span className="text-red-400">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setValue("country", value)}
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base placeholder:text-sm">
                          <SelectValue placeholder="Select Country">
                            {selectedCountry && (
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {selectedCountry.flag}
                                </span>
                                <span>{selectedCountry.name}</span>
                              </div>
                            )}
                          </SelectValue>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              <div className="flex items-center gap-2">
                                <img src={country.flag} alt="" className="object-cover w-6 h-5"/>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-xs text-red-500">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Pain Points */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="painPoints"
                        className="text-sm font-medium text-gray-700"
                      >
                        Current Challenges{" "}
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="painPoints"
                        placeholder="Describe your current school management challenges..."
                        {...register("painPoints")}
                        className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-base text-sm"
                      />
                      {errors.painPoints && (
                        <p className="text-xs text-red-500">
                          {errors.painPoints.message}
                        </p>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3 py-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={watchedAgreeToTerms}
                        onCheckedChange={(checked) =>
                          setValue("agreeToTerms", checked as boolean)
                        }
                        className="mt-1 border-gray-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                      >
                        By clicking submit you are agreeing to our terms and
                        conditions and privacy policy.
                      </Label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-xs text-red-500">
                        {errors.agreeToTerms.message}
                      </p>
                    )}

                    {/* reCAPTCHA placeholder */}
                    <div className="flex items-center justify-center lg:justify-start py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                        </div>
                        <span>I'm not a robot</span>
                        <div className="text-sm text-gray-400">reCAPTCHA</div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center lg:justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full lg:w-auto min-w-[200px] h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
