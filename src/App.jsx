import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import './features/assessment/styles/global.css';

// 🧭 Core Pages
const Landingpage = lazy(() => import("./layouts/LandingPage"));
const Home = lazy(() => import('./scrape/Home'));
const Recommendation = lazy(() => import('./features/career/recommendation/Recommendation'));
const JobDetails = lazy(() => import('./features/career/recommendation/RecommDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./features/dashboard/DashBoard'));

// 🔐 Auth Pages
const LoginForm = lazy(() => import('./features/auth/Login'));
const SignupForm = lazy(() => import('./features/auth/Signup'));
const ProtectedRoute = lazy(() => import('./routes/ProtectedRoute'));
const GoogleProfileCompletion = lazy(() => import('./features/auth/GoogleProfileCompletion'));
const Forgotpassword = lazy(() => import('./features/auth/ForgotPassword'));
const Changepassword = lazy(() => import('./features/auth/ChangePassword'));
const VerifyEmail = lazy(() => import('./features/auth/VerifyEmail'));
const VerifyLogin = lazy(() => import('./features/auth/VerifyLogin'));

// 🎓 Career & Mentorship
const CareerForm = lazy(() => import('./features/forms/CareerForm'));
const CareerRecommendationForm = lazy(() => import('./features/forms/Questions'));
const RecommendationForm = lazy(() => import('./features/forms/Recommendation'));
const CreativeApplicationForm = lazy(() => import('./features/mentorship/Form'));
const AdminApplicationsPage = lazy(() => import('./features/mentorship/application/admin'));
const ApplicationTracker = lazy(() => import('./features/mentorship/Tracker'));
const MentorRegistrationForm = lazy(() => import('./features/mentorship/Registor'));
const MentorList = lazy(() => import('./features/mentorship/list/MentorList'));
const MentorAppointments = lazy(() => import('./features/mentorship/sessions/MentorAppointments'));
const UserAppointments = lazy(() => import('./features/mentorship/sessions/UserAppointment'));
const MentorFeedback = lazy(() => import('./features/mentorship/MentoFeedback'));
const ScheduleSession = lazy(() => import('./features/mentorship/sessions/BookAppointment'));
const MentorshipPage = lazy(() => import('./features/mentorship/HomePage'));
const MentoHome = lazy(() => import('./scrape/MentoHome'));
const CoachProfile = lazy(() => import('./features/dashboard/DashBoard/MentorDashBoard'));
const AMDashboard = lazy(() => import('./features/dashboard/DashBoard/AdminMento'));
const Profile = lazy(() => import('./features/profile'));
const MyBookings = lazy(() => import('./features/mentorship/bookings/MyBookings'));
const MentorSessions = lazy(() => import('./features/mentorship/bookings/MentorSessions'));
const RateSession = lazy(() => import('./features/mentorship/sessions/RateSession'));

// 🏫 Admin & University Management
const AdminDashboard = lazy(() => import('./features/admin/dashboard/DashBoard'));
const AnalyticsDashboard = lazy(() => import('./features/admin/analytics/AnalyticsDashboard'));
const SystemSettings = lazy(() => import('./features/admin/settings'));
const AdminUniversityManagement = lazy(() => import('./features/university/AdminUniversityManagement'));
const UniAdminPortal = lazy(() => import('./features/university/UniAdminPortal'));
const TeacherDashboard = lazy(() => import('./features/university/TeacherDashboard'));
const AdminUserManagement = lazy(() => import('./features/admin/users/AdminUserManagement'));
const UserManagementDashboard = lazy(() => import('./features/admin/users/UserManagementDashboard'));
const ServerLogs = lazy(() => import('./features/admin/logs/ServerLogs'));
const AnnouncementsDashboard = lazy(() => import('./features/admin/announcements'));
const NotificationsPage = lazy(() => import('./features/notifications'));
const MentorProfileReview = lazy(() => import('./features/admin/users/MentorProfileReview'));
const MentorProfilePage = lazy(() => import('./features/mentorship/profile'));

// 🧾 Forms Management
const JobTitlesManagement = lazy(() => import('./features/forms/JobTitles'));
const CompaniesManagement = lazy(() => import('./features/forms/CompaniesManagement'));
const InterestManagement = lazy(() => import('./features/forms/InterestManagement'));
const StrengthManagement = lazy(() => import('./features/forms/StrengthManagement'));
const SkillsManagement = lazy(() => import('./features/forms/SkillsManagement'));
const CollegesManagement = lazy(() => import('./features/forms/CollegesManagement'));
const AddWorkshop = lazy(() => import('./features/forms/AddWorkshop'));

// 🎥 Learning & Resources
const VideoForm = lazy(() => import('./features/education/VideoForm'));
const VideoList = lazy(() => import('./features/education/VideoList'));
const AddResourcePage = lazy(() => import('./features/resources/AddResourses'));
const ViewBooksPage = lazy(() => import('./features/resources/ViewResourses'));
const AvailableWorkshops = lazy(() => import('./features/education/AvailableWorkshops'));

// 🧠 Career Tools
const CareerQuiz = lazy(() => import('./features/career/quiz/Quiz'));
const CombinedCareerAdvisor = lazy(() => import('./features/career/quiz/Prediction'));
const ChatCareerAdvisor = lazy(() => import('./features/career/roadmap/Roadmap'));
const RecommendationJobTitlesSearch = lazy(() => import('./features/career/recommendation/JobTitle'));
const JobInfo = lazy(() => import('./features/career/recommendation/jobinfo'));
const DummyJobInfo = lazy(() => import('./features/career/recommendation/DummyInfo'));
const TechCareerPathsHub = lazy(() => import('./features/career/roadmap/Roadmap'));
const FrontendRoadmap = lazy(() => import('./features/career/roadmap/Frontend'));
const DetailedDataScientistRoadmap = lazy(() => import('./features/career/roadmap/DataScientist'));
const AssessmentApp = lazy(() => import('./features/assessment/AssessmentApp'));

