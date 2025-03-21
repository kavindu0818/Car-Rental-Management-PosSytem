import React, { useEffect } from 'react';  // Add React import here
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiTruck, FiCalendar, FiDollarSign, FiUsers, FiPlus } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import { setDashboardStats } from '../store/slices/dashboardSlice';
import {getHistory} from "../store/slices/HistorySlice.js";
import {getCars} from "../store/slices/carsSlice.js";
import {getCustomers} from "../store/slices/customersSlice.js";
import {getBookings} from "../store/slices/bookingSlice.js";
import {BiHistory, BiMoney} from "react-icons/bi";
import {AiFillDashboard} from "react-icons/ai";
import {number} from "yup";
import {PiCar} from "react-icons/pi";
import {HiCurrencyRupee} from "react-icons/hi";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector(state => state.dashboard);
  const cars = useSelector(state => state.cars.cars);
  const bookings = useSelector(state => state.bookings.bookings);
  const customers = useSelector(state => state.customers.customers);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    // Calculate dashboard statistics
    const totalCars = cars.length;
    const totalBooking = bookings.length;
    const availableCars = cars.filter(car => car.available).length;
    const activeBookings = bookings.filter(booking => booking.status === 'active').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalCustomers = customers.length;

    // Generate monthly revenue data (sample data for demonstration)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 1200 },
      { month: 'Feb', revenue: 1900 },
      { month: 'Mar', revenue: 1500 },
      { month: 'Apr', revenue: 2200 },
      { month: 'May', revenue: 2800 },
      { month: 'Jun', revenue: 2100 },
    ];

    // useEffect(() => {
    //   // dispatch(getCars());
    //   // dispatch(getCustomers());
    //   dispatch(getBookings());
    // }, [dispatch]);

    // Get recent bookings
    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // Get popular cars based on booking frequency
    const carBookingCount = {};
    bookings.forEach(booking => {
      if (!carBookingCount[booking.carId]) {
        carBookingCount[booking.carId] = 0;
      }
      carBookingCount[booking.carId]++;
    });

    const popularCars = Object.entries(carBookingCount)
        .map(([number, count]) => ({
          cars: cars.find(car => car.number === number),
          bookingCount: count,
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 3);

    dispatch(setDashboardStats({
      totalBooking,
      totalCars,
      availableCars,
      activeBookings,
      totalRevenue,
      totalCustomers,
      monthlyRevenue,
      recentBookings,
      popularCars,
    }));
  }, [cars, bookings, customers, dispatch]);

  const chartData = {
    labels: stats.monthlyRevenue?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats.monthlyRevenue?.map(item => item.revenue) || [],
        backgroundColor: 'rgba(12, 10, 36)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <AiFillDashboard className="text-5xl text-blue-900"/>
            {/*<div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">*/}
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900">Dashboard</h1>
              <h6 className="text-gray-600 text-lg font-semibold mt-2">
                Welcome back, <span className="text-blue-600">{userInfo?.username}</span>!
              </h6>
            </div>
            {/*<div className="bg-blue-100 relative -right-96 text-blue-900 px-4 py-2 rounded-md text-sm font-medium">*/}
            {/*  Today: {new Date().toLocaleDateString()}*/}
            {/*</div>*/}
            {/*</div>*/}

          </div>
          {/*  <div className="flex space-x-3">*/}
          {/*    <Link to="/cars/add" className="btn btn-primary bg-blue-950 flex items-center">*/}
          {/*      <FiPlus className="mr-1"/> Add Car*/}
          {/*    </Link>*/}
          {/*    <Link to="/bookings" className="btn btn-primary bg-blue-950 flex items-center">*/}
          {/*      <FiPlus className="mr-1"/> Add Booking*/}
          {/*    </Link>*/}
          {/*  </div>*/}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
              title="Total Cars"
              value={stats.totalCars}
              icon={PiCar}
              change="5%"
              changeType="increase"
          />
          <StatCard
              title="Active Bookings"
              value={stats.totalBooking}
              icon={FiCalendar}
              change="12%"
              changeType="increase"
          />
          <StatCard
              title="Total Revenue"
              value={`Rs ${stats.totalRevenue}`}
              icon={BiMoney}
              change="8%"
              changeType="increase"
          />
          <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={FiUsers}
              change="3%"
              changeType="increase"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h2>
            <div className="h-80">
              <Bar data={chartData} options={chartOptions}/>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Cars</h2>
            <div className="space-y-4">
              {stats.popularCars?.map(({cars, bookingCount}) => (
                  cars && (  // Fix: Ensure 'cars' exists
                      <div key={cars.number} className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          <img
                              src={cars.image}
                              alt={cars.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/100?text=Car';
                              }}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{cars.name} {cars.model}</h3>
                          <p className="text-sm text-gray-500">{cars.year} • Rs{cars.price}/day</p>
                        </div>
                        <div
                            className="flex-shrink-0 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                          {bookingCount} bookings
                        </div>
                      </div>
                  )
              ))}
            </div>
          </div>
        </div>


          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-center text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Dates
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentBookings?.map(booking => {
                  const car = cars.find(c => c.number === booking.carId);
                  const customer = customers.find(c => c.phone === booking.customerId);

                  return (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customerId || 'Unknown Customer'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {car ? `${car.name}` : 'Unknown Car'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {booking.startDate} to {booking.endDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Rs{booking.totalAmount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                        </td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        );
        };

        export default Dashboard;
