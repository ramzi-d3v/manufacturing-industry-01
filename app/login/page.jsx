"use client";

import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "@/components/login/signup";

export default function Page() {
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, prevent access
        router.replace("/dashboard");
      } else {
        // User is not logged in, allow access
        setCanAccess(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading || !canAccess) {
    return null; // Show nothing, preventing access
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-gradient-to-br dark:from-black dark:via-slate-950 dark:to-black">
      {/* Animated Background Elements (shared with dashboard) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
