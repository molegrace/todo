import { createUserWithEmailAndPassword, updateProfile, type User, type UserCredential } from "firebase/auth";
import { auth } from "../firebase";

export const registerWithEmailPassword = (
  email: string,
  password: string
): Promise<UserCredential> => createUserWithEmailAndPassword(auth, email, password);

export const setUserDisplayName = (
  user: User,
  displayName: string
): Promise<void> => updateProfile(user, { displayName });

