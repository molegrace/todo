import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  clearAuthSession,
  startAuthSession,
} from "../services/auth/sessionExpiry";

export const registerWithEmailPassword = (
  email: string,
  password: string
): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password).then((credential) => {
    startAuthSession(credential.user.uid);
    return credential;
  });

export const setUserDisplayName = (
  user: User,
  displayName: string
): Promise<void> => updateProfile(user, { displayName });

export const loginWithEmailPassword = (
  email: string,
  password: string
): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password).then((credential) => {
    startAuthSession(credential.user.uid);
    return credential;
  });

export const logoutFirebase = async (): Promise<void> => {
  await signOut(auth);
  clearAuthSession();
};
