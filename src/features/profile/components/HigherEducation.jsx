import { useState } from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'react-hot-toast';

const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'pursuing', label: 'Pursuing' },
    { value: 'completed', label: 'Completed' },
];

const gradStatusOptions = [
    { value: 'not_applicable', label: 'Not Applicable' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'pursuing', label: 'Pursuing' },
    { value: 'completed', label: 'Completed' },
];

const HigherEducation = ({ profile, saving, onUpdateUndergraduate, onUpdateGraduation }) => {
    const [editingUG, setEditingUG] = useState(false);
    const [editingGrad, setEditingGrad] = useState(false);

    const [ugData, setUgData] = useState({
        status: profile?.undergraduate?.status || 'not_started',
        courseName: profile?.undergraduate?.courseName || '',
        specialization: profile?.undergraduate?.specialization || '',
        collegeName: profile?.undergraduate?.collegeName || '',
        university: profile?.undergraduate?.university || '',
        startYear: profile?.undergraduate?.startYear || '',
        passoutYear: profile?.undergraduate?.passoutYear || '',
        expectedPassoutYear: profile?.undergraduate?.expectedPassoutYear || '',
        cgpa: profile?.undergraduate?.cgpa || '',
        percentage: profile?.undergraduate?.percentage || '',
    });

    const [gradData, setGradData] = useState({
        status: profile?.graduation?.status || 'not_applicable',
        courseName: profile?.graduation?.courseName || '',
        specialization: profile?.graduation?.specialization || '',
        collegeName: profile?.graduation?.collegeName || '',
        university: profile?.graduation?.university || '',
        startYear: profile?.graduation?.startYear || '',
        passoutYear: profile?.graduation?.passoutYear || '',
        expectedPassoutYear: profile?.graduation?.expectedPassoutYear || '',
        cgpa: profile?.graduation?.cgpa || '',
        percentage: profile?.graduation?.percentage || '',
    });

    const handleUGSave = async () => {
        const result = await onUpdateUndergraduate(ugData);
        if (result.success) {
            toast.success(result.message);
            setEditingUG(false);
        } else {
            toast.error(result.message);
        }
    };

    const handleGradSave = async () => {
        const result = await onUpdateGraduation(gradData);
        if (result.success) {
            toast.success(result.message);
            setEditingGrad(false);
        } else {
            toast.error(result.message);
        }
    };

    const renderEducationForm = (data, setData, isEditing, type) => {
        const isPursuing = data.status === 'pursuing';
        const isCompleted = data.status === 'completed';
        const showFields = isPursuing || isCompleted || data.status === 'not_started';

        return (
            <div className="form-grid">
                <div className="form-group">
                    <Label>Status</Label>
                    <select
                        value={data.status}
                        onChange={(e) => setData(prev => ({ ...prev, status: e.target.value }))}
                        disabled={!isEditing}
                        className="select-field"
                    >
                        {(type === 'grad' ? gradStatusOptions : statusOptions).map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {showFields && data.status !== 'not_applicable' && (
                    <>
                        <div className="form-group">
                            <Label>Course/Degree Name</Label>
                            <Input
                                value={data.courseName}
                                onChange={(e) => setData(prev => ({ ...prev, courseName: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="B.Tech, B.Sc, BBA..."
                            />
                        </div>
                        <div className="form-group">
                            <Label>Specialization</Label>
                            <Input
                                value={data.specialization}
                                onChange={(e) => setData(prev => ({ ...prev, specialization: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="Computer Science, Electronics..."
                            />
                        </div>
                        <div className="form-group">
                            <Label>College Name</Label>
                            <Input
                                value={data.collegeName}
                                onChange={(e) => setData(prev => ({ ...prev, collegeName: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="Your college name"
                            />
                        </div>
                        <div className="form-group">
                            <Label>University</Label>
                            <Input
                                value={data.university}
                                onChange={(e) => setData(prev => ({ ...prev, university: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="University name"
                            />
                        </div>
                        <div className="form-group">
                            <Label>Start Year</Label>
                            <Input
                                type="number"
                                value={data.startYear}
                                onChange={(e) => setData(prev => ({ ...prev, startYear: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="2022"
                                min="1990"
                                max="2100"
                            />
                        </div>
                        {isPursuing && (
                            <div className="form-group">
                                <Label>Expected Passout Year</Label>
                                <Input
                                    type="number"
                                    value={data.expectedPassoutYear}
                                    onChange={(e) => setData(prev => ({ ...prev, expectedPassoutYear: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="2026"
                                    min="1990"
                                    max="2100"
                                />
                            </div>
                        )}
                        {isCompleted && (
                            <>
                                <div className="form-group">
                                    <Label>Passout Year</Label>
                                    <Input
                                        type="number"
                                        value={data.passoutYear}
                                        onChange={(e) => setData(prev => ({ ...prev, passoutYear: e.target.value }))}
                                        disabled={!isEditing}
                                        placeholder="2026"
                                        min="1990"
                                        max="2100"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label>CGPA (out of 10)</Label>
                                    <Input
                                        type="number"
                                        value={data.cgpa}
                                        onChange={(e) => setData(prev => ({ ...prev, cgpa: e.target.value }))}
                                        disabled={!isEditing}
                                        placeholder="8.5"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                    />
                                </div>
                                <div className="form-group">
                                    <Label>Percentage</Label>
                                    <Input
                                        type="number"
                                        value={data.percentage}
                                        onChange={(e) => setData(prev => ({ ...prev, percentage: e.target.value }))}
                                        disabled={!isEditing}
                                        placeholder="85.5"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>Higher Education</h2>
            </div>

            {/* Undergraduate Section */}
            <div className="education-card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="grade-badge ug">UG</span>
                        <h3>Undergraduate</h3>
                    </div>
                    <div className="card-controls">
                        {!editingUG ? (
                            <Button variant="outline" size="sm" onClick={() => setEditingUG(true)}>Edit</Button>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => setEditingUG(false)} disabled={saving}>
                                    <X size={14} /> Cancel
                                </Button>
                                <Button size="sm" onClick={handleUGSave} disabled={saving} className="save-btn">
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="card-content">
                    {renderEducationForm(ugData, setUgData, editingUG, 'ug')}
                </div>
            </div>

            {/* Graduation/Post-Graduation Section */}
            <div className="education-card">
                <div className="card-header">
                    <div className="card-title">
                        <span className="grade-badge grad">PG</span>
                        <h3>Post-Graduation</h3>
                    </div>
                    <div className="card-controls">
                        {!editingGrad ? (
                            <Button variant="outline" size="sm" onClick={() => setEditingGrad(true)}>Edit</Button>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => setEditingGrad(false)} disabled={saving}>
                                    <X size={14} /> Cancel
                                </Button>
                                <Button size="sm" onClick={handleGradSave} disabled={saving} className="save-btn">
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="card-content">
                    {renderEducationForm(gradData, setGradData, editingGrad, 'grad')}
                </div>
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

        .education-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .grade-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }

        .grade-badge.ug {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .grade-badge.grad {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .card-title h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .card-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .card-content {
          padding: 20px;
          background: #ffffff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .select-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
        }

        .select-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default HigherEducation;
