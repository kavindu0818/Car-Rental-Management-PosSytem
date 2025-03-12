import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/UserSlice.js';
import loginVideo from '../Assets/video/CarAnimation.mp4';
import logo from '../Assets/carSingalLogo.png';

export function IntroPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated, loading, error } = useSelector((state) => state.user || {}); // Fallback to empty object

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
        <div
            className="relative w-full h-screen flex items-center justify-center bg-blue-950 overflow-hidden"> {/* Prevent horizontal scroll */}
            {/* Background Video */}
            <div className="absolute inset-0">
                <video autoPlay loop muted className="w-full h-full object-cover opacity-60">
                    <source src={loginVideo} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Blue Blur Overlay */}
            <div className="absolute inset-0 bg-blue-950 opacity-40 blur-sm"></div>

            {/* Content */}
            <div className="absolute z-10 left-16 w-full px-6 flex items-center justify-between overflow-hidden">
                {/* Left side content */}
                <div className="text-left text-white">
                    <h1 className="text-7xl font-bold">KMW CAR RENTAL</h1>
                    {/*<h1 className="text-4xl font-bold text-center">PVT(LTD)</h1>*/}


                    <h5 className="text-lg mt-6 max-w-lg">
                        KMW Car Rental offers a wide range of high-quality vehicles for any occasion, from stylish
                        sedans to luxurious cars and family-friendly SUVs. Our well-maintained fleet, competitive rates,
                        and exceptional customer service ensure a smooth and effortless rental experience. Rent your
                        dream car today and drive with confidence!!
                    </h5>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-4 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-transparent border-2 border-white"
                    >
                        Get Started
                    </button>
                </div>

                {/* Right side logo */}
            </div>

            <div className="flex items-center justify-center z-10 relative left-96 top-24">
                <img src={logo} alt="KMW Car Rental Logo" className="w-[1000px] h-[1000px]"/>
            </div>
        </div>
    );
}

export default IntroPage;
