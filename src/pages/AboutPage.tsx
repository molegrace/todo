import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-main-50 flex items-center justify-center px-6">
      <div className="bg-main-100 border border-main-300 shadow rounded-2xl p-10 max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-main-600 mb-6">
          About Our Todo App
        </h2>

        <p className="text-main-500 mb-4">
          This application is designed to help individuals and teams
          stay organized and productive.
        </p>

        <p className="text-main-500 mb-4">
          With simple task management, priority tracking, and clean design,
          we ensure you focus more on achieving goals and less on managing chaos.
        </p>

        <p className="text-main-500">
          Built with React and Tailwind CSS for performance and simplicity.
        </p>
      </div>
    </div>
  );
};

export default About;
