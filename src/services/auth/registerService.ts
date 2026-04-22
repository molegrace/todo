import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";
import { registerWithEmailPassword, setUserDisplayName } from "../../api/firebaseAuthApi";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

export type RegisterResult = {
  user: User;
};

export type RegisterField =
  | "name"
  | "email"
  | "password"
  | "confirmPassword"
  | "agree";

export class RegisterValidationError extends Error {
  field: RegisterField;

  constructor(field: RegisterField, message: string) {
    super(message);
    this.name = "RegisterValidationError";
    this.field = field;
  }
}

const assertValidRegisterInput = (input: RegisterInput) => {
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();

  if (!trimmedName) throw new RegisterValidationError("name", "Name is required.");
  if (!trimmedEmail) throw new RegisterValidationError("email", "Email is required.");
  if (!input.password) throw new RegisterValidationError("password", "Password is required.");
  if (input.password.length < 6) {
    throw new RegisterValidationError("password", "Password must be at least 6 characters.");
  }
  if (input.confirmPassword !== input.password) {
    throw new RegisterValidationError("confirmPassword", "Passwords do not match.");
  }
  if (!input.agree) {
    throw new RegisterValidationError("agree", "You must agree to the terms to continue.");
  }
};

export const registerUser = async (input: RegisterInput): Promise<RegisterResult> => {
  assertValidRegisterInput(input);

  const credential = await registerWithEmailPassword(
    input.email.trim(),
    input.password
  );

  const trimmedName = input.name.trim();
  if (trimmedName) {
    await setUserDisplayName(credential.user, trimmedName);
  }

  return { user: credential.user };
};

export type RegisterErrorDetails = {
  field?: RegisterField;
  message: string;
};

export const getRegisterErrorDetails = (error: unknown): RegisterErrorDetails => {
  if (error instanceof RegisterValidationError) {
    return { field: error.field, message: error.message };
  }

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return { field: "email", message: "That email is already in use." };
      case "auth/invalid-email":
        return { field: "email", message: "Please enter a valid email address." };
      case "auth/weak-password":
        return { field: "password", message: "Please choose a stronger password." };
      case "auth/network-request-failed":
        return { message: "Network error. Check your connection and try again." };
      case "auth/too-many-requests":
        return { message: "Too many attempts. Please try again later." };
      case "auth/operation-not-allowed":
        return { message: "Email/password sign-in is disabled for this project." };
      case "auth/configuration-not-found":
        return {
          message:
            "Firebase Auth is not configured for this project. Enable Authentication (Email/Password) in the Firebase console and verify your Firebase config values.",
        };
      case "auth/invalid-api-key":
      case "auth/app-not-authorized":
        return {
          message:
            "This app isn't authorized to use the provided Firebase API key. Verify your Firebase config and API key restrictions (HTTP referrers).",
        };
      default:
        return { message: "Failed to create your account. Please try again." };
    }
  }

  return { message: "Something went wrong. Please try again." };
};

export const getRegisterErrorMessage = (error: unknown): string =>
  getRegisterErrorDetails(error).message;
