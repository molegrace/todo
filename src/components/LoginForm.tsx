import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";
import { getLoginErrorDetails, loginUser, type LoginField } from "../services/auth/loginService";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await loginUser(formData);
      navigate("/dashboard");
    } catch (error) {
      const details = getLoginErrorDetails(error);
      if (details.field) setFieldErrors({ [details.field]: details.message });
      else setFormError(details.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-main-50 via-white to-primary-100">
      <div className="auth-card-border w-80">
        <div className="auth-card-surface bg-white p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-main-700">
            Login
          </h2>

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

            <Button
              type="submit"
              label={isSubmitting ? "Logging in..." : "Login"}
              className="mt-2 w-full bg-main-400 text-white hover:bg-main-500"
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
    </div>
  );
};

export default LoginForm;
