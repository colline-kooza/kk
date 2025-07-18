// utils/utils.ts - FIXED VERSION
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export function extractSubdomainFromHost(host: string): string | null {
  if (!host) return null;
  // Remove port from host
  const hostname = host.split(":")[0];

  // Check for localhost environment
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isLocalhost) {
    // Handle localhost subdomains (e.g., main-high-school.localhost)
    if (hostname.includes(".localhost")) {
      const subdomain = hostname.split(".")[0];
      console.log(`Extracted localhost subdomain: ${subdomain}`);
      return subdomain;
    }
    return null;
  }

  // Production environment
  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN?.split(":")[0] || "localhost";

  // Handle Vercel preview deployments (tenant---branch.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    const subdomain = parts.length > 0 ? parts[0] : null;
    return subdomain;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    hostname.endsWith(`.${rootDomain}`);

  if (isSubdomain) {
    const subdomain = hostname.replace(`.${rootDomain}`, "");
    return subdomain;
  }

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
    const domain = rootDomain.split(":")[0];
    const url = `https://${sanitizedSubdomain}.${domain}${cleanPathname}${cleanSearch}`;
    console.log(`Built production subdomain URL: ${url}`);
    return url;
  } else {
    // Development environment - FIXED: Always include port
    const port = rootDomain.includes(":") ? rootDomain.split(":")[1] : "3000";
    const url = `http://${sanitizedSubdomain}.localhost:${port}${cleanPathname}${cleanSearch}`;
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

// FIXED: Updated handleUserRedirect function for LoginForm
export function handleUserRedirect(user: any, school: any, router: any) {
  if (user.role === "SUPER_ADMIN") {
    router.push("/admin/dashboard");
  } else if (school?.subdomain) {
    // Build the correct subdomain URL
    const subdomainUrl = buildSubdomainUrl(school.subdomain, "/dashboard");
    console.log("Redirecting to:", subdomainUrl);

    // Use window.location.href for cross-subdomain navigation
    window.location.href = subdomainUrl;
  } else {
    router.push("/dashboard");
  }
}

// Alternative redirect function that you can use instead of window.location.href
export function redirectToSubdomain(
  subdomain: string,
  pathname: string = "/dashboard"
) {
  const url = buildSubdomainUrl(subdomain, pathname);
  console.log("Redirecting to subdomain:", url);

  // This ensures a proper redirect without getting stuck in a loop
  if (window.location.href !== url) {
    window.location.href = url;
  }
}

// UPDATED: Login form handleUserRedirect function
// Replace your current handleUserRedirect function with this:
/*
function handleUserRedirect(user: User, school: School | null) {
  if (user.role === 'SUPER_ADMIN') {
    router.push('/admin/dashboard');
  } else if (school?.subdomain) {
    const subdomainUrl = buildSubdomainUrl(school.subdomain, '/dashboard');
    console.log('Redirecting to:', subdomainUrl);
    
    // Check if we're already on the correct subdomain
    const currentHost = window.location.host;
    const expectedHost = `${school.subdomain}.localhost:3000`;
    
    if (currentHost !== expectedHost) {
      window.location.href = subdomainUrl;
    } else {
      // Already on correct subdomain, just navigate to dashboard
      router.push('/dashboard');
    }
  } else {
    router.push('/dashboard');
  }
}
*/
