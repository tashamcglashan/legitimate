// src/pages/MatchSetup.jsx
import React, { useState } from 'react';
import './MatchSetup.css';
import { useNavigate } from 'react-router-dom';

export default function MatchSetup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    preference: '',
    familyPlans: '',
    denomination: '',
    activities: [],
    education: '',
  });

  const totalSteps = 5;

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
    return (step / totalSteps) * 100;
  };

  return (
    <div className="match-setup-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
      </div>

      {/* Question content will go here next */}
      {step === 1 && (
  <div className="form-step">
    <h2>What is your sex?</h2>
    <div className="option-buttons">
      <button
        className={formData.gender === "Male" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, gender: "Male" })}
      >
        Male
      </button>
      <button
        className={formData.gender === "Female" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, gender: "Female" })}
      >
        Female
      </button>
      <button
        className={formData.gender === "Non-binary" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, gender: "Non-binary" })}
      >
        Non-binary
      </button>
      <button
        className={formData.gender === "Prefer not to say" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, gender: "Prefer not to say" })}
      >
        Prefer not to say
      </button>
    </div>

    <div className="step-buttons">
      <button onClick={nextStep} disabled={!formData.gender}>Next</button>
    </div>
  </div>
)}
  {step === 2 && (
  <div className="form-step">
    <h2> Who are you looking for?</h2>
    <div className="option-buttons">
      <button
        className={formData.preference === "Male" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, preference: "Male" })}
      >
        Male
      </button>
      <button
        className={formData.preference === "Female" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, preference: "Female" })}
      >
        Female
      </button>
      <button
        className={formData.preference === "Open to all" ? "selected" : ""}
        onClick={() => setFormData({ ...formData, preference: "Open to all" })}
      >
        Open to all
      </button>
    </div>

    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep} disabled={!formData.preference}>Next</button>
    </div>
  </div>
)}

{step === 3 && (
  <div className="form-step">
    <h2>Do you have any family plans?</h2>
    <div className="option-buttons">
      <button
        className={formData.familyPlans === `I want kids someday` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, familyPlans: `I want kids someday` })}
      >
        I want kids someday
      </button>
      <button
        className={formData.familyPlans === `I’m actively planning for a family` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, familyPlans: `I’m actively planning for a family` })}
      >
        I’m actively planning for a family
      </button>
      <button
        className={formData.familyPlans === `I already have kids — want more` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, familyPlans: `I already have kids — want more` })}
      >
        I already have kids — want more
      </button>
      <button
        className={formData.familyPlans === `I already have kids — don’t want more` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, familyPlans: `I already have kids — don’t want more` })}
      >
        I already have kids — don’t want more
      </button>
      <button
        className={formData.familyPlans === `I’m not planning for kids` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, familyPlans: `I’m not planning for kids` })}
      >
        I’m not planning for kids
      </button>
      <button
        className={formData.familyPlans === `Prefer not to say` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, familyPlans: `Prefer not to say` })}
      >
        Prefer not to say
      </button>
    </div>

    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep} disabled={!formData.familyPlans}>Next</button>
    </div>
  </div>
)}

{step === 4 && (
  <div className="form-step">
    <h2>What are your spiritual or religious beliefs?</h2>
    <div className="option-buttons">
      <button
        className={formData.belief === `Christian` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Christian` })}
      >
        Christian
      </button>
      <button
        className={formData.belief === `Muslim` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Muslim` })}
      >
        Muslim
      </button>
      <button
        className={formData.belief === `Jewish` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Jewish` })}
      >
        Jewish
      </button>
      <button
        className={formData.belief === `Hindu` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Hindu` })}
      >
        Hindu
      </button>
      <button
        className={formData.belief === `Buddhist` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Buddhist` })}
      >
        Buddhist
      </button>
      <button
        className={formData.belief === `Spiritual but not religious` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Spiritual but not religious` })}
      >
        Spiritual but not religious
      </button>
      <button
        className={formData.belief === `Atheist / Agnostic` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Atheist / Agnostic` })}
      >
        Atheist / Agnostic
      </button>
      <button
        className={formData.belief === `Other` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Other` })}
      >
        Other
      </button>
      <button
        className={formData.belief === `Prefer not to say` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, belief: `Prefer not to say` })}
      >
        Prefer not to say
      </button>
    </div>

    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep} disabled={!formData.belief}>Next</button>
    </div>
  </div>
)}

{step === 5 && (
  <div className="form-step">
    <h2>What activities or interests do you enjoy?</h2>
    <div className="option-buttons">
      {[
        "Traveling",
        "Cooking",
        "Sports",
        "Fitness & Wellness",
        "Reading",
        "Outdoor Adventures",
        "Volunteering",
        "Live Music / Concerts",
        "Art & Culture",
        "Gaming",
        "Other"
      ].map((activity) => (
        <button
          key={activity}
          className={formData.activities?.includes(activity) ? "selected" : ""}
          onClick={() => {
            const current = formData.activities || [];
            const alreadySelected = current.includes(activity);
            const updated = alreadySelected
              ? current.filter((item) => item !== activity)
              : [...current, activity];
            setFormData({ ...formData, activities: updated });
          }}
        >
          {activity}
        </button>
      ))}
    </div>

    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep} disabled={!formData.activities || formData.activities.length === 0}>Next</button>
    </div>
  </div>
)}

{step === 6 && (
  <div className="form-step">
    <h2>What’s your highest level of education?</h2>
    <div className="option-buttons">
      <button
        className={formData.education === `High School` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `High School` })}
      >
        High School
      </button>
      <button
        className={formData.education === `Some College` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Some College` })}
      >
        Some College
      </button>
      <button
        className={formData.education === `Associate Degree` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Associate Degree` })}
      >
        Associate Degree
      </button>
      <button
        className={formData.education === `Bachelor’s Degree` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Bachelor’s Degree` })}
      >
        Bachelor’s Degree
      </button>
      <button
        className={formData.education === `Master’s Degree` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Master’s Degree` })}
      >
        Master’s Degree
      </button>
      <button
        className={formData.education === `Doctorate / Professional Degree` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Doctorate / Professional Degree` })}
      >
        Doctorate / Professional Degree
      </button>
      <button
        className={formData.education === `Trade / Vocational` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Trade / Vocational` })}
      >
        Trade / Vocational
      </button>
      <button
        className={formData.education === `Prefer not to say` ? "selected" : ""}
        onClick={() => setFormData({ ...formData, education: `Prefer not to say` })}
      >
        Prefer not to say
      </button>
    </div>

    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep} disabled={!formData.education}>Next</button>
    </div>
  </div>
)}

{step === 7 && (
  <div className="form-step">
    <h2>Do you have any dealbreakers or red flags?</h2>
    <div className="option-buttons">
      {[
        "Smoking",
        "Heavy drinking",
        "Dishonesty",
        "No long-term goals",
        "Poor communication",
        "Doesn’t want kids",
        "Inconsistent behavior",
        "Other",
        "None"
      ].map((flag) => (
        <button
          key={flag}
          className={formData.redFlags?.includes(flag) ? "selected" : ""}
          onClick={() => {
            const current = formData.redFlags || [];
            const alreadySelected = current.includes(flag);
            const updated = alreadySelected
              ? current.filter((item) => item !== flag)
              : [...current, flag];
            setFormData({ ...formData, redFlags: updated });
          }}
        >
          {flag}
        </button>
      ))}
    </div>

    <div className="step-buttons">
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep} disabled={!formData.redFlags || formData.redFlags.length === 0}>Finish</button>
    </div>
  </div>
)}

    </div>
  );
}
