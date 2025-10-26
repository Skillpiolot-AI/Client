import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config'

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/applications`);
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications. Please try again.');
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.put(`${config.API_BASE_URL}/applications/${id}/status`, { status });
      toast.success(`Application ${status.toLowerCase()} successfully`);
      fetchApplications(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading applications...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Applications Dashboard</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div key={app._id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{app.name}</h2>
              <p className="text-gray-600 mb-1">Email: {app.email}</p>
              <p className="text-gray-600 mb-1">Phone: {app.phone}</p>
              <p className="text-gray-600 mb-1">Job Title: {app.jobTitle}</p>
              <p className="text-gray-600 mb-1">Experience: {app.experience} years</p>
              <p className="text-gray-600 mb-3">
                Companies: {app.companiesWorked.join(', ')}
              </p>
              <p className="text-gray-600 mb-3">
                Submitted: {new Date(app.submittedAt).toLocaleDateString()}
              </p>
              <p className={`font-semibold mb-4 ${
                app.status === 'Pending' ? 'text-yellow-500' :
                app.status === 'Approved' ? 'text-green-500' : 'text-red-500'
              }`}>
                Status: {app.status}
              </p>
              {app.status === 'Pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateApplicationStatus(app._id, 'Approved')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminApplicationsPage;