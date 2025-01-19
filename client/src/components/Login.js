import React from 'react';

export default function Login() {
    return (
        <form>
            <label htmlFor="username"><b>Username</b></label>
            <input type="text" placeholder="Enter username" name="username" id="username" required />

            <label htmlFor="password"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password" id="password" required />

            <p>Don't have an account? <a href="/auth/register">Register</a>.</p>
            <button type="submit" className="loginbtn">Login</button>

            <hr />
            <button
                type="button"
                className="google-login"
                onClick={() => (window.location.href = 'http://localhost:4000/auth/google')}
            >
                Login with Google
            </button>
        </form>
    );
}
