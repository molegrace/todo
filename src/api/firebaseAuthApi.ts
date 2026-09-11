import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type ActionCodeSettings,
  type User,
  type UserCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";
import {
  clearAuthSession,
  startAuthSession,
} from "../services/auth/sessionExpiry";

const getActionCodeSettings = (): ActionCodeSettings => {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const baseUrl = import.meta.env.BASE_URL || "/";
  const redirectUrl = `${origin}${baseUrl}login`.replace(/([^:]\/)\/+/g, "$1");

  return {
    url: redirectUrl,
    handleCodeInApp: false,
  };
};

export const registerWithEmailPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await sendEmailVerification(credential.user, getActionCodeSettings());
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to send verification email during registration:", error);
    }
  } finally {
    await signOut(auth);
    clearAuthSession();
  }
  return credential;
};

export const setUserDisplayName = (
  user: User,
  displayName: string
): Promise<void> => updateProfile(user, { displayName });

export const setUserProfile = (
  user: User,
  updates: { displayName?: string; photoURL?: string | null }
): Promise<void> => updateProfile(user, updates);

export const loginWithEmailPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (!credential.user.emailVerified) {
    await signOut(auth);
    clearAuthSession();
    throw new FirebaseError(
      "auth/email-not-verified",
      "Your email address is not verified. Please check your inbox for the verification link before logging in."
    );
  }
  startAuthSession(credential.user.uid);
  return credential;
};

export const resendVerificationEmailApi = async (
  email: string,
  password: string
): Promise<void> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (credential.user.emailVerified) {
    await signOut(auth);
    clearAuthSession();
    throw new FirebaseError(
      "auth/email-already-verified",
      "Your email is already verified. You can log in directly."
    );
  }
  await sendEmailVerification(credential.user, getActionCodeSettings());
  await signOut(auth);
  clearAuthSession();
};

export const logoutFirebase = async (): Promise<void> => {
  await signOut(auth);
  clearAuthSession();
};
