import { FirebaseError } from "firebase/app";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
  uid?: string | null;
};

export type ContactMessageDoc = {
  name: string;
  email: string;
  message: string;
  uid: string | null;
  createdAt: string;
  status: "new";
};

export const createContactMessage = async (
  input: ContactMessageInput
): Promise<string> => {
  const docToCreate: ContactMessageDoc = {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    uid: input.uid ?? null,
    createdAt: new Date().toISOString(),
    status: "new",
  };

  const docRef = await addDoc(collection(db, "contactMessages"), docToCreate);
  return docRef.id;
};

export const getContactMessageErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return "Contact form is not configured yet (permission denied). Ask the admin to update Firestore rules.";
      case "unavailable":
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Failed to send message. Please try again.";
    }
  }

  return "Failed to send message. Please try again.";
};