// 🧩 Community & Updates
const ModernCommunityPage = lazy(() => import('./features/community/community'));
const UpdatesPage = lazy(() => import('./features/updates/UpdatesPage'));
const AdminUpdatesPage = lazy(() => import('./features/updates/AdminUpdatesPage'));

// 🎓 Other
const CollegeList = lazy(() => import('./features/colleges/CollegeList'));
const AIlandingpage = lazy(() => import("./features/ai-landing/AILandingPage"));
const DocsPage = lazy(() => import('./pages/DocsPage'));

// 🌐 Global Components
import Navbar from "./layouts/Navbar"
import ChatBot1 from './features/chatbot/ChatBot';

// Loading Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  // Assessment flow state
  const [currentPage, setCurrentPage] = useState('home');
  const [assessmentData, setAssessmentData] = useState(null);

  const handleStartAssessment = () => {
    setCurrentPage('assessment');
  };

  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
    setCurrentPage('results');
  };

  const handleStartNew = () => {
    setAssessmentData(null);
    setCurrentPage('home');
  };

  return (
    <>
      <Navbar />

      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/Assesmentinfo" element={<AIlandingpage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/job-details/:jobTitle" element={<JobDetails />} />
          <Route path="/learn" element={<VideoForm />} />
          <Route path="/learnlist" element={<VideoList />} />
          <Route path="/mentorship" element={<MentorList />} />
          <Route path="/question" element={<CareerRecommendationForm />} />
          <Route path="/workshopAdd" element={<AddWorkshop />} />
          <Route path="/workshops" element={<AvailableWorkshops />} />
          <Route path="/dashboardAdmin" element={<AdminDashboard />} />
          <Route path="/addResources" element={<AddResourcePage />} />
          <Route path="/view-books" element={<ViewBooksPage />} />
          <Route path="/userFeedback" element={<MentorFeedback />} />
          <Route path="/community" element={<ModernCommunityPage />} />
          <Route path="/roadmap" element={<FrontendRoadmap />} />
          <Route path="/mentorDashboard" element={<CoachProfile />} />
          <Route path="/schedulementor" element={<ScheduleSession />} />
          <Route path="/mentor" element={<MentoHome />} />
          <Route path="/softwareengineer" element={<FrontendRoadmap />} />
          <Route path="/careerquiz" element={<CareerQuiz />} />
          <Route path="/combinedquiz" element={<CombinedCareerAdvisor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobtitleall" element={<RecommendationJobTitlesSearch />} />
          <Route path="/job-info" element={<JobInfo />} />
          <Route path="/dummyinfo" element={<DummyJobInfo />} />
          <Route path="/mentorHome" element={<MentorshipPage />} />
          <Route path="/careerPaths" element={<TechCareerPathsHub />} />
          <Route path="/datascientist" element={<DetailedDataScientistRoadmap />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/colleges" element={<CollegeList />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route path="/complete-profile" element={<GoogleProfileCompletion />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/rate-session/:bookingId" element={<RateSession />} />


          {/* 👤 User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Mentor', 'Admin']} />}>
            <Route path="/careerform" element={<CareerForm />} />
            <Route path="/application" element={<CreativeApplicationForm />} />
            <Route path="/tracker" element={<ApplicationTracker />} />
            <Route path="/my-applications" element={<UserAppointments />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/change-password" element={<Changepassword />} />
          </Route>

          {/* 🎓 Mentor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin']} />}>
            <Route path="/my-sessions" element={<MentorAppointments />} />
            <Route path="/mentor-sessions" element={<MentorSessions />} />
            <Route path="/mentor-profile" element={<MentorProfilePage />} />
            <Route path="/interestForm" element={<InterestManagement />} />
            <Route path="/StrengthForm" element={<StrengthManagement />} />
            <Route path="/amdashboard" element={<AMDashboard />} />
            <Route path="/skillform" element={<SkillsManagement />} />
            <Route path="/collegeform" element={<CollegesManagement />} />
            <Route path="/recommendationForm" element={<RecommendationForm />} />
          </Route>

          {/* 🛠️ Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/JobForm" element={<JobTitlesManagement />} />
            <Route path="/Companyform" element={<CompaniesManagement />} />
            <Route path="/mentoapplication" element={<AdminApplicationsPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/addmentor" element={<MentorRegistrationForm />} />
            <Route path="/universityManagement" element={<AdminUniversityManagement />} />
            <Route path="/admin/updates" element={<AdminUpdatesPage />} />
            <Route path="/admin/user-management" element={<AdminUserManagement />} />
            <Route path="/admin/userData" element={<UserManagementDashboard />} />
            <Route path="/admin/system-settings" element={<SystemSettings />} />
            <Route path="/admin/server-logs" element={<ServerLogs />} />
            <Route path="/admin/announcements" element={<AnnouncementsDashboard />} />
            <Route path="/admin/profile-reviews" element={<MentorProfileReview />} />
          </Route>

          {/* 🏫 University Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['UniAdmin']} />}>
            <Route path="/uniAdminPortal" element={<UniAdminPortal />} />
          </Route>

          {/* 👨‍🏫 Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['UniTeach']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          </Route>

          {/* ❌ 404 */}
          <Route path="/assessment" element={<AssessmentApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <ChatBot1 />
    </>
  );
}

export default App;
