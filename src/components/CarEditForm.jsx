import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CarEditForm = ({props, onSubmit, initialValues = null }) => {
    const validationSchema = Yup.object({
        name: Yup.string().required('Car name is required'),
        model: Yup.string().required('Model is required'),
        year: Yup.number()
            .required('Year is required')
            .min(1900, 'Year must be at least 1900')
            .max(new Date().getFullYear() + 1, `Year cannot be greater than ${new Date().getFullYear() + 1}`),
        type: Yup.string().required('Car type is required'),
        price: Yup.number()
            .required('Price is required')
            .min(1, 'Price must be greater than 0'),
        image: Yup.string().required('Image URL is required'),
        site: Yup.string().required('Site is required'),
        fuel: Yup.string().required('Fuel is required'),
    });

    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            model: '',
            year: new Date().getFullYear(),
            type: '',
            available: true,
            price: '',
            image: '',
            site:'',
            fuel:'',
            number:''
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit({
                ...values,
                year: Number(values.year),
                price: Number(values.price),
            });
        },
    });

    const carTypes = [
        'Sedan',
        'SUV',
        'Hatchback',
        'Convertible',
        'Coupe',
        'Minivan',
        'Pickup Truck',
        'Luxury',
        'Sports Car',
        'Electric',
    ];

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Car Name
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
                    {formik.touched.name && formik.errors.name ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Model
                    </label>
                    <input
                        type="text"
                        name="model"
                        id="model"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.model}
                    />
                    {formik.touched.model && formik.errors.model ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.model}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        Year
                    </label>
                    <input
                        type="number"
                        name="year"
                        id="year"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.year}
                    />
                    {formik.touched.year && formik.errors.year ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.year}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Car Type
                    </label>
                    <select
                        name="type"
                        id="type"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.type}
                    >
                        <option value="">Select Car Type</option>
                        {carTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {formik.touched.type && formik.errors.type ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.type}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.price}
                    />
                    {formik.touched.price && formik.errors.price ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.price}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Number Plate
                    </label>
                    <input
                        type="text"
                        name="number"
                        id="number"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.number}
                    />
                    {formik.touched.number && formik.errors.number ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.number}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        site
                    </label>
                    <input
                        type="text"
                        name="site"
                        id="site"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.site}
                    />
                    {formik.touched.model && formik.errors.model ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.site}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Fuel
                    </label>
                    <input
                        type="text"
                        name="fuel"
                        id="fuel"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fuel}
                    />
                    {formik.touched.fuel && formik.errors.model ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.fuel}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image URL
                    </label>
                    <input
                        type="text"
                        name="image"
                        id="image"
                        className="input"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.image}
                    />
                    {formik.touched.image && formik.errors.image ? (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.image}</p>
                    ) : null}
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Available</label>
                    <input
                        type="checkbox"
                        name="available"
                        id="available"
                        className="h-4 w-4"
                        onChange={formik.handleChange}
                        checked={formik.values.available}
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-transparent border-2 border-black hover:text-black"
            >
                Update
            </button>
        </form>
    );
};

export default CarEditForm;
