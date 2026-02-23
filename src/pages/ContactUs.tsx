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
    <div className="min-h-screen  flex items-center justify-center px-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-green-700  mb-6 text-center">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         
         <Input type="text" name="name" placeholder="Your Name " className="w-full" required/>
         <Input type="email" name="email" placeholder="Your Email" className="w-full" required />

          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
