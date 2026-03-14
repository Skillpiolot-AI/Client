import { User, Calendar, Clock, Link2, BookOpen, Star } from 'lucide-react';

const sections = [
    { id: 'bio', label: 'Bio & Details', icon: User },
    { id: 'schedule', label: 'Schedule & Availability', icon: Calendar },
    { id: 'sessions', label: 'Sessions', icon: Clock },
    { id: 'social', label: 'Social & Links', icon: Link2 },
];

const MentorSidebar = ({ activeSection, onSectionChange, profile, user, sessionStats }) => {
    return (
        <div className="mentor-sidebar">
            <div className="sidebar-header">
                <div className="mentor-preview">
                    <div className="avatar-container">
                        {profile?.profileImage || user?.imageUrl ? (
                            <img
                                src={profile?.profileImage || user?.imageUrl}
                                alt={profile?.displayName || user?.name}
                                className="mentor-avatar"
                            />
                        ) : (
                            <div className="avatar-placeholder">
                                {(profile?.displayName || user?.name)?.charAt(0)?.toUpperCase() || 'M'}
                            </div>
                        )}
                    </div>
                    <div className="mentor-info">
                        <h3>{profile?.displayName || user?.name || 'Mentor'}</h3>
                        <p className="tagline">{profile?.tagline || 'Verified Mentor'}</p>
                        {profile?.averageRating > 0 && (
                            <div className="rating">
                                <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                                <span>{profile.averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
                {sessionStats && (
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-value">{sessionStats.completed || 0}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{sessionStats.pending || 0}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{sessionStats.total || 0}</span>
                            <span className="stat-label">Total</span>
                        </div>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSectionChange(section.id)}
                        >
                            <Icon size={20} />
                            <span>{section.label}</span>
                        </button>
                    );
                })}
            </nav>

            <style jsx>{`
        .mentor-sidebar {
          width: 300px;
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #1A237E 0%, #3949AB 100%);
        }

        .mentor-preview {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar-container {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
        }

        .mentor-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          color: #1A237E;
        }

        .mentor-info h3 {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .mentor-info .tagline {
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          margin: 0;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
          color: #f59e0b;
          font-size: 13px;
          font-weight: 600;
        }

        .stats-row {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-value {
          display: block;
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .stat-label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          padding: 12px 0;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .nav-item.active {
          background: #EEF2FF;
          color: #1A237E;
          border-left-color: #1A237E;
          font-weight: 600;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .mentor-sidebar {
            width: 100%;
            min-height: auto;
            position: relative;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }

          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 8px;
            gap: 4px;
          }

          .nav-item {
            padding: 10px 16px;
            border-left: none;
            border-bottom: 2px solid transparent;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .nav-item.active {
            border-left-color: transparent;
            border-bottom-color: #1A237E;
          }

          .nav-item span {
            display: none;
          }
        }
      `}</style>
        </div>
    );
};

export default MentorSidebar;
