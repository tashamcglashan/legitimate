import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
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
      alert('Please enter your email first.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert('Password reset email sent! Please check your inbox or spam.');
    } catch (error) {
      console.error('Password Reset Error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          alert('No account found with that email.');
          break;
        case 'auth/invalid-email':
          alert('Invalid email format.');
          break;
        default:
          alert('Failed to send password reset email. Please try again.');
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        setError(
          'Please verify your email before logging in. Check your inbox or spam.'
        );
        await auth.signOut(); // Sign them out if not verified
        return;
      }

      navigate('/match-setup');
    } catch (err) {
      console.error('Sign-in error:', err);
      switch (err.code) {
        case 'auth/wrong-password':
          setError("Incorrect password. Try again or click 'Forgot Password'.");
          break;
        case 'auth/user-not-found':
          setError('No account found with that email.');
          break;
        case 'auth/too-many-requests':
          setError(
            'Too many login attempts. Try again later or reset your password.'
          );
          break;
        case 'auth/invalid-email':
          setError('The email format is invalid.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
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
