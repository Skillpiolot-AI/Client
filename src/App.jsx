

// import React from 'react';
// import { Routes, Route, Router } from 'react-router-dom';
// import Home from './Pages/Home';
// import Recommendation from './Pages/Recommendation/Recommendation';
// import JobDetails from './Pages/Recommendation/RecommDetails';
// import CareerForm from './Pages/Forms/CareerForm';
// import NotFound from './Pages/Error/NotFound';
// import CoolNavbar from './Pages/Headers/Navbar';

// import LoginForm from './Pages/User/Login';
// import SignupForm from './Pages/User/Signup';
// import JobTitlesManagement from './Pages/Forms/JobTitles';
// import CompaniesManagement from './Pages/Forms/CompaniesManagement';
// import CreativeApplicationForm from './Pages/MentorShip/Form';
// import AdminApplicationsPage from './Pages/MentorShip/List';
// import ApplicationTracker from './Pages/MentorShip/Tracker';
// import Dashboard from './Pages/DashBoard';
// import MentorRegistrationForm from './Pages/MentorShip/Registor';
// import MentorList from './Pages/MentorShip/MentorList';
// import MentorAppointments from './Pages/MentorShip/MentorAppointments';
// import UserAppointments from './Pages/MentorShip/UserAppointment';
// import ProtectedRoute from '../src/Pages/Protection/ProtectedRoute';
// import VideoForm from './Pages/Educate/VideoForm';
// import VideoList from './Pages/Educate/VideoList';
// import LoadingSpinner from './Pages/Loader/Loader';
// import InterestManagement from './Pages/Forms/InterestManagement';
// import StrengthManagement from './Pages/Forms/StrengthManagement';
// import SkillsManagement from './Pages/Forms/SkillsManagement';
// import CollegesManagement from './Pages/Forms/CollegesManagement';
// import RecommendationForm from './Pages/Forms/Recommendation';
// import Button from "./Pages/Button"
// import CareerRecommendationForm from './Pages/Forms/Questions';
// import AddWorkshop from './Pages/Forms/AddWorkshop';
// import AvailableWorkshops from './Pages/Workshops/AvailableWorkshops';
// import AdminDashboard from './Pages/Admin/DashBoard';
// import AddResourcePage from './Pages/Resourses/AddResourses';
// import ViewBooksPage from './Pages/Resourses/ViewResourses';
// import MentorFeedback from './Pages/MentorShip/MentoFeedback';
// import ChatCareerAdvisor from './Pages/Roadmap/Roadmap';
// import ModernCommunityPage from './Pages/community/community';
// import CoachProfile from './Pages/DashBoard/MentorDashBoard';
// import ScheduleSession from './Pages/MentorShip/BookAppointment';
// import CareerQuiz from './Pages/Quiz/Quiz';
// import CombinedCareerAdvisor from './Pages/Quiz/Prediction';
// import Profile from './Pages/Profile/Profile';
// import RecommendationJobTitlesSearch from './Pages/Recommendation/JobTitle';
// import JobInfo from './Pages/Recommendation/jobinfo';
// import FrontendRoadmap from './Roadmap/Frontend';
// import MentoHome from './Pages/MentoHome';
// import Footer from './Pages/Headers/Footer';
// import chatbot from './Bots/chatbot'
// import DummyJobInfo from './Pages/Recommendation/DummyInfo';
// import MentorshipPage from './Pages/Mentor Home/HomePage';
// import AMDashboard from './Pages/DashBoard/AdminMento';
// import ChatBot from './Bots/chatbot';
// import TechCareerPathsHub from './Roadmap/Roadmap';
// import DetailedDataScientistRoadmap from './Roadmap/DataScientist';
// import AnalyticsDashboard from './Pages/Admin/Analytics/AnalyticsDashboard';

// // Import new update components
// import UpdatesPage from './Pages/updates/UpdatesPage';
// import AdminUpdatesPage from './Pages/updates/AdminUpdatesPage';

