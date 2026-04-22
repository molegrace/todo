import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";
import { loginWithEmailPassword } from "../../api/firebaseAuthApi";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  user: User;
};

export type LoginField = "email" | "password";

export class LoginValidationError extends Error {
  field: LoginField;

  constructor(field: LoginField, message: string) {
    super(message);
    this.name = "LoginValidationError";
    this.field = field;
  }
}

const assertValidLoginInput = (input: LoginInput) => {
  const trimmedEmail = input.email.trim();

  if (!trimmedEmail) throw new LoginValidationError("email", "Email is required.");
  if (!input.password) throw new LoginValidationError("password", "Password is required.");
};

export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
  assertValidLoginInput(input);

  const credential = await loginWithEmailPassword(
    input.email.trim(),
    input.password
  );

  return { user: credential.user };
};

export type LoginErrorDetails = {
  field?: LoginField;
  message: string;
};

export const getLoginErrorDetails = (error: unknown): LoginErrorDetails => {
  if (error instanceof LoginValidationError) {
    return { field: error.field, message: error.message };
  }

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return { field: "email", message: "Please enter a valid email address." };
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return { message: "Invalid email or password." };
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
        return { message: "Failed to log in. Please try again." };
    }
  }

  return { message: "Something went wrong. Please try again." };
};

