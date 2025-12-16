"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
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
  {
    value: "company",
    title: "Company Details",
    description: "Business registration information",
  },
  {
    value: "personal",
    title: "User Details",
    description: "Enter your basic information",
  },
  {
    value: "payment",
    title: "Payment Info",
    description: "How you'd like to pay",
  },
  {
    value: "documents",
    title: "Documents",
    description: "Upload documents",
  },
];

/* --------------------------
   YEARS
-------------------------- */
const years = Array.from(
  { length: 30 },
  (_, i) => `${new Date().getFullYear() - i}`
);

/* --------------------------
   COMPONENT
-------------------------- */
export function StepperFormDemo() {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    companyName: "",
    tin: "",
    description: "",
    brelaName: "",
    businessLicenceYear: "",
    location: "",
    contact: "",
    companyEmail: "",

    firstName: "",
    phone: "",
    role: "",
    email: "",

    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* Autofill from Firebase */
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        update("email", user.email || "");
        update("firstName", (user.displayName || "").split(" ")[0] || "");
      }
    });
    return () => unsub();
  }, []);

  /* --------------------------
     VALIDATION
  -------------------------- */
  function validateStep() {
    if (step === 0) {
      if (
        !form.companyName ||
        !form.tin ||
        !form.brelaName ||
        !form.businessLicenceYear ||
        !form.location
      ) {
        toast.info("Please complete company details");
        return false;
      }
    }

    if (step === 1) {
      if (!form.firstName || !form.phone || !form.role || !form.email) {
        toast.info("Please complete user details");
        return false;
      }
    }

    if (step === 2 && form.paymentMethod === "card") {
      if (!form.cardNumber || !form.expiry || !form.cvv) {
        toast.info("Please complete card details");
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function onSubmit(e) {
    e.preventDefault();
    toast.success("Form submitted successfully");
    console.log("FORM DATA:", form);
  }

  return (
    <form onSubmit={onSubmit} className="w-full">

      {/* STEPPER */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {steps.map((s, i) => (
          <div key={s.value} className="flex items-center gap-2">
            <div
              className={`size-8 rounded-full flex items-center justify-center border text-sm
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
              <div className="text-xs text-muted-foreground">
                {s.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* STEP 0: COMPANY */}
      {step === 0 && (
        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
            <Input
              placeholder="TIN"
              value={form.tin}
              onChange={(e) => update("tin", e.target.value)}
            />
          </div>

          <textarea
            className="min-h-[90px] rounded-md border px-3 py-2 text-sm"
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="BRELA"
              value={form.brelaName}
              onChange={(e) => update("brelaName", e.target.value)}
            />

            <Select
              value={form.businessLicenceYear}
              onValueChange={(v) => update("businessLicenceYear", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => update("contact", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={form.companyEmail}
              onChange={(e) => update("companyEmail", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STEP 1: USER */}
      {step === 1 && (
        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />

          <Select
            value={form.role}
            onValueChange={(v) => update("role", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="distributor">Distributor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* STEP 2: PAYMENT */}
      {step === 2 && (
        <div className="flex flex-col gap-4">

          <Select
            value={form.paymentMethod}
            onValueChange={(v) => update("paymentMethod", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="cod">Cash</SelectItem>
            </SelectContent>
          </Select>

          {form.paymentMethod === "card" && (
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Card Number"
                value={form.cardNumber}
                onChange={(e) => update("cardNumber", e.target.value)}
              />
              <Input
                placeholder="Expiry"
                value={form.expiry}
                onChange={(e) => update("expiry", e.target.value)}
              />
              <Input
                placeholder="CVV"
                value={form.cvv}
                onChange={(e) => update("cvv", e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* STEP 3: DOCUMENTS */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <FileUpload />
        </div>
      )}

      {/* BUTTONS */}
      <div className="mt-6 flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={prevStep}
        >
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {step + 1} of {steps.length}
        </div>

        {step === steps.length - 1 ? (
          <Button type="submit">Complete</Button>
        ) : (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
