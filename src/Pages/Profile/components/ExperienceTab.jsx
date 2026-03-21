import React from 'react';

export default function ExperienceTab({ user }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 lg:pt-16 pb-20">
      {/* Hero Header Section */}
      <div className="mb-12 lg:mb-16 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-8">
          <span className="text-xs font-bold tracking-widest text-teal-700 uppercase mb-4 block">Professional Journey</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Crafting a legacy of <br className="hidden sm:block" />
            <span className="text-on-tertiary-container">impactful work.</span>
          </h2>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:text-right">
          <p className="text-secondary text-sm sm:text-base leading-relaxed mb-6">
            12 years of experience bridging the gap between complex engineering and human-centric interfaces.
          </p>
          <button className="w-full lg:w-auto bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all">
            Add New Experience
          </button>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Experience Timeline Section */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          <h3 className="text-xl font-bold text-primary mb-6">Work History</h3>
          
          {/* Timeline Card 1 */}
          <div className="group relative pl-8 pb-12 border-l-2 border-surface-container-highest last:pb-0">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-600 border-4 border-white shadow-sm"></div>
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl transition-all duration-300 hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] group-hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                <div>
                  <h4 className="text-lg font-bold text-primary">Lead Product Designer</h4>
                  <p className="text-teal-700 font-medium">Lumina Systems • San Francisco, CA</p>
                </div>
                <span className="px-4 py-1.5 bg-surface-container text-xs font-bold text-secondary rounded-full shrink-0">Jan 2021 — Present</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Spearheading the design system evolution for a multi-platform enterprise SaaS. Managed a team of 6 designers across 3 time zones.
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-teal-600 text-sm mt-1">check_circle</span>
                  <p className="text-sm text-on-surface-variant">Increased user retention by 24% through a complete navigation overhaul.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-teal-600 text-sm mt-1">check_circle</span>
                  <p className="text-sm text-on-surface-variant">Architected the "Aura" Design System used by 120+ engineers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card 2 */}
          <div className="group relative pl-8 pb-12 border-l-2 border-surface-container-highest last:pb-0">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-surface-container-highest border-4 border-white shadow-sm"></div>
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl transition-all duration-300 hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] group-hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                <div>
                  <h4 className="text-lg font-bold text-primary">Senior UI Engineer</h4>
                  <p className="text-teal-700 font-medium">Velocity Media • New York, NY</p>
                </div>
                <span className="px-4 py-1.5 bg-surface-container text-xs font-bold text-secondary rounded-full shrink-0">May 2018 — Dec 2020</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Focused on the intersection of motion design and performance. Delivered high-fidelity prototypes for Fortune 500 clients.
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-teal-600 text-sm mt-1">check_circle</span>
                  <p className="text-sm text-on-surface-variant">Reduced initial page load time by 40% using advanced CSS techniques.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="material-symbols-outlined text-teal-600 text-sm mt-1">check_circle</span>
                  <p className="text-sm text-on-surface-variant">Led the front-end transition to Tailwind CSS and React.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Social & Sidebar */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          {/* Social Connections Panel */}
          <section className="bg-white p-6 sm:p-8 rounded-xl border border-outline-variant/15 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-primary">Social Links</h3>
              <button className="text-teal-600 font-semibold text-xs hover:underline uppercase tracking-wider">Edit All</button>
            </div>
            
            <div className="space-y-4">
              {/* LinkedIn */}
              <a href="#" className="flex items-center p-3 sm:p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-primary">link</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-tighter">LinkedIn</p>
                  <p className="text-sm font-medium text-primary truncate">linkedin.com/in/{user?.name ? user.name.toLowerCase().replace(' ', '') : 'user'}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors ml-2">open_in_new</span>
              </a>

              {/* GitHub */}
              <a href="#" className="flex items-center p-3 sm:p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-tighter">GitHub</p>
                  <p className="text-sm font-medium text-primary truncate">github.com/{user?.name ? user.name.toLowerCase().replace(' ', '') : 'user'}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors ml-2">open_in_new</span>
              </a>
              
              {/* Portfolio */}
              <a href="#" className="flex items-center p-3 sm:p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-primary">web</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-teal-700 uppercase tracking-tighter">Portfolio</p>
                  <p className="text-sm font-medium text-primary truncate">{user?.name ? user.name.toLowerCase().replace(' ', '') : 'user'}.design</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors ml-2">open_in_new</span>
              </a>
            </div>
          </section>

          {/* Profile Completeness Card */}
          <section className="bg-gradient-to-br from-tertiary to-teal-900 p-6 sm:p-8 rounded-xl text-white">
            <h4 className="font-bold text-xl mb-2">Profile Strength</h4>
            <p className="text-teal-100 text-sm mb-6">Your profile is more complete than 92% of users in your field.</p>
            
            <div className="w-full bg-white/10 h-1.5 rounded-full mb-8">
              <div className="bg-on-tertiary-container h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="text-sm font-medium">Next: Professional Summary</span>
              </div>
              <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-teal-50 transition-colors">
                Boost Profile
              </button>
            </div>
          </section>

          {/* Mentor Insight Card */}
          <div className="p-6 sm:p-8 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <div className="flex gap-4 items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm shrink-0">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyymrX-iqvJKEggp4XRFQjFYBvVlWuN-I6ncxOp9_3zdR_oYkl1iXz-41c3N306CH40awri-IPXRM7cy5AvRw2-acE8fSLSc_taGciKymznxyvuDDSO0C5nNt2AROQBIH6E7dMYgX3z50e0dRMoK-PJ0NxsrvBjhkWrMz3JuTgjfSb-R_a2Kb5FYeO3K_YybG4I810aT8BkjSXEYDANI3ws9Gy0z2OzN3ohn6KLj3iFHjkd9lhsmLwP8mZ79r2E6CCJEJdeFNK5tw" 
                  alt="Mentor Insight" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-700 uppercase">Navigator Insight</p>
                <p className="text-sm font-bold text-primary">Sarah Chen</p>
              </div>
            </div>
            <p className="text-sm italic text-secondary leading-relaxed">
              "Your impact at Lumina Systems is impressive. I recommend highlighting more of your data-driven design decisions for your next career move."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
