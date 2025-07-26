import React from "react";
import feelingImage from "../assets/undraw_intense-feeling_4i8u.svg";
import "./JoinNowSection.css";
import {useNavigate} from "react-router-dom";



export default function JoinNowSection() {
    const navigate = useNavigate();
  return (
    <section className="joinnow-section">
      <div className="joinnow-container">
        <div className="joinnow-text">
          <h2>Join the App Built on Proof, Not Promises</h2>
          <p>
            If you're tired of swiping through bots, ghosters, and fakes — LegitiMate is for you.
            Sign up free and start connecting with people who are real, verified, and ready.
          </p>
          <button className="joinnow-button" onClick={() => navigate("/signup")}>Join Now</button>
        </div>
        <div className="joinnow-image">
          <img src={feelingImage} alt="Emotional connection" />
        </div>
      </div>
    </section>
  );
}
