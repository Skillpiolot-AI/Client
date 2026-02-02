import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import useMentorProfile from './hooks/useMentorProfile';
import MentorSidebar from './components/MentorSidebar';
import BioSection from './components/BioSection';
import ScheduleSection from './components/ScheduleSection';
import SessionsSection from './components/SessionsSection';
import SocialSection from './components/SocialSection';
import { useAuth } from '../../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const MentorProfilePage = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('bio');

    const {
        profile,
        sessionStats,
        sessions,
        sessionStatusCounts,
        loading,
        saving,
        error,
        fetchSessions,
        updateProfile,
        addBusyDate,
        removeBusyDate,
    } = useMentorProfile();

    const renderContent = () => {
        switch (activeSection) {
            case 'bio':
                return (
                    <BioSection
                        profile={profile}
                        saving={saving}
                        onUpdate={updateProfile}
                    />
                );
            case 'schedule':
                return (
                    <ScheduleSection
                        profile={profile}
                        saving={saving}
                        onUpdate={updateProfile}
                        onAddBusyDate={addBusyDate}
                        onRemoveBusyDate={removeBusyDate}
                    />
                );
            case 'sessions':
                return (
                    <SessionsSection
                        sessions={sessions}
                        statusCounts={sessionStatusCounts}
                        onFetchSessions={fetchSessions}
                    />
                );
            case 'social':
                return (
                    <SocialSection
                        profile={profile}
                        saving={saving}
                        onUpdate={updateProfile}
                    />
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 size={48} className="animate-spin" />
                <p>Loading your mentor profile...</p>
                <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8fafc;
            color: #1A237E;
          }
          .loading-container p {
            margin-top: 16px;
            color: #64748b;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Profile</h2>
                <p>{error}</p>
                <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8fafc;
          }
          .error-container h2 {
            color: #ef4444;
            margin-bottom: 8px;
          }
          .error-container p {
            color: #64748b;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="mentor-profile-page">
            <Toaster position="top-right" />

            <MentorSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                profile={profile}
                user={user}
                sessionStats={sessionStats}
            />

            <main className="mentor-profile-content">
                {renderContent()}
            </main>

            <style jsx>{`
        .mentor-profile-page {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .mentor-profile-content {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          background: #f8fafc;
        }

        @media (max-width: 768px) {
          .mentor-profile-page {
            flex-direction: column;
          }

          .mentor-profile-content {
            min-height: auto;
          }
        }
      `}</style>
        </div>
    );
};

export default MentorProfilePage;