// import AdminUniversityManagement from './Pages/University/AdminUniversityManagement';
// import UniAdminPortal from './Pages/University/UniAdminPortal';
// import TeacherDashboard from './Pages/University/TeacherDashboard';

// import HomePage from './Assesment/components/Home/HomePage';
// import AssessmentPage from './Assesment/components/Assessment/AssessmentPage';
// import ResultsPage from './Assesment/components/Results/ResultsPage';
// import './styles/global.css';


// import { AuthProvider } from './utils/axiosConfig';

// function App() {
//   const [currentPage, setCurrentPage] = useState('home');
//     const [assessmentData, setAssessmentData] = useState(null);
  
//     const handleStartAssessment = () => {
//       setCurrentPage('assessment');
//     };
  
//     const handleAssessmentComplete = (data) => {
//       setAssessmentData(data);
//       setCurrentPage('results');
//     };
  
//     const handleStartNew = () => {
//       setAssessmentData(null);
//       setCurrentPage('home');
//     };
  

//   return (
//     <>
//       <AuthProvider>
//         <CoolNavbar />
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/signup" element={<SignupForm />} />
//           <Route path="/recommendation" element={<Recommendation />} />
//           <Route path="/job-details/:jobTitle" element={<JobDetails />} />
//           <Route path='/Learn' element={<VideoForm />} />
//           <Route path="/learnlist" element={<VideoList />} />
//           <Route path="/mentorship" element={<MentorList />} />
//           <Route path='/question' element={<CareerRecommendationForm />} />
//           <Route path='/button' element={<Button />} />
//           <Route path='/workshopAdd' element={<AddWorkshop />} /> {/*Admin*/}
//           <Route path="/workshops" element={<AvailableWorkshops />} />
//           <Route path='/dashboardAdmin' element={<AdminDashboard />} />   {/*Admin*/}
//           <Route path="/addResources" element={<AddResourcePage />} />    {/*Admin*/}
//           <Route path="/view-books" element={<ViewBooksPage />} />
//           <Route path="/userFeedback" element={<MentorFeedback />} />    {/*Admin*/}
//           <Route path="/community" element={<ModernCommunityPage />} />
//           <Route path="/roadmap" element={<FrontendRoadmap />} />
//           <Route path="/mentorDashboard" element={<CoachProfile />} />      {/*Mentor*/}
//           <Route path='/schedulementor' element={<ScheduleSession />} />
//           <Route path="/mentor" element={<MentoHome />} />
//           <Route path="/softwareengineer" element={<FrontendRoadmap />} />
//           <Route path="/careerquiz" element={<CareerQuiz />} />
//           <Route path="/combinedquiz" element={<CombinedCareerAdvisor />} />
//           <Route path='/profile' element={<Profile />} />
//           <Route path='/jobtitleall' element={<RecommendationJobTitlesSearch />} />
//           <Route path="/job-info" element={<JobInfo />} />
//           <Route path="/dummyinfo" element={<DummyJobInfo />} />
//           <Route path="/mentorHome" element={<MentorshipPage />} />
//           <Route path='/careerPaths' element={<TechCareerPathsHub />} />
//           <Route path="/datascientist" element={<DetailedDataScientistRoadmap />} />

//           {/* Updates Routes */}
//           <Route path="/updates" element={<UpdatesPage />} />

//           {/* User protected routes */}
//           <Route element={<ProtectedRoute allowedRoles={['User', 'Mentor', 'Admin']} />}>
//             <Route path="/careerform" element={<CareerForm />} />
//             <Route path="/application" element={<CreativeApplicationForm />} />
//             <Route path="/tracker" element={<ApplicationTracker />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/my-applications" element={<UserAppointments />} />
//           </Route>

//           {/* Mentor protected routes */}
//           <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin']} />}>
//             <Route path="/my-sessions" element={<MentorAppointments />} />
//             <Route path="/interestForm" element={<InterestManagement />} />
//             <Route path='/StrengthForm' element={<StrengthManagement />} />
//             <Route path='/amdashboard' element={<AMDashboard />} />
//             <Route path='/skillform' element={<SkillsManagement />} />
//             <Route path='/collegeform' element={<CollegesManagement />} />
//             <Route path="/recommendationForm" element={<RecommendationForm />} />
//           </Route>

