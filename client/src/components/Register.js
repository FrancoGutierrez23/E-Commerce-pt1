import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful!");
        setError("");

        const { token } = data;
        localStorage.setItem("token", token); // Save JWT token
        window.location.href = `/home`; // Redirect to home
      } else {
        setError(data.error || "Registration failed.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 pt-20 rounded-lg shadow-lg space-y-4"
    >
      <label htmlFor="email" className="block text-gray-700 font-semibold">
        Email
      </label>
      <input
        type="text"
        placeholder="Enter Email"
        name="email"
        id="email"
        required
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <label htmlFor="username" className="block text-gray-700 font-semibold">
        Username
      </label>
      <input
        type="text"
        placeholder="Enter Username"
        name="username"
        id="username"
        required
        value={formData.username}
        onChange={handleChange}
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
        required
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

      <button
        type="submit"
        className="loginbtn w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
      >
        <FontAwesomeIcon icon={faUserPlus} /> Register
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <button
        type="button"
        className="google-login w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
        onClick={() =>
          (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
        }
      >
        Register with Google
      </button>
    </form>
  );
}
