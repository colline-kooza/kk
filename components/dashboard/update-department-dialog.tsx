"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { User, Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import type { DepartmentData, MinTeachersDataProps } from "@/types/types";
import { toast } from "sonner";
import { useUpdateDepartment } from "@/hooks/useDepartmentQueries";
import { useMinTeachersData } from "@/hooks/useMinTeachersData";

interface UpdateDepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentData | null;
}

export function UpdateDepartmentDialog({
  isOpen,
  onClose,
  department,
}: UpdateDepartmentDialogProps) {
  const [departmentName, setDepartmentName] = useState("");
  const [hodValue, setHodValue] = useState<{ id: string; name: string } | null>(
    null
  );
  const { myTeachers } = useMinTeachersData();
  const [hodSelectOpen, setHodSelectOpen] = useState(false);

  // Always call the hook (Rules of Hooks), but use fallback ID if none exists
  const { isUpdating, updateDepartment } = useUpdateDepartment(
    department?.id || "temp-fallback-id"
  );

  // Reset form when dialog opens with new department data
  useEffect(() => {
    if (isOpen && department) {
      setDepartmentName(department.name || "");
      // If you have both hodId and hodName in your department data
      if (department.hodName) {
        setHodValue({
          id: department.hodId || "", // assuming you have hodId in department data
          name: department.hodName,
        });
      } else {
        setHodValue(null);
      }
    }
  }, [isOpen, department]);

  const handleClose = () => {
    onClose();
    // Reset form after a short delay to avoid visual glitch
    setTimeout(() => {
      setDepartmentName("");
      setHodValue(null);
      setHodSelectOpen(false);
    }, 150);
  };

  const handleHodSelect = (teacher: MinTeachersDataProps) => {
    setHodValue({
      id: teacher.id,
      name: teacher.name,
    });
    setHodSelectOpen(false);
  };

  const handleClearHod = () => {
    setHodValue(null);
  };

  const handleUpdate = async () => {
    // Early return if no department or no valid ID
    if (!department || !department.id) {
      toast.error("Invalid department selected");
      return;
    }

    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }

    const data = {
      name: departmentName,
      hodName: hodValue?.name || "",
      hodId: hodValue?.id || "", // Include the ID if your backend needs it
    };

    try {
      await updateDepartment(data);
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update department");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    }
  };

  // Don't render dialog if no department is provided
  if (!department) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogDescription>
            Update the department information. You can modify the name and
            assign a head of department.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="update-department-name">Department Name *</Label>
            <Input
              id="update-department-name"
              placeholder="Enter department name..."
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isUpdating}
              autoFocus
            />
          </div>
          <div className="grid mt-4 gap-2">
            <Label
              htmlFor="update-hod-name"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Head of Department
            </Label>
            <Popover open={hodSelectOpen} onOpenChange={setHodSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={hodSelectOpen}
                  className="justify-between hover:text-gray-500 text-gray-500 hover:bg-transparent hover:border-[#863ec0] hover:border-[1px]-solid  bg-transparent"
                  disabled={isUpdating}
                >
                  {hodValue?.name || "Select head of department..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search employees..." />
                  <CommandList>
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandGroup>
                      {hodValue && (
                        <CommandItem
                          onSelect={handleClearHod}
                          className="text-muted-foreground hover:text-gray-300"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              !hodValue ? "opacity-100" : "opacity-0"
                            )}
                          />
                          Clear selection
                        </CommandItem>
                      )}
                      {myTeachers &&
                        myTeachers.map((teacher) => (
                          <CommandItem
                            key={teacher.id}
                            onSelect={() => handleHodSelect(teacher)}
                            className="hover:text-gray-300"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                hodValue?.id === teacher.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {teacher.name}
                              </span>
                              <span className="text-sm  text-muted-foreground">
                                {teacher.name}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">
              Search and select from available employees, or leave empty if no
              head of department is assigned
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleUpdate}
            disabled={!departmentName.trim() || isUpdating || !department.id}
          >
            {isUpdating ? "Updating wait..." : "Update Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
