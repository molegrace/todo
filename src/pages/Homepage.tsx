import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-main-50 to-main-100 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold text-main-600 mb-6">
        Organize Your Life with Ease
      </h1>

      <p className="text-lg text-main-600 max-w-2xl mb-8">
        Our Todo App helps you manage daily tasks, boost productivity,
        and stay focused on what truly matters.
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-primary-300 text-white px-6 py-3 rounded-lg hover:bg-primary-500 transition"
        >
          Get Started
        </Link>

        <Link
          to="/about"
          className="border border-primary-300 text-primary-500 px-6 py-3 rounded-lg hover:bg-primary-200 transition"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Home;
