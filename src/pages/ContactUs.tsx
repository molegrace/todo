import React, { useState } from "react";
import Input from "../components/Input";

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-main-50 via-white to-primary-100 px-6">
      <div className="auth-card-border w-full max-w-lg">
        <div className="auth-card-surface bg-white p-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-main-700">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input type="text" name="name" placeholder="Your Name " className="w-full" required />
            <Input type="email" name="email" placeholder="Your Email" className="w-full" required />

            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              onChange={handleChange}
              className="rounded-lg border border-main-300 px-4 py-2 text-main-700 outline-none focus:ring-2 focus:ring-main-400"
              required
            />

            <button
              type="submit"
              className="rounded-lg bg-main-400 py-2 text-white transition hover:bg-main-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
