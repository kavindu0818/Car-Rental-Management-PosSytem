import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiCalendar } from 'react-icons/fi';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const { customers } = useSelector(state => state.customers);
  const { bookings } = useSelector(state => state.bookings);
  const { cars } = useSelector(state => state.cars);
  
  useEffect(() => {
    const foundCustomer = customers.find(c => c.id === id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
    } else {
      navigate('/customers');
    }
  }, [id, customers, navigate]);
  
  if (!customer) {
    return <div>Loading...</div>;
  }
  
  // Get customer's bookings
  const customerBookings = bookings.filter(booking => booking.customerId === customer.id);
  
  // Sort bookings by date (most recent first)
  const sortedBookings = [...customerBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Calculate statistics
  const totalBookings = customerBookings.length;
  const activeBookings = customerBookings.filter(booking => booking.status === 'active').length;
  const completedBookings = customerBookings.filter(booking => booking.status === 'completed').length;
  const totalSpent = customerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-sm text-gray-500">Customer since {customer.createdAt}</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{customer.name}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{customer.email}</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">License: {customer.licenseNumber}</span>
              </div>
              <div className="flex items-start">
                <FiMapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-700">{customer.address}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-xl font-bold text-gray-900">{totalBookings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Active Bookings</p>
                <p className="text-xl font-bold text-gray-900">{activeBookings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Completed Trips</p>
                <p className="text-xl font-bold text-gray-900">{completedBookings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">${totalSpent}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Booking History</h3>
              <Link 
                to="/bookings/add" 
                state={{ customerId: customer.id }}
                className="btn btn-primary text-sm"
              >
                New Booking
              </Link>
            </div>
            
            {sortedBookings.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No bookings found for this customer.</p>
                <Link 
                  to="/bookings/add" 
                  state={{ customerId: customer.id }}
                  className="mt-4 inline-block btn btn-primary"
                >
                  Create first booking
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Car
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedBookings.map(booking => {
                      const car = cars.find(c => c.id === booking.carId);
                      
                      return (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{booking.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {car && (
                                  <img 
                                    className="h-10 w-10 rounded-md object-cover" 
                                    src={car.image} 
                                    alt={car.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/40?text=Car';
                                    }}
                                  />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {car ? `${car.name} ${car.model}` : 'Unknown Car'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {car ? `${car.year} • ${car.type}` : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiCalendar className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">
                                {booking.startDate} to {booking.endDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'active' ? 'bg-green-100 text-green-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              booking.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;