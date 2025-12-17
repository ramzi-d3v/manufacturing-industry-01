"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { getFirebaseAuth, getFirestoreDB } from "@/lib/firebase";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";

/* --------------------------
   STEPS
-------------------------- */
const steps = [
  { value: "company", title: "Company Details", description: "Business info" },
  { value: "user", title: "User Details", description: "Personal info" },
  { value: "payment", title: "Payment Info", description: "Payment setup" },
  { value: "documents", title: "Documents", description: "Upload documents" },
];

/* --------------------------
   YEARS
-------------------------- */
const years = Array.from({ length: 30 }, (_, i) => `${new Date().getFullYear() - i}`);

export function StepperFormDemo() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const db = getFirestoreDB();

  const [form, setForm] = useState({
    /* COMPANY */
    companyName: "",
    tin: "",
    description: "",
    brelaName: "",
    businessLicenceYear: "",
    location: "",
    contact: "",
    companyEmail: "",

    /* USER */
    firstName: "",
    phone: "",
    email: "",
    role: "",
    birthday: "",

    /* PAYMENT */
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  /* AUTH */
  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        update("email", u.email || "");
        update("firstName", u.displayName?.split(" ")[0] || "");
      }
    });
  }, []);

  /* NAVIGATION */
  function nextStep() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  /* SUBMIT → FIRESTORE */
  async function onSubmit(e) {
  e.preventDefault();
  if (!user) return toast.error("Not authenticated");

  try {
    const uid = user.uid;

    // Save user, company, payment, documents as before
    await setDoc(doc(db, "users", uid), { ...form, createdAt: serverTimestamp() });
    await setDoc(doc(db, "companies", uid), { ...form, createdAt: serverTimestamp() });
    await setDoc(doc(db, "payments", uid), {
      uid,
      paymentMethod: form.paymentMethod,
      cardLast4: form.cardNumber?.slice(-4) || "",
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, "documents", uid), { uid, uploaded: false, createdAt: serverTimestamp() });

    toast.success("Registration completed! Check your email to verify.");

    // Show pending verification page
    setStep("pending");
  } catch (err) {
    console.error(err);
    toast.error("Submission failed");
  }
}


  return (
    <form onSubmit={onSubmit} className="w-full">

      {/* STEPPER */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {steps.map((s, i) => (
          <div key={s.value} className="flex items-center gap-2">
            <div
              className={`size-8 rounded-full flex items-center justify-center border
              ${
                i === step
                  ? "bg-white text-black"
                  : i < step
                  ? "bg-green-500 text-white"
                  : "text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* STEP 1: COMPANY */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Company Name" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
            <Input placeholder="TIN" value={form.tin} onChange={(e) => update("tin", e.target.value)} />
          </div>

          <textarea
            className="border rounded-md p-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="BRELA" value={form.brelaName} onChange={(e) => update("brelaName", e.target.value)} />
            <Select value={form.businessLicenceYear} onValueChange={(v) => update("businessLicenceYear", v)}>
              <SelectTrigger><SelectValue placeholder="Licence Year" /></SelectTrigger>
              <SelectContent>
                {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Contact" value={form.contact} onChange={(e) => update("contact", e.target.value)} />
            <Input placeholder="Company Email" value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
          </div>
        </div>
      )}

     
{step === 1 && (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-2 gap-4">
      <Input placeholder="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
      <Input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
    </div>

    {/* EMAIL + ROLE + BIRTHDAY (same row) */}
    <div className="grid grid-cols-3 gap-4">
      <Input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
      <Select value={form.role} onValueChange={(v) => update("role", v)}>
        <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="supplier">Supplier</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="distributor">Distributor</SelectItem>
        </SelectContent>
      </Select>
      <Input type="date" placeholder="Birthday" value={form.birthday} onChange={(e) => update("birthday", e.target.value)} />
    </div>
  </div>
)}


{step === 2 && (
  <div className="flex flex-col gap-4">
    <Select value={form.paymentMethod} onValueChange={(v) => update("paymentMethod", v)}>
      <SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="card">Card</SelectItem>
        <SelectItem value="bank">Bank</SelectItem>
        <SelectItem value="cash">Cash</SelectItem>
      </SelectContent>
    </Select>

    {form.paymentMethod === "card" && (
      <div className="grid grid-cols-3 gap-4">
        <Input placeholder="Card Number" value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)} />
        <Input placeholder="Expiry" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} />
        <Input placeholder="CVV" value={form.cvv} onChange={(e) => update("cvv", e.target.value)} />
      </div>
    )}

    {form.paymentMethod === "bank" && (
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => update("bankName", e.target.value)} />
        <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} />
      </div>
    )}

    {form.paymentMethod === "cash" && (
      <p className="text-sm text-muted-foreground">You will pay in cash upon delivery/visit.</p>
    )}
  </div>
)}

      {/* STEP 4: DOCUMENTS */}
      {step === 3 && <FileUpload />}

      {step === "pending" && (
  <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-md shadow-md">
    <h2 className="text-lg font-semibold">Pending Email Verification</h2>
    <p className="text-sm text-muted-foreground text-center">
      We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
    </p>
    <Button
      onClick={async () => {
        const auth = getFirebaseAuth();
        await auth.currentUser.reload(); // refresh user data
        if (auth.currentUser.emailVerified) {
          toast.success("Email verified! Redirecting...");
          router.push("/dashboard");
        } else {
          toast.error("Email not verified yet. Please check your inbox.");
        }
      }}
    >
      I have verified my email
    </Button>
  </div>
)}


      {/* BUTTONS */}
      <div className="mt-6 flex justify-between">
        <Button type="button" variant="outline" disabled={step === 0} onClick={prevStep}>Previous</Button>
        {step === steps.length - 1 ? (
          <Button type="submit">Complete</Button>
        ) : (
          <Button type="button" onClick={nextStep}>Next</Button>
        )}
      </div>
    </form>
  );
}



  