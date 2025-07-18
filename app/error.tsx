"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Home } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "./../public/images/error-animation.json";

export default function Error() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex justify-center items-center">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>500 Access Restricted</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">500</span> Oops! Something Wrong
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800"> Happened</span>
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                It looks like Something wrong Happened try reloading ...
              </p>
            </div>

            {/* 👇 Buttons with navigation */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                onClick={() => router.refresh()} // 👈 Go back
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Reload
              </Button>

              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => router.push("/dashboard")} // 👈 Go to login
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>

          {/* Lottie animation */}
          <div className="relative z-10">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full max-w-md h-60"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
