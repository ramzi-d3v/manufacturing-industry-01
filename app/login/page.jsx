"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "@/components/login/signup";

export default function Page() {
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
}
