import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hanlde submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Login failed.");

        const { token } = data;

        // Save the token to localStorage
        localStorage.setItem("token", token);

        // Redirect to user home
        window.location.href = `/home`;
      } else {
        // Handle non-JSON response
        const text = await response.text();
        throw new Error(text || "Unexpected response from server.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4 pt-20"
    >
      <label htmlFor="username" className="block text-gray-700 font-semibold">
        Username
      </label>
      <input
        type="text"
        placeholder="Enter username"
        name="username"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full px-4 py2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <label htmlFor="password" className="block text-gray-700 font-semibold">
        Password
      </label>
      <input
        type="password"
        placeholder="Enter Password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      {error && <p className="text-indigo-500 text-sm">{error}</p>}

      <p className="text-gray-600 text-md">
        Don't have an account?{" "}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Register
        </a>
        .
      </p>

      <button
        type="submit"
        className="loginbtn w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
      >
        <FontAwesomeIcon icon={faSignIn} /> Login
      </button>

      <hr />
      <button
        type="button"
        className="google-login w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
        onClick={() =>
          (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
        }
      >
        Login with Google
      </button>
    </form>
  );
}
