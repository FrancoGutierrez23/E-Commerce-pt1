import React, { useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Hanlde submit event
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Login failed.');
                
                const { user, token } = data;

                // Save the token to localStorage
                localStorage.setItem('token', token);
    
                // Redirect to user profile
                window.location.href = `/user/${user.id}`;
            } else {
                // Handle non-JSON response
                const text = await response.text();
                throw new Error(text || 'Unexpected response from server.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form 
        onSubmit={handleSubmit}
        className='max-w-md mx-auto bg-white p-6 mt-5 rounded-lg shadow-lg space-y-4'>
            <label htmlFor="username" className='block text-gray-700 font-semibold'>Username</label>
            <input
                type="text"
                placeholder="Enter username"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='w-full px-4 py2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' 
            />

            <label htmlFor="password" className='block text-gray-700 font-semibold'>Password</label>
            <input
                type="password"
                placeholder="Enter Password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <p className='text-gray-600 text-sm'>Don't have an account? <a href="/auth/register" className='text-blue-600 hover:underline'>Register</a>.</p>
            <button type="submit" className="loginbtn w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Login</button>

            <hr />
            <button
                type="button"
                className="google-login w-full flex items-center justify-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                onClick={() => (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)}
            >
                Login with Google
            </button>
        </form>
    );
}

