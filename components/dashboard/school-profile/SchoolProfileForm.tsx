"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  GraduationCap,
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Quote,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import useSchoolStore from "@/store/school";
import { createSchool } from "@/actions/school";
import { useRouter } from "next/navigation";

// School validation schema (matching your provided schema)
const SchoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  logo: z.string().optional(),
  primaryEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  primaryPhone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .url("Website must be a valid URL")
    .optional()
    .or(z.literal("")),
  establishedYear: z
    .number()
    .int()
    .min(1800, "Year must be 1800 or later")
    .max(
      new Date().getFullYear(),
      `Year cannot be later than ${new Date().getFullYear()}`
    )
    .nullable()
    .optional(),
  slogan: z.string().optional(),
  description: z.string().optional(),
});

export type SchoolFormData = z.infer<typeof SchoolSchema>;

// Server action for creating school

export default function SchoolProfileForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(SchoolSchema),
    defaultValues: {
      name: "",
      logo: "",
      primaryEmail: "",
      primaryPhone: "",
      address: "",
      website: "",
      establishedYear: undefined,
      slogan: "",
      description: "",
    },
  });
  const router = useRouter();
  const { setSchool } = useSchoolStore();
  const onSubmit: SubmitHandler<SchoolFormData> = async (
    data: SchoolFormData
  ) => {
    setIsSubmitting(true);

    try {
      const createdSchool = await createSchool(data);
      setSchool(createdSchool);
      console.log("School created successfully:", createdSchool);

      toast.success("Success!", {
        description: "School profile created successfully.",
      });

      setOpen(false);
      form.reset();

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create school:", error);

      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to create school profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = (): void => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full">
          <Plus className="h-4 w-4 mr-2" />
          Setup School Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <GraduationCap className="h-5 w-5" />
                Create School Profile
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                Fill in the details below to create your school profile
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* School Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        School Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter school name..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Logo URL */}
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Logo URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Primary Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@school.edu"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Primary Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter school address..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website and Established Year */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.school.edu"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="establishedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Established Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1800"
                            max={new Date().getFullYear()}
                            placeholder="2000"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Slogan */}
                <FormField
                  control={form.control}
                  name="slogan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Quote className="h-4 w-4" />
                        School Slogan
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter school slogan or motto..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your school..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value?.length || 0} characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create School Profile"
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
