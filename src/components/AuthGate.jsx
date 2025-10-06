import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

export default function AuthGate() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // not signed in
      if (!user) {
        setRedirect({ to: "/signin" });
        setChecking(false);
        return;
      }

      // email not verified
      if (!user.emailVerified) {
        alert("Please verify your email first.");
        setRedirect({ to: "/signin" });
        setChecking(false);
        return;
      }

      // ensure user doc
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
      const videoVerified =
        (data.verifications && data.verifications.video) ||
        Boolean(data.selfieVideoUrl);

      if (!videoVerified) {
        setRedirect({ to: "/verify-selfie" });
        setChecking(false);
        return;
      }

      if (!setupComplete) {
        setRedirect({ to: "/match-setup" });
        setChecking(false);
        return;
      }

      // all good
      setRedirect(null);
      setChecking(false);
    });

    return () => unsub();
  }, []);

  if (checking) return <p style={{ padding: "2rem" }}>Loading…</p>;

  if (redirect) {
    // preserve intended path so you can come back after completing flow
    return <Navigate to={redirect.to} replace state={{ from: location }} />;
  }

  // ✅ Render the matched protected route here
  return <Outlet />;
}