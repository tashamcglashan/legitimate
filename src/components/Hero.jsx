import React from "react";
import heroImage from "../assets/undraw_online-dating_w9n9.svg"; // Make sure the path and name match
import "./Hero.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">Real People. Real Proof.</h1>
          <p className="hero-subtitle">
            Selfie verification and scam protection built into dating.
          </p>
          <button className="hero-button" onClick={() => navigate("/signup")}>Join Now</button>
        </div>
        <div className="hero-right">
          <img src={heroImage} alt="Online dating illustration" className="hero-img" />
        </div>
      </div>
    </section>
  );
}
