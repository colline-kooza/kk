import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

import "./globals.css";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "react-hot-toast";
import { Toaster as SoonerToaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { SchoolProvider } from "@/components/providers/SchoolProvider";
import { SchoolLoadingWrapper } from "@/components/providers/SchoolLoadingWrapper";

export const metadata: Metadata = {
  title: "SchoolPro",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster position="top-center" reverseOrder={false} />
        <SoonerToaster richColors />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ReactQueryProvider>
          <SchoolProvider>
            <SchoolLoadingWrapper>
              {children}
            </SchoolLoadingWrapper>
          </SchoolProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}