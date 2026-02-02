import { useState } from 'react';
import { Save, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'react-hot-toast';

const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Other'];
const streams = ['Science', 'Commerce', 'Arts', 'Other'];

const EducationDetails = ({ profile, saving, onUpdateTenth, onUpdateTwelfth }) => {
    const [tenthExpanded, setTenthExpanded] = useState(true);
    const [twelfthExpanded, setTwelfthExpanded] = useState(true);
    const [editingTenth, setEditingTenth] = useState(false);
    const [editingTwelfth, setEditingTwelfth] = useState(false);

    const [tenthData, setTenthData] = useState({
        percentage: profile?.tenthGrade?.percentage || '',
        cgpa: profile?.tenthGrade?.cgpa || '',
        board: profile?.tenthGrade?.board || '',
        year: profile?.tenthGrade?.year || '',
        school: profile?.tenthGrade?.school || '',
    });

    const [twelfthData, setTwelfthData] = useState({
        percentage: profile?.twelfthGrade?.percentage || '',
        cgpa: profile?.twelfthGrade?.cgpa || '',
        board: profile?.twelfthGrade?.board || '',
        stream: profile?.twelfthGrade?.stream || '',
        year: profile?.twelfthGrade?.year || '',
        school: profile?.twelfthGrade?.school || '',
    });

    const handleTenthSave = async () => {
        const result = await onUpdateTenth(tenthData);
        if (result.success) {
            toast.success(result.message);
            setEditingTenth(false);
        } else {
            toast.error(result.message);
        }
    };

    const handleTwelfthSave = async () => {
        const result = await onUpdateTwelfth(twelfthData);
        if (result.success) {
            toast.success(result.message);
            setEditingTwelfth(false);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>Education Details</h2>
            </div>

            {/* 10th Grade Section */}
            <div className="education-card">
                <div className="card-header" onClick={() => setTenthExpanded(!tenthExpanded)}>
                    <div className="card-title">
                        <span className="grade-badge">10th</span>
                        <h3>10th Grade (Secondary)</h3>
                    </div>
                    <div className="card-controls">
                        {!editingTenth ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); setEditingTenth(true); }}
                            >
                                Edit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); setEditingTenth(false); }}
                                    disabled={saving}
                                >
                                    <X size={14} />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); handleTenthSave(); }}
                                    disabled={saving}
                                    className="save-btn"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </Button>
                            </>
                        )}
                        {tenthExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>

                {tenthExpanded && (
                    <div className="card-content">
                        <div className="form-grid">
                            <div className="form-group">
                                <Label>Percentage</Label>
                                <Input
                                    type="number"
                                    value={tenthData.percentage}
                                    onChange={(e) => setTenthData(prev => ({ ...prev, percentage: e.target.value }))}
                                    disabled={!editingTenth}
                                    placeholder="85.5"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="form-group">
                                <Label>CGPA (out of 10)</Label>
                                <Input
                                    type="number"
                                    value={tenthData.cgpa}
                                    onChange={(e) => setTenthData(prev => ({ ...prev, cgpa: e.target.value }))}
                                    disabled={!editingTenth}
                                    placeholder="9.2"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                />
                            </div>
                            <div className="form-group">
                                <Label>Board</Label>
                                <select
                                    value={tenthData.board}
                                    onChange={(e) => setTenthData(prev => ({ ...prev, board: e.target.value }))}
                                    disabled={!editingTenth}
                                    className="select-field"
                                >
                                    <option value="">Select Board</option>
                                    {boards.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <Label>Passing Year</Label>
                                <Input
                                    type="number"
                                    value={tenthData.year}
                                    onChange={(e) => setTenthData(prev => ({ ...prev, year: e.target.value }))}
                                    disabled={!editingTenth}
                                    placeholder="2020"
                                    min="1990"
                                    max="2100"
                                />
                            </div>
                            <div className="form-group full-width">
                                <Label>School Name</Label>
                                <Input
                                    value={tenthData.school}
                                    onChange={(e) => setTenthData(prev => ({ ...prev, school: e.target.value }))}
                                    disabled={!editingTenth}
                                    placeholder="Your school name"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 12th Grade Section */}
            <div className="education-card">
                <div className="card-header" onClick={() => setTwelfthExpanded(!twelfthExpanded)}>
                    <div className="card-title">
                        <span className="grade-badge twelfth">12th</span>
                        <h3>12th Grade (Higher Secondary)</h3>
                    </div>
                    <div className="card-controls">
                        {!editingTwelfth ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); setEditingTwelfth(true); }}
                            >
                                Edit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); setEditingTwelfth(false); }}
                                    disabled={saving}
                                >
                                    <X size={14} />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); handleTwelfthSave(); }}
                                    disabled={saving}
                                    className="save-btn"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </Button>
                            </>
                        )}
                        {twelfthExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>

                {twelfthExpanded && (
                    <div className="card-content">
                        <div className="form-grid">
                            <div className="form-group">
                                <Label>Percentage</Label>
                                <Input
                                    type="number"
                                    value={twelfthData.percentage}
                                    onChange={(e) => setTwelfthData(prev => ({ ...prev, percentage: e.target.value }))}
                                    disabled={!editingTwelfth}
                                    placeholder="85.5"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="form-group">
                                <Label>CGPA (out of 10)</Label>
                                <Input
                                    type="number"
                                    value={twelfthData.cgpa}
                                    onChange={(e) => setTwelfthData(prev => ({ ...prev, cgpa: e.target.value }))}
                                    disabled={!editingTwelfth}
                                    placeholder="9.2"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                />
                            </div>
                            <div className="form-group">
                                <Label>Board</Label>
                                <select
                                    value={twelfthData.board}
                                    onChange={(e) => setTwelfthData(prev => ({ ...prev, board: e.target.value }))}
                                    disabled={!editingTwelfth}
                                    className="select-field"
                                >
                                    <option value="">Select Board</option>
                                    {boards.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <Label>Stream</Label>
                                <select
                                    value={twelfthData.stream}
                                    onChange={(e) => setTwelfthData(prev => ({ ...prev, stream: e.target.value }))}
                                    disabled={!editingTwelfth}
                                    className="select-field"
                                >
                                    <option value="">Select Stream</option>
                                    {streams.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <Label>Passing Year</Label>
                                <Input
                                    type="number"
                                    value={twelfthData.year}
                                    onChange={(e) => setTwelfthData(prev => ({ ...prev, year: e.target.value }))}
                                    disabled={!editingTwelfth}
                                    placeholder="2022"
                                    min="1990"
                                    max="2100"
                                />
                            </div>
                            <div className="form-group full-width">
                                <Label>School/College Name</Label>
                                <Input
                                    value={twelfthData.school}
                                    onChange={(e) => setTwelfthData(prev => ({ ...prev, school: e.target.value }))}
                                    disabled={!editingTwelfth}
                                    placeholder="Your school/college name"
                                />
                            </div>
                        </div>
                    </div>
                )}
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
          cursor: pointer;
          transition: background 0.2s;
        }

        .card-header:hover {
          background: #f1f5f9;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .grade-badge {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .grade-badge.twelfth {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
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
          color: #64748b;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .card-content {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
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

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .select-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
          cursor: pointer;
        }

        .select-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .select-field:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
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

export default EducationDetails;
