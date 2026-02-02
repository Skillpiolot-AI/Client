import { useState } from 'react';
import { Bell, Mail, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { toast } from 'react-hot-toast';

const NotificationSettings = ({ user, saving, onToggleNewsletter }) => {
  const [newsletter, setNewsletter] = useState(user?.newsletter || false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    const newValue = !newsletter;
    setIsUpdating(true);

    const result = await onToggleNewsletter(newValue);

    if (result.success) {
      setNewsletter(newValue);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setIsUpdating(false);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Notification Settings</h2>
      </div>

      <div className="settings-list">
        <div className="setting-card">
          <div className="setting-icon">
            <Mail size={24} />
          </div>
          <div className="setting-content">
            <h3>Newsletter Subscription</h3>
            <p>Receive weekly updates about new features, career tips, and opportunities.</p>
          </div>
          <div className="setting-action">
            <button
              className={`toggle-btn ${newsletter ? 'active' : ''}`}
              onClick={handleToggle}
              disabled={isUpdating || saving}
            >
              {isUpdating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="setting-card">
          <div className="setting-icon bell">
            <Bell size={24} />
          </div>
          <div className="setting-content">
            <h3>Email Notifications</h3>
            <p>Receive email alerts for important account activities and security updates.</p>
          </div>
          <div className="setting-action">
            <span className="always-on-badge">Always On</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h4>📧 Email Preferences</h4>
        <p>We respect your privacy. You can unsubscribe from promotional emails at any time. Essential security and account-related emails cannot be disabled.</p>
      </div>

      <style jsx>{`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .setting-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .setting-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .setting-icon.bell {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .setting-content {
          flex: 1;
        }

        .setting-content h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .setting-content p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .toggle-btn {
          width: 52px;
          height: 28px;
          background: #e2e8f0;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.2s;
          padding: 2px;
        }

        .toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle-btn.active {
          background: #f97316;
        }

        .toggle-track {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .toggle-thumb {
          display: block;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle-btn.active .toggle-thumb {
          transform: translateX(24px);
        }

        .always-on-badge {
          background: #dcfce7;
          color: #16a34a;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .info-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 20px;
        }

        .info-card h4 {
          color: #1d4ed8;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .info-card p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .setting-card {
            flex-wrap: wrap;
          }

          .setting-action {
            width: 100%;
            margin-top: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSettings;
