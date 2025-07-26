import React from "react";
import togetherImage from "../assets/undraw_everywhere-together_c4di.svg";
import "./BreakSection.css";

export default function BreakSection() {
  return (
    <section className="break-section">
      <div className="break-container">
        <img src={togetherImage} alt="People connecting" className="break-img" />
        <div className="break-text">
          <h2>Built for Real Connection</h2>
          <p>
            No more endless swiping. Just verified people looking for meaningful relationships.
          </p>
        </div>
      </div>
    </section>
  );
}
