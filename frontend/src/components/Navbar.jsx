import { useState } from "react";
import { FaGithub, FaLinkedin, FaBars, FaTimes, FaUser, FaBriefcase, FaGraduationCap, FaTrophy, FaProjectDiagram, FaEnvelope } from "react-icons/fa";

const navLinks = [
  { href: "#home", label: "Home", icon: <FaUser className="inline mr-1" /> },
  { href: "#about", label: "About", icon: <FaUser className="inline mr-1" /> },
  { href: "#education", label: "Education", icon: <FaGraduationCap className="inline mr-1" /> },
  { href: "#experience", label: "Experience", icon: <FaBriefcase className="inline mr-1" /> },
  { href: "#achievements", label: "Achievements", icon: <FaTrophy className="inline mr-1" /> },
  { href: "#projects", label: "Projects", icon: <FaProjectDiagram className="inline mr-1" /> },
  { href: "#contact", label: "Contact", icon: <FaEnvelope className="inline mr-1" /> },
];

const Navbar = ({ name = "Gabrial Deora" }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-lg border-b border-blue-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-700 tracking-tight cursor-pointer">
          {name}
        </div>
        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.href} className="group">
              <a
                href={link.href}
                className="relative text-gray-700 font-semibold flex items-center transition hover:text-blue-600 px-2 py-1"
              >
                {link.icon}
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>
        {/* Socials */}
        <div className="hidden md:flex mt-3 items-center space-x-4">
          <a href="https://github.com/Gabrial-8467" target="_blank" className="text-gray-700 hover:text-blue-700 text-xl transition">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/gabrial-deora" target="_blank" className="text-blue-700 hover:text-blue-900 text-xl transition">
            <FaLinkedin />
          </a>
        </div>
        {/* Hamburger */}
        <button
          className="md:hidden text-xl sm:text-2xl text-blue-700 focus:outline-none p-1"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-b border-blue-100 px-4 sm:px-6 pb-4">
          <ul className="flex flex-col space-y-3 sm:space-y-4 mt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center text-gray-700 font-semibold transition hover:text-blue-600 px-2 py-2 text-sm sm:text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex space-x-4 mt-4 sm:mt-4 pt-2 border-t border-gray-200">
              <a href="https://github.com/Gabrial-8467" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-700 text-lg sm:text-xl transition">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/gabrial-deora" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-lg sm:text-xl transition">
                <FaLinkedin />
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 