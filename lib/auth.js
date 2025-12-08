"use client";

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export const signup = async (email, password, displayName) => {
  if (!auth) throw new Error("Firebase not initialized");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const login = async (email, password) => {
  if (!auth) throw new Error("Firebase not initialized");
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  if (!auth) throw new Error("Firebase not initialized");
  return await signOut(auth);
};

export const getCurrentUser = () => {
  if (!auth) return null;
  return auth.currentUser;
};


