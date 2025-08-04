import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileDropdownRef = useRef(null);
  const desktopMenuRef = useRef(null);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    const handleClickOutsideDesktop = (event) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        const allDetails = desktopMenuRef.current.querySelectorAll("details[open]");
        allDetails.forEach((detail) => detail.removeAttribute("open"));
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDesktop);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDesktop);
    };
  }, []);

  // Accordion behavior for desktop <details>
  useEffect(() => {
    const desktopMenu = desktopMenuRef.current;
    if (!desktopMenu) return;
    const allDetails = desktopMenu.querySelectorAll("details");

    const handleToggle = (e) => {
      allDetails.forEach((detail) => {
        if (detail !== e.target && detail.hasAttribute("open")) {
          detail.removeAttribute("open");
        }
      });
    };

    allDetails.forEach((detail) =>
      detail.addEventListener("toggle", handleToggle)
    );

    return () => {
      allDetails.forEach((detail) =>
        detail.removeEventListener("toggle", handleToggle)
      );
    };
  }, []);

  return (
    <header>
      <div className="navbar bg-primary text-white shadow-sm px-4 md:px-20">
        {/* Mobile: Left Side */}
        <div className="navbar-start">
          {/* Logo */}
          <Link to="/" className="btn btn-ghost text-white text-xl hover:bg-transparent hover:outline-none">
            All In One Solution
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden ml-auto" ref={mobileDropdownRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <ul className="absolute left-4 right-4 mt-2 z-50 bg-base-100 text-black shadow-md rounded-box p-4 space-y-2">
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li>
                <div className="font-semibold">Text Formatter</div>
                <ul className="ml-4 space-y-1">
                  <li><Link to="/Convert-Text" onClick={() => setMenuOpen(false)}>Convert Text</Link></li>
                  <li><Link to="/Compare-Text" onClick={() => setMenuOpen(false)}>Compare Text</Link></li>
                </ul>
              </li>
              <li>
                <div className="font-semibold">Code Translation</div>
                <ul className="ml-4 space-y-1">
                  <li><Link to="/HTML-Formatter" onClick={() => setMenuOpen(false)}>HTML Formatter</Link></li>
                  <li><Link to="/Css-Formatter" onClick={() => setMenuOpen(false)}>CSS Formatter</Link></li>
                  <li><Link to="/Js-Formatter" onClick={() => setMenuOpen(false)}>JS Formatter</Link></li>
                  <li><Link to="/Scss-Formatter" onClick={() => setMenuOpen(false)}>SCSS Formatter</Link></li>
                  <li><Link to="/Compare-Code" onClick={() => setMenuOpen(false)}>Compare Code</Link></li>
                </ul>
              </li>
              <li>
                <div className="font-semibold">Image Tools</div>
                <ul className="ml-4 space-y-1">
                  <li><Link to="/HeicToJpg" onClick={() => setMenuOpen(false)}>HEIC To JPG</Link></li>
                  <li><Link to="/JpgToWebp" onClick={() => setMenuOpen(false)}>JPG To WebP</Link></li>
                  <li><Link to="/Compress-Images" onClick={() => setMenuOpen(false)}>Compress Images</Link></li>
                </ul>
              </li>
            </ul>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="navbar-end hidden lg:flex" ref={desktopMenuRef}>
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/">Home</Link></li>

            <li>
              <details>
                <summary>Text Formatter</summary>
                <ul className="p-2 bg-base-100 text-black rounded-box z-20">
                  <li><Link to="/Convert-Text">Convert Text</Link></li>
                  <li><Link to="/Compare-Text">Compare Text</Link></li>
                </ul>
              </details>
            </li>

            <li>
              <details>
                <summary>Code Translation</summary>
                <ul className="p-2 bg-base-100 text-black rounded-box z-20">
                  <li><Link to="/HTML-Formatter">HTML Formatter</Link></li>
                  <li><Link to="/Css-Formatter">CSS Formatter</Link></li>
                  <li><Link to="/Js-Formatter">JS Formatter</Link></li>
                  <li><Link to="/Scss-Formatter">SCSS Formatter</Link></li>
                  <li><Link to="/Compare-Code">Compare Code</Link></li>
                </ul>
              </details>
            </li>

            <li>
              <details>
                <summary>Image Tools</summary>
                <ul className="p-2 bg-base-100 text-black rounded-box z-20">
                  <li><Link to="/HeicToJpg">HEIC To JPG</Link></li>
                  <li><Link to="/JpgToWebp">JPG To WebP</Link></li>
                  <li><Link to="/Compress-Images">Compress Images</Link></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
