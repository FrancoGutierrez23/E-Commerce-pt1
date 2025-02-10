import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import fetchUserStatus from './utils';


export default function Nav() {
    const [userId, setUserId] = useState(null);
    const location = useLocation();

    // Verify if if user is logged
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserStatus(userId, setUserId, token);
    }, [location, userId]);

    return (
        <nav className="bg-gray-900 p-4 shadow-lg">
            <ul className="flex items-center justify-btween max-w-4xl mx-auto text-white">
                {userId ? (
                    <div className="flex space-x-5">
                    <li><Link to="/home" className="hover:text-gray-300 transition">Home</Link></li>

                    <li><Link to={`/cart/${userId}`} className="hover:text-gray-300 transition">Cart</Link></li>

                    <li><Link to={`/user/${userId}`} className="hover:text-gray-300 transition">Profile</Link></li>
                    
                    <li><Link to={`/orders/${userId}`} className="hover:text-gray-300 transition">Orders</Link></li>

                    <li><Link to='/auth/logout/' className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition">Logout</Link></li>
                    </div>
                ) : (
                    <div className="flex space-x-5">

                    <li><Link to="/home" className="hover:text-gray-300 transition">Home</Link></li>

                    <Link to="/auth/login" className="hover:text-gray-300 transition">Login</Link>
                        
                    <Link to="/auth/register" className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition">Register</Link>
                    </div>
                )}
                
            </ul>
        </nav>
    )
}