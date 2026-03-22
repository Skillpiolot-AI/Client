import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/GroupSettingsPage.css';

export default function GroupSettingsPage() {
  const { id } = useParams();
  const { fetchGroupById, currentGroup, leaveGroup, loading } = useGroupContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id) {
      fetchGroupById(id).then((group) => {
        setFormData(group || {});
      });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLeaveGroup = async () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await leaveGroup(id);
        navigate('/groups/my-groups');
      } catch (error) {
        console.error('Failed to leave group:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="group-settings-page">
      <div className="container">
        <h1>{currentGroup?.name} - Settings</h1>

        <div className="settings-container">
          <section className="settings-section">
            <h2>Group Information</h2>
            {isEditing ? (
              <form className="settings-form">
                <div className="form-group">
                  <label>Group Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Name:</strong> {currentGroup?.name}</p>
                <p><strong>Description:</strong> {currentGroup?.description}</p>
                <p><strong>Category:</strong> {currentGroup?.category}</p>
                <p><strong>Members:</strong> {currentGroup?.memberCount}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  Edit Information
                </button>
              </>
            )}
          </section>

          <section className="settings-section danger-zone">
            <h2>Danger Zone</h2>
            <button
              onClick={handleLeaveGroup}
              disabled={loading}
              className="btn btn-danger"
            >
              Leave Group
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
