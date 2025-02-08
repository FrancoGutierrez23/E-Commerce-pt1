import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import fetchUserStatus from './utils';


export default function Nav() {
    const [userId, setUserId] = useState(null);
    const location = useLocation();

    // Verify if if user is logged
    useEffect(() => {
        fetchUserStatus(userId, setUserId);
    }, [location, userId]);

    return (
        <nav>
            <ul style={{display: "flex", listStyle: "none", width: "300px", justifyContent: "space-between"}}>
                <li><Link to="/home">Home</Link></li>
                
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