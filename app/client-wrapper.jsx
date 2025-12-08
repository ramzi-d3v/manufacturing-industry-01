"use client";

import { AuthProvider } from "@/components/AuthProvider";

export default function ClientAuthWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
