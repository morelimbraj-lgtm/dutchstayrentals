
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-6xl font-bold text-indigo-400">404</h1>
      <h2 className="text-3xl font-semibold text-white mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-8">
        <Button>
            Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
