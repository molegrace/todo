import React, { useEffect, useMemo, useState } from "react";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { useAuth } from "../context/AuthContext";
import {
  createContactMessage,
  getContactMessageErrorMessage,
} from "../api/firestoreContactMessagesApi";
import { Link, useNavigate } from "react-router-dom";

const Contact: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    { type: "success" | "error"; message: string } | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setForm((prev) => (prev.email ? prev : { ...prev, email: user.email ?? "" }));
  }, [user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validationError = useMemo(() => {
    if (!user) return "Please log in to send a message.";
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.email.includes("@")) return "Please enter a valid email.";
    if (!form.message.trim()) return "Please enter your message.";
    if (form.message.trim().length < 10) return "Message should be at least 10 characters.";
    return null;
  }, [form.email, form.message, form.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setStatus(undefined);

    if (validationError) {
      setStatus({ type: "error", message: validationError });
      if (!user) navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        name: form.name,
        email: form.email,
        message: form.message,
        uid: user?.uid ?? null,
      });
      setStatus({ type: "success", message: "Thanks! Your message was sent to the admin." });
      setForm((prev) => ({ ...prev, message: "" }));
    } catch (error) {
      if (import.meta.env.DEV) {
        // Helpful while developing: show the actual Firebase/Firestore error in console.
        console.error("Failed to send contact message:", error);
      }
      setStatus({ type: "error", message: getContactMessageErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-main-50 via-white to-primary-100 px-6">
      <div className="auth-card-border w-full max-w-lg">
        <div className="auth-card-surface bg-white p-8">
          <h2 className="mb-6 text-center text-3xl font-bold text-main-700">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status && <Alert message={status.message} type={status.type} />}
            {!user && !status && (
              <Alert
                type="error"
                message="You must be logged in to send a message. Please log in, then come back to Contact Us."
              />
            )}

            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full"
              value={form.name}
              onChange={handleChange}
              disabled={isSubmitting || !user}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full"
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting || !user}
              required
            />

            <Textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              disabled={isSubmitting || !user}
              className="rounded-lg border border-main-300 px-4 py-2 text-main-700 outline-none focus:ring-2 focus:ring-main-400"
              required
            />

            <Button
              type="submit"
              label={isSubmitting ? "Sending..." : "Send Message"}
              className="rounded-lg bg-main-400 py-2 text-white transition hover:bg-main-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting || !user}
            />

            {!user && (
              <p className="text-center text-sm text-main-600">
                <Link to="/login" className="font-medium text-main-600 hover:underline">
                  Go to login
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
