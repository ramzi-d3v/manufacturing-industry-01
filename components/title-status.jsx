"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { getFirebaseAuth, getFirestoreDB } from "@/lib/firebase";
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";

export function StepperFormDemo() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ /* all fields here... */ });
  const [user, setUser] = useState(null);
  const [overlay, setOverlay] = useState(false);
  const db = getFirestoreDB();
  const auth = getFirebaseAuth();
  const router = useRouter();

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        const userDocRef = doc(db, "users", u.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
          const data = docSnap.data();
          if (data?.approved) setOverlay(false);
          else if (data?.pending) setOverlay(true);
        });

        // pre-fill email and firstName
        update("email", u.email);
        update("firstName", u.displayName?.split(" ")[0] || "");

        // auto-send verification email if not verified
        if (!u.emailVerified) {
          sendEmailVerification(u);
          toast("Check your email to verify account!");
        }

        return () => unsubscribe();
      } else {
        router.push("/login"); // protect root page if not logged in
      }
    });
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!user) return toast.error("Not authenticated");

    setOverlay(true);

    const uid = user.uid;

    try {
      // Users collection
      await setDoc(doc(db, "users", uid), {
        uid,
        ...form,
        pending: true,
        approved: false,
        profileComplete: true,
        createdAt: serverTimestamp(),
      });

      // Companies, Payments, Documents collection...
      // ...

      toast.success("Registration submitted! Check email for approval link.");

    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
      setOverlay(false);
    }
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-md text-center">
          <h2 className="text-xl font-bold mb-4">Pending approval...</h2>
          <p>We have sent an email verification link. Please verify and wait for admin approval.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* STEPPER + fields as before */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
