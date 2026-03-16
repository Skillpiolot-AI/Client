import React, { useState } from 'react';

const DashboardCard = ({ title, path, description, badge }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden transform hover:scale-105">
    {badge && (
      <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-semibold ${badge === 'Public' ? 'bg-blue-100 text-blue-700' :
          badge === 'User' ? 'bg-green-100 text-green-700' :
            badge === 'Mentor' ? 'bg-purple-100 text-purple-700' :
              badge === 'Admin' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
        }`}>
        {badge}
      </span>
    )}
    <h3 className="text-xl font-semibold mb-2 text-gray-800 pr-16">{title}</h3>
    <p className="text-gray-600 mb-4 text-sm">{description}</p>
    <a
      href={path}
      className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center group"
    >
      Go to {title}
      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  </div>
);

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('All');

  const sections = {
    core: [
      { title: 'Home', path: '/', description: 'Main landing page', badge: 'Public' },
      { title: 'Assessment Info', path: '/Assesmentinfo', description: 'AI-powered career assessment information', badge: 'Public' },
      { title: 'Assessment', path: '/assessment', description: 'Take career assessment test', badge: 'Public' },
      { title: 'Profile', path: '/profile', description: 'View and edit your profile', badge: 'User' },
      { title: 'Dashboard', path: '/dashboard', description: 'User dashboard overview', badge: 'User' },
    ],

    auth: [
      { title: 'Login', path: '/login', description: 'Log in to your account', badge: 'Public' },
      { title: 'Signup', path: '/signup', description: 'Create a new account', badge: 'Public' },
      { title: 'Forgot Password', path: '/forgot-password', description: 'Reset your password', badge: 'Public' },
      { title: 'Verify Email', path: '/verify-email', description: 'Email verification page', badge: 'Public' },
      { title: 'Verify Login', path: '/verify-login', description: 'Login verification page', badge: 'Public' },
    ],

    career: [
      { title: 'Career Form', path: '/careerform', description: 'Fill out your career information', badge: 'User' },
      { title: 'Recommendation', path: '/recommendation', description: 'Get personalized job recommendations', badge: 'Public' },
      { title: 'Recommendation Form', path: '/recommendationForm', description: 'Fill out recommendation form', badge: 'Mentor' },
      { title: 'Career Questions', path: '/question', description: 'Answer career-related questions', badge: 'Public' },
      { title: 'Career Quiz', path: '/careerquiz', description: 'Take career assessment quiz', badge: 'Public' },
      { title: 'Combined Quiz', path: '/combinedquiz', description: 'Advanced career prediction quiz', badge: 'Public' },
      { title: 'Career Paths', path: '/careerPaths', description: 'Explore tech career paths', badge: 'Public' },
      { title: 'All Job Titles', path: '/jobtitleall', description: 'Search all job titles', badge: 'Public' },
      { title: 'Job Info', path: '/job-info', description: 'View job information', badge: 'Public' },
      { title: 'Dummy Job Info', path: '/dummyinfo', description: 'Sample job information', badge: 'Public' },
    ],

    mentorship: [
      { title: 'Mentorship Home', path: '/mentorHome', description: 'Mentorship program overview', badge: 'Public' },
      { title: 'Find Mentors', path: '/mentors', description: 'Browse and book available mentors', badge: 'Public' },
      { title: 'My Priority DMs', path: '/my-dms', description: 'View and manage your Priority DMs with mentors', badge: 'User' },
      { title: 'Student DMs', path: '/mentor-dms', description: 'Manage async Priority DMs with students', badge: 'Mentor' },
      { title: 'Mentor Dashboard', path: '/mentorDashboard', description: 'Mentor profile and settings', badge: 'Mentor' },
      { title: 'Become a Mentor', path: '/application', description: 'Apply to become a mentor', badge: 'User' },
      { title: 'Track Application', path: '/tracker', description: 'Track your mentor application status', badge: 'User' },
      { title: 'My Appointments', path: '/my-applications', description: 'View scheduled appointments', badge: 'User' },
      { title: 'My Bookings', path: '/my-bookings', description: 'View your booking history', badge: 'User' },
      { title: 'Mentor Sessions', path: '/mentor-sessions', description: 'Manage your mentoring sessions', badge: 'Mentor' },
      { title: 'My Sessions (Old)', path: '/my-sessions', description: 'Legacy session view', badge: 'Mentor' },
      { title: 'Book Session', path: '/schedulementor', description: 'Schedule a mentoring session', badge: 'Public' },
      { title: 'Rate Session', path: '/rate-session/:bookingId', description: 'Rate your completed session', badge: 'User' },
      { title: 'User Feedback', path: '/userFeedback', description: 'View all user feedback', badge: 'Admin' },
    ],

    learning: [
      { title: 'Add Videos', path: '/learn', description: 'Upload educational videos', badge: 'Admin' },
      { title: 'Video Library', path: '/learnlist', description: 'Browse training videos', badge: 'Public' },
      { title: 'Add Resources', path: '/addResources', description: 'Add books and materials', badge: 'Admin' },
      { title: 'Resource Library', path: '/view-books', description: 'Browse books and resources', badge: 'Public' },
      { title: 'Workshops', path: '/workshops', description: 'Explore available workshops', badge: 'Public' },
      { title: 'Add Workshop', path: '/workshopAdd', description: 'Create new workshop', badge: 'Admin' },
    ],

    roadmaps: [
      { title: 'Career Roadmaps', path: '/roadmap', description: 'Explore career paths', badge: 'Public' },
      { title: 'Software Engineer', path: '/softwareengineer', description: 'Frontend developer roadmap', badge: 'Public' },
      { title: 'Data Scientist', path: '/datascientist', description: 'Data science career path', badge: 'Public' },
      { title: 'All Career Paths', path: '/careerPaths', description: 'Browse all tech career paths', badge: 'Public' },
    ],

    admin: [
      { title: 'Admin Dashboard', path: '/dashboardAdmin', description: 'Main admin control panel', badge: 'Admin' },
      { title: 'Analytics', path: '/analytics', description: 'System analytics and metrics', badge: 'Admin' },
      { title: 'Announcements', path: '/admin/announcements', description: 'Send notifications to users', badge: 'Admin' },
      { title: 'User Management', path: '/admin/user-management', description: 'Manage all users', badge: 'Admin' },
      { title: 'User Data', path: '/admin/userData', description: 'Detailed user analytics', badge: 'Admin' },
      { title: 'Mentor Applications', path: '/mentoapplication', description: 'Review mentor applications', badge: 'Admin' },
      { title: 'Add Mentor', path: '/addmentor', description: 'Register new mentors', badge: 'Admin' },
      { title: 'Admin Updates', path: '/admin/updates', description: 'Manage platform updates', badge: 'Admin' },
      { title: 'System Settings', path: '/admin/system-settings', description: 'Configure system settings', badge: 'Admin' },
      { title: 'Server Logs', path: '/admin/server-logs', description: 'View server activity logs', badge: 'Admin' },
      { title: 'Mentor Dashboard', path: '/amdashboard', description: 'Mentor management view', badge: 'Mentor' },
    ],

    management: [
      { title: 'Job Titles', path: '/JobForm', description: 'Manage job title database', badge: 'Admin' },
      { title: 'Companies', path: '/Companyform', description: 'Manage company database', badge: 'Admin' },
      { title: 'My Interests', path: '/interestForm', description: 'Update your interests', badge: 'Mentor' },
      { title: 'My Strengths', path: '/StrengthForm', description: 'Update your strengths', badge: 'Mentor' },
      { title: 'My Skills', path: '/skillform', description: 'Manage your skills', badge: 'Mentor' },
      { title: 'Colleges', path: '/collegeform', description: 'Manage college database', badge: 'Mentor' },
      { title: 'Browse Colleges', path: '/colleges', description: 'Explore all colleges', badge: 'Public' },
    ],

    university: [
      { title: 'University Management', path: '/universityManagement', description: 'Admin university control', badge: 'Admin' },
      { title: 'University Portal', path: '/uniAdminPortal', description: 'University admin dashboard', badge: 'UniAdmin' },
      { title: 'Teacher Dashboard', path: '/teacher/dashboard', description: 'Teacher management portal', badge: 'UniTeach' },
    ],

    community: [
      { title: 'Community', path: '/community', description: 'Connect with other users', badge: 'Public' },
      { title: 'Platform Updates', path: '/updates', description: 'Latest news and updates', badge: 'Public' },
      { title: 'Documentation', path: '/docs', description: 'Platform documentation', badge: 'Public' },
    ],
  };

  const sectionTitles = {
    core: '🏠 Core Pages',
    auth: '🔐 Authentication',
    career: '💼 Career & Jobs',
    mentorship: '🎓 Mentorship',
    learning: '📚 Learning Resources',
    roadmaps: '🗺️ Career Roadmaps',
    admin: '⚙️ Admin Panel',
    management: '📋 Management',
    university: '🏫 University',
    community: '👥 Community',
  };

  const badges = ['All', 'Public', 'User', 'Mentor', 'Admin', 'UniAdmin', 'UniTeach'];

  const filteredSections = {};
  Object.entries(sections).forEach(([key, cards]) => {
    const filtered = cards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBadge = selectedBadge === 'All' || card.badge === selectedBadge;
      return matchesSearch && matchesBadge;
    });
    if (filtered.length > 0) {
      filteredSections[key] = filtered;
    }
  });

  const totalPages = Object.values(sections).flat().length;
  const filteredPages = Object.values(filteredSections).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Application Dashboard
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Navigate through all available pages and features
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {badges.map(badge => (
                <button
                  key={badge}
                  onClick={() => setSelectedBadge(badge)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedBadge === badge
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredPages} of {totalPages} pages
          </div>
        </div>

        {/* Sections */}
        {Object.entries(filteredSections).map(([key, cards]) => (
          <div key={key} className="mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-4 border-blue-500 pb-3 inline-block">
              {sectionTitles[key]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {cards.map((card, index) => (
                <DashboardCard key={index} {...card} />
              ))}
            </div>
          </div>
        ))}

        {filteredPages === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No pages found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm border-t-2 border-gray-200 pt-8">
          <p className="mb-4 text-lg font-semibold">Total Pages: {totalPages}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Public
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              User
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-medium">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Mentor
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Admin
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg font-medium">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              University
            </span>
          </div>
        </div>
      </div>

      <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out;
            }
          `}</style>
    </div>
  );
};

export default Dashboard;