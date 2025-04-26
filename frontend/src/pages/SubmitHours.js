import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SubmitHours = ({ user, token, toast }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orgIdFromQuery = queryParams.get('org');

  const [formData, setFormData] = useState({
    organization: orgIdFromQuery || '',
    description: '',
    hours: '',
    date: new Date().toISOString().substr(0, 10) // Today in YYYY-MM-DD format
  });
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://volunteer-hours-tracker.vercel.app/api/organizations');
        setOrganizations(res.data.data);
      } catch (err) {
        toast.error('Error loading organizations. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const { organization, description, hours, date } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await axios.post(
        'https://volunteer-hours-tracker.vercel.app/api/hours',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Volunteer hours submitted successfully!');
      
      // Clear form
      setFormData({
        organization: '',
        description: '',
        hours: '',
        date: new Date().toISOString().substr(0, 10)
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to submit volunteer hours. Please try again.'
      );
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">Loading organizations...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Submit Volunteer Hours</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="organization">
              Organization
            </label>
            <select
              id="organization"
              name="organization"
              value={organization}
              onChange={onChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select an Organization</option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description of Work
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Describe the volunteer work you did"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hours">
              Hours
            </label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={hours}
              onChange={onChange}
              required
              min="0.25"
              step="0.25"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Number of hours (e.g., 2.5)"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={onChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={submitLoading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                submitLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitLoading ? 'Submitting...' : 'Submit Hours'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitHours; 