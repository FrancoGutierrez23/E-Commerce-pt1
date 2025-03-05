import React, { useState, useEffect, useContext, createContext } from "react";
import { Link } from "react-router-dom";
import {
  faHome,
  faShoppingCart,
  faUser,
  faSignOut,
  faEnvelopeCircleCheck,
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fetchUserStatus = async (token) => {
  // Only need the token here
  if (!token) {
    return Error("Please login/register first.");
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/status`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.isAuthenticated ? data.user.id : null; // Return user ID directly
  } catch (error) {
    console.error("Error fetching user status:", error);
    return null; // Return null in case of error
  }
};

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading
  const token = localStorage.getItem("token");

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const userId = await fetchUserStatus(token); // Get userId here
      if (userId) {
        setUserId(userId); // Update context with userId
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error("Failed to fetch user status:", error);
      setUserId(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false); // If no token, authentication check is finished
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ userId, loading, checkAuthStatus }}>
      {!loading && children} {/* Prevent rendering until loading is done */}
    </AuthContext.Provider>
  );
};

// Nav Component
export default function Nav() {
  const { userId } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-indigo-800 p-4 shadow-lg fixed w-full z-10 ">
      <ul className="flex items-center justify-between mx-auto text-white">
        <div className="flex space-x-5">
          <li>
            <Link to="/home" className="hover:text-indigo-100 transition">
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>

          {userId && token ? (
            <>
              <li>
                <Link
                  to={`/cart/${userId}`}
                  className="hover:text-gray-300 transition"
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Cart
                </Link>
              </li>
              <li>
                <Link
                  to={`/user/${userId}`}
                  className="hover:text-gray-300 transition"
                >
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </li>
              <li>
                <Link
                  to={`/orders/${userId}`}
                  className="hover:text-gray-300 transition"
                >
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} /> Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/logout"
                  className="bg-black bg-opacity-40 hover:bg-opacity-50 px-3 py-1 rounded-lg hover:text-indigo-100 transition"
                >
                  <FontAwesomeIcon icon={faSignOut} /> Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/auth/login"
                  className="hover:text-gray-300 transition"
                >
                  <FontAwesomeIcon icon={faSignIn} /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="bg-black bg-opacity-50 hover:bg-opacity-50 px-3 py-1 rounded-lg hover:text-indigo-100  transition"
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Register
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}
