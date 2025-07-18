"use client";

import { useState } from "react";
import { Trash2, Eye, Phone, MapPin, Globe, Calendar, Users } from "lucide-react";
import type { DataTableAction, DataTableColumn, DataTableFilter } from "@/types/data-table";

import { useRouter } from "next/navigation";
import { useSchools } from "@/hooks/use-all-schools";
import type { School } from "@/types/schools";
import { DataImage } from "@/components/data-table/DataImage";
import { StatusBadge } from "@/components/data-table/StatusBadge";
import { DataTable } from "@/components/data-table/DataTable";

export default function SchoolsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [filters, setFilters] = useState({
    status: "",
    establishedYear: "",
    hasAdmin: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  // Fetch data with current filters and pagination
  const { schools, pagination, stats, isLoading, error, refetch } = useSchools({
    page: currentPage,
    limit: 10,
    ...filters,
    search: searchQuery,
  });

  // Define columns for schools with better responsive design
  const columns: DataTableColumn<School>[] = [
    {
      id: "name",
      header: "School Name",
      cell: (_, row) => (
        <div className="flex items-center gap-3 min-w-0 max-w-[280px]">
          <DataImage 
            src={row.logo ?? "/images/logo.png"} 
            className="w-10 h-10 flex-shrink-0 rounded-lg object-cover" 
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate text-sm leading-tight">
              {row.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {row.code}
            </div>
            {row.slogan && (
              <div className="text-xs text-gray-400 truncate mt-0.5 line-clamp-1">
                {row.slogan}
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "contact",
      header: "Contact",
      cell: (_, row) => (
        <div className="flex flex-col gap-1 min-w-0 max-w-[200px]">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.primaryPhone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.primaryEmail || "N/A"}</span>
          </div>
          {row.website && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Globe className="h-3 w-3 flex-shrink-0" />
              <a 
                href={row.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="truncate hover:underline"
              >
                {row.website.replace(/(https?:\/\/)?(www\.)?/, "")}
              </a>
            </div>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      id: "location",
      header: "Location",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0 max-w-[180px]">
          <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 truncate text-sm">
            {row.address || "N/A"}
          </span>
        </div>
      ),
      sortable: false,
    },
    {
      id: "students",
      header: "Students",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <Users className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm font-medium">
            {row.studentCount || 0}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      id: "establishedYear",
      header: "Est. Year",
      accessorKey: "establishedYear",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm font-medium">
            {value || "N/A"}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      id: "admin",
      header: "Admin",
      cell: (_, row) => (
        <StatusBadge 
          status={row.adminId ? "Assigned" : "Unassigned"} 
          variant={row.adminId ? "APPROVED" : "PENDING"} 
        />
      ),
      sortable: false,
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => (
        <StatusBadge 
          status={row.isActive ? "Active" : "Inactive"} 
          variant={row.isActive ? "APPROVED" : "REJECTED"} 
        />
      ),
      sortable: true,
    },
  ];

  // Define filters based on stats with better labels
  // Fixed filter options in SchoolsPage.tsx
const tableFilters: DataTableFilter[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { label: "All Status", value: "all", count: stats.total },
      { label: `Active (${stats.active})`, value: "true", count: stats.active },
      { label: `Inactive (${stats.inactive})`, value: "false", count: stats.inactive },
    ],
  },
  {
    id: "establishedYear",
    label: "Established Year",
    options: [
      { label: "All Years", value: "all", count: stats.total },
      ...Object.entries(stats.byEstablishedYear)
        .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort by year descending
        .map(([year, count]) => ({
          label: `${year} (${count})`,
          value: year.toString(), // Ensure it's a string for consistency
          count,
        })),
    ],
  },
  {
    id: "hasAdmin",
    label: "Admin Assignment",
    options: [
      { label: "All Schools", value: "all", count: stats.total },
      { label: `Assigned (${stats.withAdmin})`, value: "true", count: stats.withAdmin },
      { label: `Unassigned (${stats.withoutAdmin})`, value: "false", count: stats.withoutAdmin },
    ],
  },
];

  // Define actions
  const actions: DataTableAction<School>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
        router.push(`/dashboard/schools/${row.id}`);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: (row) => {
        // TODO: Implement delete confirmation dialog
        console.log("Delete school:", row);
      },
    },
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

  const handleAddSchool = () => {
    router.push("/dashboard/super-admin/schools/new");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            title="All Schools"
            subtitle="Manage and review schools with advanced filtering and bulk actions."
            columns={columns}
            data={schools}
            filters={tableFilters}
            actions={actions}
            searchPlaceholder="Search by school name, code, or location..."
            showAddButton={false}
            addButtonLabel="Add New School"
            onAddClick={handleAddSchool}
            showViewToggle={true}
            isLoading={isLoading}
            error={error}
            onRefresh={refetch}
            pageSize={10}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            enableSelection={true}
            showActions={true}
            maxVisibleColumns={6}
            filterState={filters}
            onFilterChange={handleFilterChange}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
}