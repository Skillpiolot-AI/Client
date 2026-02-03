// RecipientSelector Component - Select announcement recipients
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, X } from 'lucide-react';
import config from '../../../config/config';

const RecipientSelector = ({ recipientType, targetRoles, recipientIds, onChange }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const recipientTypes = [
        { value: 'all', label: '👥 All Users', desc: 'Send to everyone' },
        { value: 'mentors', label: '🎓 Mentors Only', desc: 'All verified mentors' },
        { value: 'users', label: '👤 Users Only', desc: 'Regular users' },
        { value: 'specific', label: '🎯 Specific Users', desc: 'Select individuals' },
    ];

    const roleOptions = [
        { value: 'User', label: 'Users' },
        { value: 'Mentor', label: 'Mentors' },
        { value: 'Admin', label: 'Admins' },
        { value: 'Student', label: 'Students' },
        { value: 'UniAdmin', label: 'University Admins' },
        { value: 'UniTeach', label: 'Teachers' },
    ];

    useEffect(() => {
        if (recipientType === 'specific' && recipientIds.length > 0) {
            fetchSelectedUsers();
        }
    }, []);

    const fetchSelectedUsers = async () => {
        // Fetch user details for selected IDs
        // This would need an endpoint to get users by IDs
    };

    const searchUsers = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${config.API_BASE_URL}/admin/users?search=${query}&limit=10`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSearchResults(response.data.users || response.data || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecipientTypeChange = (type) => {
        onChange({
            recipientType: type,
            targetRoles: [],
            recipientIds: [],
        });
        setSelectedUsers([]);
    };

    const handleRoleToggle = (role) => {
        const newRoles = targetRoles.includes(role)
            ? targetRoles.filter(r => r !== role)
            : [...targetRoles, role];
        onChange({ targetRoles: newRoles });
    };

    const handleUserSelect = (user) => {
        if (!recipientIds.includes(user._id)) {
            setSelectedUsers([...selectedUsers, user]);
            onChange({ recipientIds: [...recipientIds, user._id] });
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleUserRemove = (userId) => {
        setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
        onChange({ recipientIds: recipientIds.filter(id => id !== userId) });
    };

    return (
        <div className="form-group">
            <label className="form-label">
                <Users size={16} style={{ marginRight: '0.5rem' }} />
                Recipients
            </label>

            {/* Recipient Type Selection */}
            <div className="recipient-type-grid">
                {recipientTypes.map((type) => (
                    <button
                        key={type.value}
                        type="button"
                        className={`recipient-type-btn ${recipientType === type.value ? 'active' : ''}`}
                        onClick={() => handleRecipientTypeChange(type.value)}
                    >
                        <div style={{ fontWeight: 600 }}>{type.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{type.desc}</div>
                    </button>
                ))}
            </div>

            {/* Role Filter (for 'all' type) */}
            {recipientType === 'all' && (
                <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                        Filter by Role (optional)
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {roleOptions.map((role) => (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => handleRoleToggle(role.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: targetRoles.includes(role.value) ? '2px solid #6366f1' : '2px solid #e5e7eb',
                                    background: targetRoles.includes(role.value) ? '#f0f0ff' : 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                }}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* User Search (for 'specific' type) */}
            {recipientType === 'specific' && (
                <div style={{ marginTop: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '40px' }}
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                searchUsers(e.target.value);
                            }}
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            marginTop: '0.5rem',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        }}>
                            {searchResults.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserSelect(user)}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        background: '#ede9fe',
                                        color: '#7c3aed',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                    }}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Selected Users ({selectedUsers.length})
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {selectedUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: '#f0f0ff',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <span>{user.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleUserRemove(user._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                display: 'flex',
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecipientSelector;
