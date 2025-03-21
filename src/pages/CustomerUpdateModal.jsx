import React, { useState, useEffect } from 'react';
import { updateCustomer } from "../store/slices/customersSlice.js";
import { useDispatch } from "react-redux";

const CustomerUpdateModal = ({ customer, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        license: '',
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || '',
                license: customer.license || '',
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Update Model", formData);
        dispatch(updateCustomer(formData))
            .then(() => {
                onClose();
            })
            .catch((error) => {
                console.error("Update failed:", error);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-96 max-h-[95vh] overflow-auto">
                <div className="flex justify-between items-center  mb-3 ">
                    <h2 className="text-lg font-semibold text-blue-950">Update Customer</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-gray-700 text-sm">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">License</label>
                        <input
                            type="text"
                            name="license"
                            value={formData.license}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full text-sm"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-950  font-bold text-white px-5 py-2 rounded-lg text-sm hover:bg-transparent border-2 border-black hover:text-black font-bold"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerUpdateModal;
