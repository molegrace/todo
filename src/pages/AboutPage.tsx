import React from "react";
import picture2 from "../assets/picture2.jpg";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-main-50 via-white to-primary-100 px-6 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="about-reveal relative mx-auto w-full max-w-md md:order-2">
          <div className="about-glow-pulse absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-main-200/60 to-primary-200/70 blur-2xl" />
          <div className="about-image-float relative overflow-hidden rounded-[2rem] border border-main-200 bg-white p-3 shadow-2xl">
            <img
              src={picture2}
              alt="Todo planning workspace"
              className="h-[420px] w-full rounded-[1.5rem] object-cover transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        <div className="about-card-border">
          <div className="about-card-surface bg-white/90 p-8 backdrop-blur-sm md:p-10">
            <span className="about-badge about-reveal inline-flex cursor-default rounded-full bg-main-100 px-4 py-1 text-sm font-medium text-main-600 ring-1 ring-main-200">
              Simple, clear, productive
            </span>

            <h2 className="about-reveal about-reveal-delay-1 mt-6 text-3xl font-bold whitespace-nowrap text-main-600 sm:text-4xl lg:text-[3.2rem]">
              About Our Todo App
            </h2>

            <p className="about-reveal about-reveal-delay-2 mt-6 text-lg leading-8 text-main-500">
              This application is designed to help individuals and teams
              stay organized and productive.
            </p>

            <p className="about-reveal about-reveal-delay-3 mt-4 text-lg leading-8 text-main-600">
              With simple task management, priority tracking, and clean design,
              we ensure you focus more on achieving goals and less on managing chaos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
