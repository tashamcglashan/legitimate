import React from "react";
import "./Footer.css";
import logo from "../assets/nobackgroundLogo.png"; // Replace with your actual logo file path

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Logo */}
        <div className="footer-logo">
          <img src={logo} alt="LegitiMate logo" />
        </div>

        {/* Middle: Links */}
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <a href="/privacy">Privacy Policy</a>
        </div>

        {/* Right: Copyright */}
        <div className="footer-copy">
          <p>&copy; 2025 LegitiMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
