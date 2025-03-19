import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { deleteCustomer, getCustomers, saveCustomer, updateCustomer } from '../store/slices/customersSlice';
import CustomerForm from '../components/CustomerForm';
import CustomerUpdateModal from '../pages/CustomerUpdateModal.jsx'; // ✅ Ensure this is imported
import { BsFilePerson } from "react-icons/bs";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector(state => state.customers);
  const { bookings = [] } = useSelector(state => state.bookings);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // ✅ State for Update Modal

  const handleDeleteCustomer = (id) => {
    const customerBookings = bookings.filter(booking => booking.customerId === id);
    if (customerBookings.length > 0) {
      alert('Cannot delete customer with existing bookings. Please delete the bookings first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(id));
      setShowAddCustomer(false);
    }
  };

  const handleAddCustomer = (values) => {
    dispatch(saveCustomer(values));
    setShowAddCustomer(false);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer); // ✅ Set selected customer
    setShowUpdateModal(true); // ✅ Show modal
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    dispatch(updateCustomer(updatedCustomer)); // ✅ Dispatch update action
    setShowUpdateModal(false); // ✅ Close modal
  };

  const filteredCustomers = customers.filter(
      (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
  );

  return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-4">
            <BsFilePerson className="text-5xl text-blue-900"/>
            <div>
              <h1 className="text-3xl font-bold text-blue-950">Customer Management</h1>
              <h6 className="text-gray-500 text-lg font-bold">Manage your fleet efficiently</h6>
            </div>
          </div>
          <button
              onClick={() => setShowAddCustomer(true)}
              className="bg-blue-950 hover:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center shadow-md transition duration-300"
          >
            <FiPlus className="mr-2 text-xl"/> Add Customer
          </button>
        </div>

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
              <CustomerForm onSubmit={handleAddCustomer}/>
            </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400"/>
            </div>
            <input
                type="text"
                className="w-full p-2 pl-10 border border-gray-300 rounded"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No customers found matching your criteria.</p>
              <button
                  onClick={() => setShowAddCustomer(true)}
                  className="mt-4 bg-blue-950 text-white px-6 py-2 rounded-lg"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map(customer => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                      <div className="text-sm text-gray-500">Since {customer.createdAt}</div>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.license}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FiEdit/>
                        </button>
                        <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2/>
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* ✅ Customer Update Modal */}
        {showUpdateModal && selectedCustomer && (
            <CustomerUpdateModal
                customer={selectedCustomer}
                onClose={() => setShowUpdateModal(false)}
                onUpdate={handleUpdateCustomer}
            />
        )}
      </div>
  );
};

export default Customers;
