import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function Nav() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await fetch('http://localhost:4000/auth/status', {
                    credentials: 'include', // Include cookies for session
                });
                const data = await response.json();

                if (data.isAuthenticated) {
                    setUserId(data.user.id);
                }
            } catch (error) {
                console.error('Error fetching user status:', error);
            }
        };

        fetchUserStatus();
    }, []);

    return (
        <nav>
            <ul style={{display: "flex", listStyle: "none", width: "300px", justifyContent: "space-between"}}>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/home">Home</Link></li>
                <li>
                    {userId ? (
                        <>
                        <Link to={`/user/${userId}`}>Profile</Link>
                        
                        <Link to='/auth/logout/'>Logout</Link>
                        </>
                    ) : (
                        <>
                        <Link to="/auth/login">Login</Link>
                        
                        <Link to="/auth/register">Register</Link>
                        </>
                    )}
                </li>
            </ul>
        </nav>
    )
}