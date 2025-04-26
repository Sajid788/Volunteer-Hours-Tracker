import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-50 rounded-lg p-8 max-w-4xl text-center mb-8 shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Track Your Volunteer Hours</h1>
        <p className="text-xl text-gray-700 mb-6">
          Easily record, track, and verify your volunteer hours across different organizations in one place.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg"
          >
            Get Started
          </Link>
          <Link
            to="/organizations"
            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-bold text-lg"
          >
            View Organizations
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-4xl mb-4">
            <i className="fas fa-clock"></i>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Track Hours</h2>
          <p className="text-gray-600">
            Record your volunteer hours with ease. Specify the organization, date, and
            duration with detailed descriptions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-green-600 text-4xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Verify Hours</h2>
          <p className="text-gray-600">
            Organizations can easily verify your contributed hours, making
            it official and adding credibility to your service.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-purple-600 text-4xl mb-4">
            <i className="fas fa-chart-bar"></i>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Generate Reports</h2>
          <p className="text-gray-600">
            Get insights into your volunteer work with detailed reports
            showing your contributions across different organizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 