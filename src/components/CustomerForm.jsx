import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const CustomerForm = ({ onSubmit, initialValues = null }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    licenseNumber: Yup.string().required("License number is required"),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      email: "",
      phone: "",
      address: "",
      licenseNumber: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
                type="text"
                name="name"
                id="name"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
                type="email"
                name="email"
                id="email"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
                type="text"
                name="phone"
                id="phone"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
              Driver's License Number
            </label>
            <input
                type="text"
                name="licenseNumber"
                id="licenseNumber"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.licenseNumber}
            />
            {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.licenseNumber}</p>
            )}
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
                name="address"
                id="address"
                rows={3}
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.address}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            {initialValues ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>
  );
};

export default CustomerForm;
