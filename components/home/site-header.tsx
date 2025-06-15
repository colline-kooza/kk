"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Menu, X } from "lucide-react";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "/features" },
  { title: "Learn", href: "/learn" },
  { title: "Academy", href: "/academy" },
];

export default function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <div className="bg-blue-500 flex items-center justify-center rounded-full w-8 h-8 p-1">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl">Lectify</span>
        </Link>

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
          <Button href="/auth/register">Sign up</Button>
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
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Sign up
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
