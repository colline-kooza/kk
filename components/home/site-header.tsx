"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Menu, X } from "lucide-react";
import MainLogo from "./main-logo";
import { RainbowButton } from "../magicui/rainbow-button";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "/features" },
  { title: "Learn", href: "/learn" },
  { title: "Academy", href: "/academy" },
];

export default function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent  backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 py-2 px-5 ">
      <div className="container mx-auto flex h-14 items-center">
        <MainLogo />

        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-4">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center space-x-4 ml-4">
          <Button href="/auth/login" variant="ghost">
            Log in
          </Button>
          <RainbowButton link="/auth/enquiry" className="h-10 px-8 text-xs font-medium ">
            Enquiry
            <ArrowRight className="ml-2 h-4 w-4" />
          </RainbowButton>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b px-4 py-4">
                <span className="font-bold text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <ul className="flex-1 px-4 py-6 space-y-4">
                {menuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t px-4 py-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Button>
                <Button
                  variant="outline"
                  className="w-full px-8 py-3 text-white 
      bg-gradient-to-r from-[#7938cc] via-[#9d5ce0] to-[#7938cc] bg-[length:200%_100%] 
      hover:bg-[position:100%_0] hover:shadow-lg hover:shadow-[#7938cc]/25
      animate-[rainbow_3s_ease-in-out_infinite] cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                Enquiry
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
