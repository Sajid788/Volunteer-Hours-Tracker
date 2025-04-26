import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrganizationDetail = ({ user, token }) => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get(`https://volunteer-hours-tracker.vercel.app/api/organizations/${id}`);
        setOrganization(res.data.data);
      } catch (err) {
        setError('Error fetching organization details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">Loading organization details...</p>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error || 'Organization not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/organizations" className="text-blue-600 hover:underline">
          <i className="fas fa-arrow-left mr-2"></i>Back to Organizations
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{organization.name}</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700">{organization.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-blue-600"></i>
                <span>{organization.address}</span>
              </li>
              {organization.email && (
                <li className="flex items-start">
                  <i className="fas fa-envelope mt-1 mr-3 text-blue-600"></i>
                  <a
                    href={`mailto:${organization.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {organization.email}
                  </a>
                </li>
              )}
              {organization.phone && (
                <li className="flex items-start">
                  <i className="fas fa-phone mt-1 mr-3 text-blue-600"></i>
                  <span>{organization.phone}</span>
                </li>
              )}
              {organization.website && (
                <li className="flex items-start">
                  <i className="fas fa-globe mt-1 mr-3 text-blue-600"></i>
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {organization.website}
                  </a>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            {user && user.role === 'volunteer' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Log Volunteer Hours</h2>
                <Link
                  to={`/submit-hours?org=${organization._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg inline-block"
                >
                  Submit Hours for this Organization
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail; 