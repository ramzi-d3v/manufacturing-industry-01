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
        router.replace("/"); 
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-6 px-10 py-12 bg-white/10 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-lg text-white">

        {/* Smooth Spinner */}
        <div className="w-20 h-20 border-8 border-gray-500/20 border-t-blue-950 rounded-full animate-spin-smooth" />

        <h1 className="text-2xl font-semibold text-center">
          Verify Your Email
        </h1>

        <p className="text-sm text-white/80 text-center leading-relaxed">
          We’ve sent a verification link to your email address.
          <br />
          Please verify your email to continue using the platform.
        </p>

        {/* <Button
          onClick={checkVerificationManually}
          disabled={checking}
          className="w-full bg-white/10 border border-white/20 hover:bg-white/20 text-white"
        >
          {checking ? "Checking..." : "I have verified my email"}
        </Button> */}

        <p className="text-xs text-white/50 text-center">
          This page will automatically update once verification is complete.
        </p>
      </div>

      <style jsx>{`
        @keyframes spinSmooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-smooth {
          animation: spinSmooth 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
