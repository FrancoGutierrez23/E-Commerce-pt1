import React, { useState, useEffect, useContext, createContext } from "react";
import { Link } from "react-router-dom";
import fetchUserStatus from "./utils";
import { faHome, faShoppingCart, faUser, faSignOut, faEnvelopeCircleCheck, faSignIn, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!userId) {  // Fetch only if userId is null (to prevent unnecessary re-fetching)
            fetchUserStatus(userId, setUserId, token);
        }
    }, [userId]); // Only runs if userId is null
    

    return (
        <AuthContext.Provider value={{ userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
}

// Nav Component
export default function Nav() {
    const { userId } = useContext(AuthContext);

    return (
        <nav className="bg-gray-900 p-4 shadow-lg fixed w-full z-10 ">
            <ul className="flex items-center justify-between mx-auto text-white">
                <div className="flex space-x-5">
                    <li>
                        <Link to="/home" className="hover:text-gray-300 transition">
                            <FontAwesomeIcon icon={faHome} /> Home
                        </Link>
                    </li>

                    {userId ? (
                        <>
                            <li>
                                <Link to={`/cart/${userId}`} className="hover:text-gray-300 transition">
                                    <FontAwesomeIcon icon={faShoppingCart} /> Cart
                                </Link>
                            </li>
                            <li>
                                <Link to={`/user/${userId}`} className="hover:text-gray-300 transition">
                                    <FontAwesomeIcon icon={faUser} /> Profile
                                </Link>
                            </li>
                            <li>
                                <Link to={`/orders/${userId}`} className="hover:text-gray-300 transition">
                                <FontAwesomeIcon icon={faEnvelopeCircleCheck} /> Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/auth/logout" className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition">
                                    <FontAwesomeIcon icon={faSignOut} /> Logout
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/auth/login" className="hover:text-gray-300 transition">
                                <FontAwesomeIcon icon={faSignIn} /> Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/auth/register" className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition">
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
