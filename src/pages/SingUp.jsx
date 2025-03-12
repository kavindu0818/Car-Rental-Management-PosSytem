import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../store/slices/UserSlice.js";
import { useNavigate } from "react-router-dom";
import loginVideo from '../Assets/video/Car-Animation.mp4';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading = false, error = null } = useSelector((state) => state.user || {});

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: ""  // Add a role field
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(saveUser(formData));

        if (saveUser.fulfilled.match(resultAction)) {
            alert("Sign-up successful!");
            navigate("/login");
        }
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

            {/* Sign-up Form */}
            <div className="relative z-10 flex justify-center items-center h-full">
                <div className="bg-blue-950 bg-opacity-50 rounded-3xl p-8 w-full max-w-md">
                    <div className="mb-6">
                        <h2 className="text-4xl font-semibold text-white text-center">Sign Up</h2>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-300 text-sm">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter Username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter Email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                placeholder="Enter Password"
                                required
                            />
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-gray-300 text-sm">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
                                required
                            >
                                <option value="">Select a Role</option>
                                <option value="MANAGER">Manager</option>
                                <option value="CASHIER">Cashier</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-transparent border-white border-2 text-white py-2 px-4 rounded hover:bg-black"
                                disabled={loading}
                            >
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="bg-blue-950 border-white border-2 text-white py-2 px-4 rounded hover:bg-gray-500"
                            >
                                Already have an account? Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
