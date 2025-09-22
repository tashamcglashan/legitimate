// src/components/LogoutButton.jsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin", { replace: true });
    } catch (e) {
      console.error("Logout error:", e);
      alert("Could not log out. Please try again.");
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      Log Out
    </button>
  );
}