//           {/* Admin protected routes */}
//           <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
//             <Route path="/JobForm" element={<JobTitlesManagement />} />
//             <Route path="/universityManagement" element={<AdminUniversityManagement />} />

//             <Route path="/Companyform" element={<CompaniesManagement />} />
//             <Route path="/mentoapplication" element={<AdminApplicationsPage />} />
//             <Route path="/analytics" element={<AnalyticsDashboard />} />
//             <Route path="/addmentor" element={<MentorRegistrationForm />} />

//             {/* Admin Updates Management */}
//             <Route path="/admin/updates" element={<AdminUpdatesPage />} />
//           </Route>


//           <Route element={<ProtectedRoute allowedRoles={['UniAdmin']} />}>
//             <Route path="/uniAdminPortal" element={<UniAdminPortal />} />
//           </Route>

//           <div className="App">
//                 {currentPage === 'home' && (
//                   <HomePage onStartAssessment={handleStartAssessment} />
//                 )}
                
//                 {currentPage === 'assessment' && (
//                   <AssessmentPage onComplete={handleAssessmentComplete} />
//                 )}
                
//                 {currentPage === 'results' && assessmentData && (
//                   <ResultsPage 
//                     assessmentData={assessmentData} 
//                     onStartNew={handleStartNew}
//                   />
//                 )}
//               </div>

//           <Route element={<ProtectedRoute allowedRoles={['UniTeach']} />}>
//             <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
//           </Route>
//           {/* Catch-all route for 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//         {/* <ChatBot/> */}
//         <ChatBot />
//         <Footer />
//       </AuthProvider>
//     </>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './assesment/styles/global.css';
import Landingpage from "./homepage/pages/LandingPage"

import AssessmentApp from './Assesment/AssessmentApp';
// 🌐 Layout Components
import CoolNavbar from './Pages/Headers/Navbar';
import Footer from './Pages/Headers/Footer';
import ChatBot from './Bots/chatbot';

// 🧭 Core Pages
import Home from './Pages/Home';
import Recommendation from './Pages/Recommendation/Recommendation';
import JobDetails from './Pages/Recommendation/RecommDetails';
import NotFound from './Pages/Error/NotFound';
import Dashboard from './Pages/DashBoard';

// 🔐 Auth Pages
import LoginForm from './Pages/User/Login';
import SignupForm from './Pages/User/Signup';
import ProtectedRoute from './Pages/Protection/ProtectedRoute';

// 🎓 Career & Mentorship
import CareerForm from './Pages/Forms/CareerForm';
import CareerRecommendationForm from './Pages/Forms/Questions';
import RecommendationForm from './Pages/Forms/Recommendation';
import CreativeApplicationForm from './Pages/MentorShip/Form';
import AdminApplicationsPage from './Pages/MentorShip/List';
import ApplicationTracker from './Pages/MentorShip/Tracker';
import MentorRegistrationForm from './Pages/MentorShip/Registor';
import MentorList from './Pages/MentorShip/MentorList';
import MentorAppointments from './Pages/MentorShip/MentorAppointments';
import UserAppointments from './Pages/MentorShip/UserAppointment';
import MentorFeedback from './Pages/MentorShip/MentoFeedback';
import ScheduleSession from './Pages/MentorShip/BookAppointment';
import MentorshipPage from './Pages/Mentor Home/HomePage';
import MentoHome from './Pages/MentoHome';
import CoachProfile from './Pages/DashBoard/MentorDashBoard';
import AMDashboard from './Pages/DashBoard/AdminMento';
import Profile from './Pages/Profile/Profile'

