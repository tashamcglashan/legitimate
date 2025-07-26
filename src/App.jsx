import { Routes, Route } from "react-router-dom";
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



function App() {
  return (
    <>
      <Navbar />
      <Routes>
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
        <Route path="/match-setup" element={<MatchSetup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
