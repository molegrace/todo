import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";

export type SocialLinks = {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

export type UserProfileDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  socialLinks?: SocialLinks;
  createdAt: string;
  updatedAt: string;
};

export const getUserProfileDoc = async (uid: string): Promise<UserProfileDoc | null> => {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfileDoc;
};

export const ensureUserProfileDoc = async (user: User): Promise<void> => {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  const now = new Date().toISOString();
  const base: Omit<UserProfileDoc, "createdAt"> = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    updatedAt: now,
  };

  if (snapshot.exists()) {
    await setDoc(ref, base, { merge: true });
    return;
  }

  const initial: UserProfileDoc = {
    ...base,
    createdAt: now,
  };
  await setDoc(ref, initial, { merge: true });
};

export const updateUserProfileDoc = async (
  user: User,
  updates: Partial<Pick<UserProfileDoc, "displayName" | "email" | "photoURL" | "socialLinks">>
): Promise<void> => {
  const ref = doc(db, "users", user.uid);
  const now = new Date().toISOString();

  await setDoc(
    ref,
    {
      uid: user.uid,
      updatedAt: now,
      ...updates,
    } satisfies Partial<UserProfileDoc>,
    { merge: true }
  );
};
