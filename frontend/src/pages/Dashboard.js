import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, token, toast }) => {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [totalApprovedHours, setTotalApprovedHours] = useState(0);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [editingHour, setEditingHour] = useState(null);
  const [editForm, setEditForm] = useState({
    description: '',
    hours: '',
    date: '',
    status: 'pending'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    hourId: null
  });

  const fetchHours = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://volunteer-hours-tracker.vercel.app/api/hours', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHours(res.data.data);

      // Calculate stats
      const pendingHours = res.data.data.filter((h) => h.status === 'pending').length;
      const approvedHours = res.data.data.filter((h) => h.status === 'approved').length;
      const rejectedHours = res.data.data.filter((h) => h.status === 'rejected').length;

      // Calculate total approved hours
      const totalHours = res.data.data
        .filter((h) => h.status === 'approved')
        .reduce((acc, hour) => acc + hour.hours, 0);

      setStats({
        pending: pendingHours,
        approved: approvedHours,
        rejected: rejectedHours,
      });

      setTotalApprovedHours(totalHours);
    } catch (err) {
      toast.error('Error fetching volunteer hours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHours();
  }, [token, toast]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Function to get badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Handler for updating hour status
  const handleStatusUpdate = async (hourId, newStatus) => {
    setActionLoading(true);
    
    try {
      await axios.put(
        `https://volunteer-hours-tracker.vercel.app/api/hours/${hourId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(`Hours ${newStatus} successfully`);
      // Refresh hours data
      fetchHours();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${newStatus} hours`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handler for deleting hours
  const handleDeleteHours = async (hourId) => {
    setDeleteDialog({
      isOpen: true,
      hourId: hourId
    });
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    setActionLoading(true);
    
    try {
      await axios.delete(`https://volunteer-hours-tracker.vercel.app/api/hours/${deleteDialog.hourId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Hours deleted successfully');
      // Refresh hours data
      fetchHours();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete hours');
    } finally {
      setActionLoading(false);
      setDeleteDialog({ isOpen: false, hourId: null });
    }
  };

  // Cancel delete handler
  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, hourId: null });
  };

  // Start editing an hour record
  const startEditing = (hour) => {
    setEditingHour(hour._id);
    setEditForm({
      description: hour.description,
      hours: hour.hours,
      date: formatDateForInput(hour.date),
      status: hour.status
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingHour(null);
    setEditForm({
      description: '',
      hours: '',
      date: '',
      status: 'pending'
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // Save edited hour
  const saveEditedHour = async (hourId) => {
    setActionLoading(true);
    
    try {
      await axios.put(
        `https://volunteer-hours-tracker.vercel.app/api/hours/${hourId}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success('Hours updated successfully');
      // Refresh hours data
      fetchHours();
      cancelEditing();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update hours');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Approved Hours</p>
            <p className="text-2xl font-bold text-blue-600">{totalApprovedHours.toFixed(1)}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Pending Hours</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Approved Hours</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Rejected Hours</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {user?.role === 'volunteer' && (
        <div className="mb-6">
          <Link
            to="/submit-hours"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Submit New Hours
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Hours</h2>
        {hours.length === 0 ? (
          <p className="text-gray-600">No volunteer hours recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Organization</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Hours</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  {(user?.role === 'admin' || user?.role === 'organization') && (
                    <th className="py-3 px-4 text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hours.map((hour) => (
                  <tr key={hour._id} className="hover:bg-gray-50">
                    {editingHour === hour._id ? (
                      <>
                        <td className="py-3 px-4" colSpan="4">
                          <div className="space-y-2">
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
                              <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="2"
                              ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Hours</label>
                                <input
                                  type="number"
                                  name="hours"
                                  value={editForm.hours}
                                  onChange={handleEditChange}
                                  min="0.25"
                                  step="0.25"
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-bold mb-1">Date</label>
                                <input
                                  type="date"
                                  name="date"
                                  value={editForm.date}
                                  onChange={handleEditChange}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            name="status"
                            value={editForm.status}
                            onChange={handleEditChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEditedHour(hour._id)}
                              disabled={actionLoading}
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4">
                          {hour.organization.name}
                        </td>
                        <td className="py-3 px-4">{hour.description}</td>
                        <td className="py-3 px-4">{formatDate(hour.date)}</td>
                        <td className="py-3 px-4">{hour.hours}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                              hour.status
                            )}`}
                          >
                            {hour.status.charAt(0).toUpperCase() + hour.status.slice(1)}
                          </span>
                        </td>
                        {(user?.role === 'admin' || (user?.role === 'organization' && hour.status === 'pending')) && (
                          <td className="py-3 px-4">
                            <div className="flex space-x-1">
                              {hour.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(hour._id, 'approved')}
                                    disabled={actionLoading}
                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(hour._id, 'rejected')}
                                    disabled={actionLoading}
                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {user?.role === 'admin' && (
                                <>
                                  <button
                                    onClick={() => startEditing(hour)}
                                    disabled={actionLoading}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteHours(hour._id)}
                                    disabled={actionLoading}
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded text-xs"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete these hours? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 