import logo from "../../public/logo.jpg";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("#about");

  const getLinkClass = (tabName: string) => {
    const baseClass = "transition-colors duration-200 hover:text-primary py-1";
    const activeClass = "text-primary border-b-2 border-primary font-bold";
    const inactiveClass = "text-muted-foreground";

    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };


  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-border/60 backdrop-blur-md px-6 py-4 shadow-md">
      {/* Logo */}
      <a
        href="#"
        className="flex items-center gap-3 text-xl font-bold transition-colors duration-200 hover:text-primary"
      >
        <img
          src={logo}
          alt="Tzzmania Fitness Logo"
          className="h-14 w-14 rounded-lg object-cover transition-all duration-300 hover:scale-105"
        />
        <span className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          Tzzmania <span className="text-primary">Fitness</span>
        </span>
      </a>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 font-medium">
        <a
          href="#about"
          onClick={() => setActiveTab("about")}
          className={getLinkClass("about")}
        >
          About Us
        </a>
        <a
          href="#schedule"
          onClick={() => setActiveTab("schedule")}
          className={getLinkClass("schedule")}
        >
          Gym Schedule
        </a>
        <a
          href="#membership"
          onClick={() => setActiveTab("membership")}
          className={getLinkClass("membership")}
        >
          Memberships
        </a>
        <a
          href="#contact"
          onClick={() => setActiveTab("contact")}
          className={getLinkClass("contact")}
        >
          Contact Us
        </a>
      </div>

      {/* Button */}
      <button
        disabled
        className="rounded-full bg-primary px-5 py-2 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 "
      >
        Sign In
      </button>

      {/**/}
      <button
        className="md:hidden text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {menuOpen && (
        <div className="absolute left-0 top-full w-full bg-surface shadow-lg md:hidden bg-surface/90 backdrop-blur-md text-center">
          <a href="#about" onClick={() => setActiveTab("about")}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("about")}`}>
            About
          </a>

          <a href="#schedule" onClick={() => setActiveTab("schedule")}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("schedule")}`}>
            Schedule
          </a>

          <a href="#membership" onClick={() => setActiveTab("membership")}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("membership")}`}>
            Membership
          </a>

          <a href="#contact" onClick={() => setActiveTab("contact")}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("contact")}`}>
            Contact
          </a>
        </div>
      )}


    </nav>


  );
}

export default Navbar;