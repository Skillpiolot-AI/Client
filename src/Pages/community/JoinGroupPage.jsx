import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/JoinGroupPage.css';

export default function JoinGroupPage() {
  const { inviteCode } = useParams();
  const { validateInviteCode, joinGroupWithInviteCode, loading, error } = useGroupContext();
  const navigate = useNavigate();
  const [groupInfo, setGroupInfo] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const validateCode = async () => {
      try {
        const data = await validateInviteCode(inviteCode);
        setGroupInfo(data.group);
      } catch (err) {
        console.error('Invalid invite code:', err);
      }
    };

    if (inviteCode) {
      validateCode();
    }
  }, [inviteCode]);

  const handleJoin = async () => {
    try {
      await joinGroupWithInviteCode(groupInfo._id, inviteCode);
      setJoined(true);
      setTimeout(() => {
        navigate(`/groups/chat/${groupInfo._id}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  if (loading) return <div className="loading">Processing invite...</div>;

  if (!groupInfo && !error) return <div className="loading">Loading invite...</div>;

  if (error || !groupInfo) {
    return (
      <div className="join-group-page error-state">
        <div className="container">
          <h1>Invalid Invite Link</h1>
          <p>This invite link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="join-group-page">
      <div className="container">
        {joined ? (
          <div className="success-state">
            <h1>Welcome to {groupInfo.name}! 🎉</h1>
            <p>You've successfully joined the group. Redirecting to chat...</p>
          </div>
        ) : (
          <div className="invite-card">
            <h1>Join Group</h1>
            <div className="group-info-display">
              <h2>{groupInfo.name}</h2>
              <p className="description">{groupInfo.description}</p>
              <div className="info-stats">
                <div className="stat">
                  <strong>Members</strong>
                  <span>{groupInfo.memberCount}</span>
                </div>
                <div className="stat">
                  <strong>Category</strong>
                  <span>{groupInfo.category}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleJoin}
              disabled={loading}
              className="btn btn-primary btn-large"
            >
              {loading ? 'Joining...' : 'Join Group'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
