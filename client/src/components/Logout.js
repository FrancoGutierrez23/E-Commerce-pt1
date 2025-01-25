import React from 'react';
//import { useNavigate } from 'react-router-dom';

const Logout = () => {
   // const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/auth/logout', {
                method: 'GET',
                credentials: 'include', // Ensures cookies are included in the request
            });

            if (response.ok) {
                // Redirect to the login page
                window.location.href = '/auth/login'
            } else {
                console.error('Failed to log out:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <button 
            onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;
