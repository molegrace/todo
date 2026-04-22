import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";

export const registerWithEmailPassword = (
  email: string,
  password: string
): Promise<UserCredential> => createUserWithEmailAndPassword(auth, email, password);

export const setUserDisplayName = (
  user: User,
  displayName: string
): Promise<void> => updateProfile(user, { displayName });

export const loginWithEmailPassword = (
  email: string,
  password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password);

export const logoutFirebase = (): Promise<void> => signOut(auth);
