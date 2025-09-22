import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LogoutButton from './LogoutButton.jsx';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">LegitiMate</Link>
      </div>
      <div className="navbar-links">
        <Link to="/signin">Login</Link>
        <Link to="/signup" className="signin-link">Sign up</Link>
        <LogoutButton className="logout-button" />
      </div>
    </nav>
  );
}
