"use client";

import type React from "react";

import { useState } from "react";
import { School, Edit } from "lucide-react";
import type { DataTableAction, DataTableColumn } from "@/types/data-table";
import { DataImage } from "../data-table/DataImage";
import { DataTable } from "../data-table/DataTable";
import type { DepartmentData } from "@/types/types";
import { toast } from "sonner";
import { useSubjects } from "@/hooks/use-subjects";
import { SubjectData } from "@/types/subjects-data";
import CreateSubjectDialog from "./create-subject-dialog";
import { useSuspenseDepartments } from "@/hooks/useDepartmentQueries";

export default function SubjectsPage({ userId }: { userId: string }) {
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
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(
    null
  );
  const { allMinDepartments } = useSuspenseDepartments(userId);
  const {
    allSubjects,
    refetch,
    totalPages,
    isLoading,
    createSubject,
    isCreating,
    searchQuery: hookSearchQuery,
    error,
  } = useSubjects({
    page: currentPage,
    limit: 10,
    search: searchQuery,
  });

  // Define columns for school Departments
  const columns: DataTableColumn<SubjectData>[] = [
    {
      id: "subject",
      header: "Subject",
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
      id: "shortName",
      header: "Short Name",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {row.shortName ? row.shortName : "Not Assigned"}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "type",
      header: "Subject type",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {row.type ? row.type : "Not Assigned"}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "code",
      header: "Subject Code",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {row.code ? row.code : "Not Assigned"}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Created",
      cell: (_, row) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
      sortable: true,
    },
  ];

  //   // Define actions
  const actions: DataTableAction<SubjectData>[] = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => {
        setSelectedSubject(row);
        setDialogMode("update");
        setIsDialogOpen(true);
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
    setSelectedSubject(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-full">
        <DataTable
          title="School Subjects"
          subtitle="Manage and review school subjects with advanced filtering and bulk actions."
          columns={columns}
          data={allSubjects}
          actions={actions}
          searchPlaceholder="Search by Subject name..."
          showAddButton={true}
          addButtonLabel="Add Subject"
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
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
        </Dialog> */}

        {/* Update Department Dialog */}
        <CreateSubjectDialog
          isCreating={isCreating}
          departments={allMinDepartments}
          createSubject={createSubject}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          mode={dialogMode}
          existingSubject={selectedSubject}
        />
      </div>
    </div>
  );
}
