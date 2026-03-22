import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';

export default function CreateGroupPage() {
  const { createGroup, loading, error } = useGroupContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    type: 'Public', // Public, Private
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Group name is required");
    
    const success = await createGroup(formData);
    if (success) {
      navigate('/groups');
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen pt-12">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 mx-auto px-6">
        {/* Left Side: Contextual Info */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-sm uppercase tracking-[0.05em] font-bold text-on-surface-variant block mb-4">Launch Pad</span>
            <h1 className="text-4xl font-black font-headline text-primary leading-tight tracking-tight mb-6">Chart a New Community Course</h1>
            <p className="text-sm text-on-surface-variant leading-relaxed opacity-80">SkillPilot groups are more than just forums. They are curated environments for professional elevation. Set your parameters and gather your peers.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
              <span className="font-semibold text-primary">Core Identity</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-[0_20px_40px_rgba(31,27,24,0.06)] relative overflow-hidden">
            {/* Progress Bar Decor */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-surface-container-highest">
              <div className="h-full bg-gradient-to-r from-primary to-primary-container w-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 mt-4">
              <section className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider text-primary font-headline" htmlFor="name">Group Name</label>
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 outline-none placeholder:text-outline-variant" 
                    id="name" 
                    name="name"
                    placeholder="e.g. Senior Architecture Strategists" 
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold uppercase tracking-wider text-primary font-headline" htmlFor="description">Strategic Purpose</label>
                  <textarea 
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 outline-none placeholder:text-outline-variant resize-none" 
                    id="description" 
                    name="description"
                    placeholder="What is the mission of this group? Define the value for its members." 
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold uppercase tracking-wider text-primary font-headline">Privacy & Visibility</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex flex-col p-5 rounded-xl cursor-pointer hover:bg-surface-container-high transition-all group ${formData.type === 'Public' ? 'bg-surface-container-high border border-primary' : 'bg-surface-container-low'}`}>
                      <input 
                        className="absolute top-5 right-5 text-primary focus:ring-primary h-5 w-5 border-outline-variant" 
                        name="type" 
                        type="radio"
                        value="Public"
                        checked={formData.type === 'Public'}
                        onChange={handleChange}
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary">public</span>
                        <span className="font-bold text-primary">Public Group</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Anyone can find and join this group without approval.</p>
                    </label>

                    <label className={`relative flex flex-col p-5 rounded-xl cursor-pointer hover:bg-surface-container-high transition-all group ${formData.type === 'Private' ? 'bg-surface-container-high border border-primary' : 'bg-surface-container-low'}`}>
                      <input 
                        className="absolute top-5 right-5 text-primary focus:ring-primary h-5 w-5 border-outline-variant" 
                        name="type" 
                        type="radio"
                        value="Private"
                        checked={formData.type === 'Private'}
                        onChange={handleChange}
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        <span className="font-bold text-primary">Private Vault</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">Invisible to outsiders. Members must be invited or approved.</p>
                    </label>
                  </div>
                </div>
              </section>

              {error && <div className="p-4 bg-error-container text-error rounded-xl text-sm">{error}</div>}

              <div className="pt-10 flex items-center justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold py-4 px-10 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Launching...' : 'Launch Group'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
