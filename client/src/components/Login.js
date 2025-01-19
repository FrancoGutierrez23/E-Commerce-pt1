import React from 'react';

export default function Login() {
    return (
        <form>
            <label htmlFor="username"><b>Username</b></label>
            <input type="text" placeholder="Enter username" name="username" id="username" required />

            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" id="psw" required />
            
            <p>Don't have an account? <a href="/auth/register">Register</a>.</p>
            <button type="submit" className="loginbtn">Login</button>
        </form>
    )
};