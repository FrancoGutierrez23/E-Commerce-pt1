import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./Nav";
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

export default function PhoneNav() {
  const { userId } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gray-900 p-4 shadow-lg mb-5 fixed w-full z-10">
      <div className="flex justify-between items-center">
        {/* Hamburger Icon */}
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              // X icon when menu is open
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon when menu is closed
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Home Link */}
        <Link to="/home" className="text-white text-lg">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>

        {userId ? (
          <Link
            to={`/cart/${userId}`}
            className="block text-white hover:text-gray-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </Link>
        ) : (
          <Link
            to="/auth/login"
            className="block text-white hover:text-gray-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faSignIn} /> Login
          </Link>
        )}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <ul className="mt-4 space-y-2">
          {userId ? (
            <>
              <li>
                <Link
                  to={`/user/${userId}`}
                  className="block text-white hover:text-gray-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </li>
              <li>
                <Link
                  to={`/orders/${userId}`}
                  className="block text-white hover:text-gray-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} /> Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/logout"
                  className="block bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  onClick={() => setMenuOpen(false)}
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
                  className="block text-white hover:text-gray-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faSignIn} /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="block bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
