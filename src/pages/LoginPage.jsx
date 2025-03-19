import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, getUser } from "../store/slices/UserSlice.js";
import loginVideo from "../Assets/video/Car-Animation.mp4";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(""); // Added state for error handling
    const [loading, setLoading] = useState(false); // Added state for loading
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error message before attempting login

        try {
            const resultAction = await dispatch(loginUser(credentials));

            if (loginUser.fulfilled.match(resultAction)) {
                alert("Login successful!");
                await dispatch(getUser(credentials.username)); // Fetch user details after login
                navigate("/dashboard");
            } else {
                setError("Login failed. Please check your credentials."); // Set error message
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="relative w-full h-screen bg-blue-950 overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video autoPlay loop muted className="w-full h-full object-cover" style={{ opacity: 0.6 }}>
                    <source src={loginVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Login Form */}
            <div className="relative z-10 flex justify-center items-center h-full">
                <div className="bg-blue-950 bg-opacity-50 rounded-3xl p-8 w-full max-w-md">
                    <div className="mb-6">
                        <h2 className="text-4xl font-semibold text-white text-center">Login</h2>
                    </div>
                    {/* Display error message if any */}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-300 text-sm">Phone Number</label>
                            <input
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter User Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter Password"
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-transparent border-white border-2 text-white py-2 px-4 rounded hover:bg-black"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/signUp")}
                                className="bg-blue-950 border-white border-2 text-white py-2 px-4 rounded hover:bg-gray-500"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
