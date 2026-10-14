import React, { useState, useEffect } from "react";
import logo from "../../public/logo.jpg";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { name: "About", hash: "/#about", key: "about" },
  { name: "Schedule", hash: "/#schedule", key: "schedule" },
  { name: "Memberships", hash: "/#membership", key: "membership" },
  { name: "Contact", hash: "/#contact", key: "contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("index");
  const [scrolled, setScrolled] = useState(false);
  const { userObj } = useAuth();

  // Detect scroll to adjust backdrop intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (key: string) => {
    setActiveTab(key);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full transition-all duration-300 border ${scrolled
            ? "bg-surface/80 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/40 py-2.5 px-4 sm:px-6"
            : "bg-surface/40 backdrop-blur-md border-white/10 py-3.5 px-5 sm:px-7"
          }`}
      >
        <nav className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <HashLink
            smooth
            to="/#"
            onClick={() => handleNavClick("index")}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Tzzmania Fitness Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-primary/40 transition-transform duration-300 group-hover:scale-105 group-hover:ring-primary"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-surface" />
            </div>
            <span className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
              Tzzmania <span className="text-primary">Fitness</span>
            </span>
          </HashLink>

          {/* Desktop Central Capsule Links */}
          <div className="hidden md:flex items-center gap-1 bg-background/50 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <HashLink
                  key={item.key}
                  smooth
                  to={item.hash}
                  onClick={() => handleNavClick(item.key)}
                  className={`relative px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full ${isActive
                      ? "text-white bg-primary shadow-lg shadow-primary/30"
                      : "text-text/70 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.name}
                </HashLink>
              );
            })}
          </div>

          {/* Desktop Right Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {userObj ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-white/10 hover:bg-primary text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
              >
                <UserCircleIcon className="h-4 w-4 text-secondary" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-secondary/30"
              >
                <span>Log In</span>
                <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            aria-label="Toggle Mobile Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-primary" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="md:hidden pt-3 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-surface/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <HashLink
                    key={item.key}
                    smooth
                    to={item.hash}
                    onClick={() => handleNavClick(item.key)}
                    className={`flex items-center justify-between py-3 px-5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-text/80 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span>{item.name}</span>
                    <ChevronRightIcon className="h-4 w-4 opacity-50" />
                  </HashLink>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10">
              <Link
                to={userObj ? "/dashboard" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 active:scale-98 transition-all"
              >
                {userObj ? (
                  <>
                    <UserCircleIcon className="h-5 w-5" />
                    <span>Go to Dashboard</span>
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Log In to Account</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;