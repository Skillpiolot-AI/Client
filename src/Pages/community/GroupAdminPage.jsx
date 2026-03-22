import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/GroupAdminPage.css';

export default function GroupAdminPage() {
  const { id } = useParams();
  const { fetchGroupById, getGroupMembers, groupMembers, banUser, loading } = useGroupContext();
  const [selectedMember, setSelectedMember] = useState(null);
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchGroupById(id);
      getGroupMembers(id);
    }
  }, [id]);

  const handleBanMember = async (memberId) => {
    if (!banReason.trim()) {
      alert('Please provide a reason for banning');
      return;
    }

    try {
      await banUser(id, {
        memberId,
        reason: banReason,
      });
      setBanReason('');
      setSelectedMember(null);
      // Refresh members list
      getGroupMembers(id);
    } catch (error) {
      console.error('Failed to ban member:', error);
    }
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="group-admin-page">
      <div className="container">
        <h1>Group Administration</h1>

        <div className="admin-panel">
          <section className="members-section">
            <h2>Members Management</h2>
            <div className="members-table">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupMembers.map((member) => (
                    <tr key={member._id}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedMember(member._id)}
                          className="btn btn-small btn-danger"
                        >
                          Ban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {selectedMember && (
            <section className="ban-section">
              <h3>Ban Member</h3>
              <div className="ban-form">
                <textarea
                  placeholder="Reason for banning..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows="4"
                />
                <div className="button-group">
                  <button
                    onClick={() => handleBanMember(selectedMember)}
                    disabled={loading}
                    className="btn btn-danger"
                  >
                    Confirm Ban
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(null);
                      setBanReason('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
