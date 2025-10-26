
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, path, description, index }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={path} className="text-blue-500 hover:text-blue-700 font-medium">
      Go to {title}
    </Link>
  </motion.div>
);

const Dashboard = () => {
  const cards = [
    { title: 'Home', path: '/', description: 'Main landing page' },
    { title: 'Recommendation', path: '/recommendation', description: 'Get personalized job recommendations' },
    { title: 'Career Form', path: '/careerform', description: 'Fill out your career information' },
    { title: 'Login', path: '/login', description: 'Log in to your account' },
    { title: 'Signup', path: '/signup', description: 'Create a new account' },
    { title: 'Job Titles Management', path: '/JobForm', description: 'Manage job titles' },
    { title: 'Companies Management', path: '/Companyform', description: 'Manage company information' },
    { title: 'Application Form', path: '/application', description: 'Submit a new application' },
    { title: 'Admin Applications', path: '/mentoapplication', description: 'View and manage applications' },
    { title: 'Application Tracker', path: '/tracker', description: 'Track your application status' },
    { title: 'Add Mentor', path: '/addmentor', description: 'Register as a mentor' },
    { title: 'Mentorship', path: '/mentorship', description: 'View available mentors' },
    { title: 'My Sessions', path: '/my-sessions', description: 'View your mentoring sessions' },
    { title: 'My Applications', path: '/my-applications', description: 'View your applications' },
    { title: 'Learn', path: '/Learn', description: 'Access educational content' },
    { title: 'Learn List', path: '/learnlist', description: 'View list of educational content' },
    { title: 'Career Questions', path: '/question', description: 'Answer career-related questions' },
    { title: 'Add Workshop', path: '/workshopAdd', description: 'Add a new workshop' },
    { title: 'Available Workshops', path: '/workshops', description: 'View available workshops' },
    { title: 'Admin Dashboard', path: '/dashboardAdmin', description: 'Access admin dashboard' },
    { title: 'Add Resources', path: '/addResources', description: 'Add educational resources' },
    { title: 'View Books', path: '/viewbooks', description: 'View available books and resources' },
    { title: 'User Feedback', path: '/userFeedback', description: 'Provide feedback on mentorship' },
    { title: 'Interest Management', path: '/interestForm', description: 'Manage your interests' },
    { title: 'Strength Management', path: '/StrengthForm', description: 'Manage your strengths' },
    { title: 'Skills Management', path: '/skillform', description: 'Manage your skills' },
    { title: 'Colleges Management', path: '/collegeform', description: 'Manage college information' },
    { title: 'Recommendation Form', path: '/recommendationForm', description: 'Fill out recommendation form' },
  ];

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Application Dashboard
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;