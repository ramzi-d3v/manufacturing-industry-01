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

const GitHubIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.54 3.22l-.05-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const AppleIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.54 3.22l-.05-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleIcon = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

const Logo = (props) => (
  <svg fill="currentColor" height="48" width="40" viewBox="0 0 40 48" {...props}>
    <clipPath id="a">
      <path d="m0 0h40v48h-40z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" />
      <path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" />
      <path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" />
      <path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" />
      <path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" />
      <path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" />
    </g>
  </svg>
);

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


  // Email/password signup
 
  const handleSignUp = async () => {
  if (!isSignUpValid) return;

  try {
    setIsLoading(true);
    setError("");

    const userCredential = await signup(
      emailSignUp,
      passwordSignUp,
      nameInput
    );

    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      toast.success("Verification email sent! Please check your inbox.");
    }

    // ✅ redirect after signup
    router.replace("/dashboard");

  } catch (error) {
    setError(error.message || "Signup failed");
    console.error(error.message);
  } finally {
    setIsLoading(false);
  }
};


  // Email/password login

  const handleSignInClick = async () => {
    if (!isLoginValid) return;

    try {
      setIsLoading(true);
      setError("");
      await login(emailLogin, passwordLogin);
      router.replace("/dashboard");
    } catch (error) {
      if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
        setError(error.message);
      }
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  
  // OAuth login (Google / Apple)

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

      if (isNewUser && !user.emailVerified) {
        await sendEmailVerification(user);
        alert("fication email sent! Please check your inbox.");
      }

      router.replace("/dashboard");
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
            // Sign In Form
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



