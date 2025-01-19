import React from 'react';

export default function Register() {
    return (
        <form>
            <label for="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" id="email" required />

            <label for="username"><b>Username</b></label>
            <input type="text" placeholder="Enter username" name="username" id="username" required />

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" id="psw" required />
            
            <p>By creating an account you agree to our <a href="/">Terms & Privacy</a>.</p>
            <button type="submit" class="registerbtn">Register</button>
        </form>
    )
};