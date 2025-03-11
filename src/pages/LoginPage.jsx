import React from "react";
import { useNavigate } from "react-router-dom";
import loginVideo from "../Assets/video/Car-Animation.mp4"; // Import your video

export function Login() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video autoPlay loop muted className="w-full h-full object-cover" style={{ opacity: 0.6 }}>
                    <source src={loginVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Login Form */}
            <div className="relative z-10 flex justify-center items-center h-full">
                <div className="bg-gray-800 bg-opacity-50 rounded-3xl p-8 w-full max-w-md">
                    <div className="mb-6">
                        <h2 className="text-4xl font-semibold text-white text-center">Login</h2>
                    </div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm">Username</label>
                            <input
                                type="text"
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter Username"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm">Password</label>
                            <input
                                type="password"
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter Password"
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-transparent border-white border-2 text-white py-2 px-4 rounded hover:bg-black"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/signUp")} // Fixed navigation path
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
}

export default Login;
