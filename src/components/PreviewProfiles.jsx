import React from "react";
import "./PreviewProfiles.css";
import verifiedIcon from "../assets/verified_32.32.png";


export default function PreviewProfiles() {
  const profiles = [
    {
      name: "Alicia M.",
      age: 32,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      tagline: "Faith, family, and fitness 💪",
    },
    {
      name: "Marcus T.",
      age: 36,
      image: "https://randomuser.me/api/portraits/men/34.jpg",
      tagline: "Dog dad. Coffee lover.",
    },
    {
      name: "Sara D.",
      age: 29,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      tagline: "Looking for something real.",
    },
    {
      name: "James R.",
      age: 41,
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      tagline: "No games. Just honesty & laughter.",
    },
  ];

  return (
    <section className="preview-section">
      <h2 className="preview-heading">Meet Verified Members</h2>
      <div className="preview-grid">
      {profiles.map((profile, index) => (
  <div className="profile-card" key={index}>
    <div className="image-wrapper">
      <img src={profile.image} alt={profile.name} className="profile-image" />
      <img src={verifiedIcon} alt="Verified Badge" className="verified-badge" />
    </div>
    <h3>{profile.name}, {profile.age}</h3>
    <p>{profile.tagline.replace(" ✅", "")}</p>
  </div>
))}

      </div>
    </section>
  );
}
