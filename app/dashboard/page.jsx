"use client";

import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged } from "firebase/auth";

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

  if (!canAccess) {
    return null; // Prevent access completely
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-50 dark:to-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Dashboard Header */}
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-white">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome, {user.displayName || "User"}!
                </h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="destructive"
              className="ml-auto"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>

        {/* User Details Card */}
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Account Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Full Name
              </label>
              <p className="text-foreground py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                {user.displayName || "Not set"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email Address
              </label>
              <p className="text-foreground py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                User ID
              </label>
              <p className="text-foreground py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-md text-sm break-all">
                {user.uid}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Account Created
              </label>
              <p className="text-foreground py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
