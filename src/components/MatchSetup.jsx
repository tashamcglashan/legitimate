// src/pages/MatchSetup.jsx
import React, { useState } from 'react';
import './MatchSetup.css';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

export default function MatchSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 13;

  const [formData, setFormData] = useState({
    firstName: '',
    age: '',
    gender: '',
    location: '',
    preference: '',
    familyPlans: '',
    belief: '',
    education: '',
    redFlags: [],
    photos: [],
    prompt1: '',
    prompt2: '',
    prompt3: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleRemovePhoto = (indexToRemove) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== indexToRemove);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const handleFinish = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("You must be logged in.");
      return;
    }

    try {
      await setDoc(doc(db, "users", uid), {
        firstName: formData.firstName,
        age: formData.age,
        gender: formData.gender,
        location: formData.location,
        photos: formData.photos,
        prompts: {
          partner: formData.prompt1,
          greenFlag: formData.prompt2,
          loveLanguage: formData.prompt3,
        },
    
        matchPreferences: {
          preference: formData.preference,
          familyPlans: formData.familyPlans,
          belief: formData.belief,
          education: formData.education,
          redFlags: formData.redFlags,
        },
        setupComplete: true,
        uid: uid,
        email: auth.currentUser.email,
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error saving setup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const getProgress = () => (step / totalSteps) * 100;

  return (
    <div className="match-setup-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
      </div>

      {step === 1 && (
        <div className="form-step">
          <h2>What is your first name?</h2>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Tasha" />
          <div className="step-buttons">
            <button onClick={nextStep} disabled={!formData.firstName}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <h2>What is your age?</h2>
          <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 34" />
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.age}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h2>What is your gender?</h2>
          <div className="option-buttons">
            {["Female", "Male", "Non-binary", "Prefer not to say"].map(option => (
              <button
                key={option}
                className={formData.gender === option ? "selected" : ""}
                onClick={() => setFormData({ ...formData, gender: option })}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.gender}>Next</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="form-step">
          <h2>Where are you located?</h2>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. California" />
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.location}>Next</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="form-step">
          <h2>Who are you looking to date?</h2>
          <div className="option-buttons">
            {["Men", "Women", "Everyone"].map(option => (
              <button
                key={option}
                className={formData.preference === option ? "selected" : ""}
                onClick={() => setFormData({ ...formData, preference: option })}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.preference}>Next</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="form-step">
          <h2>Do you want kids?</h2>
          <div className="option-buttons">
            {["Have kids – don't want more", "Have kids – want more", "Want kids", "Don’t want kids", "Unsure"].map(option => (
              <button
                key={option}
                className={formData.familyPlans === option ? "selected" : ""}
                onClick={() => setFormData({ ...formData, familyPlans: option })}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.familyPlans}>Next</button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="form-step">
          <h2>What are your core beliefs or values?</h2>
          <div className="option-buttons">
            {["Christian", "Spiritual", "Muslim", "Jewish", "Atheist", "Other"].map(option => (
              <button
                key={option}
                className={formData.belief === option ? "selected" : ""}
                onClick={() => setFormData({ ...formData, belief: option })}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.belief}>Next</button>
          </div>
        </div>
      )}

      {step === 8 && (
        <div className="form-step">
          <h2>What is your highest level of education?</h2>
          <div className="option-buttons">
            {["High School", "Some College", "College Graduate", "Postgraduate"].map(option => (
              <button
                key={option}
                className={formData.education === option ? "selected" : ""}
                onClick={() => setFormData({ ...formData, education: option })}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.education}>Next</button>
          </div>
        </div>
      )}

      {step === 9 && (
        <div className="form-step">
          <h2>Do you have any dealbreakers or red flags?</h2>
          <div className="option-buttons">
            {["Smoking", "Heavy drinking", "Dishonesty", "No long-term goals", "Poor communication", "Doesn’t want kids", "Inconsistent behavior", "Other", "None"].map(flag => (
              <button
                key={flag}
                className={formData.redFlags?.includes(flag) ? "selected" : ""}
                onClick={() => {
                  const updated = formData.redFlags.includes(flag)
                    ? formData.redFlags.filter(f => f !== flag)
                    : [...formData.redFlags, flag];
                  setFormData({ ...formData, redFlags: updated });
                }}
              >
                {flag}
              </button>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.redFlags.length}>Next</button>
          </div>
        </div>
      )}

      {step === 10 && (
        <div className="form-step">
          <h2>Upload up to 6 profile photos</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 6);
              const urls = files.map(file => URL.createObjectURL(file));
              setFormData({ ...formData, photos: [...formData.photos, ...urls].slice(0, 6) });
            }}
          />
          <div className="photo-preview">
            {formData.photos.map((url, index) => (
              <div key={index} className="photo-thumbnail">
                <img src={url} alt={`Upload ${index + 1}`} />
                <button onClick={() => handleRemovePhoto(index)}>×</button>
              </div>
            ))}
          </div>
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={formData.photos.length === 0}>Next</button>
          </div>
        </div>
      )}

      {step === 11 && (
        <div className="form-step">
          <h2>What does your first date look like?</h2>
          <input type="text" name="prompt1" value={formData.prompt1} onChange={handleChange} placeholder="e.g. Coffee at a cafe" />
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.prompt1}>Next</button>
          </div>
        </div>
      )}

      {step === 12 && (
        <div className="form-step">
          <h2>What’s a green flag you bring to a relationship?</h2>
          <input type="text" name="prompt2" value={formData.prompt2} onChange={handleChange} placeholder="e.g. I’m a great listener..." />
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!formData.prompt2}>Next</button>
          </div>
        </div>
      )}

      {step === 13 && (
        <div className="form-step">
          <h2>What’s your love language?</h2>
          <input type="text" name="prompt3" value={formData.prompt3} onChange={handleChange} placeholder="e.g. Words of affirmation" />
          <div className="step-buttons">
            <button onClick={prevStep}>Back</button>
            <button onClick={handleFinish} disabled={!formData.prompt3}>Finish</button>
          </div>
        </div>
      )}
    </div>
  );
}
