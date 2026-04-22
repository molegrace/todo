import { FirebaseError } from "firebase/app";
import { logoutFirebase } from "../../api/firebaseAuthApi";

export const logoutUser = async (): Promise<void> => {
  await logoutFirebase();
};

export const getLogoutErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Failed to log out. Please try again.";
    }
  }

  return "Failed to log out. Please try again.";
};

