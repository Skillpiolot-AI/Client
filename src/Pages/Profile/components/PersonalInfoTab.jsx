import React from 'react';

export default function PersonalInfoTab({ user, formData, handleInputChange, handleSubmit, isEditing }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
      {/* Header Section */}
      <header className="mb-12 lg:mb-16">
        <h2 className="text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-4">Personal Information</h2>
        <p className="text-base lg:text-lg text-secondary leading-relaxed max-w-2xl">
          Manage your personal details and how you appear to mentors and recruiters within the Navigator ecosystem.
        </p>
      </header>

      {/* Profile Picture Section (Asymmetric Bento Style) */}
      <section className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="relative group cursor-pointer mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm transition-transform group-hover:scale-105 duration-300">
              <img 
                className="w-full h-full object-cover" 
                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAlALyjCco-lGT6YyVmprGJDquxq3bPTSyRfFe17NjIrUldxc0OPqwB5Bp8HfjVJcYaGeJEHDUM71Z1ELhVm82cYDMRRe_LL9gGsORjIjNC8BgWzWT6rUfuHIpIXamMcU0rtbVZMUWITrqmLGqvXDAHzxt0e9Cz9yNCNfHZ_D7v-GQyurOU7e2fqftujHp7r72z2HNZXwdPoOsxQ9mgG7GlVt3C1evrx7CvnFCDAEOfZ2nVuLiDom7QE9tiy6xJshmqvcm710C0nBg"} 
                alt="User Profile" 
              />
            </div>
            <div className="absolute inset-0 bg-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
            </div>
          </div>
          <h3 className="font-headline font-bold text-primary">{user?.name || "Alex Sterling"}</h3>
          <p className="text-xs font-label uppercase tracking-widest text-secondary mt-1">{user?.headline || "Senior Product Designer"}</p>
        </div>
        
        <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(31,27,24,0.06)] flex flex-col justify-center">
          <h4 className="text-sm font-label uppercase tracking-widest text-on-tertiary-container font-bold mb-4">Quick Bio</h4>
          <p className="text-on-surface leading-relaxed italic">
            "{user?.bio || "Dedicated to crafting seamless digital experiences and mentoring the next generation of designers. Currently exploring the intersection of AI and human-centered design."}"
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold rounded-full">Available for Mentoring</span>
            <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full">Remote First</span>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-surface-container-low rounded-xl p-6 lg:p-10">
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Full Name</label>
              <input 
                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium" 
                type="text" 
                defaultValue={user?.name || "Alex Sterling"} 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Professional Headline</label>
              <input 
                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium" 
                type="text" 
                defaultValue={user?.headline || "Senior Product Designer & UX Strategist"} 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Email Address</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 pl-11 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium" 
                  type="email" 
                  defaultValue={user?.email || "alex.sterling@navigator.pro"} 
                />
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-outline text-lg">mail</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Phone Number</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 pl-11 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium" 
                  type="tel" 
                  defaultValue={user?.phone || "+1 (555) 928-4031"} 
                />
                <span className="material-symbols-outlined absolute left-4 top-3.5 text-outline text-lg">call</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1">Short Professional Summary</label>
            <textarea 
              className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium resize-none" 
              rows="4"
              defaultValue={user?.bio || "Senior Product Designer with over 8 years of experience in creating complex SaaS platforms. Passionate about mentoring junior talent and building design systems that scale."}
            ></textarea>
          </div>
          <div className="pt-6 flex items-center justify-end gap-4 border-t border-outline-variant/10">
            <button className="px-6 py-2.5 text-sm font-bold text-primary hover:underline transition-all" type="button">Discard Changes</button>
            <button className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-md hover:translate-y-[-2px] hover:shadow-lg transition-all active:scale-[0.99]" type="submit">
              Save Profile Information
            </button>
          </div>
        </form>
      </section>

      {/* Career Timeline Preview (Glassmorphism Accent) */}
      <section className="mt-12 lg:mt-16">
        <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 bg-surface-container-low">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h4 className="text-xl font-bold font-headline text-primary mb-6">Profile Completion</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-on-tertiary-container h-full w-[85%]"></div>
              </div>
              <span className="text-sm font-bold text-on-tertiary-container">85%</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/40">
                <span className="material-symbols-outlined text-teal-600 mb-2">check_circle</span>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Personal</p>
                <p className="text-sm font-medium">Completed</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-white/40">
                <span className="material-symbols-outlined text-teal-600 mb-2">check_circle</span>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Education</p>
                <p className="text-sm font-medium">Completed</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-md rounded-xl border border-teal-600/30 ring-2 ring-teal-600/10">
                <span className="material-symbols-outlined text-primary mb-2">pending</span>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Social Links</p>
                <p className="text-sm font-medium">Add LinkedIn & Portfolio</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
