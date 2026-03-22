import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/MyGroupsPage.css';

export default function MyGroupsPage() {
  const { fetchMyGroups, myGroups, loading, error } = useGroupContext();

  useEffect(() => {
    fetchMyGroups();
  }, []);

  return (
    <div className="my-groups-page">
      <div className="container">
        <div className="page-header">
          <h1>My Groups</h1>
          <Link to="/groups/create" className="btn btn-primary">
            Create New Group
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your groups...</div>
        ) : (
          <div className="groups-container">
            {myGroups.length > 0 ? (
              <div className="groups-grid">
                {myGroups.map((group) => (
                  <div key={group._id} className="group-card">
                    <div className="card-content">
                      <h3>{group.name}</h3>
                      <p className="description">{group.description}</p>
                      <div className="card-footer">
                        <span className="category">{group.category}</span>
                        <span className="members">{group.memberCount} members</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <Link 
                        to={`/groups/chat/${group._id}`}
                        className="btn btn-small"
                      >
                        Chat
                      </Link>
                      <Link 
                        to={`/groups/groups/${group._id}/settings`}
                        className="btn btn-small"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>You haven't joined any groups yet</h3>
                <p>Explore and join a group to get started!</p>
                <Link to="/groups/discover" className="btn btn-primary">
                  Discover Groups
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
