import React, { useState } from "react";
import Input from "../components/Input";
import Select from "../components/Dropdown";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    con_password: "",
    role: "",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full  max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

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

          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { label: "Select role", value: "" },
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
            required
          />

          <Checkbox
            label="I agree to the terms and conditions"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            required
          />

          <Button type="submit" label="Create Account" />

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
