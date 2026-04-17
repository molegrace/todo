import React, { useState } from "react";
import Input from "../components/Input";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    con_password: "",
    agree: false,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-main-50 via-white to-primary-100 px-4 py-10 sm:py-16">
      <div className="auth-card-border mx-auto w-full max-w-md">
        <div className="auth-card-surface bg-white p-6">
          <h2 className="mb-6 text-center text-3xl font-bold text-main-700">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              className="w-full"
              value={formData.name}
              onChange={handleChange}
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
              required
            />

            <Input
              label="Confirm Password"
              name="con_password"
              type="password"
              placeholder="Confirm your password"
              className="w-full"
              value={formData.con_password}
              onChange={handleChange}
              required
            />

            <Checkbox
              label="I agree to the terms and conditions"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              required
            />

            <Button type="submit" label="Create Account" className="w-full" />

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
