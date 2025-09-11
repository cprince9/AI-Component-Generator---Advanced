import React from 'react';
import { Link } from 'react-router-dom';
import { LuFileWarning } from "react-icons/lu";

const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
        <LuFileWarning className="text-purple-400 text-7xl mb-4" />
        <h1 className="text-5xl font-extrabold text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mb-8">
            Sorry, the page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link
            to="/"
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
        >
            Go Back to Home
        </Link>
    </div>
  );
};

export default NoPage;