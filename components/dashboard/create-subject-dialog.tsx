"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateSubjectData, SubjectData } from "@/types/subjects-data";
import type { MinDepartmentData } from "@/types/types";
import { useUpdateSubject } from "@/hooks/use-subjects";

type createDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  createSubject: any;
  departments: MinDepartmentData[];
  isCreating: boolean;
  mode: "create" | "update";
  existingSubject?: SubjectData | null;
};

export default function CreateSubjectDialog({
  isOpen,
  onClose,
  createSubject,
  departments,
  isCreating,
  mode,
  existingSubject,
}: createDialogProps) {
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const isUpdateMode = mode === "update";

  const { updateSubject, isUpdating } = useUpdateSubject(
    existingSubject?.id ?? ""
  );

  const isProcessing = isCreating || isUpdating;

  const handleClose = () => {
    onClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateSubjectData>({
    defaultValues: {
      name: "",
      code: "",
      shortName: "",
      type: "THEORY",
      departmentId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isUpdateMode && existingSubject) {
        // Populate form with existing subject data
        setValue("name", existingSubject.name);
        setValue("code", existingSubject.code);
        setValue("shortName", existingSubject.shortName || "");
        setValue("type", existingSubject.type);
        setValue("departmentId", existingSubject.departmentId || "");
      } else {
        // Reset form for create mode
        reset({
          name: "",
          code: "",
          shortName: "",
          type: "THEORY",
          departmentId: "",
        });
      }
    }
  }, [isOpen, isUpdateMode, existingSubject, setValue, reset]);

  const watchedType = watch("type");
  const watchedDepartmentId = watch("departmentId");

  const selectedDepartment = departments.find(
    (dept) => dept.id === watchedDepartmentId
  );

  // const onSubmit = async (data: CreateSubjectData) => {
  //   try {
  //     await createSubject(data);
  //     handleClose();
  //     reset();
  //   } catch (error) {
  //     console.error("Error creating subject:", error);
  //   }
  // };

  const onSubmit = async (data: CreateSubjectData) => {
    try {
      if (isUpdateMode && existingSubject) {
        await updateSubject(data);
        console.log("updated.");
      } else {
        await createSubject(data);
      }
      handleClose();
    } catch (error) {
      console.error(
        `Error ${existingSubject ? "updating" : "creating"} subject:`,
        error
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Subject
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingSubject ? "Update Subject" : "Create New Subject"}
          </DialogTitle>
          <DialogDescription>
            {existingSubject
              ? "Update a subject in the system. Fill in all the required information below"
              : "Add a new subject to the system. Fill in all the required information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Subject Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Data Structures and Algorithms"
                {...register("name", {
                  required: "Subject name is required",
                  minLength: {
                    value: 2,
                    message: "Subject name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Subject name must not exceed 100 characters",
                  },
                })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Subject Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CS301"
                {...register("code", {
                  required: "Subject code is required",
                  pattern: {
                    value: /^[A-Z]{2,4}[0-9]{2,4}$/,
                    message:
                      "Code must be in format like CS301 (2-4 letters followed by 2-4 numbers)",
                  },
                })}
                className={errors.code ? "border-red-500" : ""}
                style={{ textTransform: "uppercase" }}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            {/* Short Name */}
            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input
                id="shortName"
                placeholder="e.g., DSA"
                {...register("shortName", {
                  minLength: {
                    value: 2,
                    message: "Short name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Short name must not exceed 20 characters",
                  },
                })}
                className={errors.shortName ? "border-red-500" : ""}
              />
              {errors.shortName && (
                <p className="text-sm text-red-500">
                  {errors.shortName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Subject Type */}
              <div className="space-y-2 w-full">
                <Label htmlFor="type">Subject Type *</Label>
                <Select
                  value={watchedType}
                  onValueChange={(value: "THEORY" | "PRACTICAL" | "BOTH") =>
                    setValue("type", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    className={errors.type ? "border-red-500 w-full" : "w-full"}
                  >
                    <SelectValue placeholder="Select subject type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THEORY">Theory</SelectItem>
                    <SelectItem value="PRACTICAL">Practical</SelectItem>
                    <SelectItem value="BOTH">
                      Both Theory & Practical
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              {/* Department with Search */}
              <div className="space-y-2 w-full">
                <Label htmlFor="departmentId">Department *</Label>
                <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={departmentOpen}
                      className={cn(
                        "w-full justify-between",
                        errors.departmentId && "border-red-500",
                        !watchedDepartmentId && "text-muted-foreground"
                      )}
                    >
                      {selectedDepartment
                        ? selectedDepartment.name
                        : "Select department..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search departments..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No department found.</CommandEmpty>
                        <CommandGroup>
                          {departments.map((dept) => (
                            <CommandItem
                              key={dept.id}
                              value={dept.name}
                              onSelect={() => {
                                setValue("departmentId", dept.id, {
                                  shouldValidate: true,
                                });
                                setDepartmentOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watchedDepartmentId === dept.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {dept.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.departmentId && (
                  <p className="text-sm text-red-500">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose()}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing
                ? `${isUpdateMode ? "Updating" : "Creating"}...`
                : `${isUpdateMode ? "Update" : "Create"} Subject`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
