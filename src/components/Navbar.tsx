import React from "react";
import { Link } from "react-router-dom";
type NavbarProps = {
  title: string;
};

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="bg-main-200 border border-main-300 shadow text-main-500 px-6 py-3 flex justify-between">
      <h1 className="font-semibold text-primary-500">{title}</h1>
      <div className="flex gap-4" >
      <Link to="/" className="hover:text-primary-600">Home</Link>
      <Link to="/about" className="hover:text-primary-600">About</Link>
      <Link to="/contact" className="hover:text-primary-600">Contact</Link>
      <Link to="/login" className="hover:text-primary-600">Login</Link>
      <Link to="/register" className="hover:text-primary-600">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
