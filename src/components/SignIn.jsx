import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail  } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';


export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert("Please enter your email first.");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error(error);
      alert("Failed to send password reset email.");
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/match-setup'); // redirect to next page after login
    } catch (err) {
      setError('Invalid email or password. Try again.');
    }
  };

  return (
    <div className="signin-page">
      <h2>Sign In to LegitiMate</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <p className="forgot-password" onClick={handleForgotPassword}>
  Forgot your password?
</p>

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
