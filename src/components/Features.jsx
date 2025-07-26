import React from "react";
import "./Features.css";

export default function Features() {
  const features = [
    {
      icon: "📸",
      title: "Selfie Verification",
      description: "Every profile starts with a real-time selfie check to prove they're real.",
    },
    {
      icon: "🔍",
      title: "Background Checked",
      description: "We run basic background checks so you're not dating in the dark.",
    },
    {
      icon: "🤖",
      title: "Bot + Scam Detection",
      description: "AI-powered filters stop bots, fake accounts, and scammers.",
    },
    {
      icon: "🎯",
      title: "Value-Based Filters",
      description: "Match by lifestyle, family goals, faith, and more — not just swipes.",
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-heading">Why LegitiMate?</h2>
      <div className="features-grid">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
