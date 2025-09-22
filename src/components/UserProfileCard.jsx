import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./UserProfileCard.css";
import verifiedIcon from "../assets/verified_32.32.png"; // Adjust the path as necessary

const UserProfileCard = ({ user: userProp }) => {
  const [user, setUser] = useState(userProp || null);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editedText, setEditedText] = useState("");

  const uid = auth.currentUser?.uid;

  // Fetch user data if not passed in
  useEffect(() => {
    const fetchUser = async () => {
      if (uid) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      }
    };
    fetchUser();
  }, [uid]);
  

  const isVerified = user?.verifications?.selfie && user?.verifications?.background;

  const handleEdit = (key) => {
    setEditingPrompt(key);
    setEditedText(user.prompts[key]);
  };

  const handleSave = async () => {
    const updatedPrompts = {
      ...user.prompts,
      [editingPrompt]: editedText,
    };

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      prompts: updatedPrompts,
    });

    setUser((prev) => ({
      ...prev,
      prompts: updatedPrompts,
    }));

    setEditingPrompt(null);
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-card">
      <div className="profile-header">

  <img
  src={
    user.photos && user.photos.length > 0
      ? user.photos[0]
      : "https://placehold.co/150x150?text=No+Image"
  }
  alt="Main profile"
  className="main-photo"
/>


        <div className="name-age">
          <h2>{user.firstName ? user.firstName : "First Name"}, {user.age ? ` ${user.age}`: ""}</h2>
          {isVerified && (
            <div className="verification-badge">
              <img src= {verifiedIcon} alt="Verified" />
              <span>Verified</span>
            </div>
          )}
        </div>
        <p className="location">{user.location || "Location not set"}</p>
      </div>

      <div className="photo-gallery">
  {user.photos?.map((photo, index) => (
    <img key={index} src={photo} alt={`User pic ${index + 1}`} />
  ))}
</div>


      <div className="prompt-section">
        {user.prompts &&
          Object.entries(user.prompts).map(([key, response]) => (
            <div key={key} className="prompt-block">
              <h4>{formatPrompt(key)}</h4>
              {editingPrompt === key ? (
                <>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button onClick={handleSave}>Save</button>
                </>
              ) : (
                <>
                  <p>{response}</p>
                  <button className="edit-btn" onClick={() => handleEdit(key)}>
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

// Move this outside the return block
const formatPrompt = (key) => {
  const map = {
    partner: "What I’m looking for in a partner",
    greenFlag: "My biggest green flag",
    loveLanguage: "My love language is...",
  };
  return map[key] || key;
};

export default UserProfileCard;
