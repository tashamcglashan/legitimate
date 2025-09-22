import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

export default function AuthGate({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signin", { replace: true });
        return;
      }

      if (!user.emailVerified) {
        alert("Please verify your email first.");
        navigate("/signin", { replace: true });
        return;
      }

      // Ensure user doc exists
      const ref = doc(db, "users", user.uid);
      let snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          createdAt: Date.now(),
          setupComplete: false,
          verifications: { video: false },
          selfieVideoUrl: "",
        });
        snap = await getDoc(ref);
      }

      const data = snap.data() || {};
      const setupComplete = Boolean(data.setupComplete);
      const verifications = data.verifications || {};
      const selfieVideoUrl = data.selfieVideoUrl || "";
      const videoVerified = verifications.video ?? Boolean(selfieVideoUrl);

      console.log("[AuthGate] data", {
        setupComplete,
        verifications,
        selfieVideoUrl,
        videoVerified,
      });

      // If selfie not verified → redirect
      if (!videoVerified) {
        navigate("/verify-selfie", { replace: true });
        return;
      }

      // If setup not complete → redirect
      if (!setupComplete) {
        navigate("/match-setup", { replace: true });
        return;
      }

      // Passed all checks → allow access
      setReady(true);
    });

    return () => unsub();
  }, [navigate, location]);

  if (!ready) return <p>Loading…</p>;

  return <>{children}</>;
}
