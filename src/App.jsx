


import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Home from './Pages/Home';
import Recommendation from './Pages/Recommendation/Recommendation';
import JobDetails from './Pages/Recommendation/RecommDetails';
import CareerForm from './Pages/Forms/CareerForm';
import NotFound from './Pages/Error/NotFound';
import CoolNavbar from './Pages/Headers/Navbar';

import LoginForm from './Pages/User/Login';
import SignupForm from './Pages/User/Signup';
import JobTitlesManagement from './Pages/Forms/JobTitles';
import CompaniesManagement from './Pages/Forms/CompaniesManagement';
import CreativeApplicationForm from './Pages/MentorShip/Form';
import AdminApplicationsPage from './Pages/MentorShip/List';
import ApplicationTracker from './Pages/MentorShip/Tracker';
import Dashboard from './Pages/DashBoard';
import MentorRegistrationForm from './Pages/MentorShip/Registor';
import MentorList from './Pages/MentorShip/MentorList';
import MentorAppointments from './Pages/MentorShip/MentorAppointments';
import UserAppointments from './Pages/MentorShip/UserAppointment';
import ProtectedRoute from '../src/Pages/Protection/ProtectedRoute';
import VideoForm from './Pages/Educate/VideoForm';
import VideoList from './Pages/Educate/VideoList';
import LoadingSpinner from './Pages/Loader/Loader';
import InterestManagement from './Pages/Forms/InterestManagement';
import StrengthManagement from './Pages/Forms/StrengthManagement';
import SkillsManagement from './Pages/Forms/SkillsManagement';
import CollegesManagement from './Pages/Forms/CollegesManagement';
import RecommendationForm from './Pages/Forms/Recommendation';
import Button from "./Pages/Button"
import CareerRecommendationForm from './Pages/Forms/Questions';
import AddWorkshop from './Pages/Forms/AddWorkshop';
import AvailableWorkshops from './Pages/Workshops/AvailableWorkshops';
import AdminDashboard from './Pages/Admin/DashBoard';
import AddResourcePage from './Pages/Resourses/AddResourses';
import ViewBooksPage from './Pages/Resourses/ViewResourses';
import MentorFeedback from './Pages/MentorShip/MentoFeedback';
import ChatCareerAdvisor from './Pages/Roadmap/Roadmap';
import ModernCommunityPage from './Pages/community/community';
import CoachProfile from './Pages/DashBoard/MentorDashBoard';
import ScheduleSession from './Pages/MentorShip/BookAppointment';
import CareerQuiz from './Pages/Quiz/Quiz';
import CombinedCareerAdvisor from './Pages/Quiz/Prediction';
import Profile from './Pages/Profile/Profile';
import RecommendationJobTitlesSearch from './Pages/Recommendation/JobTitle';
import JobInfo from './Pages/Recommendation/jobinfo';
import FrontendRoadmap from './Roadmap/Frontend';
import MentoHome from './Pages/MentoHome';
import Footer from './Pages/Headers/Footer';
import chatbot from './Bots/chatbot'
import DummyJobInfo from './Pages/Recommendation/DummyInfo';
import MentorshipPage from './Pages/Mentor Home/HomePage';
import AMDashboard from './Pages/DashBoard/AdminMento';
import ChatBot from './Bots/chatbot';
import TechCareerPathsHub from './Roadmap/Roadmap';
import DetailedDataScientistRoadmap from './Roadmap/DataScientist';
import AnalyticsDashboard from './Pages/Admin/Analytics/AnalyticsDashboard';

function App() {
  return (
    <>
    
      <CoolNavbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/job-details/:jobTitle" element={<JobDetails />} />
        <Route path='/Learn' element={<VideoForm/>}/>
        <Route path ="/learnlist" element={<VideoList/>}/>
        <Route path="/mentorship" element={<MentorList />} />
        <Route path='/question' element={<CareerRecommendationForm/>}/>
        <Route path='/button' element={<Button/>}/>   
        <Route path='/workshopAdd'element={<AddWorkshop/>}/> {/*Admin*/}
        <Route path="/workshops"element={<AvailableWorkshops/>}/>
        <Route path='/dashboardAdmin' element={<AdminDashboard/>}/>   {/*Admin*/}
        <Route path="/addResources" element={<AddResourcePage/>}/>    {/*Admin*/}
        <Route path ="/view-books" element={<ViewBooksPage/>}/>
        <Route path="/userFeedback" element={<MentorFeedback/>}/>    {/*Admin*/}
        <Route path="/community" element={<ModernCommunityPage/>}/>
        <Route path="/roadmap" element={<FrontendRoadmap/>}/>
        <Route path="/mentorDashboard" element={<CoachProfile/>}/>      {/*Mentor*/}
        <Route path='/schedulementor'element={<ScheduleSession/>}/>
        <Route path ="/mentor" element={<MentoHome/>}/>
        <Route path="/softwareengineer" element={<FrontendRoadmap/>}/>
        <Route path="/careerquiz" element={<CareerQuiz/>}/>
        <Route path="/combinedquiz" element={<CombinedCareerAdvisor/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/jobtitleall' element={<RecommendationJobTitlesSearch/>}/>
        <Route path="/job-info" element={<JobInfo/>}/>
        <Route path="/dummyinfo" element={<DummyJobInfo/>}/>
        <Route path ="/mentorHome" element={<MentorshipPage/>}/>
        <Route path='/careerPaths' element={<TechCareerPathsHub/>}/>
        <Route path="/datascientist" element={<DetailedDataScientistRoadmap/>}/>
        {/* User protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['User', 'Mentor', 'Admin']} />}>
          <Route path="/careerform" element={<CareerForm />} />
          <Route path="/application" element={<CreativeApplicationForm />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          <Route path="/dashboard" element={<Dashboard />} />
         
          <Route path="/my-applications" element={<UserAppointments />} />
          
        </Route>

        {/* Mentor protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin']} />}>
          <Route path="/my-sessions" element={<MentorAppointments />} />
          <Route path="/interestForm" element={<InterestManagement/>}/>
          <Route path='/StrengthForm' element={<StrengthManagement/>}/>
          <Route path='/amdashboard'element={<AMDashboard/>}/>
          <Route path='/skillform' element={<SkillsManagement/>}/>
          <Route path='/collegeform'element={<CollegesManagement/>}/>
          <Route path ="/recommendationForm"element={<RecommendationForm/>}/>
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/JobForm" element={<JobTitlesManagement />} />
          <Route path="/Companyform" element={<CompaniesManagement />} />
          <Route path="/mentoapplication" element={<AdminApplicationsPage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/addmentor" element={<MentorRegistrationForm />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <ChatBot/> */}
      <ChatBot/>
      <Footer/>
    </>
  );
}

export default App;