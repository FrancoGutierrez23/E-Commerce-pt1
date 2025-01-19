import React from 'react';

export default function Login() {
    return (
        <form>
            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter username" name="username" id="username" required />

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" id="psw" required />
            
            <p>Don't have an account? <a href="/auth/register">Register</a>.</p>
            <button type="submit" class="loginbtn">Login</button>
        </form>
    )
};