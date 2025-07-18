import { SchoolApplication } from "@/types/school-application-detailed";

export function getStatusColor(status: SchoolApplication["status"]) {
  switch (status) {
    case "APPROVED":
      return "text-green-600 bg-green-50 border-green-200";
    case "REJECTED":
      return "text-red-600 bg-red-50 border-red-200";
    case "PENDING":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getRoleDisplayName(role: SchoolApplication["role"]) {
  switch (role) {
    case "PRINCIPAL":
      return "Principal";
    case "TEACHER":
      return "Teacher";
    case "ADMIN":
      return "Administrator";
    case "OTHER":
      return "Other";
    default:
      return role;
  }
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCountryFlag(country: string) {
  // Simple country to flag emoji mapping
  const countryFlags: Record<string, string> = {
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Germany: "🇩🇪",
    France: "🇫🇷",
    Japan: "🇯🇵",
    China: "🇨🇳",
    India: "🇮🇳",
    Brazil: "🇧🇷",
    Nigeria: "🇳🇬",
    Kenya: "🇰🇪",
    "South Africa": "🇿🇦",
  };

  return countryFlags[country] || "🌍";
}
