// src/pages/SignIn.jsx
import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase-config';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
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
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (!user.emailVerified) {
        setError('Please verify your email before logging in. Check your inbox or spam.');
        await signOut(auth);
        setLoading(false);
        return;
      }

      // 🔎 Fetch the user’s Firestore doc to decide where to send them
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data()?.setupComplete === true) {
        navigate('/profile');
      } else {
        navigate('/match-setup');
      }
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
          setError('Too many login attempts. Try again later or reset your password.');
          break;
        case 'auth/invalid-email':
          setError('The email format is invalid.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
