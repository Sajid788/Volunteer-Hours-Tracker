import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Organizations = ({ user, token }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/organizations');
        setOrganizations(res.data.data);
      } catch (err) {
        setError('Error fetching organizations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">Loading organizations...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        {user && user.role === 'organization' && (
          <Link
            to="/create-organization"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Add Organization
          </Link>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {organizations.length === 0 ? (
        <p className="text-gray-600">No organizations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div
              key={org._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{org.description}</p>
                <div className="mb-3">
                  <p className="text-sm text-gray-500">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {org.address}
                  </p>
                </div>
                {org.website && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">
                      <i className="fas fa-globe mr-2"></i>
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {org.website}
                      </a>
                    </p>
                  </div>
                )}
                <Link
                  to={`/organizations/${org._id}`}
                  className="inline-block mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Organizations; 