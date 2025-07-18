// utils/utils.ts - PRODUCTION READY VERSION
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get the correct root domain based on environment
export const getRootDomain = () => {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    return process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kk-five-pi.vercel.app";
  }
  return "localhost:3000";
};

export const rootDomain = getRootDomain();

export function extractSubdomainFromHost(host: string): string | null {
  if (!host) return null;

  // Remove port from host
  const hostname = host.split(":")[0];

  console.log("Extracting subdomain from:", hostname);

  // Check for localhost environment
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  const isProduction = process.env.NODE_ENV === "production";

  if (isLocalhost && !isProduction) {
    // Handle localhost subdomains (e.g., main-high-school.localhost)
    if (hostname.includes(".localhost")) {
      const subdomain = hostname.split(".")[0];
      console.log(`Extracted localhost subdomain: ${subdomain}`);
      return subdomain;
    }
    return null;
  }

  // Production environment
  const currentRootDomain = getRootDomain().split(":")[0];

  // Handle Vercel preview deployments (tenant---branch.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    const subdomain = parts.length > 0 ? parts[0] : null;
    console.log(`Extracted Vercel preview subdomain: ${subdomain}`);
    return subdomain;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== currentRootDomain &&
    hostname !== `www.${currentRootDomain}` &&
    hostname.endsWith(`.${currentRootDomain}`);

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${currentRootDomain}`, "");
    console.log(`Extracted regular subdomain: ${subdomain}`);
    return subdomain;
  }

  console.log("No subdomain found");
  return null;
}

export function buildSubdomainUrl(
  subdomain: string,
  pathname: string = "/",
  search: string = ""
): string {
  const isProduction = process.env.NODE_ENV === "production";
  const sanitizedSubdomain = subdomain.toLowerCase();

  // Ensure pathname starts with /
  const cleanPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  // Ensure search starts with ? if it exists
  const cleanSearch = search && !search.startsWith("?") ? `?${search}` : search;

  if (isProduction) {
    // In production, for now use query parameter approach
    // This is a fallback until proper subdomain DNS is configured
    const domain = getRootDomain();
    const protocol = domain.includes("localhost") ? "http" : "https";
    const url = `${protocol}://${domain}${cleanPathname}${cleanSearch}${
      cleanSearch ? "&" : "?"
    }school=${sanitizedSubdomain}`;
    console.log(`Built production URL with query param: ${url}`);
    return url;
  } else {
    // Development environment - use subdomain approach
    const url = `http://${sanitizedSubdomain}.localhost:3000${cleanPathname}${cleanSearch}`;
    console.log(`Built development subdomain URL: ${url}`);
    return url;
  }
}

export function isValidSubdomain(subdomain: string): boolean {
  const validPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return (
    validPattern.test(subdomain.toLowerCase()) &&
    subdomain.length >= 2 &&
    subdomain.length <= 63
  );
}

export function sanitizeSubdomain(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

// Updated redirect functions
export function handleUserRedirect(user: any, school: any, router: any) {
  const isProduction = process.env.NODE_ENV === "production";

  if (user.role === "SUPER_ADMIN") {
    router.push("/dashboard/super-admin");
  } else if (school?.subdomain) {
    if (isProduction) {
      // In production, navigate with query parameter
      router.push(`/dashboard?school=${school.subdomain}`);
    } else {
      // Development - use subdomain approach
      const subdomainUrl = buildSubdomainUrl(school.subdomain, "/dashboard");
      console.log("Redirecting to:", subdomainUrl);

      // Use window.location.href for cross-subdomain navigation
      window.location.href = subdomainUrl;
    }
  } else {
    router.push("/dashboard");
  }
}

export function redirectToSubdomain(
  subdomain: string,
  pathname: string = "/dashboard"
) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // In production, use query parameter approach
    const url = `${pathname}?school=${subdomain}`;
    console.log("Redirecting to school via query param:", url);
    window.location.href = url;
  } else {
    // Development - use subdomain approach
    const url = buildSubdomainUrl(subdomain, pathname);
    console.log("Redirecting to subdomain:", url);

    if (window.location.href !== url) {
      window.location.href = url;
    }
  }
}
