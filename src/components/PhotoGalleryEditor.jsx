import React, { useEffect, useState } from "react";
import "./PhotoGalleryEditor.css";
import { auth, db, storage } from "../firebase-config";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  ref as storageRef,
  refFromURL,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function PhotoGalleryEditor() {
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const user = auth.currentUser;

  // ---- Load photos ---------------------------------------------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, { photos: [] }, { merge: true });
          if (mounted) setPhotos([]);
        } else {
          const data = snap.data();
          const list = Array.isArray(data.photos) ? data.photos : [];
          if (mounted) setPhotos(list);
        }
      } catch (e) {
        console.error("Failed to load photos", e);
        alert("Couldn't load your photos. Please refresh.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Normalize strings -> objects
  const normalized = photos.map((p) => (typeof p === "string" ? { url: p } : p));

  // ---- Upload --------------------------------------------------------------
  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `users/${user.uid}/gallery/${crypto.randomUUID()}_${file.name}`;
      const fileRef = storageRef(storage, filePath);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      const photo = { url, path: filePath, uploadedAt: Date.now() };

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photos: arrayUnion(photo) });

      setPhotos((prev) => [...prev, photo]);
    } catch (e) {
      console.error("Upload failed", e);
      alert("Sorry, upload failed. Try again.");
    } finally {
      setUploading(false);
      // reset the input so the same file can be chosen again if needed
      e.target.value = "";
    }
  }

  // ---- Delete --------------------------------------------------------------
  async function handleDelete(photo) {
    if (!user) return alert("Please sign in again.");
    const confirmed = window.confirm("Delete this photo? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(photo.url);
    const userRef = doc(db, "users", user.uid);

    try {
      // Prefer `path`; otherwise derive ref from https URL
      const fileRef = photo.path
        ? storageRef(storage, photo.path)
        : refFromURL(photo.url);
      await deleteObject(fileRef);

      const snap = await getDoc(userRef);
      const data = snap.data() || {};
      const current = Array.isArray(data.photos) ? data.photos : [];

      const remaining = current.filter((p) =>
        typeof p === "string" ? p !== photo.url : p.url !== photo.url
      );

      await updateDoc(userRef, { photos: remaining });
      setPhotos(remaining);
    } catch (e) {
      console.error("Delete failed", e);
      alert("Sorry, couldn't delete that photo. Check your Firebase Storage rules or try again.");
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

        {/* Upload button */}
        <label className="pg-upload-btn">
          {uploading ? "Uploading…" : "Upload Photo"}
          <input
            type="file"
            accept="image/*,video/mp4"
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>
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
