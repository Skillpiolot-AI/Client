import { useState } from 'react';
import { Save, X, Loader2, Award, BookOpen } from 'lucide-react';
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
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSave = async () => {
        try {
            // Save UG
            const ugResult = await onUpdateUndergraduate(ugData);
            if (!ugResult.success) {
                toast.error("UG details failed: " + ugResult.message);
                return;
            }
            // Save Grad
            const gradResult = await onUpdateGraduation(gradData);
            if (!gradResult.success) {
                toast.error("PG details failed: " + gradResult.message);
                return;
            }
            toast.success("Higher education details saved successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("An error occurred while saving.");
        }
    };

    const handleCancel = () => {
        setUgData({
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
        setGradData({
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
        setIsEditing(false);
    };

    const renderEducationForm = (data, setData, isEditing, type) => {
        const isPursuing = data.status === 'pursuing';
        const isCompleted = data.status === 'completed';
        const showFields = isPursuing || isCompleted || data.status === 'not_started';

        return (
            <div className="space-y-6 w-full">
                <div className="space-y-2">
                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Status</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData(prev => ({ ...prev, status: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:appearance-none disabled:px-0 disabled:py-0 disabled:text-xs"
                    >
                        {(type === 'grad' ? gradStatusOptions : statusOptions).map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {showFields && data.status !== 'not_applicable' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Course/Degree Name</label>
                                <input
                                    type="text"
                                    value={data.courseName}
                                    onChange={(e) => setData(prev => ({ ...prev, courseName: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="B.Tech, B.Sc..."
                                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Specialization</label>
                                <input
                                    type="text"
                                    value={data.specialization}
                                    onChange={(e) => setData(prev => ({ ...prev, specialization: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="Computer Science..."
                                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">College/Institution</label>
                            <input
                                type="text"
                                value={data.collegeName}
                                onChange={(e) => setData(prev => ({ ...prev, collegeName: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="College name"
                                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm text-teal-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">University</label>
                            <input
                                type="text"
                                value={data.university}
                                onChange={(e) => setData(prev => ({ ...prev, university: e.target.value }))}
                                disabled={!isEditing}
                                placeholder="University name"
                                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Start Year</label>
                                <input
                                    type="number"
                                    value={data.startYear}
                                    onChange={(e) => setData(prev => ({ ...prev, startYear: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="2020"
                                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"
                                />
                            </div>
                            {isPursuing && (
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Expected Passout</label>
                                    <input
                                        type="number"
                                        value={data.expectedPassoutYear}
                                        onChange={(e) => setData(prev => ({ ...prev, expectedPassoutYear: e.target.value }))}
                                        disabled={!isEditing}
                                        placeholder="2024"
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"
                                    />
                                </div>
                            )}
                            {isCompleted && (
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Passout Year</label>
                                    <input
                                        type="number"
                                        value={data.passoutYear}
                                        onChange={(e) => setData(prev => ({ ...prev, passoutYear: e.target.value }))}
                                        disabled={!isEditing}
                                        placeholder="2024"
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"
                                    />
                                </div>
                            )}

                            {isCompleted && (
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">CGPA / %</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={data.cgpa || data.percentage}
                                            onChange={(e) => {
                                                // Simplified handling for the new consolidated design:
                                                const val = parseFloat(e.target.value);
                                                if (val <= 10) setData(prev => ({...prev, cgpa: e.target.value, percentage: ''}));
                                                else setData(prev => ({...prev, percentage: e.target.value, cgpa: ''}));
                                            }}
                                            disabled={!isEditing}
                                            placeholder="9.0 or 85"
                                            className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-primary font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
            <section>
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-teal-700 shadow-sm border border-outline-variant/10">
                            <Award size={20} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-headline text-slate-800">Higher Education</h3>
                    </div>
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors w-full sm:w-auto"
                        >
                            Edit Details
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            <button 
                                type="button"
                                onClick={handleCancel} 
                                disabled={saving}
                                className="px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button 
                                type="button"
                                onClick={handleSave} 
                                disabled={saving}
                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Large Feature Card: Masters / PG */}
                    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 md:p-10 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 lg:gap-10">
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 shadow-sm z-10">
                            <span className="text-xl md:text-3xl font-black text-slate-300">PG</span>
                        </div>
                        <div className="flex-1 z-10">
                            <p className="text-[10px] font-label font-bold text-teal-700 uppercase tracking-widest mb-4">Post-Graduation / Masters</p>
                            {renderEducationForm(gradData, setGradData, isEditing, 'grad')}
                        </div>
                    </div>

                    {/* Side Card: Bachelor's / UG */}
                    <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-6 md:p-8 rounded-2xl flex flex-col border border-transparent hover:border-teal-200/50 transition-all duration-300">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                    <BookOpen size={20} className="text-primary" />
                                </div>
                            </div>
                            <p className="text-[10px] font-label font-bold text-teal-700 uppercase tracking-widest mb-4">Undergraduate</p>
                            {renderEducationForm(ugData, setUgData, isEditing, 'ug')}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HigherEducation;
