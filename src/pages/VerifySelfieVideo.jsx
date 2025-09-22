import React, { useRef, useState, useEffect } from "react";
import "./VerifySelfieVideo.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function VerifySelfieVideo() {
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Start camera once + cleanup on unmount
  useEffect(() => {
    let localStream;
    const startCamera = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (videoRef.current) videoRef.current.srcObject = localStream;
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };
    startCamera();

    return () => {
      try {
        // stop recording if active
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
        // stop camera tracks
        localStream?.getTracks()?.forEach((t) => t.stop());
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ⬅️ run once

  const handleStartRecording = () => {
    if (!stream) return;
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(blob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!videoBlob || !auth.currentUser) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", videoBlob);
      formData.append("upload_preset", "verify-selfie-video");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwmy6fyvl/video/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      const videoURL = data?.secure_url;
      if (!videoURL) {
        throw new Error(data?.error?.message || "No secure_url from Cloudinary");
      }

      // Update Firestore (do NOT touch photos here)
      const userRef = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(userRef);
      const existingVerifications = snap.data()?.verifications || {};

      await updateDoc(userRef, {
        selfieVideoUrl: videoURL,
        verifications: { ...existingVerifications, video: true },
      });

      alert("Video selfie uploaded!");
      navigate("/profile");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="verify-video-container">
      <h2>Selfie Video Verification</h2>
      <video ref={videoRef} autoPlay playsInline muted className="video-preview" />
      <div className="button-group">
        {!recording ? (
          <button onClick={handleStartRecording} disabled={!stream}>
            Start Recording
          </button>
        ) : (
          <button onClick={handleStopRecording}>Stop Recording</button>
        )}
        <button onClick={handleUpload} disabled={!videoBlob || uploading}>
          {uploading ? "Uploading…" : "Upload & Verify"}
        </button>
      </div>
    </div>
  );
}