// 🏫 Admin & University Management
import AdminDashboard from './Pages/Admin/DashBoard';
import AnalyticsDashboard from './Pages/Admin/Analytics/AnalyticsDashboard';
import AdminUniversityManagement from './Pages/University/AdminUniversityManagement';
import UniAdminPortal from './Pages/University/UniAdminPortal';
import TeacherDashboard from './Pages/University/TeacherDashboard';

// 🧾 Forms Management
import JobTitlesManagement from './Pages/Forms/JobTitles';
import CompaniesManagement from './Pages/Forms/CompaniesManagement';
import InterestManagement from './Pages/Forms/InterestManagement';
import StrengthManagement from './Pages/Forms/StrengthManagement';
import SkillsManagement from './Pages/Forms/SkillsManagement';
import CollegesManagement from './Pages/Forms/CollegesManagement';
import AddWorkshop from './Pages/Forms/AddWorkshop';

// 🎥 Learning & Resources
import VideoForm from './Pages/Educate/VideoForm';
import VideoList from './Pages/Educate/VideoList';
import AddResourcePage from './Pages/Resourses/AddResourses';
import ViewBooksPage from './Pages/Resourses/ViewResourses';
import AvailableWorkshops from './Pages/Workshops/AvailableWorkshops';

// 🧠 Career Tools
import CareerQuiz from './Pages/Quiz/Quiz';
import CombinedCareerAdvisor from './Pages/Quiz/Prediction';
import ChatCareerAdvisor from './Pages/Roadmap/Roadmap';
import RecommendationJobTitlesSearch from './Pages/Recommendation/JobTitle';
import JobInfo from './Pages/Recommendation/jobinfo';
import DummyJobInfo from './Pages/Recommendation/DummyInfo';
import TechCareerPathsHub from './Roadmap/Roadmap';
import FrontendRoadmap from './Roadmap/Frontend';
import DetailedDataScientistRoadmap from './Roadmap/DataScientist';

// 🧩 Community & Updates
import ModernCommunityPage from './Pages/community/community';
import UpdatesPage from './Pages/updates/UpdatesPage';
import AdminUpdatesPage from './Pages/updates/AdminUpdatesPage';

// 🧮 Assessment Pages
import HomePage from './Assesment/components/Home/HomePage';
import AssessmentPage from './Assesment/components/Assessment/AssessmentPage';
import ResultsPage from './Assesment/components/Results/ResultsPage';

// 🧰 Utils
import { AuthProvider } from './utils/axiosConfig';
import Button from './Pages/Button';
import CollegeList from './Pages/Colleges/CollegeList';
import AIlandingpage from "./AILandingpage/AILandingPage"
<<<<<<< HEAD


=======
import Forgotpassword from "./Pages/User/ForgotPassword"
import VerifyEmail from './Pages/User/VerifyEmail';
import VerifyLogin from './Pages/User/VerifyLogin';

