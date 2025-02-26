import React from "react";
import { useState } from "react";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {
          method: "GET",
          credentials: "include", // Ensures cookies are included in the request
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="p-20 text-gray-500 text-lg">Wait a moment...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="flex items-center justify-center p-32 flex-wrap flex-col">
      <span className="text-xl">Are you sure?</span>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-1 text-white rounded-lg m-2 hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
