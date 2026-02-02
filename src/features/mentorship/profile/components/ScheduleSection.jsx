import { useState, useEffect } from 'react';
import { Save, Calendar, Clock, Plus, X, Loader2 } from 'lucide-react';

const ScheduleSection = ({ profile, saving, onUpdate, onAddBusyDate, onRemoveBusyDate }) => {
    const [formData, setFormData] = useState({
        sessionsPerWeek: 1,
        sessionDuration: 60,
        availabilitySlots: [],
    });
    const [newBusyDate, setNewBusyDate] = useState({ date: '', reason: '' });
    const [hasChanges, setHasChanges] = useState(false);
    const [addingBusy, setAddingBusy] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        if (profile) {
            setFormData({
                sessionsPerWeek: profile.sessionsPerWeek || 1,
                sessionDuration: profile.sessionDuration || 60,
                availabilitySlots: profile.availabilitySlots || [],
            });
        }
    }, [profile]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const toggleDayAvailability = (day, startTime = '09:00', endTime = '18:00') => {
        const existingSlot = formData.availabilitySlots.find(s => s.day === day);

        if (existingSlot) {
            // Toggle availability
            setFormData(prev => ({
                ...prev,
                availabilitySlots: prev.availabilitySlots.map(s =>
                    s.day === day ? { ...s, isAvailable: !s.isAvailable } : s
                ),
            }));
        } else {
            // Add new slot
            setFormData(prev => ({
                ...prev,
                availabilitySlots: [...prev.availabilitySlots, { day, startTime, endTime, isAvailable: true }],
            }));
        }
        setHasChanges(true);
    };

    const updateSlotTime = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            availabilitySlots: prev.availabilitySlots.map(s =>
                s.day === day ? { ...s, [field]: value } : s
            ),
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        await onUpdate(formData);
        setHasChanges(false);
    };

    const handleAddBusyDate = async () => {
        if (!newBusyDate.date) return;
        setAddingBusy(true);
        try {
            await onAddBusyDate(newBusyDate.date, newBusyDate.reason);
            setNewBusyDate({ date: '', reason: '' });
        } finally {
            setAddingBusy(false);
        }
    };

    const getSlotForDay = (day) => {
        return formData.availabilitySlots.find(s => s.day === day) || null;
    };

    return (
        <div className="schedule-section">
            <div className="section-header">
                <div>
                    <h2>Schedule & Availability</h2>
                    <p>Manage your weekly schedule and mark specific dates as unavailable</p>
                </div>
                <button
                    className={`save-btn ${!hasChanges ? 'disabled' : ''}`}
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                >
                    {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="content-grid">
                {/* Session Configuration */}
                <div className="form-card">
                    <h3><Clock size={18} /> Session Configuration</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Sessions per Week</label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={formData.sessionsPerWeek}
                                onChange={(e) => handleChange('sessionsPerWeek', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Session Duration (minutes)</label>
                            <select
                                value={formData.sessionDuration}
                                onChange={(e) => handleChange('sessionDuration', parseInt(e.target.value))}
                            >
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                                <option value={90}>90 minutes</option>
                                <option value={120}>2 hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Weekly Availability */}
                <div className="form-card">
                    <h3><Calendar size={18} /> Weekly Availability</h3>
                    <p className="help-text">Click a day to toggle availability, then set your hours.</p>

                    <div className="days-grid">
                        {days.map((day) => {
                            const slot = getSlotForDay(day);
                            const isAvailable = slot?.isAvailable ?? false;

                            return (
                                <div key={day} className={`day-card ${isAvailable ? 'available' : ''}`}>
                                    <div className="day-header" onClick={() => toggleDayAvailability(day)}>
                                        <span className="day-name">{day}</span>
                                        <span className={`status-badge ${isAvailable ? 'on' : 'off'}`}>
                                            {isAvailable ? 'Available' : 'Off'}
                                        </span>
                                    </div>
                                    {isAvailable && slot && (
                                        <div className="time-inputs">
                                            <input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) => updateSlotTime(day, 'startTime', e.target.value)}
                                            />
                                            <span>to</span>
                                            <input
                                                type="time"
                                                value={slot.endTime}
                                                onChange={(e) => updateSlotTime(day, 'endTime', e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Busy Dates */}
                <div className="form-card">
                    <h3><X size={18} /> Busy Dates (Unavailable)</h3>
                    <p className="help-text">Mark specific dates when you cannot take sessions.</p>

                    <div className="add-busy-form">
                        <input
                            type="date"
                            value={newBusyDate.date}
                            onChange={(e) => setNewBusyDate(prev => ({ ...prev, date: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <input
                            type="text"
                            placeholder="Reason (optional)"
                            value={newBusyDate.reason}
                            onChange={(e) => setNewBusyDate(prev => ({ ...prev, reason: e.target.value }))}
                        />
                        <button onClick={handleAddBusyDate} disabled={addingBusy || !newBusyDate.date}>
                            {addingBusy ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
                            Add
                        </button>
                    </div>

                    <div className="busy-dates-list">
                        {profile?.busyDates?.length > 0 ? (
                            profile.busyDates
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map((busy) => (
                                    <div key={busy._id} className="busy-date-item">
                                        <div className="busy-info">
                                            <span className="busy-date">
                                                {new Date(busy.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            {busy.reason && <span className="busy-reason">{busy.reason}</span>}
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => onRemoveBusyDate(busy._id)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                        ) : (
                            <p className="no-dates">No busy dates marked. You're available on all days!</p>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .schedule-section {
          padding: 32px;
          max-width: 1000px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
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

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(.disabled) {
          background: #3949AB;
        }

        .save-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .content-grid {
          display: grid;
          gap: 24px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .help-text {
          color: #64748b;
          font-size: 13px;
          margin: 0 0 20px 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .day-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .day-card.available {
          border-color: #1A237E;
          background: #EEF2FF;
        }

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          user-select: none;
        }

        .day-name {
          font-weight: 600;
          color: #1e293b;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .status-badge.on {
          background: #059669;
          color: white;
        }

        .status-badge.off {
          background: #e2e8f0;
          color: #64748b;
        }

        .time-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #e2e8f0;
        }

        .time-inputs input {
          flex: 1;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
        }

        .time-inputs span {
          color: #64748b;
          font-size: 13px;
        }

        .add-busy-form {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .add-busy-form input[type="date"] {
          width: 180px;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .add-busy-form input[type="text"] {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .add-busy-form button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .add-busy-form button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .busy-dates-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .busy-date-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
        }

        .busy-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .busy-date {
          font-weight: 600;
          color: #DC2626;
        }

        .busy-reason {
          font-size: 13px;
          color: #7F1D1D;
        }

        .remove-btn {
          padding: 6px;
          background: white;
          border: 1px solid #FECACA;
          border-radius: 6px;
          color: #DC2626;
          cursor: pointer;
        }

        .remove-btn:hover {
          background: #FEE2E2;
        }

        .no-dates {
          color: #64748b;
          font-size: 14px;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .schedule-section {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .add-busy-form {
            flex-direction: column;
          }

          .add-busy-form input[type="date"] {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default ScheduleSection;
