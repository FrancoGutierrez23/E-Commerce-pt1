import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage

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
                setUser(data); // Set user data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h1>User Profile</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default User;
