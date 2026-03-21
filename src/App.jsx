import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import './assesment/styles/global.css';
import RoleGuard from './components/RoleGuard';


// 🧭 Core Pages
const Landingpage = lazy(() => import("./homepage/pages/LandingPage"));
const Home = lazy(() => import('./Pages/Home'));
const Recommendation = lazy(() => import('./Pages/Recommendation/Recommendation'));
const JobDetails = lazy(() => import('./Pages/Recommendation/RecommDetails'));
const NotFound = lazy(() => import('./Pages/Error/NotFound'));
const Dashboard = lazy(() => import('./Pages/DashBoard'));


// 🔐 Auth Pages
const LoginForm = lazy(() => import('./Pages/User/Login'));
const SignupForm = lazy(() => import('./Pages/User/Signup'));
const ProtectedRoute = lazy(() => import('./Pages/Protection/ProtectedRoute'));
const GoogleProfileCompletion = lazy(() => import('./Pages/User/GoogleProfileCompletion'));
const Forgotpassword = lazy(() => import('./Pages/User/ForgotPassword'));
const Changepassword = lazy(() => import('./Pages/User/ChangePassword'));
const VerifyEmail = lazy(() => import('./Pages/User/VerifyEmail'));
const VerifyLogin = lazy(() => import('./Pages/User/VerifyLogin'));

// 🎓 Career & Mentorship
const CareerForm = lazy(() => import('./Pages/Forms/CareerForm'));
const CareerRecommendationForm = lazy(() => import('./Pages/Forms/Questions'));
const RecommendationForm = lazy(() => import('./Pages/Forms/Recommendation'));
const CreativeApplicationForm = lazy(() => import('./Pages/MentorShip/Form'));
const AdminApplicationsPage = lazy(() => import('./Pages/MentorShip/MentorApplication'));
const ApplicationTracker = lazy(() => import('./Pages/MentorShip/Tracker'));
const MentorRegistrationForm = lazy(() => import('./Pages/MentorShip/Registor'));
const MentorList = lazy(() => import('./Pages/MentorShip/MentorList'));
const MentorAppointments = lazy(() => import('./Pages/MentorShip/MentorAppointments'));
const UserAppointments = lazy(() => import('./Pages/MentorShip/UserAppointment'));
const MentorFeedback = lazy(() => import('./Pages/MentorShip/MentoFeedback'));
const ScheduleSession = lazy(() => import('./Pages/MentorShip/BookAppointment'));
const MentorshipPage = lazy(() => import('./Pages/Mentor Home/HomePage'));
const MentoHome = lazy(() => import('./Pages/MentoHome'));
const CoachProfile = lazy(() => import('./Pages/DashBoard/MentorDashBoard'));
const MentorDashboardModern = lazy(() => import('./Pages/DashBoard/MentorDashboard/MentorDashboard'));
const AMDashboard = lazy(() => import('./Pages/DashBoard/AdminMento'));
const Profile = lazy(() => import('./Pages/Profile'));
const MyBookings = lazy(() => import('./Pages/MentorShip/Bookings/MyBookings'));
const MentorSessions = lazy(() => import('./Pages/MentorShip/Bookings/MentorSessions'));
const RateSession = lazy(() => import('./Pages/MentorShip/RateSession'));
const MentorSearchPage = lazy(() => import('./Pages/MentorShip/MentorSearchPage'));
const PublicMentorProfile = lazy(() => import('./Pages/MentorShip/PublicMentorProfile'));
const CheckoutPage = lazy(() => import('./Pages/MentorShip/Bookings/CheckoutPage'));
const SuccessPage = lazy(() => import('./Pages/MentorShip/Bookings/SuccessPage'));
const BecomeMentorFlow = lazy(() => import('./Pages/MentorShip/BecomeMentorFlow'));
const MentorDashboardNew = lazy(() => import('./Pages/MentorShip/MentorDashboardNew'));
const MenteeDMInbox = lazy(() => import('./Pages/MentorShip/DM/MenteeDMInbox'));
const MentorDMInbox = lazy(() => import('./Pages/MentorShip/DM/MentorDMInbox'));
const ChatThread = lazy(() => import('./Pages/MentorShip/DM/ChatThread'));
const AdminMentorApprovals = lazy(() => import('./Pages/Admin/MentorApprovals'));


// 🏫 Admin & University Management
const AdminDashboard = lazy(() => import('./Pages/Admin/DashBoard'));
const AnalyticsDashboard = lazy(() => import('./Pages/Admin/Analytics/AnalyticsDashboard'));
const SystemSettings = lazy(() => import('./Pages/Admin/SystemSettings'));
const AdminUniversityManagement = lazy(() => import('./Pages/University/AdminUniversityManagement'));
const UniAdminPortal = lazy(() => import('./Pages/University/UniAdminPortal'));
const TeacherDashboard = lazy(() => import('./Pages/University/TeacherDashboard'));
const AdminUserManagement = lazy(() => import('./Pages/Admin/AdminUserManagement'));
const UserManagementDashboard = lazy(() => import('./Pages/Admin/UserManagementDashboard'));
const ServerLogs = lazy(() => import('./Pages/Admin/ServerLogs'));
const AnnouncementsDashboard = lazy(() => import('./Pages/Admin/Announcements'));
const NotificationsPage = lazy(() => import('./Pages/Notifications'));
const MentorProfileReview = lazy(() => import('./Pages/Admin/MentorProfileReview'));
const MentorProfilePage = lazy(() => import('./pages/MentorProfile'));

