import { useEffect, useState } from "react";
import { auth } from "./firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import PreviewProfiles from "./components/PreviewProfiles.jsx";
import SignUp from "./components/SignUp.jsx";
import MatchSetup from "./components/MatchSetup.jsx";
import BreakSection from "./components/BreakSection.jsx";
import JoinNowSection from "./components/JoinNowSection.jsx";
import Footer from "./components/Footer.jsx";
import About from "./components/About";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SignIn from "./components/SignIn.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthGate from "./components/AuthGate.jsx";
import VerifySelfieVideo from "./pages/VerifySelfieVideo.jsx";

function App() {
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Don’t redirect here if you're using AuthGate properly
      setCheckingUser(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingUser) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <>
      <Navbar />
      <Routes>
  {/* Public marketing */}
  <Route
    path="/"
    element={
      <>
        <Hero />
        <Features />
        <BreakSection />
        <PreviewProfiles />
        <JoinNowSection />
      </>
    }
  />
  <Route path="/signup" element={<SignUp />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/privacy" element={<PrivacyPolicy />} />

  {/* Selfie + Setup are NOT inside AuthGate */}
  <Route path="/verify-selfie" element={<VerifySelfieVideo />} />
  <Route path="/match-setup" element={<MatchSetup />} />

  {/* Fully protected */}
  <Route element={<AuthGate />}>
    <Route path="/profile" element={<ProfilePage />} />
    {/* add other fully protected routes here, e.g. /match */}
  </Route>
</Routes>

      <Footer />
    </>
  );
}

export default App;
