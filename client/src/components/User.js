import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchUserProfile = async () => {
        // Check if a token is provided in the URL (for Google login)
        const queryParams = new URLSearchParams(window.location.search);
        console.log(queryParams.get('id'))
        const tokenFromUrl = queryParams.get('token');

        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl); // Store the token
            window.history.replaceState({}, document.title, `/user/${userId}`); // Remove token from URL
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const message = await response.json();
                throw new Error(message.error || 'Failed to fetch user data.');
            }

            const data = await response.json();
            setUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchUserProfile();
}, [userId]);

    const manageId = () => {
        localStorage.setItem('userId', user.id);
        return user.id;
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h1>User Profile</h1>
            <p><strong>ID:</strong> {manageId()}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default User;
