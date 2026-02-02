import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, Star, User, Video } from 'lucide-react';

const SessionsSection = ({ sessions, statusCounts, onFetchSessions }) => {
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const statusParam = activeTab === 'all' ? null : activeTab;
        onFetchSessions(statusParam);
    }, [activeTab]);

    const tabs = [
        { id: 'all', label: 'All Sessions', count: statusCounts?.all || 0 },
        { id: 'scheduled', label: 'Upcoming', count: statusCounts?.scheduled || 0 },
        { id: 'completed', label: 'Completed', count: statusCounts?.completed || 0 },
        { id: 'pending', label: 'Pending', count: statusCounts?.pending || 0 },
        { id: 'cancelled', label: 'Cancelled', count: statusCounts?.cancelled || 0 },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle size={16} className="text-green" />;
            case 'scheduled':
                return <Calendar size={16} className="text-blue" />;
            case 'pending':
                return <Clock size={16} className="text-orange" />;
            case 'cancelled':
                return <XCircle size={16} className="text-red" />;
            default:
                return <Clock size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#059669';
            case 'scheduled': return '#2563eb';
            case 'pending': return '#d97706';
            case 'cancelled': return '#dc2626';
            default: return '#64748b';
        }
    };

    return (
        <div className="sessions-section">
            <div className="section-header">
                <h2>Sessions</h2>
                <p>View all your mentorship sessions</p>
            </div>

            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        <span className="count">{tab.count}</span>
                    </button>
                ))}
            </div>

            <div className="sessions-list">
                {sessions?.length > 0 ? (
                    sessions.map((session) => (
                        <div key={session._id} className="session-card">
                            <div className="session-left">
                                <div className="mentee-avatar">
                                    {session.userId?.imageUrl ? (
                                        <img src={session.userId.imageUrl} alt={session.userId.name} />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="session-info">
                                    <h4>{session.userId?.name || 'User'}</h4>
                                    <p className="session-email">{session.userId?.email}</p>
                                    <div className="session-meta">
                                        <span className="session-date">
                                            <Calendar size={14} />
                                            {session.scheduledDate
                                                ? new Date(session.scheduledDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : 'Not scheduled'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="session-right">
                                <div
                                    className="status-badge"
                                    style={{ background: getStatusColor(session.status) + '15', color: getStatusColor(session.status) }}
                                >
                                    {getStatusIcon(session.status)}
                                    {session.status}
                                </div>
                                {session.rating && (
                                    <div className="rating">
                                        <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                                        <span>{session.rating.overallRating || 'N/A'}</span>
                                    </div>
                                )}
                                {session.meetingLink && session.status === 'scheduled' && (
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="join-btn"
                                    >
                                        <Video size={16} />
                                        Join
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <Calendar size={48} />
                        <h3>No sessions found</h3>
                        <p>Sessions will appear here when students book with you.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .sessions-section {
          padding: 32px;
          max-width: 1000px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .tab.active {
          background: #1A237E;
          color: white;
          border-color: #1A237E;
        }

        .tab .count {
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          font-size: 12px;
        }

        .tab.active .count {
          background: rgba(255, 255, 255, 0.2);
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .session-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .session-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .session-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mentee-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #EEF2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #1A237E;
        }

        .mentee-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .session-info h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .session-email {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 6px 0;
        }

        .session-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .session-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #475569;
        }

        .session-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #f59e0b;
        }

        .join-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #1A237E;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .join-btn:hover {
          background: #3949AB;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state svg {
          color: #e2e8f0;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          margin: 0;
        }

        .text-green { color: #059669; }
        .text-blue { color: #2563eb; }
        .text-orange { color: #d97706; }
        .text-red { color: #dc2626; }

        @media (max-width: 768px) {
          .sessions-section {
            padding: 20px;
          }

          .session-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .session-right {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
        </div>
    );
};

export default SessionsSection;
