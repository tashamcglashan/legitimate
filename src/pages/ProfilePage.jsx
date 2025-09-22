import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./ProfilePage.css";
import blueCheck from "../assets/verified_32.32.png"; // Import the blue check image




export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);
  
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserData(data);
          setPhotos(data.photos || []);
  
          if (!data.photos || data.photos.length === 0) {
            navigate("/match-setup");
            return;
          }
  
          if (
            location.pathname !== "/verify-selfie" &&
            (!data.verifications || data.verifications.selfie !== true)
          ) {
            navigate("/verify-selfie");
            return;
          }
  
        } else {
          console.log("User document not found");
          navigate("/signin");
        }
      } else {
        console.log("No user is signed in");
        navigate("/signin");
      }
  
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  

  const handlePhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newUrl = URL.createObjectURL(file);
    const updated = [...photos];
    updated[index] = newUrl;
    setPhotos(updated);
  };

  const handleRemovePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
  };

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...urls].slice(0, 6)); // Limit to 6
  };

  const savePhotos = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await updateDoc(doc(db, "users", uid), {
        photos: photos,
      });

      const updatedDoc = await getDoc(doc(db, "users", uid));
      if (updatedDoc.exists()) {
        setUserData(updatedDoc.data());
        setEditMode(false);
      }
    } catch (err) {
      console.error("Error updating photos:", err);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h1>Welcome, {userData?.firstName || "Friend"}</h1>
      {userData?.verifications?.selfie ? (
  <div className="verified-status selfie-verified">✅ Selfie Verified</div>
) : (
  <div className="verified-status selfie-pending">⏳ Selfie Pending Review</div>
)}
      <h3>Your Photos</h3>
      <div className="photo-preview">
      {photos.map((url, index) => (
  <div className="photo-wrapper" key={index}>
    <div className="photo-with-badge">
      {url.includes("cloudinary") ? (
        <video src={url} controls className="photo-thumbnail" />
      ) : (
        <img src={url} alt={`Photo ${index + 1}`} className="photo-thumbnail" />
      )}

      {/* ✅ Show blue check only if selfie is verified */}
      {userData?.verifications?.selfie && (
        <img src={blueCheck} alt="Verified" className="blue-badge" />
      )}
    </div>
  </div>
))}


      </div>

      {editMode && (
        <div className="photo-add">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhotos}
          />
        </div>
      )}

      <div className="edit-actions">
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Edit Photos</button>
        ) : (
          <>
            <button onClick={savePhotos}>Save New Photos</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        )}
      </div>

      <div className="logout-wrapper">
        <button className="logout-button" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}
