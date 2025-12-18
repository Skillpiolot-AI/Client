import { User, GraduationCap, Briefcase, Link2, Bell, Shield, BookOpen } from 'lucide-react';

const sections = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'education', label: 'Education (10th & 12th)', icon: GraduationCap },
  { id: 'higher-education', label: 'Higher Education', icon: BookOpen },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'social-links', label: 'Social Links', icon: Link2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
];

const ProfileSidebar = ({ activeSection, onSectionChange, user }) => {
  return (
    <div className="profile-sidebar">
      <div className="sidebar-header">
        <div className="user-preview">
          <div className="avatar-container">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} className="user-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="user-info">
            <h3>{user?.name || 'User'}</h3>
            <p>@{user?.username || 'username'}</p>
          </div>
        </div>
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
        .profile-sidebar {
          width: 280px;
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          padding: 0;
          position: sticky;
          top: 0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        }

        .user-preview {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar-container {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .user-avatar {
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
          font-size: 20px;
          font-weight: 600;
          color: #f97316;
        }

        .user-info h3 {
          color: white;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .user-info p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          margin: 0;
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
          background: #fff7ed;
          color: #ea580c;
          border-left-color: #f97316;
          font-weight: 600;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .profile-sidebar {
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
            border-bottom-color: #f97316;
          }

          .nav-item span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSidebar;
