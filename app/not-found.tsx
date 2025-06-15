"use client";
import { ArrowLeft, Home, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full max-w-6xl  overflow-hidden  ">
          <CardHeader className="bg-indigo-600 py-6">
            <div className="flex items-center justify-center space-x-2">
              <GraduationCap className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold text-white">
                Lectify Schools
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-12 pb-8 px-8">
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="rounded-full bg-indigo-100 p-6 shadow-inner"
              >
                <BookOpen className="h-12 w-12 text-indigo-600" />
              </motion.div>
            </div>

            <h1 className="mb-4 text-4xl md:text-5xl font-bold text-gray-800">
              <span className="text-indigo-600">404</span> - Page Not Found
            </h1>

            <p className="mb-8 text-lg text-gray-600 max-w-md mx-auto">
              The lesson you're looking for isn't in our syllabus. It might have
              been moved or archived.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <Link href="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Page
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center py-6 bg-gray-50 border-t">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a href="/support" className="text-indigo-600 hover:underline">
                Contact Support
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