// 🧾 Forms Management
const JobTitlesManagement = lazy(() => import('./Pages/Forms/JobTitles'));
const CompaniesManagement = lazy(() => import('./Pages/Forms/CompaniesManagement'));
const InterestManagement = lazy(() => import('./Pages/Forms/InterestManagement'));
const StrengthManagement = lazy(() => import('./Pages/Forms/StrengthManagement'));
const SkillsManagement = lazy(() => import('./Pages/Forms/SkillsManagement'));
const CollegesManagement = lazy(() => import('./Pages/Forms/CollegesManagement'));
const AddWorkshop = lazy(() => import('./Pages/Forms/AddWorkshop'));

// 🎥 Learning & Resources
const VideoForm = lazy(() => import('./Pages/Educate/VideoForm'));
const VideoList = lazy(() => import('./Pages/Educate/VideoList'));
const AddResourcePage = lazy(() => import('./Pages/Resourses/AddResourses'));
const ViewBooksPage = lazy(() => import('./Pages/Resourses/ViewResourses'));
const AvailableWorkshops = lazy(() => import('./Pages/Workshops/AvailableWorkshops'));

// 🧠 Career Tools
const CareerQuiz = lazy(() => import('./Pages/Quiz/Quiz'));
const CombinedCareerAdvisor = lazy(() => import('./Pages/Quiz/Prediction'));
const ChatCareerAdvisor = lazy(() => import('./Pages/Roadmap/Roadmap'));
const RecommendationJobTitlesSearch = lazy(() => import('./Pages/Recommendation/JobTitle'));
const JobInfo = lazy(() => import('./Pages/Recommendation/jobinfo'));
const DummyJobInfo = lazy(() => import('./Pages/Recommendation/DummyInfo'));
const TechCareerPathsHub = lazy(() => import('./Roadmap/Roadmap'));
const FrontendRoadmap = lazy(() => import('./Roadmap/Frontend'));
const DetailedDataScientistRoadmap = lazy(() => import('./Roadmap/DataScientist'));
const AssessmentApp = lazy(() => import('./Assesment/AssessmentApp'));

// 🧩 Community & Updates
const ModernCommunityPage = lazy(() => import('./Pages/community/community'));
const UpdatesPage = lazy(() => import('./Pages/updates/UpdatesPage'));
const AdminUpdatesPage = lazy(() => import('./Pages/updates/AdminUpdatesPage'));

// 🎓 Other
const CollegeList = lazy(() => import('./Pages/Colleges/CollegeList'));
const AIlandingpage = lazy(() => import("./AILandingpage/AILandingPage"));
const DocsPage = lazy(() => import('./Pages/Docs/DocsPage'));

// 🌐 Global Components
import Navbar from "./homepage/landing/Navbar"
import FooterSection from "./homepage/components/FooterSection"
import ChatBot1 from './chatbot/ChatBot';

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
  //hello world
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
          <Route path="/mentorDashboard/modern" element={<MentorDashboardModern />} />
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
          {/* Mentor search & public profile (Topmate-style) */}
          <Route path="/mentors" element={<MentorSearchPage />} />
          <Route path="/mentor/:handle" element={<PublicMentorProfile />} />
          <Route path="/mentor/:handle/checkout" element={<CheckoutPage />} />
          <Route path="/mentor/:handle/success" element={<SuccessPage />} />
          <Route path="/become-a-mentor" element={<BecomeMentorFlow />} />
          <Route path="/mentor-dashboard" element={
            <RoleGuard roles={['Mentor', 'Admin']}>
              <MentorDashboardNew />
            </RoleGuard>
          } />
          <Route path="/admin/mentor-applications" element={
            <RoleGuard roles={['Admin']}>
              <AdminMentorApprovals />
            </RoleGuard>
          } />


          {/* 👤 User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Mentor', 'Admin']} />}>
            <Route path="/careerform" element={<CareerForm />} />
            <Route path="/application" element={<CreativeApplicationForm />} />
            <Route path="/tracker" element={<ApplicationTracker />} />
            <Route path="/my-applications" element={<UserAppointments />} />
            {/* Mentee routes */}
            <Route path="/my-dms" element={<MenteeDMInbox />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/dm/:threadId" element={<ChatThread />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/change-password" element={<Changepassword />} />
          </Route>

          {/* 🎓 Mentor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin']} />}>
            <Route path="/my-sessions" element={<MentorAppointments />} />
            <Route path="/mentor-sessions" element={<MentorSessions />} />
            <Route path="/mentor-dms" element={<MentorDMInbox />} />
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
      <FooterSection />
    </>
  );
}

export default App;
