import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";
import {
  getLoginErrorDetails,
  loginUser,
  resendVerificationEmail,
  type LoginField,
} from "../services/auth/loginService";
import todoImage from "../assets/todo_image.jpg";

type LocationState = {
  registered?: boolean;
  email?: string;
  emailVerificationSent?: boolean;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const [formData, setFormData] = useState({
    email: locationState?.email || "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    locationState?.emailVerificationSent
      ? `Account created! We've sent a verification link to ${
          locationState.email || "your email"
        }. Please verify your email before logging in.`
      : locationState?.registered
      ? "Account created! Please verify your email before logging in."
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setInfoMessage(null);
    setFieldErrors({});
    setIsUnverified(false);
    setIsSubmitting(true);

    try {
      await loginUser(formData);
      navigate("/dashboard");
    } catch (error) {
      const details = getLoginErrorDetails(error);
      if (details.field) {
        setFieldErrors({ [details.field]: details.message });
      } else {
        setFormError(details.message);
      }
      if (details.isUnverified) {
        setIsUnverified(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (isResending) return;
    setFormError(null);
    setInfoMessage(null);
    setIsResending(true);

    try {
      await resendVerificationEmail(formData);
      setInfoMessage(
        "Verification email resent! Please check your email to verify your account."
      );
    } catch (error) {
      const details = getLoginErrorDetails(error);
      setFormError(details.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-main-50 via-white to-primary-100 px-4 py-10">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-main-900/10 md:grid-cols-2">
        <div className="flex items-center p-8 sm:p-10">
          <div className="w-full">
            <h2 className="mb-6 text-center text-2xl font-bold text-main-700">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {infoMessage && (
                <div
                  className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
                  role="status"
                >
                  {infoMessage}
                </div>
              )}

              {formError && (
                <div
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {formError}
                  {isUnverified && (
                    <div className="mt-2 text-xs">
                      <button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="font-semibold text-blue-700 hover:underline disabled:opacity-50"
                      >
                        {isResending
                          ? "Resending verification email..."
                          : "Resend verification email"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                variant="underline"
                className="w-full"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                variant="underline"
                passwordToggle
                className="w-full"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                required
              />

              <Button
                type="submit"
                label={isSubmitting ? "Logging in..." : "Login"}
                className="mt-2 w-full"
                disabled={isSubmitting}
              />
            </form>

            <p className="mt-4 text-center text-sm text-main-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-main-600 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="min-h-64 md:min-h-full">
          <img
            src={todoImage}
            alt="To-do list stationery"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
