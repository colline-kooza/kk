import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Settings,
  Library,
  Bus,
  Building,
  UserCheck,
  Trophy,
  Bell,
  BarChart3,
  type LucideIcon,
  School,
  Book,
} from "lucide-react";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  RECEPTIONIST = "RECEPTIONIST",
  ACCOUNTANT = "ACCOUNTANT",
  LIBRARIAN = "LIBRARIAN",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string | number;
  roles: UserRole[];
  items?: {
    title: string;
    url: string;
    roles: UserRole[];
    badge?: string | number;
  }[];
}

export const navigationConfig: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: [
      // UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.RECEPTIONIST,
      UserRole.ACCOUNTANT,
      UserRole.LIBRARIAN,
      UserRole.STUDENT,
      UserRole.PARENT,
    ],
  },
  {
    title: "Dashboard",
    url: "/dashboard/super-admin",
    icon: Home,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    title: "Entries",
    url: "/dashboard/super-admin/school-applications",
    icon: School,
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    title: "Schools",
    url: "#",
    icon: Users,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.RECEPTIONIST,
    ],
    items: [
      {
        title: "All Schools",
        url: "/dashboard/schools",
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        title: "School Details",
        url: "/dashboard/#",
        roles: [
          UserRole.SUPER_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.ADMIN,
          UserRole.TEACHER,
          UserRole.RECEPTIONIST,
        ],
      },
    ],
  },
  {
    title: "Students",
    url: "#",
    icon: Users,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.RECEPTIONIST,
    ],
    items: [
      {
        title: "All Students",
        url: "/dashboard/students",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPTIONIST],
      },
      {
        title: "Enrollment",
        url: "/dashboard/students/enrollment",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPTIONIST],
      },
      {
        title: "Attendance",
        url: "/dashboard/students/attendance",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Grades",
        url: "/dashboard/students/grades",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Behavior Records",
        url: "/dashboard/students/behavior",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
    ],
  },
  {
    title: "Teachers",
    url: "#",
    icon: GraduationCap,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    items: [
      {
        title: "All Teachers",
        url: "/dashboard/teachers",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Schedules",
        url: "/dashboard/teachers/schedules",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Performance",
        url: "/dashboard/teachers/performance",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Payroll",
        url: "/dashboard/teachers/payroll",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
    ],
  },
  {
    title: "Classes",
    url: "#",
    icon: BookOpen,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
    items: [
      {
        title: "All Classes",
        url: "/dashboard/classes",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Timetable",
        url: "/dashboard/classes/timetable",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Curriculum",
        url: "/dashboard/classes/curriculum",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Assignments",
        url: "/dashboard/classes/assignments",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
    ],
  },
  {
    title: "Library",
    url: "#",
    icon: Library,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.LIBRARIAN,
      UserRole.TEACHER,
      UserRole.STUDENT,
    ],
    items: [
      {
        title: "Books",
        url: "/dashboard/library/books",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN],
      },
      {
        title: "Issue/Return",
        url: "/dashboard/library/transactions",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN],
      },
      {
        title: "My Books",
        url: "/dashboard/library/my-books",
        roles: [UserRole.STUDENT, UserRole.TEACHER],
      },
      {
        title: "Overdue",
        url: "/dashboard/library/overdue",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.LIBRARIAN],
        badge: "5",
      },
    ],
  },
  {
    title: "Finance",
    url: "#",
    icon: DollarSign,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT],
    items: [
      {
        title: "Fee Management",
        url: "/dashboard/finance/fees",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT],
      },
      {
        title: "Payments",
        url: "/dashboard/finance/payments",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT],
      },
      {
        title: "Expenses",
        url: "/dashboard/finance/expenses",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT],
      },
      {
        title: "Reports",
        url: "/dashboard/finance/reports",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT],
      },
    ],
  },
  {
    title: "Exams",
    url: "#",
    icon: Trophy,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.STUDENT,
      UserRole.PARENT,
    ],
    items: [
      {
        title: "Exam Schedule",
        url: "/dashboard/exams/schedule",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Results",
        url: "/dashboard/exams/results",
        roles: [
          UserRole.SUPER_ADMIN,
          UserRole.ADMIN,
          UserRole.TEACHER,
          UserRole.STUDENT,
          UserRole.PARENT,
        ],
      },
      {
        title: "Grade Reports",
        url: "/dashboard/exams/reports",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
    ],
  },
  {
    title: "Attendance",
    url: "/dashboard/attendance",
    icon: UserCheck,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.STUDENT,
      UserRole.PARENT,
    ],
  },
  {
    title: "Transport",
    url: "#",
    icon: Bus,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPTIONIST],
    items: [
      {
        title: "Routes",
        url: "/dashboard/transport/routes",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Vehicles",
        url: "/dashboard/transport/vehicles",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Drivers",
        url: "/dashboard/transport/drivers",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
    ],
  },
  {
    title: "Hostel",
    url: "#",
    icon: Building,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    items: [
      {
        title: "Rooms",
        url: "/dashboard/hostel/rooms",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Allocations",
        url: "/dashboard/hostel/allocations",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Fees",
        url: "/dashboard/hostel/fees",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
    ],
  },
  {
    title: "Academics",
    url: "#",
    icon: Book,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    items: [
      {
        title: "Classes",
        url: "/dashboard/academics/classes",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Departments",
        url: "/dashboard/academics/departments",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "Subjects",
        url: "/dashboard/academics/subjects",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
    ],
  },
  {
    title: "Notices",
    url: "/dashboard/notices",
    icon: Bell,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.STUDENT,
      UserRole.PARENT,
    ],
    badge: "3",
  },
  {
    title: "Reports",
    url: "#",
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
    items: [
      {
        title: "Academic Reports",
        url: "/dashboard/reports/academic",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Attendance Reports",
        url: "/dashboard/reports/attendance",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
      },
      {
        title: "Financial Reports",
        url: "/dashboard/reports/financial",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    items: [
      {
        title: "School Settings",
        url: "/dashboard/settings/school",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "User Management",
        url: "/dashboard/settings/users",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        title: "System Settings",
        url: "/dashboard/settings/system",
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        title: "Backup & Restore",
        url: "/dashboard/settings/backup",
        roles: [UserRole.SUPER_ADMIN],
      },
    ],
  },
];

// Helper function to filter navigation items based on user role
export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) => subItem.roles.includes(role)),
    }));
}
