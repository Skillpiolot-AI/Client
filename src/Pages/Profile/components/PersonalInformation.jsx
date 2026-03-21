import { useState, useRef } from 'react';
import { Camera, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PersonalInformation = ({ profile, user, saving, onUpdate, onUploadPhoto, onRemovePhoto }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: profile?.firstName || user?.name?.split(' ')[0] || '',
        lastName: profile?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        country: profile?.country || '',
        phoneNumber: profile?.phoneNumber || '',
        address: profile?.address || '',
        bio: profile?.bio || '',
    });
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const result = await onUpdate(formData);
        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: profile?.firstName || user?.name?.split(' ')[0] || '',
            lastName: profile?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
            country: profile?.country || '',
            phoneNumber: profile?.phoneNumber || '',
            address: profile?.address || '',
            bio: profile?.bio || '',
        });
        setIsEditing(false);
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const result = await onUploadPhoto(file);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleRemovePhoto = async () => {
        const result = await onRemovePhoto();
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
            {/* Header Section */}
            <header className="mb-12 lg:mb-16 flex justify-between items-start">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-4">Personal Information</h2>
                    <p className="text-base lg:text-lg text-secondary leading-relaxed max-w-2xl">
                        Manage your personal details and how you appear to mentors and recruiters within the Navigator ecosystem.
                    </p>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="px-6 py-2.5 bg-white border border-outline-variant/30 text-primary rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleCancel} 
                            disabled={saving}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2"
                        >
                            <X size={16} /> Cancel
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save
                        </button>
                    </div>
                )}
            </header>

            {/* Profile Picture Section (Asymmetric Bento Style) */}
            <section className="grid grid-cols-12 gap-8 mb-12">
                <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center text-center relative group">
                    <div className="relative cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm transition-transform group-hover:scale-105 duration-300 bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center">
                            {user?.imageUrl ? (
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={user.imageUrl} 
                                    alt="User Profile" 
                                />
                            ) : (
                                <span className="text-4xl font-bold text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white w-8 h-8" />
                        </div>
                    </div>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />

                    {user?.imageUrl && (
                        <button 
                            onClick={handleRemovePhoto}
                            disabled={saving}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Photo"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    <h3 className="font-headline font-bold text-primary">{user?.name || "User Name"}</h3>
                    <p className="text-xs font-label uppercase tracking-widest text-secondary mt-1">{user?.headline || formData.country || "Navigator User"}</p>
                </div>
                
                <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-outline-variant/10 flex flex-col justify-center">
                    <h4 className="text-sm font-label uppercase tracking-widest text-on-tertiary-container font-bold mb-4">Quick Bio</h4>
                    <p className="text-on-surface leading-relaxed italic text-sm md:text-base">
                        "{formData.bio || profile?.bio || "You haven't added a bio yet. Click edit to share your professional journey."}"
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold rounded-full">Member</span>
                        {formData.country && <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full">{formData.country}</span>}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="bg-surface-container-low rounded-xl p-6 lg:p-10 border border-outline-variant/10 shadow-sm">
                <form className="space-y-10" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">First Name</label>
                            <input 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                                type="text" 
                                placeholder="John"
                            />
                        </div>
                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Last Name</label>
                            <input 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                                type="text" 
                                placeholder="Doe"
                            />
                        </div>
                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Email Address</label>
                            <div className="relative">
                                <input 
                                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium opacity-60 cursor-not-allowed" 
                                    type="email" 
                                    value={user?.email || ''} 
                                    disabled
                                />
                            </div>
                            <span className="text-xs text-slate-500 px-1 inline-block mt-1">Email can be changed in Security settings</span>
                        </div>
                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Phone Number</label>
                            <div className="relative">
                                <input 
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed`} 
                                    type="tel" 
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Date of Birth</label>
                            <input 
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed`} 
                                type="date" 
                            />
                        </div>
                        {/* Country */}
                        <div className="space-y-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Country</label>
                            <input 
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed`} 
                                type="text" 
                                placeholder="Your Country"
                            />
                        </div>
                        {/* Address */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Address</label>
                            <input 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed`} 
                                type="text" 
                                placeholder="Your full address"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Short Professional Summary</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium resize-none disabled:opacity-60 disabled:cursor-not-allowed`}
                            rows="4"
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    {isEditing && (
                        <div className="pt-6 flex items-center justify-end gap-4 border-t border-outline-variant/10">
                            <button 
                                type="button" 
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
                            >
                                Discard Changes
                            </button>
                            <button 
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all active:scale-[0.99] flex items-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                Save Profile Information
                            </button>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};

export default PersonalInformation;
