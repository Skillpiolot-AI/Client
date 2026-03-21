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
            <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
                <Loader2 size={48} className="animate-spin text-primary" />
                <p className="mt-4 text-on-surface-variant font-medium">Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-center px-4">
                <h2 className="text-error text-2xl font-bold mb-2">Error Loading Profile</h2>
                <p className="text-on-surface-variant">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-surface font-body text-on-surface">
            <Toaster position="top-right" />

            <ProfileSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                user={user}
            />

            <main className="flex-1 min-w-0 pb-16 lg:pb-0">
                {/* Mobile Dropdown Navigator */}
                <div className="lg:hidden p-4 border-b border-outline-variant/20 flex justify-between items-center bg-white sticky top-[64px] z-30 shadow-sm">
                    <span className="font-bold text-primary font-headline">Profile Dashboard</span>
                    <select 
                        value={activeSection} 
                        onChange={(e) => setActiveSection(e.target.value)}
                        className="text-sm bg-surface-container-highest border-none rounded-lg focus:ring-1 focus:ring-primary/20 text-on-surface font-medium py-2 px-3"
                    >
                        <option value="personal">Personal Information</option>
                        <option value="education">Education</option>
                        <option value="higher-education">Higher Education</option>
                        <option value="experience">Experience</option>
                        <option value="social-links">Social Links</option>
                        <option value="notifications">Notifications</option>
                        <option value="security">Security & Privacy</option>
                    </select>
                </div>

                <div className="animate-in fade-in duration-300">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
