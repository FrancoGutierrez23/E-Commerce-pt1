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
        <form onSubmit={handleSubmit}>
            <label htmlFor="username"><b>Username</b></label>
            <input
                type="text"
                placeholder="Enter username"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <label htmlFor="password"><b>Password</b></label>
            <input
                type="password"
                placeholder="Enter Password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>Don't have an account? <a href="/auth/register">Register</a>.</p>
            <button type="submit" className="loginbtn">Login</button>

            <hr />
            <button
                type="button"
                className="google-login"
                onClick={() => (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)}
            >
                Login with Google
            </button>
        </form>
    );
}

