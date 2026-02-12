import React from "react";

type NavbarProps = {
  title: string;
};

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="bg-green-400 text-white px-6 py-3 flex justify-between">
      <h1 className="font-semibold">{title}</h1>
      <div className="flex gap-4 " >
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Login</a>
        <a href="register">Sign Up</a>
      </div>
    </nav>
  );
};

export default Navbar;
