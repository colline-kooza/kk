import SiteFooter from "@/components/home/site-footer";
import SiteHeader from "@/components/home/site-header";

import React, { ReactNode } from "react";

export default function FrontLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
