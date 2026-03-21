import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import config from '../../config';

// Import Tab Components
import ProfileSidebar from './components/ProfileSidebar';
import PersonalInfoTab from './components/PersonalInfoTab';
import EducationTab from './components/EducationTab';
import PortfolioTab from './components/PortfolioTab';
import ExperienceTab from './components/ExperienceTab';
import SecurityTab from './components/SecurityTab';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    tenthGrade: { percentage: '', maths: '', science: '', english: '' },
    twelfthGrade: { percentage: '', maths: '', physics: '', chemistry: '' },
    jobRolesPredicted: ['', '', '']
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data.success && data.profile) {
        setProfile(data.profile);
        setFormData({
          tenthGrade: data.profile.tenthGrade || { percentage: '', maths: '', science: '', english: '' },
          twelfthGrade: data.profile.twelfthGrade || { percentage: '', maths: '', physics: '', chemistry: '' },
          jobRolesPredicted: data.profile.jobRolesPredicted || ['', '', '']
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChangePassword = async () => {
    setIsResetting(true);
    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
        email: user?.email
      });

      if (data.success) {
        toast.success("Verification code sent to your email");
        navigate('/change-password', {
          state: {
            email: user?.email
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsResetting(false);
    }
  };

  const handleInputChange = (e, grade, subject) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: value
      }
    }));
  };

  const handleJobRoleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      jobRolesPredicted: prev.jobRolesPredicted.map((role, i) => i === index ? value : role)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_BASE_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      fetchProfile();
      toast.success("Profile saved successfully.");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to save profile.");
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'personal':
        return <PersonalInfoTab user={user} handleSubmit={handleSubmit} />;
      case 'education':
        return (
          <EducationTab 
            isEditing={isEditing} 
            profile={profile}
            formData={formData}
            handleInputChange={handleInputChange}
            handleJobRoleChange={handleJobRoleChange}
            handleSubmit={handleSubmit}
          />
        );
      case 'higher-education':
        return <PortfolioTab profile={profile} />;
      case 'experience':
        return <ExperienceTab user={user} />;
      case 'security':
        return <SecurityTab user={user} isResetting={isResetting} handleChangePassword={handleChangePassword} />;
      default:
        return (
          <div className="flex items-center justify-center p-12 h-64 text-secondary">
            <p>This section is currently under development.</p>
          </div>
        );
    }
  };

  // If no profile yet, but not actively loading we can just render the layout 
  // with placeholders or let the tabs handle empty states.

  return (
    <div className="flex min-h-screen bg-surface font-body text-on-surface">
      <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      
      <main className="flex-1 min-w-0">
        <div className="lg:hidden p-4 border-b border-outline-variant/20 flex justify-between items-center bg-white sticky top-[64px] z-30">
          <span className="font-bold text-primary font-headline">Profile Dashboard</span>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value)}
            className="text-sm bg-surface-container-highest border-none rounded-lg focus:ring-1 focus:ring-primary/20"
          >
            <option value="personal">Personal Information</option>
            <option value="education">Education</option>
            <option value="higher-education">Higher Education & Goals</option>
            <option value="experience">Experience</option>
            <option value="social">Social Links</option>
            <option value="notifications">Notifications</option>
            <option value="security">Security & Privacy</option>
          </select>
        </div>

        {/* Tab Header specific actions (Edit toggle) */}
        {activeTab === 'education' && (
          <div className="px-4 sm:px-8 lg:px-12 pt-6 flex justify-end">
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className="text-teal-600 font-semibold text-sm hover:underline"
             >
               {isEditing ? 'Cancel Edit' : 'Edit Education Data'}
             </button>
          </div>
        )}

        <div className="animate-in fade-in duration-300">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}