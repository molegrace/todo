import React from "react";
import { Link } from "react-router-dom";
import picture3 from "../assets/picture3.jpg";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-main-50 via-white to-main-100 px-6 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span className="about-badge home-reveal inline-flex cursor-default rounded-full bg-main-100 px-4 py-1 text-sm font-medium text-main-600 ring-1 ring-main-200">
            Plan smarter, finish faster
          </span>

          <h1 className="home-reveal home-reveal-delay-1 mt-6 text-5xl font-bold text-main-600 sm:text-4xl">
            Organize Your Life with Ease
          </h1>

          <p className="home-reveal home-reveal-delay-2 mx-auto mt-6 max-w-2xl text-lg text-main-500 md:mx-0">
            Our Todo App helps you manage daily tasks, boost productivity,
            and stay focused on what truly matters.
          </p>

          <div className="home-reveal home-reveal-delay-3 mt-8 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <Link
              to="/register"
              className="rounded-lg bg-main-500 px-6 py-3 text-white transition hover:bg-main-600"
            >
              Get Started
            </Link>

            <Link
              to="/about"
              className="rounded-lg border border-main-300 px-6 py-3 text-main-600 transition hover:bg-main-50"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="home-reveal home-reveal-delay-4 relative mx-auto w-full max-w-md">
          <div className="home-glow-pulse absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-main-200/60 to-primary-200/70 blur-2xl" />
          <div className="home-image-float relative overflow-hidden rounded-[2rem] border border-main-200 bg-white p-3 shadow-2xl">
            <img
              src={picture3}
              alt="Productivity illustration"
              className="h-[420px] w-full rounded-[1.5rem] object-cover transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
