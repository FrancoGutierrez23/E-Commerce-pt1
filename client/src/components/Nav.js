import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


export default function Nav() {
    const [userId, setUserId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        console.log("Fetching user status...");
        
        const fetchUserStatus = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/status`, {
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
    }, [location]);

    return (
        <nav>
            <ul style={{display: "flex", listStyle: "none", width: "300px", justifyContent: "space-between"}}>
                <li><Link to="/home">Home</Link></li>
                <li>{userId}</li>
                
                {userId ? (
                    <>
                    <li><Link to={`/cart/${userId}`}>Cart</Link></li>

                    <li><Link to={`/user/${userId}`}>Profile</Link></li>
                    
                    <li><Link to={`/orders/${userId}`}>Orders</Link></li>

                    <li><Link to='/auth/logout/'>Logout</Link></li>
                    </>
                ) : (
                    <>
                    <Link to="/auth/login">Login</Link>
                        
                    <Link to="/auth/register">Register</Link>
                    </>
                )}
                
            </ul>
        </nav>
    )
}