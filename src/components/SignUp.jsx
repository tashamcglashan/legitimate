import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase-config';
import './SignUp.css';

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const getProgress = () => (step / 3) * 100;

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await sendEmailVerification(userCredential.user);
      alert("Verification email sent! Please check your inbox or spam.");
      nextStep(); // Move to "Thank You" screen
    } catch (error) {
      console.error("Signup Error:", error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("Email is already registered. Please log in instead.");
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
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep} disabled={!formData.email}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h2>Create a password</h2>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <button onClick={prevStep}>Back</button>
          <button onClick={handleSignUp} disabled={!formData.password}>
            Sign Up
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="form-step">
          <h2>Thanks, {formData.firstName}!</h2>
          <p>Please verify your email before continuing. Check spam!</p>
          <button onClick={() => navigate("/signin")}>Go to Sign In</button>
        </div>
      )}
    </div>
  );
}
