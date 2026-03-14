import { useState } from 'react';
import { Plus, Trash2, Save, X, Loader2, Briefcase } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'react-hot-toast';

const emptyExperience = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  location: '',
};

const ExperienceSection = ({ profile, saving, onUpdate }) => {
  const [experiences, setExperiences] = useState(profile?.experience || []);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAdd = () => {
    setExperiences(prev => [{ ...emptyExperience }, ...prev]);
    setIsEditing(true);
    setHasChanges(true);
  };

  const handleRemove = (index) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleChange = (index, field, value) => {
    setExperiences(prev => prev.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const validExperiences = experiences.filter(exp => exp.company && exp.role);

    const result = await onUpdate(validExperiences);
    if (result.success) {
      toast.success(result.message);
      setIsEditing(false);
      setHasChanges(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancel = () => {
    setExperiences(profile?.experience || []);
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Work Experience</h2>
        <div className="header-actions">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X size={16} /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="save-btn">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleAdd}>
            <Plus size={16} /> Add Experience
          </Button>
        </div>
      </div>

      {experiences.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} />
          <h3>No Experience Added</h3>
          <p>Add your work experience to showcase your professional journey</p>
          <Button onClick={handleAdd}>
            <Plus size={16} /> Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="experience-list">
          {experiences.map((exp, index) => (
            <div key={index} className="experience-card">
              <div className="card-header">
                <div className="card-number">{index + 1}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="remove-btn"
                  onClick={() => handleRemove(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group">
                    <Label>Company Name *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => handleChange(index, 'company', e.target.value)}
                      placeholder="Google, Microsoft..."
                    />
                  </div>
                  <div className="form-group">
                    <Label>Role/Position *</Label>
                    <Input
                      value={exp.role}
                      onChange={(e) => handleChange(index, 'role', e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                      disabled={exp.isCurrent}
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => handleChange(index, 'isCurrent', e.target.checked)}
                      />
                      <span>Currently Working Here</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      placeholder="New Delhi, India"
                    />
                  </div>
                  <div className="form-group full-width">
                    <Label>Description</Label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                      className="description-textarea"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f8fafc;
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          color: #64748b;
        }

        .empty-state h3 {
          color: #1e293b;
          margin: 20px 0 8px;
        }

        .empty-state p {
          margin-bottom: 20px;
        }

        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .experience-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #fff7ed;
          border-bottom: 1px solid #fed7aa;
        }

        .card-number {
          width: 28px;
          height: 28px;
          background: #f97316;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .remove-btn {
          color: #ef4444;
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

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .checkbox-group {
          justify-content: flex-end;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: #f97316;
        }

        .description-textarea {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .description-textarea:focus {
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

export default ExperienceSection;
