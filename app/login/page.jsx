"use client"
import AuthForm from "@/components/login/signup"
export default function Page() {
  
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  )
}
