import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/UserSlice.js';
import loginVideo from '../Assets/video/Car-Animation.mp4';

export function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, loading, error } = useSelector((state) => state.user || {});  // Fallback to empty object

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser(credentials));

        if (loginUser.fulfilled.match(resultAction)) {
            alert('Login successful!');
            navigate('/dashboard'); // Redirect after login
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="relative w-full h-screen bg-blue-950 overflow-hidden"> {/* Set background color to blue */}
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
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/signUp')}
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
