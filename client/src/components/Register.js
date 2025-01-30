import React, { useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful!');
                setError('');

                const { user, token } = data;
                localStorage.setItem('token', token); // Save JWT token
                window.location.href = `/user/${user.id}`; // Redirect to home
            } else {
                setError(data.error || 'Registration failed.');
                setSuccess('');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setSuccess('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email"><b>Email</b></label>
            <input
                type="text"
                placeholder="Enter Email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
            />

            <label htmlFor="username"><b>Username</b></label>
            <input
                type="text"
                placeholder="Enter Username"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
            />

            <label htmlFor="password"><b>Password</b></label>
            <input
                type="password"
                placeholder="Enter Password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
            />

            <p>By creating an account you agree to our <a href="/">Terms & Privacy</a>.</p>
            <button type="submit" className="registerbtn">Register</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <hr />
            <button
                type="button"
                className="google-login"
                onClick={() => (window.location.href = 'https://localhost:4000/auth/google')}
            >
                Register with Google
            </button>
        </form>
    );
}
