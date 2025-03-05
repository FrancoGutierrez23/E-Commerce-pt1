import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Nav.js"; // Import AuthContext

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuthStatus } = useContext(AuthContext);

  useEffect(() => {
    const handleLogin = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (token) {
        localStorage.setItem("token", token);
        await checkAuthStatus(); // ✅ Wait for authentication check
        navigate("/home", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    };

    handleLogin();
  }, [navigate, checkAuthStatus]);

  return <div>Logging in...</div>;
}
