import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, ChevronRight, Book, Layers, Users, Settings, FileText, Shield, GraduationCap, Building2, MessageSquare, Route, Briefcase, FolderTree, Zap, Home as HomeIcon, Search } from 'lucide-react';

// Documentation Page with Light/Dark Mode
const DocsPage = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('docs-dark-mode');
        return saved ? JSON.parse(saved) : true;
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        localStorage.setItem('docs-dark-mode', JSON.stringify(darkMode));
    }, [darkMode]);

    // Documentation sections
    const sections = [
        {
            title: 'Getting Started',
            items: [
                { id: 'overview', name: 'Overview', icon: Book },
                { id: 'installation', name: 'Installation', icon: Zap },
                { id: 'project-structure', name: 'Project Structure', icon: FolderTree },
            ]
        },
        {
            title: 'Core Pages',
            items: [
                { id: 'landing', name: 'Landing Page', icon: HomeIcon },
                { id: 'auth', name: 'Authentication', icon: Shield },
                { id: 'profile', name: 'User Profile', icon: Users },
            ]
        },
        {
            title: 'Mentorship',
            items: [
                { id: 'mentor-list', name: 'Mentor List', icon: Users },
                { id: 'bookings', name: 'Bookings', icon: Briefcase },
                { id: 'sessions', name: 'Sessions', icon: MessageSquare },
                { id: 'application', name: 'Mentor Application', icon: FileText },
            ]
        },
        {
            title: 'Admin',
            items: [
                { id: 'admin-dashboard', name: 'Dashboard', icon: Layers },
                { id: 'user-management', name: 'User Management', icon: Users },
                { id: 'system-settings', name: 'System Settings', icon: Settings },
                { id: 'university', name: 'University Admin', icon: Building2 },
            ]
        },
        {
            title: 'Career Tools',
            items: [
                { id: 'career-paths', name: 'Career Paths', icon: Route },
                { id: 'assessment', name: 'Assessment', icon: GraduationCap },
                { id: 'workshops', name: 'Workshops', icon: Briefcase },
            ]
        },
    ];

    // Page documentation content
    const content = {
        overview: {
            title: 'SkillPilot Documentation',
            subtitle: 'Complete guide to the career guidance platform',
            content: `
## Welcome to SkillPilot

SkillPilot is a comprehensive career guidance and mentorship platform designed to connect students with industry professionals. The platform provides AI-powered career recommendations, mentorship booking, workshops, and career path exploration.

### Key Features

- **Mentorship Program**: Connect with verified industry mentors for 1-on-1 guidance
- **Career Assessment**: AI-powered career path recommendations based on your interests
- **Workshops**: Access to live and recorded professional development sessions
- **Community**: Engage with peers and mentors in a supportive community
- **Resource Library**: Curated books, articles, and learning materials

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT, Google OAuth |
| Video | Jitsi Meet Integration |
      `
        },
        installation: {
            title: 'Installation',
            subtitle: 'Get started with SkillPilot development',
            content: `
## Prerequisites

- Node.js 18+ 
- MongoDB instance
- npm or yarn

## Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/skillpilot.git

# Install client dependencies
cd Client-landing-page
npm install

# Install server dependencies
cd ../Server-college\\ 2
npm install
\`\`\`

## Environment Setup

Create a \`.env\` file in the server directory:

\`\`\`env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=...
\`\`\`

## Running the Application

\`\`\`bash
# Terminal 1: Start the server
cd Server-college\\ 2
npm run dev

# Terminal 2: Start the client
cd Client-landing-page
npm run dev
\`\`\`

The client will be available at \`http://localhost:5173\` and the API at \`http://localhost:3001\`.
      `
        },
        'project-structure': {
            title: 'Project Structure',
            subtitle: 'Understanding the codebase organization',
            content: `
## Frontend Structure

\`\`\`
src/
├── App.jsx                 # Main router configuration
├── AuthContext.jsx         # Authentication provider
├── config.jsx              # API configuration
├── main.jsx                # React entry point
│
├── Pages/
│   ├── Admin/              # Admin dashboard & management
│   ├── Colleges/           # College listing
│   ├── community/          # Community features
│   ├── DashBoard/          # User & mentor dashboards
│   ├── Docs/               # Documentation (you are here!)
│   ├── Error/              # 404 and error pages
│   ├── Forms/              # Data management forms
│   ├── MentorShip/         # Mentorship features
│   │   ├── MentorList/     # Browse mentors
│   │   ├── Bookings/       # Booking management
│   │   └── Form/           # Mentor application
│   ├── Profile/            # User profile
│   ├── Protection/         # Route guards
│   ├── Quiz/               # Career assessment
│   ├── Recommendation/     # Job recommendations
│   ├── Resourses/          # Learning resources
│   ├── Roadmap/            # Career roadmaps
│   ├── University/         # University management
│   ├── updates/            # Platform updates
│   ├── User/               # Auth pages (Login, Signup)
│   └── Workshops/          # Workshop listings
│
├── homepage/
│   ├── landing/            # Landing page components
│   └── pages/              # Landing page
│
├── Roadmap/                # Career path visualizations
├── Assesment/              # Assessment module
├── chatbot/                # AI chatbot
└── AILandingpage/          # AI features landing
\`\`\`

## Backend Structure

\`\`\`
Server-college 2/
├── index.js                # Express entry point
├── controllers/            # Business logic
│   ├── authController.js
│   ├── bookingController.js
│   ├── mentorController.js
│   └── applicationController.js
├── models/                 # MongoDB schemas
├── routes/                 # API route definitions
├── middleware/             # Auth & validation
└── scripts/                # Utility scripts
\`\`\`
      `
        },
        landing: {
            title: 'Landing Page',
            subtitle: 'The main entry point for users',
            content: `
## Overview

The landing page (\`/\`) is the first page users see. It showcases the platform's features and guides users to sign up or explore.

### Components

- **Navbar**: Navigation with server status indicator, user menu, and dark mode
- **Hero Section**: Main call-to-action
- **Features Grid**: Platform highlights
- **Testimonials**: User success stories
- **Footer**: Links and social media

### Route

\`\`\`jsx
<Route path="/" element={<Landingpage />} />
\`\`\`

### Key File

\`src/homepage/pages/LandingPage.jsx\`
      `
        },
        auth: {
            title: 'Authentication',
            subtitle: 'Login, Signup, and Session Management',
            content: `
## Auth Flow

SkillPilot uses JWT-based authentication with optional Google OAuth.

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| \`/login\` | LoginForm | Email/password login |
| \`/signup\` | SignupForm | New user registration |
| \`/forgot-password\` | Forgotpassword | Password reset |
| \`/verify-email\` | VerifyEmail | Email verification |
| \`/complete-profile\` | GoogleProfileCompletion | OAuth profile setup |

### AuthContext

All authentication state is managed in \`AuthContext.jsx\`:

\`\`\`jsx
const { user, login, logout, isAuthenticated, hasRole } = useAuth();
\`\`\`

### Protected Routes

Use the \`ProtectedRoute\` component to guard routes:

\`\`\`jsx
<Route element={<ProtectedRoute allowedRoles={['User', 'Mentor', 'Admin']} />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
\`\`\`
      `
        },
        profile: {
            title: 'User Profile',
            subtitle: 'Managing user information',
            content: `
## Profile Page

Route: \`/profile\`

The profile page allows users to view and edit their personal information, including:

- Name and contact details
- Profile picture
- Career interests
- Skills and strengths
- Education history

### Key File

\`src/Pages/Profile/Profile.jsx\`
      `
        },
        'mentor-list': {
            title: 'Mentor List',
            subtitle: 'Browse and filter mentors',
            content: `
## Mentor Discovery

Route: \`/mentorship\`

This page displays all verified mentors with powerful filtering options.

### Features

- **Search Bar**: Animated search with rotating placeholder text
- **Filter Sidebar**: Filter by domain, pricing, experience, mentee type
- **Mentor Cards**: Photo, bio, rating, pricing, and booking button
- **Campaign Banner**: Dynamic banner for free mentorship campaigns

### Key Files

- \`src/Pages/MentorShip/MentorList/index.jsx\`
- \`src/Pages/MentorShip/MentorList/SearchBar.jsx\`
- \`src/Pages/MentorShip/MentorList/FilterSidebar.jsx\`
      `
        },
        bookings: {
            title: 'Bookings',
            subtitle: 'User session management',
            content: `
## My Bookings

Route: \`/my-bookings\`

Users can view all their mentorship session bookings, including:

- Upcoming sessions with join button
- Past sessions
- Cancelled sessions
- Session notes and feedback

### Key File

\`src/Pages/MentorShip/Bookings/MyBookings.jsx\`
      `
        },
        sessions: {
            title: 'Mentor Sessions',
            subtitle: 'Session management for mentors',
            content: `
## Mentor Sessions

Route: \`/mentor-sessions\`

For mentors to manage their sessions:

- View all bookings
- Start video sessions
- Complete/cancel sessions
- Add session notes

### Key File

\`src/Pages/MentorShip/Bookings/MentorSessions.jsx\`
      `
        },
        application: {
            title: 'Mentor Application',
            subtitle: 'Apply to become a mentor',
            content: `
## Application Flow

### User Side

Route: \`/application\`

Submit an application with:
- Professional experience
- Areas of expertise
- LinkedIn/Portfolio links
- Motivation statement

### Admin Side

Route: \`/mentoapplication\`

Admins can:
- Review applications
- Approve/Reject/Request more info
- View applicant details

### Key Files

- \`src/Pages/MentorShip/Form/index.jsx\`
- \`src/Pages/MentorShip/MentorApplication.jsx\`
      `
        },
        'admin-dashboard': {
            title: 'Admin Dashboard',
            subtitle: 'Platform administration',
            content: `
## Admin Panel

Route: \`/dashboardAdmin\`

The central hub for administrators:

- Platform statistics
- User activity metrics
- Quick actions
- Recent applications

### Key File

\`src/Pages/Admin/DashBoard.jsx\`
      `
        },
        'user-management': {
            title: 'User Management',
            subtitle: 'Manage platform users',
            content: `
## User Administration

Route: \`/admin/userData\`

Manage all platform users:

- View user list with filters
- Edit user roles
- Deactivate/activate accounts
- View user activity

### Key File

\`src/Pages/Admin/UserManagementDashboard.jsx\`
      `
        },
        'system-settings': {
            title: 'System Settings',
            subtitle: 'Platform configuration',
            content: `
## System Settings

Route: \`/admin/system-settings\`

Configure platform-wide settings:

- **Global Free Mentorship**: Enable/disable free sessions
- **Campaign Settings**: Set campaign name and end date
- **Platform Toggles**: Feature flags
- **Email Templates**: Customize notifications

### Key File

\`src/Pages/Admin/SystemSettings.jsx\`
      `
        },
        university: {
            title: 'University Admin',
            subtitle: 'University-specific management',
            content: `
## University Portal

### Admin Route

\`/universityManagement\` - For platform admins to manage universities

### University Admin Route

\`/uniAdminPortal\` - For university administrators

### Teacher Route

\`/teacher/dashboard\` - For university teachers

### Key Files

- \`src/Pages/University/AdminUniversityManagement.jsx\`
- \`src/Pages/University/UniAdminPortal.jsx\`
- \`src/Pages/University/TeacherDashboard.jsx\`
      `
        },
        'career-paths': {
            title: 'Career Paths',
            subtitle: 'Explore career roadmaps',
            content: `
## Career Exploration

Route: \`/careerPaths\`

Interactive career path visualizations:

- Tech career roadmaps
- Skill requirements
- Learning resources
- Salary insights

### Key File

\`src/Roadmap/Roadmap.jsx\`
      `
        },
        assessment: {
            title: 'Assessment',
            subtitle: 'AI-powered career guidance',
            content: `
## Career Assessment

Route: \`/assessment\`

A comprehensive assessment module:

1. Interest questionnaire
2. Skill evaluation
3. AI analysis
4. Career recommendations

### Key Files

\`src/Assesment/AssessmentApp.jsx\`
      `
        },
        workshops: {
            title: 'Workshops',
            subtitle: 'Professional development sessions',
            content: `
## Workshop System

### User Side

Route: \`/workshops\`

Browse and register for workshops:
- Upcoming workshops
- Past recordings
- Topics and speakers

### Admin Side

Route: \`/workshopAdd\`

Create and manage workshops.

### Key Files

- \`src/Pages/Workshops/AvailableWorkshops.jsx\`
- \`src/Pages/Forms/AddWorkshop.jsx\`
      `
        },
    };

    // Filter sections based on search
    const filteredSections = sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(section => section.items.length > 0);

    const currentContent = content[activeSection] || content.overview;

    // Theme classes
    const theme = {
        bg: darkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]',
        sidebar: darkMode ? 'bg-[#1e293b]' : 'bg-white',
        card: darkMode ? 'bg-[#1e293b]' : 'bg-white',
        text: darkMode ? 'text-slate-200' : 'text-slate-800',
        textMuted: darkMode ? 'text-slate-400' : 'text-slate-500',
        border: darkMode ? 'border-slate-700' : 'border-slate-200',
        hover: darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100',
        active: darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600',
        code: darkMode ? 'bg-[#0d1117] text-green-400' : 'bg-slate-900 text-green-300',
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
            {/* Top Bar */}
            <div className={`fixed top-0 left-0 right-0 h-16 ${theme.sidebar} border-b ${theme.border} z-50 flex items-center justify-between px-4`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-2 rounded-lg ${theme.hover} lg:hidden`}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Book className="w-6 h-6 text-indigo-500" />
                        <span className="font-bold text-xl">SkillPilot Docs</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className={`relative hidden md:block`}>
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-lg ${theme.card} border ${theme.border} ${theme.text} focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64`}
                        />
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-lg ${theme.hover} transition-colors`}
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                    </button>
                </div>
            </div>

            <div className="pt-16 flex">
                {/* Sidebar */}
                <aside className={`fixed left-0 top-16 bottom-0 w-72 ${theme.sidebar} border-r ${theme.border} overflow-y-auto transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                    <nav className="p-4 space-y-6">
                        {filteredSections.map((section, idx) => (
                            <div key={idx}>
                                <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme.textMuted} mb-2`}>
                                    {section.title}
                                </h3>
                                <ul className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeSection === item.id;
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => {
                                                        setActiveSection(item.id);
                                                        setSidebarOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? theme.active : `${theme.textMuted} ${theme.hover}`}`}
                                                >
                                                    <Icon size={16} />
                                                    {item.name}
                                                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 lg:ml-72 p-6 lg:p-12 max-w-4xl`}>
                    <div className="mb-8">
                        <p className={`text-sm font-medium text-indigo-500 uppercase tracking-wide mb-2`}>
                            {sections.find(s => s.items.some(i => i.id === activeSection))?.title || 'Documentation'}
                        </p>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-2">{currentContent.title}</h1>
                        <p className={`text-lg ${theme.textMuted}`}>{currentContent.subtitle}</p>
                    </div>

                    {/* Render Markdown-like Content */}
                    <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
                        {currentContent.content.split('\n').map((line, idx) => {
                            // Headers
                            if (line.startsWith('## ')) {
                                return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                                return <h3 key={idx} className="text-xl font-semibold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                            }
                            // Code blocks
                            if (line.startsWith('```')) {
                                return null; // Handle in a more complex way if needed
                            }
                            // Tables (simplified)
                            if (line.startsWith('|')) {
                                const cells = line.split('|').filter(c => c.trim());
                                return (
                                    <div key={idx} className={`grid grid-cols-${cells.length} gap-2 py-2 border-b ${theme.border} text-sm`}>
                                        {cells.map((cell, cIdx) => (
                                            <span key={cIdx} className={`${cIdx === 0 ? 'font-medium' : ''}`}>{cell.trim()}</span>
                                        ))}
                                    </div>
                                );
                            }
                            // Lists
                            if (line.startsWith('- ')) {
                                const text = line.replace('- ', '');
                                const isBold = text.includes('**');
                                return (
                                    <li key={idx} className={`ml-4 ${theme.textMuted}`}>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-current">$1</strong>')
                                            }}
                                        />
                                    </li>
                                );
                            }
                            // Inline code
                            if (line.includes('`') && !line.startsWith('```')) {
                                return (
                                    <p key={idx} className="mb-2">
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: line.replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded ${theme.code} text-sm">$1</code>`)
                                            }}
                                        />
                                    </p>
                                );
                            }
                            // Regular paragraphs
                            if (line.trim()) {
                                return <p key={idx} className={`mb-4 ${theme.textMuted}`}>{line}</p>;
                            }
                            return null;
                        })}
                    </div>

                    {/* How to Use Section */}
                    {activeSection === 'overview' && (
                        <div className={`mt-12 p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="text-yellow-500" />
                                How to Use This Documentation
                            </h2>
                            <ol className={`list-decimal list-inside space-y-3 ${theme.textMuted}`}>
                                <li><strong className={theme.text}>Navigate</strong>: Use the sidebar to browse different sections of the documentation.</li>
                                <li><strong className={theme.text}>Search</strong>: Use the search bar at the top to quickly find specific topics.</li>
                                <li><strong className={theme.text}>Toggle Theme</strong>: Click the sun/moon icon to switch between light and dark modes.</li>
                                <li><strong className={theme.text}>Mobile</strong>: On mobile devices, tap the menu icon to open the sidebar.</li>
                                <li><strong className={theme.text}>Code Blocks</strong>: Code examples can be copied for use in your implementation.</li>
                            </ol>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DocsPage;
