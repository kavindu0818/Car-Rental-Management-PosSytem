import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import BookingHistory from './pages/BookingHistory';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import InstantBooking from './pages/InstantBooking';
import NotFound from './pages/NotFound';
import CurrentBooking from "./pages/CurruntBooking.jsx"; // Fixed typo
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SingUp.jsx"; // Fixed incorrect import
import IntroPage from './pages/IntroPage'; // IntroPage import

function App() {
    return (
        <Router>
            <Routes>
                {/* Default route for intro page */}
                {/*<Route path="/" element={<IntroPage />} />*/}
                <Route index element={<IntroPage />} />

                {/* Routes for Login/SignUp */}
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes inside Layout */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="cars" element={<Cars />} />
                    <Route path="cars/add" element={<AddCar />} />
                    <Route path="cars/edit/:id" element={<EditCar />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="bookings/add/:id" element={<AddBooking />} />
                    <Route path="current-booking" element={<CurrentBooking />} />
                    <Route path="booking-history" element={<BookingHistory />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customers/:id" element={<CustomerDetails />} />
                    <Route path="instant-booking" element={<InstantBooking />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
