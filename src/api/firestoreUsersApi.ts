import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";

export type UserProfileDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
};

export const ensureUserProfileDoc = async (user: User): Promise<void> => {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  const now = new Date().toISOString();
  const base: Omit<UserProfileDoc, "createdAt"> = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
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

