import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Changed from Inter to Poppins
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
        {children}
      </body>
    </html>
  );
}
