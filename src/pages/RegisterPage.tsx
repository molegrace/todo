import React, { useState } from "react";
import Input from "../components/Input";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import {
  getRegisterErrorDetails,
  registerUser,
  type RegisterField,
} from "../services/auth/registerService";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await registerUser(formData);
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      const details = getRegisterErrorDetails(error);
      if (details.field) setFieldErrors({ [details.field]: details.message });
      else setFormError(details.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-main-50 via-white to-primary-100 px-4 py-10 sm:py-16">
      <div className="auth-card-border mx-auto w-full max-w-md">
        <div className="auth-card-surface bg-white p-6">
          <h2 className="mb-6 text-center text-3xl font-bold text-main-700">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {formError}
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              className="w-full"
              value={formData.name}
              onChange={handleChange}
              error={fieldErrors.name}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
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
              className="w-full"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={fieldErrors.confirmPassword}
              required
            />

            <Checkbox
              label="I agree to the terms and conditions"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              required
            />
            {fieldErrors.agree && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.agree}
              </p>
            )}

            <Button
              type="submit"
              label={isSubmitting ? "Creating..." : "Create Account"}
              className="w-full"
              disabled={isSubmitting}
            />

            <p className="mt-4 text-center text-sm text-main-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-main-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
