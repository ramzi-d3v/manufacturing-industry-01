"use client";

import { signup, login } from "@/lib/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import styles from "./signup.module.css";

// Icons omitted for brevity (keep your GitHubIcon, AppleIcon, GoogleIcon, Logo)

export default function AuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignUpValid = nameInput.trim() && emailSignUp.trim() && passwordSignUp.trim();
  const isLoginValid = emailLogin.trim() && passwordLogin.trim();

  // -------------------------
  // Email/password signup
  // -------------------------
  const handleSignUp = async () => {
    if (!isSignUpValid) return;

    try {
      setIsLoading(true);
      setError("");

      const userCredential = await signup(emailSignUp, passwordSignUp, nameInput);
      const user = userCredential.user;

      // Send email verification
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      setError(error.message || "Signup failed");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // Email/password login
  // -------------------------
  const handleSignInClick = async () => {
    if (!isLoginValid) return;

    try {
      setIsLoading(true);
      setError("");
      await login(emailLogin, passwordLogin);
      router.push("/dashboard");
    } catch (error) {
      if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
        setError(error.message);
      }
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // OAuth login (Google / Apple)
  // -------------------------
  const handleLogin = async (type) => {
    try {
      setIsLoading(true);
      setError("");
      const auth = getFirebaseAuth();
      let provider;

      if (type === "google") {
        provider = new GoogleAuthProvider();
      } else if (type === "apple") {
        provider = new OAuthProvider("apple.com");
        try {
          provider.addScope('email');
          provider.addScope('name');
          provider.setCustomParameters({ locale: 'en' });
        } catch (e) {}
      }

      let userCredential;
      try {
        userCredential = await signInWithPopup(auth, provider);
      } catch (popupError) {
        if (
          popupError.code === "auth/popup-blocked" ||
          popupError.code === "auth/operation-not-supported-in-this-environment" ||
          popupError.code === "auth/cancelled-popup-request"
        ) {
          userCredential = await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }

      const user = auth.currentUser || userCredential.user;
      const isNewUser = userCredential?.additionalUserInfo?.isNewUser || false;

      // Send verification email for new users if not verified
      if (isNewUser && !user.emailVerified) {
        await sendEmailVerification(user);
        toast.success("Verification email sent! Please check your inbox.");
      }

      router.push("/dashboard");
    } catch (error) {
      if (
        error.code !== "auth/cancelled-popup-request" &&
        error.code !== "auth/popup-closed-by-user"
      ) {
        setError(error.message || "Login failed");
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // UI rendering (unchanged)
  // -------------------------
  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-1 flex-col justify-center px-4 py-6 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div key={`logo-${isSignUp}`} className={`flex items-center space-x-1.5 ${styles.logoContainer}`}>
            <Logo className="h-7 w-7 text-foreground dark:text-foreground" />
            <p className="font-medium text-lg text-foreground dark:text-foreground">Pro</p>
          </div>

          <h3 key={`title-${isSignUp}`} className={`mt-6 text-lg font-semibold text-foreground dark:text-foreground ${styles.headerTitle}`}>
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h3>

          <p key={`subtitle-${isSignUp}`} className={`mt-2 text-sm text-muted-foreground dark:text-muted-foreground ${styles.headerSubtitle}`}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              className="font-medium text-primary hover:text-primary/90 cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Conditional Rendering for Forms */}
          {isSignUp ? (
            // Sign Up Form
            <form className={`mt-6 space-y-2 ${styles.formEnter}`} onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              <div className={styles.fieldGroup}>
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="John Doe" 
                  className="mt-2"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <Label htmlFor="email-signup" className="text-sm font-medium">Email</Label>
                <Input 
                  type="email" 
                  id="email-signup" 
                  placeholder="you@example.com" 
                  className="mt-2"
                  value={emailSignUp}
                  onChange={(e) => setEmailSignUp(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <Label htmlFor="password-signup" className="text-sm font-medium">Password</Label>
                <Input 
                  type="password" 
                  id="password-signup" 
                  placeholder="********" 
                  className="mt-2"
                  value={passwordSignUp}
                  onChange={(e) => setPasswordSignUp(e.target.value)}
                />
              </div>
              <Button 
                type="submit"
                disabled={!isSignUpValid || isLoading}
                className={`mt-4 w-full py-2 font-medium ${styles.submitBtn}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`${styles.spinner}`}></div>
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          ) : (
            // Sign In Form (unchanged)
            <div className={styles.formEnter}>
              <div className="mt-6 flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button 
                  variant="outline" 
                  className="flex-1 cursor-not-allowed items-center justify-center space-x-2 py-2"
                  disabled={true}
                  onClick={() => handleLogin("apple")}
                >
                  <AppleIcon className="size-5" />
                  <span className="text-sm font-medium">Login with Apple</span>
                </Button>

                <Button 
                  variant="outline" 
                  className="flex-1 items-center justify-center space-x-2 py-2"
                  disabled={false}
                  onClick={() => handleLogin("google")}
                >
                  <GoogleIcon className="size-4" />
                  <span className="text-sm font-medium">Login with Google</span>
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-white/10 rounded" />
                </div>
                <div className="relative flex justify-center">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full  text-white/90 text-xs font-semibold shadow-sm">
                    
                  </span>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignInClick(); }}>
                <div className={styles.fieldGroup}>
                  <Label htmlFor="email-login" className="text-sm font-medium">Email</Label>
                  <Input 
                    type="email" 
                    id="email-login" 
                    placeholder="you@example.com" 
                    className="mt-2"
                    value={emailLogin}
                    onChange={(e) => setEmailLogin(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <Label htmlFor="password-login" className="text-sm font-medium">Password</Label>
                  <Input 
                    type="password" 
                    id="password-login" 
                    placeholder="********" 
                    className="mt-2"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={!isLoginValid || isLoading}
                  className={`mt-4 w-full py-2 font-medium ${styles.submitBtn} ${isLoading ? 'opacity-60' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Signing in</span>
                      <div className={styles.spinner}></div>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                Forgot your password?{" "}
                <a href="#" className="font-medium text-primary hover:text-primary/90">Reset password</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
