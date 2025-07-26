import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import './SignUp.css';

export default function SignUp() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []); 
const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const getProgress = () => {
    return (step / 2) * 100; // 2 steps for now
  };

  const handleEmailSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        "TemporaryPassword123!" // Temporary placeholder password
      );
  
      await sendEmailVerification(userCredential.user);
      alert("Verification email sent! Please check your inbox or spam before continuing.");
  
      nextStep(); // Optional: move to next step in form
    } catch (error) {
      console.error("Error sending verification email:", error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please log in instead.");
      } else {
        alert("Something went wrong: " + error.message);
      }
    }
  };
  

  return (
    <div className="signup-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
      </div>

      {step === 1 && (
        <div className="form-step">
          <h2>What's your first name?</h2>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
          <button onClick={nextStep} disabled={!formData.firstName}>Next</button>
        </div>
      )}

{step === 2 && (
  <div className="form-step">
    <h2>What's your email?</h2>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="you@example.com"
    />
    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={handleEmailSubmit} disabled={!formData.email}>
        Send Verification
      </button>
    </div>
  </div>
)}
{step === 3 && (
  <div className="form-step">
    <h2>Thanks, {formData.firstName}!</h2>
    <p>Your email is verified. You're ready to begin.</p>
    <button onClick={() => navigate("/match-setup")}>Continue</button>
  </div>
)}


    </div>
  );
}
