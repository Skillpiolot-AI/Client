import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config'
const ApplicationTracker = () => {
  const [trackingId, setTrackingId] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/track/${trackingId}`);
      setApplicationStatus(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error tracking application:', error);
      toast.error('Failed to track application. Please check your tracking ID and try again.');
      setLoading(false);
      setApplicationStatus(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Track Your Application</h2>
      <form onSubmit={handleTrack} className="space-y-4">
        <div>
          <label htmlFor="trackingId" className="block mb-1 font-medium">Tracking ID</label>
          <input
            type="text"
            id="trackingId"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your 5-digit tracking ID"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track Application'}
        </button>
      </form>
      {applicationStatus && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Application Status</h3>
          <p>Tracking ID: {applicationStatus.trackingId}</p>
          <p>Status: <span className={`font-bold ${
            applicationStatus.status === 'Pending' ? 'text-yellow-500' :
            applicationStatus.status === 'Approved' ? 'text-green-500' : 'text-red-500'
          }`}>{applicationStatus.status}</span></p>
          <p>Submitted: {new Date(applicationStatus.submittedAt).toLocaleDateString()}</p>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ApplicationTracker;