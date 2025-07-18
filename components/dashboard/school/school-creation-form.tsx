"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Building,
  Globe,
  UserPlus,
  ArrowLeft,
  Info,
  Contact,
  School,
  Save,
  MoveRight,
  ChevronLeft,
  Trash,
  Loader2,
  AlertCircle,
} from "lucide-react"
import InputField from "@/components/FormInputs/input"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"

import type { SchoolFormData } from "@/types/school"
import { useCheckSubdomain, useCreateSchool } from "@/hooks/useSchool"
import { toast } from "sonner"
import { rootDomain, sanitizeSubdomain } from "@/utils/utils"

// Form schema
const formSchema = z
  .object({
    // Step 1: School Information
    name: z.string().min(2, "School name must be at least 2 characters"),
    code: z.string().min(2, "School code must be at least 2 characters"),
    primaryEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    primaryPhone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
    slogan: z.string().optional(),
    description: z.string().optional(),
    // Step 2: Subdomain
    subdomain: z
      .string()
      .min(3, "Subdomain must be at least 3 characters")
      .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens allowed"),
    // Step 3: Admin Credentials
    adminName: z.string().min(2, "Admin name must be at least 2 characters"),
    adminEmail: z.string().email("Invalid email address"),
    adminPhone: z.string().min(10, "Phone number must be at least 10 characters"),
    adminPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const steps = [
  {
    id: 1,
    title: "School Basic Info",
    subtitle: "Basic Information",
    description: "Basic details about your school",
    icon: Building,
  },
  {
    id: 2,
    title: "Subdomain Setup",
    subtitle: "Subdomain Setup",
    description: "Choose your school's web address",
    icon: Globe,
  },
  {
    id: 3,
    title: "Create Admin Account",
    subtitle: "Admin Account",
    description: "Create administrator credentials",
    icon: UserPlus,
  },
]

// School Information Step Component
function SchoolInformationStep({ form }: { form: any }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary">Tell us about the school</h2>
        <p className="text-gray-600 text-sm">Please fill in all the details of your school</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        {/* Required Information */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2 text-purple-600" />
              Required Information
            </h3>
            <div className="space-y-6">
              <InputField
                label="School Name"
                required
                type="text"
                placeholder="e.g., Springfield High School"
                description="Enter the full name of your educational institution"
                error={form.formState.errors.name?.message}
                {...form.register("name")}
              />
              <InputField
                label="School Code"
                required
                type="text"
                placeholder="e.g., SHS001"
                description="Unique identifier for your school"
                error={form.formState.errors.code?.message}
                {...form.register("code")}
              />
            </div>
          </div>
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Contact className="w-5 h-5 mr-2 text-purple-600" />
              Contact Information
            </h3>
            <div className="space-y-6">
              <InputField
                label="Primary Email"
                type="email"
                placeholder="info@springfieldhs.edu"
                description="Main contact email for your school"
                error={form.formState.errors.primaryEmail?.message}
                {...form.register("primaryEmail")}
              />
              <InputField
                label="Primary Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                description="Main contact phone number"
                {...form.register("primaryPhone")}
              />
            </div>
          </div>
        </div>
        {/* Additional Information */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Info className="w-5 h-5 mr-2 text-purple-600" />
              Additional Information
            </h3>
            <div className="space-y-6">
              <InputField
                label="Address"
                type="textarea"
                placeholder="123 Education St, Springfield, ST 12345"
                description="Physical address of your school"
                rows={3}
                {...form.register("address")}
              />
              <InputField
                label="Website"
                type="url"
                placeholder="https://www.springfieldhs.edu"
                description="Your school's official website"
                error={form.formState.errors.website?.message}
                {...form.register("website")}
              />
              <InputField
                label="Established Year"
                type="number"
                placeholder="1985"
                description="Year your school was founded"
                {...form.register("establishedYear", { valueAsNumber: true })}
              />
              <InputField
                label="School Slogan"
                type="text"
                placeholder="Excellence in Education"
                description="Your school's motto or slogan"
                {...form.register("slogan")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fixed Subdomain Step Component
function SubdomainStep({ form }: { form: any }) {
  const subdomain = form.watch("subdomain")
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available?: boolean
    error?: string
    isChecking?: boolean
  }>({})

  const checkSubdomainMutation = useCheckSubdomain()

  // Fixed useEffect - removed checkSubdomain from dependencies to prevent infinite loop
  useEffect(() => {
    if (!subdomain || subdomain.length < 3) {
      setAvailabilityStatus({})
      return
    }

    const timeoutId = setTimeout(async () => {
      setAvailabilityStatus({ isChecking: true })

      try {
        const result = await checkSubdomainMutation.mutateAsync(subdomain)
        setAvailabilityStatus({
          available: result.available,
          error: result.error,
          isChecking: false,
        })
      } catch (error) {
        setAvailabilityStatus({
          available: false,
          error: "Failed to validate subdomain",
          isChecking: false,
        })
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [subdomain]) // Only depend on subdomain, not checkSubdomain

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary">Choose Your School's Web Address</h2>
        <p className="text-gray-600 text-sm">This will be your school's unique web address</p>
      </div>
      <div className="mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <InputField
                  label="subdomain"
                  type="text"
                  required
                  placeholder="yourschool"
                  className="rounded-r-none border-r-0"
                  {...form.register("subdomain")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = sanitizeSubdomain(e.target.value)
                    form.setValue("subdomain", value)
                  }}
                />
                <div className="h-10 bg-gray-50 border border-l-0 border-gray-200 px-4 rounded-r-lg text-sm text-gray-600 flex items-center mt-[2.5%]">
                  {/* .{rootDomain} */}
                </div>
                {availabilityStatus.isChecking && (
                  <div className="ml-2 mt-[2.5%]">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  </div>
                )}
              </div>
              {/* Availability Status */}
              {subdomain && subdomain.length >= 3 && !availabilityStatus.isChecking && (
                <div className="flex items-center space-x-2 mt-2">
                  {availabilityStatus.available === true && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Format is valid
                    </div>
                  )}
                  {availabilityStatus.available === false && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {availabilityStatus.error || "Invalid format"}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens are allowed. Minimum 3 characters.
              </p>
              {form.formState.errors.subdomain && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.subdomain.message}</p>
              )}
            </div>
            {/* Preview - FIXED: Added proper spacing with dot */}
            {subdomain && availabilityStatus.available && (
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-3">Preview</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-purple-700">School Domain Name:</span>
                    <code className="text-purple-800 font-mono bg-purple-100 px-2 py-1 rounded text-sm">
                     {subdomain}
                    </code>
                  </div>
                  <p className="text-sm text-purple-700">
                    Students, parents, and staff will access your school platform using this Domain.
                  </p>
                </div>
              </div>
            )}
            {/* Note about availability */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <Info className="w-4 h-4 inline mr-1" />
                Subdomain availability will be verified when you submit the form.
              </p>
            </div>
            {/* Tips */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Tips for choosing a good subdomain:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep it short and memorable</li>
                <li>• Use your school's name or abbreviation</li>
                <li>• Avoid special characters except hyphens</li>
                <li>• Make it easy to type and share</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Credentials Step Component
function AdminCredentialsStep({ form }: { form: any }) {
  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    form.setValue("adminPassword", password)
    form.setValue("confirmPassword", password)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Create Administrator Account</h2>
        <p className="text-gray-600 text-sm">Set up the main administrator account for your school</p>
      </div>
      <div className="mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admin Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-purple-600" />
                Administrator Information
              </h3>
              <div className="space-y-6">
                <InputField
                  label="Full Name"
                  required
                  type="text"
                  placeholder="John Doe"
                  description="Administrator's full name"
                  error={form.formState.errors.adminName?.message}
                  {...form.register("adminName")}
                />
                <InputField
                  label="Email Address"
                  required
                  type="email"
                  placeholder="admin@yourschool.edu"
                  description="This email will be used to log into the admin dashboard"
                  error={form.formState.errors.adminEmail?.message}
                  {...form.register("adminEmail")}
                />
                <InputField
                  label="Phone Number"
                  required
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  description="Administrator's contact phone number"
                  error={form.formState.errors.adminPhone?.message}
                  {...form.register("adminPhone")}
                />
              </div>
            </div>
            {/* Security Credentials */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-purple-600" />
                  Security Credentials
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generatePassword}
                  className="text-purple-600 bg-purple-50 hover:text-white"
                >
                  Auto Password
                </Button>
              </div>
              <div className="space-y-6">
                <InputField
                  label="Password"
                  required
                  type="password"
                  placeholder="Enter password"
                  description="Minimum 8 characters required"
                  error={form.formState.errors.adminPassword?.message}
                  showPasswordToggle
                  {...form.register("adminPassword")}
                />
                <InputField
                  label="Confirm Password"
                  required
                  type="password"
                  placeholder="Confirm password"
                  description="Re-enter your password to confirm"
                  error={form.formState.errors.confirmPassword?.message}
                  showPasswordToggle
                  {...form.register("confirmPassword")}
                />
              </div>
              {/* Admin Privileges Info */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-3">Administrator Privileges</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Full access to school management dashboard</li>
                  <li>• Ability to manage students, teachers, and staff</li>
                  <li>• Control over school settings and configurations</li>
                  <li>• Access to reports and analytics</li>
                  <li>• User management and role assignments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SchoolCreationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const router = useRouter()
  const { user } = useAuthStore()

  // Use the school creation hook
  const createSchoolMutation = useCreateSchool()

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      primaryEmail: "",
      primaryPhone: "",
      address: "",
      website: "",
      establishedYear: undefined,
      slogan: "",
      description: "",
      subdomain: "",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
      confirmPassword: "",
    },
  })

  // Check if user has permission to create schools
  useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN") {
      toast.error("You don't have permission to create schools.")
      router.push("/dashboard")
    }
  }, [user, router])

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      // Additional validation for subdomain step
      if (currentStep === 2) {
        const subdomain = form.getValues("subdomain")
        // You can add additional subdomain validation here if needed
      }

      setCompletedSteps((prev) => [...prev, currentStep])
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof SchoolFormData)[] => {
    switch (step) {
      case 1:
        return ["name", "code"]
      case 2:
        return ["subdomain"]
      case 3:
        return ["adminName", "adminEmail", "adminPhone", "adminPassword", "confirmPassword"]
      default:
        return []
    }
  }

  const onSubmit = async (data: SchoolFormData) => {
    try {
      const result = await createSchoolMutation.mutateAsync(data)
      toast.success(result.message)

      // Redirect to success page or dashboard
      router.push("/dashboard/super-admin")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create school"
      toast.error(errorMessage)
    }
  }

  const handleCancel = () => {
    form.reset()
    setCurrentStep(1)
    setCompletedSteps([])
  }

  const handleBack = () => {
    router.back()
  }

  const isSubmitting = createSchoolMutation.isPending

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif]">
      <div className="max-w-6xl mx-auto px-4 pb-5">
        {/* Header */}
        <div className="mb-6">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create a New School</h1>
                <p className="text-sm text-gray-600 font-medium">Set up your educational institution</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 data-[state=open]:from-purple-700 data-[state=open]:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs py-4"
                onClick={handleBack}
              >
                <ChevronLeft />
                Back
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 data-[state=open]:from-purple-700 data-[state=open]:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs py-4"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "Creating..." : "Save School"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent text-black border-[1px] border-gray-200 hover:from-purple-700 hover:to-purple-800 data-[state=open]:from-purple-700 data-[state=open]:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs py-4"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <Trash />
                Clear
              </Button>
            </div>
          </div>
          {/* Compact Progress Steps */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id)
                const isCurrent = currentStep === step.id
                const isNext = index < steps.length - 1
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? "bg-purple-600 text-white"
                            : isCurrent
                              ? "bg-purple-100 text-purple-600 border-2 border-purple-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="hidden sm:block">
                        <p className={`text-sm font-medium ${isCurrent ? "text-purple-600" : "text-gray-600"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400">{step.subtitle}</p>
                      </div>
                    </div>
                    {isNext && (
                      <div className="flex-1 mx-4">
                        <div
                          className={`h-0.5 w-full transition-all duration-300 ${
                            isCompleted ? "bg-purple-600" : "bg-gray-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <SchoolInformationStep form={form} />}
                {currentStep === 2 && <SubdomainStep form={form} />}
                {currentStep === 3 && <AdminCredentialsStep form={form} />}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 px-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center space-x-2 border-gray-200 hover:bg-gray-50 disabled:opacity-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <div className="flex items-center space-x-3">
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 data-[state=open]:from-purple-700 data-[state=open]:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs py-4"
              >
                Next
                <MoveRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 data-[state=open]:from-purple-700 data-[state=open]:to-purple-800 shadow-xs shadow-purple-200 font-inter font-medium rounded-sm text-xs py-4"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "Creating School..." : "Create School"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}