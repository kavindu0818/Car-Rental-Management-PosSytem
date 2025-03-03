import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { deleteCustomer } from '../store/slices/customersSlice';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector(state => state.customers);
  const { bookings } = useSelector(state => state.bookings);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const handleDeleteCustomer = (id) => {
    const customerBookings = bookings.filter(booking => booking.customerId === id);

    if (customerBookings.length > 0) {
      alert('Cannot delete customer with existing bookings. Please delete the bookings first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
    }
  };

  const handleAddCustomer = (values) => {
    dispatch({ type: 'customers/addCustomer', payload: values });
    setShowAddCustomer(false);
  };

  const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <button
              onClick={() => setShowAddCustomer(true)}
              className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-1" /> Add New Customer
          </button>
        </div>

        {/* Add Customer Form */}
        {showAddCustomer && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Add New Customer</h2>
                <button
                    onClick={() => setShowAddCustomer(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
              <CustomerForm onSubmit={handleAddCustomer} />
            </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="input pl-10"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Customer Table */}
        {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No customers found matching your criteria.</p>
              <button
                  onClick={() => setShowAddCustomer(true)}
                  className="mt-4 btn btn-primary"
              >
                Add a new customer
              </button>
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map(customer => {
                  const customerBookings = bookings.filter(booking => booking.customerId === customer.id);
                  const activeBookings = customerBookings.filter(booking => booking.status === 'active').length;

                  return (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">Since {customer.createdAt}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.licenseNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customerBookings.length} total</div>
                          {activeBookings > 0 && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {activeBookings} active
                        </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link to={`/customers/${customer.id}`} className="text-primary-600 hover:text-primary-900">
                              <FiEye className="h-5 w-5" />
                            </Link>
                            <button
                                onClick={() => alert('Edit functionality would be implemented here')}
                                className="text-blue-600 hover:text-blue-900"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};

export default Customers;
