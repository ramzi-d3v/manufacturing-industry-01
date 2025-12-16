"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FileUpload, FileUploadDropzone, FileUploadList } from "@/components/ui/file-upload";

// --------------------------
// ZOD VALIDATION
// --------------------------
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  phone: z.string().min(7, "Phone is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().min(0),
  company: z.string().min(0),
  website: z.string().url("Please enter a valid URL").or(z.literal("")),
  paymentMethod: z.enum(["card", "bank", "cod"]).optional(),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
  idDocument: z.any().optional(),
  profilePhoto: z.any().optional(),
  notes: z.string().optional(),
});

// --------------------------
// CUSTOM STEPS
// --------------------------
const steps = [
  { value: "personal", title: "User Details", description: "Enter your basic information", fields: ["firstName", "phone", "role", "company"] },
  { value: "payment", title: "Payment Info", description: "How you'd like to pay", fields: ["paymentMethod", "cardNumber", "expiry", "cvv"] },
  { value: "documents", title: "Documents", description: "Upload ID and profile photo", fields: ["idDocument"] },
];

// --------------------------
// COMPONENT
// --------------------------
export function StepperFormDemo() {
  const [step, setStep] = React.useState(0); // index instead of string step
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      phone: "",
      role: "",
      email: "",
      bio: "",
      company: "",
      website: "",
      paymentMethod: "card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      idDocument: null,
      profilePhoto: null,
      notes: "",
    },
  });

  const current = steps[step];

  React.useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = (user.displayName || "").split(" ")[0] || "";
        form.setValue("firstName", name);
        if (user.email) form.setValue("email", user.email);
      }
    });

    return () => unsubscribe();
  }, [form]);

  // Validation before moving next
  async function nextStep() {
    let fieldsToValidate = current.fields;
    if (current.value === "payment") {
      const pm = form.getValues("paymentMethod");
      if (pm === "card") {
        fieldsToValidate = ["paymentMethod", "cardNumber", "expiry", "cvv"];
      } else {
        fieldsToValidate = ["paymentMethod"];
      }
    }

    const valid = await form.trigger(fieldsToValidate);

    if (!valid) {
      toast.info("Please complete all required fields to continue");
      return;
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function prevStep() {
    setStep((prev) => prev - 1);
  }

  const onSubmit = (data) => {
    toast.success(<pre>{JSON.stringify(data, null, 2)}</pre>);
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>

        {/* -------------------------- */}
        {/* TOP STEP INDICATORS */}
        {/* -------------------------- */}
        <div className="flex items-center gap-6 justify-center mb-6">

          {steps.map((s, i) => (
            <div
              key={s.value}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setStep(i)}
            >
              <div
                className={`size-8 flex items-center justify-center rounded-full border text-sm transition-all
                  ${
                    i === step
                      ? "bg-white text-black"
                      : i < step
                      ? "bg-green-500 text-white"
                      : "border-muted-foreground text-muted-foreground"
                  }
                `}
              >
                {i + 1}
              </div>

              <div className="flex flex-col">
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm text-muted-foreground">
                  {s.description}
                </div>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={`h-[2px] w-14 rounded 
                    ${i < step ? "bg-green-500" : "bg-muted-foreground/20"}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* -------------------------- */}
        {/* STEP CONTENT */}
        {/* -------------------------- */}

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={(val) => field.onChange(val)} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="supplier">Supplier</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="contractor">Contractor</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => field.onChange(val)} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional card inputs */}
            {form.getValues("paymentMethod") === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="**** **** **** ****" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MM/YY" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <FileUpload/>
          </div>
        )}

        

        {/* -------------------------- */}
        {/* BUTTONS */}
        {/* -------------------------- */}

        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </div>

          {step === steps.length - 1 ? (
            <Button type="submit">Complete</Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </div>
      </form>
    </Form>
  );
}


