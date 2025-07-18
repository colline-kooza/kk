"use client"

import { useState } from "react"
import { Trash2, Eye, School, Phone } from "lucide-react"
import type { DataTableAction, DataTableColumn, DataTableFilter } from "@/types/data-table"
import type { SchoolApplication } from "@/types/school-applications"
import { useSchoolApplications } from "@/hooks/use-school-applications"
import { StatusBadge } from "./StatusBadge"
import { DataTable } from "./DataTable"
import { DataImage } from "./DataImage"
import { useRouter } from "next/navigation"

export default function SchoolApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const router= useRouter()
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    country: "",
  })

  const [searchQuery, setSearchQuery] = useState("")

  // Fetch data with current filters and pagination
  const { applications, pagination, stats, isLoading, error, refetch } = useSchoolApplications({
    page: currentPage,
    limit: 10,
    ...filters,
    search: searchQuery,
  })

  // Define columns for school applications
  const columns: DataTableColumn<SchoolApplication>[] = [
    {
      id: "applicant",
      header: "Applicant",
      cell: (_, row) => (
        <div className="flex items-center gap-3 min-w-0">
          <DataImage className="w-12 h-12 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{row.applicantName}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{row.phoneNumber}</span>
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "school",
      header: "School",
      cell: (_, row) => (
        <div className="flex items-center gap-2 min-w-0">
          <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">{row.schoolName}</div>
            <div className="text-sm text-gray-500 truncate">{row.numberOfStudents.toLocaleString()} students</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: (value) => (
        <span className="capitalize text-gray-700 font-medium whitespace-nowrap">
          {value.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
      sortable: true,
    },
    {
      id: "country",
      header: "Country",
      accessorKey: "country",
      cell: (value) => <span className="font-medium text-gray-800 whitespace-nowrap">{value}</span>,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (_, row) => <StatusBadge status={row.status} variant={row.status} />,
      sortable: true,
    },
    {
      id: "createdAt",
      header: "Applied",
      cell: (_, row) => (
        <span className="text-sm text-gray-600 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
      sortable: true,
    },
  ]

  // Define filters based on stats
  const tableFilters: DataTableFilter[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { label: `Pending (${stats.pending})`, value: "PENDING", count: stats.pending },
        { label: `Approved (${stats.approved})`, value: "APPROVED", count: stats.approved },
        { label: `Rejected (${stats.rejected})`, value: "REJECTED", count: stats.rejected },
      ],
    },
    {
      id: "role",
      label: "Role",
      options: Object.entries(stats.byRole).map(([role, count]) => ({
        label: `${role.replace(/_/g, " ")} (${count})`,
        value: role,
        count,
      })),
    },
    {
      id: "country",
      label: "Country",
      options: Object.entries(stats.byCountry).map(([country, count]) => ({
        label: `${country} (${count})`,
        value: country,
        count,
      })),
    },
  ]

  // Define actions
  const actions: DataTableAction<SchoolApplication>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => {
       router.push(`/dashboard/super-admin/school-applications/${row.id}`)
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: (row) => {
        console.log("Delete application:", row)
      },
    },
  ]

  const handleFilterChange = (filterId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value === "all" ? "" : value,
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    setCurrentPage(1) // Reset to first page when searching
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-full">
        <DataTable
          title="School Applications"
          subtitle="Manage and review school applications with advanced filtering and bulk actions."
          columns={columns}
          data={applications}
          filters={tableFilters}
          actions={actions}
          searchPlaceholder="Search by applicant name..."
          showAddButton={true}
          addButtonLabel="Add School"
          onAddClick={() => console.log("Add application clicked")}
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
          // Custom filter handling
          filterState={filters}
          onFilterChange={handleFilterChange}
          // Custom search handling
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  )
}
