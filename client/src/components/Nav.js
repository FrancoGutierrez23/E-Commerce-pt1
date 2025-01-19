import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <nav>
            <ul style={{display: "flex", listStyle: "none", width: "300px", justifyContent: "space-between"}}>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/auth/register">Register</Link></li>
                <li><Link to="/auth/login">Login</Link></li>
                <li><Link to="/user">Profile</Link></li>
            </ul>
        </nav>
    )
}