import React, { useEffect, useState } from "react";
import "./PhotoGalleryEditor.css";
import { auth, db, storage } from "../firebase-config";
import { doc, getDoc, updateDoc, arrayRemove, setDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

export default function PhotoGalleryEditor() {
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    let isMounted = true;
    async function fetchPhotos() {
      try {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { photos: [] }, { merge: true });
          if (isMounted) setPhotos([]);
        } else {
          const data = snap.data();
          if (isMounted) setPhotos(Array.isArray(data.photos) ? data.photos : []);
        }
      } catch (err) {
        console.error("Failed to load photos", err);
        alert("Couldn't load your photos. Please refresh.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPhotos();
    return () => { isMounted = false; };
  }, [user]);
   
    const normalized = photos.map(p => (typeof p === 'string' ? { url: p } : p));

    async function handleDelete(photo) {
        if (!user) return alert("Please sign in again.");
      
        // Ask user to confirm delete
        const confirmed = window.confirm("Delete this photo? This cannot be undone.");
        if (!confirmed) return;
      
        // Highlight the deleting photo
        setDeletingId(photo.url);
      
        // 👇 This is where your userRef and delete logic go
        const userRef = doc(db, "users", user.uid);
      
        try {
          // 1️⃣ Delete from Firebase Storage
          const fileRef = photo.path
            ? storageRef(storage, photo.path)
            : storageRef(storage, photo.url);
          await deleteObject(fileRef);
      
          // 2️⃣ Remove from Firestore
          const snap = await getDoc(userRef);
          const data = snap.data() || {};
          const current = Array.isArray(data.photos) ? data.photos : [];
      
          // Works for both array of strings or objects
          const remaining = current.filter((p) =>
            typeof p === "string" ? p !== photo.url : p.url !== photo.url
          );
      
          await updateDoc(userRef, { photos: remaining });
      
          // 3️⃣ Update local state so it disappears immediately
          setPhotos(remaining);
        } catch (err) {
          console.error("Delete failed", err);
          alert("Sorry, couldn't delete that photo. Try again.");
        } finally {
          setDeletingId(null);
        }
      }
      
  if (loading) {
    return (
      <div className="pg-wrapper">
        <div className="pg-header">
          <h2>My Photos</h2>
          <p className="pg-sub">Loading your gallery…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-wrapper">
      <div className="pg-header">
        <h2>My Photos</h2>
        <p className="pg-sub">Click the Delete button to remove a photo.</p>
      </div>
  
      {normalized.length === 0 ? (
        <div className="pg-empty">No photos yet.</div>
      ) : (
        <div className="pg-grid">
          {normalized.map((photo) => (
            <div className="pg-card" key={photo.url}>
              {/(mp4|video)/i.test(photo.url) || photo.url.includes("cloudinary") ? (
                <video src={photo.url} controls className="pg-img" />
              ) : (
                <img
                  src={photo.url}
                  alt="User upload"
                  className="pg-img"
                  onError={(e) => {
                    e.currentTarget.src = "/fallback-photo.png";
                  }}
                />
              )}
  
              <button
                className="pg-delete"
                onClick={() => handleDelete(photo)}
                disabled={deletingId === photo.url}
                aria-label="Delete photo"
                title="Delete photo"
              >
                {deletingId === photo.url ? "Deleting…" : "🗑 Delete"}
              </button>
  
              {photo.uploadedAt && (
                <div className="pg-meta">
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}