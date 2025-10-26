import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import config from '../../config'

const CreativeApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    companiesWorked: [],
    experience: ''
  });
  const [jobTitles, setJobTitles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittedTrackingId, setSubmittedTrackingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobTitlesResponse, companiesResponse] = await Promise.all([
          axios.get(`${config.API_BASE_URL}/job/job-titles`),
          axios.get(`${config.API_BASE_URL}/job/companies`)
        ]);
        setJobTitles(jobTitlesResponse.data);
        setCompanies(companiesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCompanyChange = (e) => {
    const selectedCompanies = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevState => ({
      ...prevState,
      companiesWorked: selectedCompanies
    }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Replace with your actual API endpoint
//       await axios.post('http://localhost:3001/api/submit-application', formData);
//       toast.success('Application submitted successfully! Awaiting admin approval.');
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         jobTitle: '',
//         companiesWorked: [],
//         experience: ''
//       });
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       toast.error('Failed to submit application. Please try again.');
//     }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/submit-application`, formData);
      setSubmittedTrackingId(response.data.trackingId);
      toast.success('Application submitted successfully! Use the tracking ID to check your status.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        jobTitle: '',
        companiesWorked: [],
        experience: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">MentorShip Form</h2>
      {submittedTrackingId ? (
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Application Submitted Successfully!</p>
          <p className="mb-4">Your tracking ID is: <span className="font-bold text-blue-600">{submittedTrackingId}</span></p>
          <p>Use this ID to track your application status.</p>
          <a
            href={`/tracker`}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Track your application here
          </a>
          <button
            onClick={() => setSubmittedTrackingId(null)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block mb-1 font-medium">Job Title</label>
          <select
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select a job title</option>
            {jobTitles.map((job) => (
              <option key={job._id} value={job.title}>{job.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="companiesWorked" className="block mb-1 font-medium">Companies Worked</label>
          <select
            id="companiesWorked"
            name="companiesWorked"
            multiple
            value={formData.companiesWorked}
            onChange={handleCompanyChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            {companies.map((company) => (
              <option key={company._id} value={company.name}>{company.name}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple</p>
        </div>
        <div>
          <label htmlFor="experience" className="block mb-1 font-medium">Experience (1-10 years)</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="1"
            max="10"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
          Submit Application
        </button>
        </form>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default CreativeApplicationForm;