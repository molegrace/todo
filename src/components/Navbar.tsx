import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/todo2.png";
import { getLogoutErrorMessage, logoutUser } from "../services/auth/logoutService";
import { useAuth } from "../context/AuthContext";

type NavbarProps = {
  title: string;
};

type MenuLinkItem = {
  label: string;
  to: string;
};

type MenuActionItem = {
  label: string;
  onClick: () => void | Promise<void>;
};

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAuthenticated = !initializing && Boolean(user);

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setLogoutError(null);
    setIsLoggingOut(true);
    try {
      await logoutUser();
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      setLogoutError(getLogoutErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = (
    [
      ...(isAuthenticated ? [{ label: "Dashboard", to: "/dashboard" }] : []),
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      ...(isAuthenticated
        ? [{ label: "Logout", onClick: handleLogout }]
        : [
            { label: "Login", to: "/login" },
            { label: "Sign Up", to: "/register" },
          ]),
    ] as Array<MenuLinkItem | MenuActionItem>
  );

  const visibleMenuItems = menuItems.filter((item) => {
    if (!("to" in item)) return true;
    if (item.to === "/dashboard") return location.pathname === "/dashboard" ? false : true;
    return item.to !== location.pathname;
  });

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
          <h1 className="text-lg font-bold tracking-tight text-blue-700">
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
            {logoutError && (
              <div className="px-3 py-2 text-xs text-red-700" role="alert">
                {logoutError}
              </div>
            )}
            {visibleMenuItems.map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleMenuClose}
                  className="rounded-xl px-3 py-2 text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  disabled={isLoggingOut}
                  className="rounded-xl px-3 py-2 text-left text-sm font-medium transition duration-200 hover:translate-x-1 hover:bg-main-100 hover:text-main-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
