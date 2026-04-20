import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/todo2.png";

type NavbarProps = {
  title: string;
};

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar-enter flex items-center justify-between border-b border-main-300 bg-main-100 px-6 py-3 text-main-600 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-2xl bg-white px-2 py-1 shadow-md ring-1 ring-main-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <img
            src={logo}
            alt="Todo logo"
            className="h-12 w-auto max-w-none object-contain transition duration-300 hover:scale-105"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-main-700">
            {title}
          </h1>
          <p className="text-xs text-main-500">Organize your day with ease</p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={handleMenuToggle}
          aria-expanded={isMenuOpen}
          aria-label="Open navigation menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-main-300 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-main-50 hover:shadow-md"
        >
          <span className={`flex flex-col gap-1 transition duration-300 ${isMenuOpen ? "rotate-90" : ""}`}>
            <span className="h-1 w-1 rounded-full bg-main-700 transition duration-300" />
            <span className="h-1 w-1 rounded-full bg-main-700 transition duration-300" />
            <span className="h-1 w-1 rounded-full bg-main-700 transition duration-300" />
          </span>
        </button>

        {isMenuOpen && (
          <div className="navbar-menu-enter absolute right-0 top-14 z-20 flex w-48 flex-col rounded-2xl border border-main-200 bg-white p-2 shadow-xl">
            <Link
              to="/"
              onClick={handleMenuClose}
              className="rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={handleMenuClose}
              className="rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={handleMenuClose}
              className="rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700"
            >
              Contact
            </Link>
            <Link
              to="/login"
              onClick={handleMenuClose}
              className="rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={handleMenuClose}
              className="rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
