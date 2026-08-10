import React from 'react';
import { Link } from 'react-router';

const Error = () => {
    return (
        <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-9xl font-extrabold text-slate-700">404</h1>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Page Not Found
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        Oops! The page you're looking for doesn't exist.
                        It might have been moved or deleted.
                    </p>
                </div>
                <div>
                    <Link to={'/'}
                        className="w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-transparent text-sm font-bold rounded-lg text-white bg-slate-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg">
                        Go Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error;