import React, { useState } from 'react';

const DashboardCard = ({ title, path, description, badge, iconColor, bgColor }) => {
  const badgeStyles = {
    Public: 'bg-surface-container-highest text-on-surface',
    User: 'bg-primary-container text-white',
    Mentor: 'bg-tertiary-container text-white',
    Admin: 'bg-secondary-container text-on-secondary-container',
    University: 'bg-surface-container-highest text-primary',
    UniAdmin: 'bg-surface-container-highest text-primary',
    UniTeach: 'bg-surface-container-highest text-primary',
  };

  const badgeText = badge === 'UniAdmin' || badge === 'UniTeach' ? 'University' : badge;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`material-symbols-outlined ${iconColor || 'text-primary'} p-2 ${bgColor || 'bg-surface-container-low'} rounded-lg`}>
            {description.includes('Auth') || description.includes('Log') || description.includes('Sign') ? 'lock' : 
             description.includes('Analytics') ? 'analytics' :
             description.includes('User') || description.includes('Profile') ? 'person' :
             description.includes('Career') || description.includes('Job') ? 'work' :
             description.includes('Mentor') ? 'groups' :
             description.includes('University') || description.includes('Teacher') ? 'school' : 'dashboard'}
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded ${badgeStyles[badge] || 'bg-surface-container-highest'}`}>
            {badgeText}
          </span>
        </div>
        <h3 className="font-headline font-bold text-lg text-primary mb-1">{title}</h3>
        <code className="text-xs text-secondary bg-surface-container-low px-2 py-1 rounded truncate block">
          {path}
        </code>
      </div>
      <a href={path} className="mt-4 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
        Go to Page
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
    </div>
  );
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('All');

  const sections = {
    core: [
      { title: 'Home', path: '/', description: 'Main landing page', badge: 'Public' },
      { title: 'Assessment Info', path: '/Assesmentinfo', description: 'AI-powered career assessment information', badge: 'Public' },
      { title: 'Assessment', path: '/assessment', description: 'Take career assessment test', badge: 'Public' },
      { title: 'Profile', path: '/profile', description: 'View and edit your profile', badge: 'User' },
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
      { title: 'Book Session', path: '/schedulementor', description: 'Schedule a mentoring session', badge: 'Public' },
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
    ],

    admin: [
      { title: 'Admin Dashboard', path: '/dashboardAdmin', description: 'Main admin control panel', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'Analytics', path: '/analytics', description: 'System analytics and metrics', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'User Management', path: '/admin/user-management', description: 'Manage all users', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'User Data', path: '/admin/userData', description: 'Detailed user analytics', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'Session Bookings', path: '/admin/bookings', description: 'Monitor and coordinate all mentor sessions', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'Mentor Applications', path: '/mentoapplication', description: 'Review mentor applications', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'Add Mentor', path: '/addmentor', description: 'Register new mentors', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'Admin Updates', path: '/admin/updates', description: 'Manage platform updates', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'System Settings', path: '/admin/system-settings', description: 'Configure system settings', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
      { title: 'Server Logs', path: '/admin/server-logs', description: 'View server activity logs', badge: 'Admin', iconColor: 'text-error', bgColor: 'bg-error-container' },
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
    core: 'Core Pages',
    auth: 'Authentication',
    career: 'Career & Jobs',
    mentorship: 'Mentorship',
    learning: 'Learning Resources',
    roadmaps: 'Career Roadmaps',
    admin: 'Admin & Management',
    management: 'Management',
    university: 'University Partners',
    community: 'Community',
  };

  const badges = ['All', 'Public', 'User', 'Mentor', 'Admin', 'University'];

  const filteredSections = {};
  Object.entries(sections).forEach(([key, cards]) => {
    const filtered = cards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const badgeText = card.badge === 'UniAdmin' || card.badge === 'UniTeach' ? 'University' : card.badge;
      const matchesBadge = selectedBadge === 'All' || badgeText === selectedBadge;
      return matchesSearch && matchesBadge;
    });
    if (filtered.length > 0) {
      filteredSections[key] = filtered;
    }
  });

  const totalPages = Object.values(sections).flat().length;
  const filteredPages = Object.values(filteredSections).flat().length;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <main class="pt-24 pb-20 px-8 max-w-[1440px] mx-auto">
        {/* Hero Section */}
        <section class="mb-16 mt-8">
          <h1 class="font-headline font-extrabold text-5xl md:text-6xl text-primary tracking-tight mb-6">Master Directory</h1>
          <p class="text-secondary max-w-2xl text-lg leading-relaxed">
            A unified roadmap of the SkillPilot ecosystem. Navigate through core services, administrative controls, and community resources from a single strategic view.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <div class="sticky top-[72px] z-40 py-6 mb-12 bg-surface/90 backdrop-blur-md">
          <div class="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div class="flex flex-wrap gap-2">
              {badges.map(badge => (
                <button
                  key={badge}
                  onClick={() => setSelectedBadge(badge)}
                  className={`px-4 py-1.5 rounded-full font-label text-xs tracking-wider uppercase transition-colors ${
                    selectedBadge === badge
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {badge === 'All' ? 'All Roles' : badge}
                </button>
              ))}
            </div>
            <div class="w-full md:w-96 relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
              <input
                type="text"
                placeholder="Find a specific page or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/10 font-body text-sm"
              />
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div class="space-y-16">
          {Object.entries(filteredSections).map(([key, cards]) => (
            <div key={key} className={key === 'admin' ? 'bg-surface-container-low p-8 rounded-3xl' : ''}>
              <div class="flex items-center gap-4 mb-8">
                <h2 class="font-headline font-bold text-2xl text-primary tracking-tight">{sectionTitles[key]}</h2>
                <div class={`h-[1px] flex-grow ${key === 'admin' ? 'bg-outline-variant/40' : 'bg-outline-variant/20'}`}></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                  <DashboardCard key={index} {...card} />
                ))}
              </div>
            </div>
          ))}

          {filteredPages === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">sentiment_dissatisfied</span>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No pages found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;