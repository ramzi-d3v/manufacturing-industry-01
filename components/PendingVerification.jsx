"use client";

import { useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PendingVerification() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  // 🔒 HARD LOCK: user cannot bypass by reload
  useEffect(() => {
    const auth = getFirebaseAuth();

    const interval = setInterval(async () => {
      if (!auth.currentUser) return;

      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        clearInterval(interval);
        toast.success("Email verified!");
        router.refresh(); // dashboard re-renders without blocker
      }
    }, 5000); // auto-check every 5s

    return () => clearInterval(interval);
  }, [router]);

  const checkVerificationManually = async () => {
    setChecking(true);
    const auth = getFirebaseAuth();

    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
      toast.success("Email verified!");
      router.refresh();
    } else {
      toast.error("Still not verified. Check your inbox.");
    }

    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900/90 via-black/90 to-slate-900/90">
      <div className="relative flex flex-col items-center gap-6 px-10 py-12 bg-white/95 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-lg">

        {/* Spinner */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-[6px] border-gray-300/40" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-[6px] border-blue-600 border-t-transparent animate-spin" />
        </div>

        <h1 className="text-2xl font-semibold text-center">
          Verify Your Email
        </h1>

        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          We’ve sent a verification link to your email address.
          <br />
          Please verify your email to continue using the platform.
        </p>

        <Button
          onClick={checkVerificationManually}
          disabled={checking}
          className="w-full"
        >
          {checking ? "Checking..." : "I have verified my email"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This page will automatically update once verification is complete.
        </p>
      </div>
    </div>
  );
}
