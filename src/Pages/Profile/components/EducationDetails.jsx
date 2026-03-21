import { useState } from 'react';
import { Save, X, Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Other'];
const streams = ['Science', 'Commerce', 'Arts', 'Other'];

const EducationDetails = ({ profile, saving, onUpdateTenth, onUpdateTwelfth }) => {
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSave = async () => {
        try {
            // Save tenth
            const tenthResult = await onUpdateTenth(tenthData);
            if (!tenthResult.success) {
                toast.error("10th details failed: " + tenthResult.message);
                return;
            }
            // Save twelfth
            const twelfthResult = await onUpdateTwelfth(twelfthData);
            if (!twelfthResult.success) {
                toast.error("12th details failed: " + twelfthResult.message);
                return;
            }
            toast.success("Education details saved successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error("An error occurred while saving.");
        }
    };

    const handleCancel = () => {
        setTenthData({
            percentage: profile?.tenthGrade?.percentage || '',
            cgpa: profile?.tenthGrade?.cgpa || '',
            board: profile?.tenthGrade?.board || '',
            year: profile?.tenthGrade?.year || '',
            school: profile?.tenthGrade?.school || '',
        });
        setTwelfthData({
            percentage: profile?.twelfthGrade?.percentage || '',
            cgpa: profile?.twelfthGrade?.cgpa || '',
            board: profile?.twelfthGrade?.board || '',
            stream: profile?.twelfthGrade?.stream || '',
            year: profile?.twelfthGrade?.year || '',
            school: profile?.twelfthGrade?.school || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
            <header className="mb-12">
                <h2 className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-3 tracking-tight">Academic Foundations</h2>
                <p className="text-secondary max-w-2xl text-base lg:text-lg leading-relaxed">
                    Your educational journey defines your core strengths. Manage your institutional history and academic achievements below.
                </p>
            </header>

            <section>
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-teal-700 shadow-sm border border-outline-variant/10">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-headline text-slate-800">Schooling (10th & 12th)</h3>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 12th Standard Card */}
                    <div className="group bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] transition-all duration-300 relative">
                        <div className="absolute top-0 right-0 p-6 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-widest rounded-full">{twelfthData.school ? 'Completed' : 'Pending'}</span>
                        </div>
                        <p className="text-[10px] font-label font-bold text-teal-700 uppercase tracking-[0.2em] mb-4">Secondary Education (12th)</p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">School Name</label>
                                <input 
                                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-xl md:disabled:text-2xl" 
                                    type="text" 
                                    value={twelfthData.school}
                                    onChange={e => setTwelfthData(prev => ({...prev, school: e.target.value}))}
                                    placeholder="e.g. St. Xavier's International Academy"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Year of Study</label>
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm" 
                                        type="number" 
                                        value={twelfthData.year}
                                        onChange={e => setTwelfthData(prev => ({...prev, year: e.target.value}))}
                                        placeholder="2020"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Board</label>
                                    <select 
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:appearance-none disabled:px-0 disabled:py-0 disabled:text-sm" 
                                        value={twelfthData.board}
                                        onChange={e => setTwelfthData(prev => ({...prev, board: e.target.value}))}
                                        disabled={!isEditing}
                                    >
                                        <option value="">Select Board</option>
                                        {boards.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Percentage</label>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-teal-700 font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm" 
                                            type="number" 
                                            value={twelfthData.percentage}
                                            onChange={e => setTwelfthData(prev => ({...prev, percentage: e.target.value}))}
                                            placeholder="90.5"
                                            max="100"
                                            disabled={!isEditing}
                                        />
                                        {isEditing && <span className="absolute right-4 top-3.5 text-secondary text-sm font-bold">%</span>}
                                        {!isEditing && twelfthData.percentage && <span className="text-teal-700 text-sm font-bold inline-block -translate-y-px ml-0.5">%</span>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">CGPA</label>
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm" 
                                        type="number" 
                                        step="0.1"
                                        value={twelfthData.cgpa}
                                        onChange={e => setTwelfthData(prev => ({...prev, cgpa: e.target.value}))}
                                        placeholder="9.5"
                                        max="10"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2 col-span-2 lg:col-span-1">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Stream</label>
                                    {isEditing ? (
                                        <select 
                                            className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold" 
                                            value={twelfthData.stream}
                                            onChange={e => setTwelfthData(prev => ({...prev, stream: e.target.value}))}
                                        >
                                            <option value="">Stream</option>
                                            {streams.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    ) : (
                                        <div className="flex flex-wrap pt-0 md:pt-1">
                                            {twelfthData.stream ? (
                                                <span className="px-3 py-1 bg-surface-container rounded-lg text-xs font-medium text-slate-600">{twelfthData.stream}</span>
                                            ) : (
                                                <span className="text-sm font-semibold opacity-70">Not specified</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 10th Standard Card */}
                    <div className="group bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] transition-all duration-300">
                        <p className="text-[10px] font-label font-bold text-teal-700 uppercase tracking-[0.2em] mb-4">Primary Education (10th)</p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">School Name</label>
                                <input 
                                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-xl md:disabled:text-2xl" 
                                    type="text" 
                                    value={tenthData.school}
                                    onChange={e => setTenthData(prev => ({...prev, school: e.target.value}))}
                                    placeholder="e.g. Heritage Global School"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Year of Study</label>
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm" 
                                        type="number" 
                                        value={tenthData.year}
                                        onChange={e => setTenthData(prev => ({...prev, year: e.target.value}))}
                                        placeholder="2018"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Board</label>
                                    <select 
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:appearance-none disabled:px-0 disabled:py-0 disabled:text-sm" 
                                        value={tenthData.board}
                                        onChange={e => setTenthData(prev => ({...prev, board: e.target.value}))}
                                        disabled={!isEditing}
                                    >
                                        <option value="">Select Board</option>
                                        {boards.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">Percentage</label>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-teal-700 font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm" 
                                            type="number" 
                                            value={tenthData.percentage}
                                            onChange={e => setTenthData(prev => ({...prev, percentage: e.target.value}))}
                                            placeholder="90.5"
                                            max="100"
                                            disabled={!isEditing}
                                        />
                                        {isEditing && <span className="absolute right-4 top-3.5 text-secondary text-sm font-bold">%</span>}
                                        {!isEditing && tenthData.percentage && <span className="text-teal-700 text-sm font-bold inline-block -translate-y-px ml-0.5">%</span>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1">CGPA</label>
                                    <input 
                                        className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm" 
                                        type="number" 
                                        step="0.1"
                                        value={tenthData.cgpa}
                                        onChange={e => setTenthData(prev => ({...prev, cgpa: e.target.value}))}
                                        placeholder="9.5"
                                        max="10"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EducationDetails;
