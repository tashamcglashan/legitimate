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

  const normalized = photos.map((p) =>
    typeof p === "string" ? { url: p } : p
  );

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
      // Is this a Firebase Storage file?
      const isFirebaseUrl =
        (photo.path && typeof photo.path === "string") ||
        photo.url.startsWith("https://firebasestorage.googleapis.com") ||
        photo.url.startsWith("gs://");
  
      // 1) Delete from Firebase Storage only if it's a Firebase file
      if (isFirebaseUrl) {
        const fileRef = photo.path
          ? storageRef(storage, photo.path)
          : refFromURL(photo.url);
        await deleteObject(fileRef);
      }
      // If it's Cloudinary (or any non-Firebase URL), skip storage delete.
  
      // 2) Remove from Firestore either way (works for strings or objects)
      const snap = await getDoc(userRef);
      const data = snap.data() || {};
      const current = Array.isArray(data.photos) ? data.photos : [];
  
      const remaining = current.filter((p) =>
        typeof p === "string" ? p !== photo.url : p.url !== photo.url
      );
  
      await updateDoc(userRef, { photos: remaining });
      setPhotos(remaining);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Removed from profile. External file wasn’t deleted because it’s not hosted on Firebase.");
    } finally {
      setDeletingId(null);
    }
  }
  

  if (loading) {
    return (
        <div className="pg-wrapper">
          <div className="pg-header">
            <h2>My Photos</h2>
            <label className="pg-upload-btn">
              {uploading ? "Uploading…" : "Upload Photo"}
              <input type="file" accept="image/*,video/mp4" onChange={handleUpload} disabled={uploading} hidden />
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
                      onError={(e) => { e.currentTarget.src = "/fallback-photo.png"; }}
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
}