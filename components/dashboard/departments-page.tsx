"use client";

import type React from "react";

import { useState } from "react";
import { School, Edit } from "lucide-react";
import type { DataTableAction, DataTableColumn } from "@/types/data-table";
import { DataImage } from "../data-table/DataImage";
import { DataTable } from "../data-table/DataTable";
import { useSuspenseDepartments } from "@/hooks/useDepartmentQueries";
import type { DepartmentData } from "@/types/types";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UpdateDepartmentDialog } from "./update-department-dialog";

export default function DepartmentsPage({ userId }: { userId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    country: "",
  });

  // Initialize search query state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentData | null>(null);

  const {
    allDepartments,
    refetch,
    createDepartment,
    isCreating,
    totalPages,
    isLoading,
    searchQuery: hookSearchQuery,
    error,
  } = useSuspenseDepartments(userId, {
    page: currentPage,
    limit: 10,
    search: searchQuery,
  });

  // Define columns for school Departments
  const columns: DataTableColumn<DepartmentData>[] = [
    {
      id: "department",
      header: "Department",
      cell: (_, row) => (
        <div className="flex items-center gap-3 min-w-0">
          <DataImage className="w-12 h-12 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{row.name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <span className="truncate">{row.slug}</span>
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "hod",
      header: "Head Of Department",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {row.hodName ? row.hodName : "Not Assigned"}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Applied",
      cell: (_, row) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
  ];

  // Define actions
  const actions: DataTableAction<DepartmentData>[] = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        setSelectedDepartment(row);
        setIsUpdateDialogOpen(true);
      },
    },
    // {
    //   label: "Delete",
    //   icon: <Trash2 className="h-4 w-4" />,
    //   variant: "destructive",
    //   onClick: (row) => {
    //     console.log("Delete application:", row);
    //   },
    // },
  ];

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value === "all" ? "" : value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDepartmentName("");
  };

  const handleCreateDepartment = async () => {
    if (!departmentName.trim()) {
      toast.error("Department name is required");
      return;
    }
    try {
      await createDepartment({
        name: departmentName.trim(),
      });

      handleDialogClose();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDialogClose = () => {
    setIsUpdateDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateDepartment();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-full">
        <DataTable
          title="School Departments"
          subtitle="Manage and review school departments with advanced filtering and bulk actions."
          columns={columns}
          data={allDepartments}
          actions={actions}
          searchPlaceholder="Search by Department name..."
          showAddButton={true}
          addButtonLabel="Add Department"
          onAddClick={handleAddClick}
          showViewToggle={true}
          isLoading={isLoading}
          error={error as string}
          onRefresh={refetch}
          pageSize={10}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          enableSelection={true}
          showActions={true}
          // Custom filter handling
          filterState={filters}
          onFilterChange={handleFilterChange}
          // Custom search handling
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Add Department Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="department-name">Department Name</Label>
                <Input
                  id="department-name"
                  placeholder="Enter department name..."
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isCreating}
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateDepartment}
                disabled={isCreating || !departmentName.trim()}
              >
                {isCreating ? "Creating..." : "Create Department"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Department Dialog */}
        <UpdateDepartmentDialog
          isOpen={isUpdateDialogOpen}
          onClose={handleUpdateDialogClose}
          department={selectedDepartment}
          // onUpdate={handleUpdateDepartment}
        />
      </div>
    </div>
  );
}
