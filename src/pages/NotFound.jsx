import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center btn btn-primary">
            <FiHome className="mr-2" /> Go to Dashboard
          </Link>
        </div>
      </div>
  );
};

export default NotFound;
