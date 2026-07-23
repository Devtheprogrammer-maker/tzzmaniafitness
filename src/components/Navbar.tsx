import logo from "../../public/logo.jpg";
import { useState } from "react";
import { Link } from 'react-router-dom';
// Import HashLink from the new package
import { HashLink } from 'react-router-hash-link';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Initialize without the '#' character
  const [activeTab, setActiveTab] = useState("index");

  const getLinkClass = (tabName: string) => {
    const baseClass = "transition-colors duration-200 hover:text-primary py-1";
    const activeClass = "text-primary border-b-2 border-primary font-bold";
    const inactiveClass = "text-muted-foreground";

    return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-border/60 backdrop-blur-md px-6 py-4 shadow-md text-white">
      {/* Logo */}
      <HashLink
        smooth
        to="/#"
        onClick={() => setActiveTab("index")}
        className={`flex items-center gap-3 text-xl font-bold transition-colors duration-200 hover:text-primary ${getLinkClass("index")}`}
      >
        <img
          src={logo}
          alt="Tzzmania Fitness Logo"
          className="h-14 w-14 rounded-lg object-cover transition-all duration-300 hover:scale-105"
        />
        <span className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          Tzzmania <span className="text-primary">Fitness</span>
        </span>
      </HashLink>

      {/* Navigation Links - 3. Use HashLink with smooth scrolling behavior */}
      <div className="hidden md:flex items-center gap-8 font-medium">
        <HashLink
          smooth
          to="/#about"
          onClick={() => setActiveTab("about")}
          className={getLinkClass("about")}
        >
          About Us
        </HashLink>
        <HashLink
          smooth
          to="/#schedule"
          onClick={() => setActiveTab("schedule")}
          className={getLinkClass("schedule")}
        >
          Gym Schedule
        </HashLink>
        <HashLink
          smooth
          to="/#membership"
          onClick={() => setActiveTab("membership")}
          className={getLinkClass("membership")}
        >
          Memberships
        </HashLink>
        <HashLink
          smooth
          to="/#contact"
          onClick={() => setActiveTab("contact")}
          className={getLinkClass("contact")}
        >
          Contact Us
        </HashLink>
      </div>

      {/* Button */}
      <Link to="/signup">
        <button
          className="rounded-full bg-primary px-5 py-2 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
        >
          Sign In
        </button>
      </Link>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Dropdown - 4. Apply smooth HashLinks here too */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full bg-surface shadow-lg md:hidden bg-surface/90 backdrop-blur-md text-center">
          <HashLink
            smooth
            to="/#about"
            onClick={() => { setActiveTab("about"); setMenuOpen(false); }}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("about")}`}
          >
            About
          </HashLink>

          <HashLink
            smooth
            to="/#schedule"
            onClick={() => { setActiveTab("schedule"); setMenuOpen(false); }}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("schedule")}`}
          >
            Schedule
          </HashLink>

          <HashLink
            smooth
            to="/#membership"
            onClick={() => { setActiveTab("membership"); setMenuOpen(false); }}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("membership")}`}
          >
            Membership
          </HashLink>

          <HashLink
            smooth
            to="/#contact"
            onClick={() => { setActiveTab("contact"); setMenuOpen(false); }}
            className={`block px-6 py-4 hover:bg-primary hover:text-white ${getLinkClass("contact")}`}
          >
            Contact
          </HashLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
