import React, { useEffect, useState } from "react";
import PhotoGalleryEditor from "../components/PhotoGalleryEditor";
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./ProfilePage.css";
import blueCheck from "../assets/verified_32.32.png"; // ✅ keep your verified badge

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setPhotos(userSnap.data().photos || []);
        }
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <div className="profile-page">
      <h1>Welcome, {userData?.firstName || "Friend"}</h1>

      {/* ✅ Selfie Verification Status */}
      {userData?.verifications?.selfie ? (
        <div className="verified-status selfie-verified">
          ✅ Selfie Verified
        </div>
      ) : (
        <div className="verified-status selfie-pending">
          ⏳ Selfie Pending Review
        </div>
      )}

      {/* ✅ Photo Section */}
      <h3>Your Photos</h3>
      {/* This single component replaces your old photos.map block */}
      <PhotoGalleryEditor />

      {/* ✅ Optional sign out or other profile actions */}
      <button className="signout-btn" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
