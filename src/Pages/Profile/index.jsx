import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import useProfile from './hooks/useProfile';
import ProfileSidebar from './components/ProfileSidebar';
import PersonalInformation from './components/PersonalInformation';
import EducationDetails from './components/EducationDetails';
import HigherEducation from './components/HigherEducation';
import ExperienceSection from './components/ExperienceSection';
import SocialLinks from './components/SocialLinks';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import { Toaster } from 'react-hot-toast';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('personal');

    const {
        profile,
        user,
        loading,
        error,
        saving,
        updatePersonalInfo,
        updateTenthGrade,
        updateTwelfthGrade,
        updateUndergraduate,
        updateGraduation,
        updateExperience,
        updateSocialLinks,
        uploadPhoto,
        removePhoto,
        toggleNewsletter,
    } = useProfile();

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return (
                    <PersonalInformation
                        profile={profile}
                        user={user}
                        saving={saving}
                        onUpdate={updatePersonalInfo}
                        onUploadPhoto={uploadPhoto}
                        onRemovePhoto={removePhoto}
                    />
                );
            case 'education':
                return (
                    <EducationDetails
                        profile={profile}
                        saving={saving}
                        onUpdateTenth={updateTenthGrade}
                        onUpdateTwelfth={updateTwelfthGrade}
                    />
                );
            case 'higher-education':
                return (
                    <HigherEducation
                        profile={profile}
                        saving={saving}
                        onUpdateUndergraduate={updateUndergraduate}
                        onUpdateGraduation={updateGraduation}
                    />
                );
            case 'experience':
                return (
                    <ExperienceSection
                        profile={profile}
                        saving={saving}
                        onUpdate={updateExperience}
                    />
                );
            case 'social-links':
                return (
                    <SocialLinks
                        profile={profile}
                        saving={saving}
                        onUpdate={updateSocialLinks}
                    />
                );
            case 'notifications':
                return (
                    <NotificationSettings
                        user={user}
                        saving={saving}
                        onToggleNewsletter={toggleNewsletter}
                    />
                );
            case 'security':
                return <SecuritySettings user={user} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 size={48} className="animate-spin" />
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Profile</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Toaster position="top-right" />

            <ProfileSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                user={user}
            />

            <main className="profile-content">
                {renderContent()}
            </main>

            <style jsx>{`
        .profile-page {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .profile-content {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          background: #f8fafc;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          color: #f97316;
        }

        .loading-container p {
          margin-top: 16px;
          color: #64748b;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          color: #1e293b;
        }

        .error-container h2 {
          color: #ef4444;
          margin-bottom: 8px;
        }

        .error-container p {
          color: #64748b;
        }

        @media (max-width: 768px) {
          .profile-page {
            flex-direction: column;
          }

          .profile-content {
            min-height: auto;
          }
        }
      `}</style>
        </div>
    );
};

export default ProfilePage;
