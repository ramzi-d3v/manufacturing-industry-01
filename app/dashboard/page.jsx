"use client";

import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { onAuthStateChanged } from "firebase/auth";
import {StepperFormDemo} from "@/components/title-status";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [canAccess, setCanAccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCanAccess(true);
      } else {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!canAccess || !user) return null;

  const initials = user.displayName
    ? user.displayName.split(" ").map(n => n.charAt(0)).join("").toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-gradient-to-br dark:from-black dark:via-slate-950 dark:to-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md border-white/10 p-4 rounded-md">
          <div className="flex items-center justify-between space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-md">
                <span className="text-base font-semibold text-white">{initials}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white">{user.displayName || "User"}</span>
                <span className="text-sm text-slate-300">{user.email}</span>
              </div>
            </div>

            {/* Logout Button */}
            <div className="self-start">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="ghost"
                className="p-2 rounded-full text-white/90 hover:bg-white/6"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>

          {/* Separator */}
          <Separator className="mt-3 border-slate-600/30" />
        </div>

        {/* Title and Description Outside Card */}
        <div className="mt-6 mb-4 text-center">
          <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
          <p className="text-slate-400 mt-1">Fill in your information to get started</p>
        </div>

        {/* Stepper Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
          <div className="p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <StepperFormDemo />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
