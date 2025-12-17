"use client";

import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PendingVerification() {
  const router = useRouter();

  const checkVerification = async () => {
    const auth = getFirebaseAuth();
    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
      toast.success("Email verified!");
      router.refresh(); // re-render dashboard
    } else {
      toast.error("Email not verified yet");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="flex flex-col items-center gap-6 p-10 bg-white/90 rounded-lg shadow-lg backdrop-blur-md">
        <div className="w-20 h-20 border-8 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

        <h2 className="text-xl font-semibold text-center">
          Pending Email Verification
        </h2>

        <p className="text-sm text-muted-foreground text-center max-w-sm">
          We’ve sent a verification link to your email. Please verify your email
          to continue.
        </p>

        <Button onClick={checkVerification}>
          I have verified my email
        </Button>
      </div>
    </div>
  );
}
