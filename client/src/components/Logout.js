import React from 'react';

const Logout = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
                method: 'GET',
                credentials: 'include', // Ensures cookies are included in the request
            });

            if (response.ok) window.location.href = '/auth/login';
            console.error('Failed to log out:', response.statusText);
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
