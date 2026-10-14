import React, { useState } from "react";
import logo from "../../public/logo.jpg";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { name: "About Us", hash: "/#about", key: "about" },
  { name: "Gym Schedule", hash: "/#schedule", key: "schedule" },
  { name: "Memberships", hash: "/#membership", key: "membership" },
  { name: "Contact Us", hash: "/#contact", key: "contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("index");
  const { userObj } = useAuth();

  const handleNavClick = (key: string) => {
    setActiveTab(key);
    setMenuOpen(false);
  };

  const getLinkClass = (key: string) => {
    const base = "transition-colors duration-200 hover:text-primary py-1";
    const active = "text-primary border-b-2 border-primary font-bold";
    const inactive = "text-muted-foreground hover:text-white";

    return `${base} ${activeTab === key ? active : inactive}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-lg text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <HashLink
          smooth
          to="/#"
          onClick={() => handleNavClick("index")}
          className="flex items-center gap-3 text-xl font-bold group"
        >
          <img
            src={logo}
            alt="Tzzmania Fitness Logo"
            className="h-11 w-11 rounded-lg object-cover border border-white/10 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="tracking-tight text-white transition-colors duration-300">
            Tzzmania <span className="text-primary">Fitness</span>
          </span>
        </HashLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <HashLink
              key={item.key}
              smooth
              to={item.hash}
              onClick={() => handleNavClick(item.key)}
              className={getLinkClass(item.key)}
            >
              {item.name}
            </HashLink>
          ))}
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center">
          <Link to={userObj ? "/dashboard" : "/login"}>
            <button className="rounded-full bg-primary hover:bg-secondary/90 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              {userObj ? "Dashboard" : "Log In"}
            </button>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          aria-label="Toggle Navigation Menu"
          aria-expanded={menuOpen}
          className="md:hidden p-2 rounded-lg text-text hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <XMarkIcon className="h-7 w-7 text-white" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute left-0 top-full w-full bg-surface/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2 text-center font-medium">
            {NAV_ITEMS.map((item) => (
              <HashLink
                key={item.key}
                smooth
                to={item.hash}
                onClick={() => handleNavClick(item.key)}
                className={`py-3 px-4 rounded-xl text-base transition-colors ${activeTab === item.key
                    ? "bg-primary/20 text-primary font-bold"
                    : "text-text hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item.name}
              </HashLink>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <Link
              to={userObj ? "/dashboard" : "/login"}
              onClick={() => setMenuOpen(false)}
            >
              <button className="w-full rounded-xl bg-primary hover:bg-secondary/90 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all active:scale-98">
                {userObj ? "Go to Dashboard" : "Log In"}
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;