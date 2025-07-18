import { type NextRequest, NextResponse } from "next/server";
import {
  getSchoolBySubdomain,
  getServerSchool,
  saveServerSchool,
} from "@/actions/auth";
import { buildSubdomainUrl, extractSubdomainFromHost } from "./utils/utils";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const urlSubdomain = extractSubdomainFromHost(host);
  const userCookie = request.cookies.get("user");
  const schoolCookie = request.cookies.get("school");

  console.log("Middleware debug:", {
    host,
    pathname,
    urlSubdomain,
    isProduction: process.env.NODE_ENV === "production",
    rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  });

  let schoolData: any = null;
  if (schoolCookie) {
    try {
      schoolData = JSON.parse(schoolCookie.value);
    } catch (error) {
      console.error("Error parsing school cookie:", error);
    }
  }

  // Skip middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/auth") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Handle subdomain access
  if (urlSubdomain) {
    console.log(`Processing subdomain: ${urlSubdomain}`);

    // Validate subdomain exists
    const fetchedSchool = await getSchoolBySubdomain(urlSubdomain);
    if (!fetchedSchool || !fetchedSchool.isActive) {
      console.log(
        `School not found or inactive for subdomain: ${urlSubdomain}`
      );

      // In production, redirect to main domain instead of non-existent subdomain
      const isProduction = process.env.NODE_ENV === "production";
      const mainDomain = isProduction
        ? `https://${
            process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kk-five-pi.vercel.app"
          }`
        : `http://localhost:3000`;

      return NextResponse.redirect(new URL("/auth/login", mainDomain));
    }

    // Update school cookie if necessary
    const currentSchool = await getServerSchool();
    if (!currentSchool || currentSchool.id !== fetchedSchool.id) {
      await saveServerSchool(fetchedSchool);
    }

    // Only redirect root to dashboard, allow all other paths
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Set header to identify subdomain context and continue
    const response = NextResponse.next();
    response.headers.set("x-school-subdomain", urlSubdomain);
    response.headers.set("x-school-id", fetchedSchool.id);
    return response;
  }

  // Handle main domain logic
  if (userCookie && schoolData?.subdomain) {
    let userData: any = null;
    try {
      userData = JSON.parse(userCookie.value);
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }

    // Super admin stays on main domain - only redirect root path
    if (userData?.role === "SUPER_ADMIN") {
      if (pathname === "/") {
        return NextResponse.redirect(
          new URL("/dashboard/super-admin", request.url)
        );
      }
      // Allow access to all other paths for super admin
      return NextResponse.next();
    }

    // Regular users - IMPORTANT: Check if we're in production
    const isProduction = process.env.NODE_ENV === "production";

    if (pathname === "/") {
      if (isProduction) {
        // In production, use query parameter approach instead of subdomains
        const schoolUrl = new URL("/dashboard", request.url);
        schoolUrl.searchParams.set("school", schoolData.subdomain);
        console.log(`Production redirect to: ${schoolUrl.toString()}`);
        return NextResponse.redirect(schoolUrl);
      } else {
        // Development - use subdomain approach
        const subdomainUrl = buildSubdomainUrl(
          schoolData.subdomain,
          "/dashboard",
          search
        );
        console.log(`Development redirect to subdomain: ${subdomainUrl}`);
        return NextResponse.redirect(new URL(subdomainUrl));
      }
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|_static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
