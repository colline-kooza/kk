"use client";

import { ArrowLeft, Home, MoveLeft } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import NotFoundAnimation from ".././public/images/404.json";
import { Button } from "@/components/ui/button"; // Adjust path if needed
import { RainbowButton } from "@/components/magicui/rainbow-button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center  p-1">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-[300px] sm:w-[400px]">
          <Lottie animationData={NotFoundAnimation} loop={true} />
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-purple-700">
          Oops! Page Not Found
        </h1>

        <p className="text-gray-600 max-w-md mx-auto text-base">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <RainbowButton link="/dashboard" className="w-full sm:w-auto text-xs">
            <Home className="mr-2 h-4 w-4" />
             Dashboard
          </RainbowButton>
          <RainbowButton  onClick={() => window.history.back()} className="w-full sm:w-auto text-xs">
            <MoveLeft className="mr-2 h-4 w-4" />
              Go Back
          </RainbowButton>
        </div>
      </motion.div>
    </main>
  );
}
