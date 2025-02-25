import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
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
        <div className='max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 pt-20'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Welcome {user.username}</h2>
            <div className="space-y-2">
                <p className="text-gray-700">
                    <strong className="font-semibold">Username:</strong> {user.username}
                </p>
                <p className="text-gray-700">
                    <strong className="font-semibold">Email:</strong> {user.email}
                </p>
                <p className="text-gray-700">
                    <strong className="font-semibold">Address:</strong> 4508 Old Dear Lane, Port Devis, NY
                </p>
                <p className="text-gray-700">
                    <strong className="font-semibold">Zipcode:</strong> 12771
                </p>
                <p className="text-gray-700">
                    <strong className="font-semibold">Phone number:</strong> 347-200-4971
                </p>
            </div>
        </div>
    );
};

export default User;