import AdminUserManagement from './Pages/Admin/AdminUserManagement';
import UserManagementDashboard from './Pages/Admin/UserManagementDashboard';
>>>>>>> backup-feature-update
import Navbar from "./homepage/landing/Navbar"
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
      <AuthProvider>
        {/* <CoolNavbar /> */}
        <Navbar/>

        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/Assesmentinfo" element={<AIlandingpage/>}/>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/recommendation" element={<Recommendation />} /> //not working useless not required
          <Route path="/job-details/:jobTitle" element={<JobDetails />} />
          <Route path="/learn" element={<VideoForm />} /> //A form for mentor to learn how to connect with the students
          <Route path="/learnlist" element={<VideoList />} /> //Learning list for mentors not working
          <Route path="/mentorship" element={<MentorList />} /> //Book appointment with mentor  - Not working for now 
          <Route path="/question" element={<CareerRecommendationForm />} /> //No use 
          <Route path="/workshopAdd" element={<AddWorkshop />} /> {/* Admin */} //For the admin to add workshops data
          <Route path="/workshops" element={<AvailableWorkshops />} /> //Available workshops for users
          <Route path="/dashboardAdmin" element={<AdminDashboard />} /> {/* Admin */} //Useless 
          <Route path="/addResources" element={<AddResourcePage />} /> {/* Admin */} //Add books page for admin
          <Route path="/view-books" element={<ViewBooksPage />} /> //View books page for users
          <Route path="/userFeedback" element={<MentorFeedback />} /> {/* Admin */} //Mentor feedback page for admin
          <Route path="/community" element={<ModernCommunityPage />} />
          <Route path="/roadmap" element={<FrontendRoadmap />} /> //Useless
          <Route path="/mentorDashboard" element={<CoachProfile />} /> {/* Mentor */} //Mentor profile dashboard Most important issue [priotrity]
          <Route path="/schedulementor" element={<ScheduleSession />} />. //Use less
          <Route path="/mentor" element={<MentoHome />} /> //Useless
          <Route path="/softwareengineer" element={<FrontendRoadmap />} /> //useless
          <Route path="/careerquiz" element={<CareerQuiz />} /> //useless
          <Route path="/combinedquiz" element={<CombinedCareerAdvisor />} />. //Testing purpose side
          <Route path="/profile" element={<Profile />} /> //Profile page need to be fixed
          <Route path="/jobtitleall" element={<RecommendationJobTitlesSearch />} /> // not required
          <Route path="/job-info" element={<JobInfo />} />  //Not required
          <Route path="/dummyinfo" element={<DummyJobInfo />} /> //not required
          <Route path="/mentorHome" element={<MentorshipPage />} /> //Issue
          <Route path="/careerPaths" element={<TechCareerPathsHub />} />. //Need to be improveed
          <Route path="/datascientist" element={<DetailedDataScientistRoadmap />} />
          <Route path="/updates" element={<UpdatesPage />} /> //Good to go 
          <Route path="/colleges" element={<CollegeList />} /> //good to go
<<<<<<< HEAD
=======
          <Route path ="/forgot-password" element ={<Forgotpassword/>}/>
           <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-login" element={<VerifyLogin />} />

>>>>>>> backup-feature-update

          {/* 👤 User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Mentor', 'Admin']} />}>
            <Route path="/careerform" element={<CareerForm />} /> //Issue not reuqired
            <Route path="/application" element={<CreativeApplicationForm />} /> // application for the mentorship in website need to be fixed ui
            <Route path="/tracker" element={<ApplicationTracker />} /> //Tracker for mentorship application 
            <Route path="/dashboard" element={<Dashboard />} /> //Admin dashboard need to be fixed
            <Route path="/my-applications" element={<UserAppointments />} />. //Issue this is for the mentor appointments
          </Route>

          {/* 🎓 Mentor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin']} />}>
            <Route path="/my-sessions" element={<MentorAppointments />} />
            <Route path="/interestForm" element={<InterestManagement />} />
            <Route path="/StrengthForm" element={<StrengthManagement />} />
            <Route path="/amdashboard" element={<AMDashboard />} />
            <Route path="/skillform" element={<SkillsManagement />} />
            <Route path="/collegeform" element={<CollegesManagement />} />
            <Route path="/recommendationForm" element={<RecommendationForm />} />
          </Route>

          {/* 🛠️ Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/JobForm" element={<JobTitlesManagement />} />
            <Route path="/Companyform" element={<CompaniesManagement />} />
            <Route path="/mentoapplication" element={<AdminApplicationsPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/addmentor" element={<MentorRegistrationForm />} />
            <Route path="/universityManagement" element={<AdminUniversityManagement />} />
            <Route path="/admin/updates" element={<AdminUpdatesPage />} />
<<<<<<< HEAD
=======
            <Route path="/admin/user-management" element={<AdminUserManagement />} />
            <Route path="/admin/userData" element={<UserManagementDashboard />} />
>>>>>>> backup-feature-update
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

        {/* 🧠 Assessment Route */}
       

        {/* 💬 Chatbot & Footer */}
        <ChatBot />
        {/* <Footer /> */}
      </AuthProvider>
    </>
  );
}

export default App;
