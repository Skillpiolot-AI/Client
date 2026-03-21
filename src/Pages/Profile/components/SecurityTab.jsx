import React from 'react';

export default function SecurityTab({ handleChangePassword, isResetting, user }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16">
      <header className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Security & Privacy</h1>
        <p className="text-on-surface-variant text-base lg:text-lg">Manage your account protection and notification preferences.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Notification Section: Bento Style */}
        <section className="col-span-12 lg:col-span-7 space-y-8">
          <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Notification Preferences</h3>
                <p className="text-sm text-on-surface-variant mt-1">Control how you want to be reached.</p>
              </div>
              <span className="material-symbols-outlined text-on-tertiary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
            </div>
            
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary">mail</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm lg:text-base">Email Notifications</p>
                    <p className="text-xs text-on-surface-variant hidden sm:block">Weekly digest, mentions, and updates</p>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-on-tertiary-container transition-colors duration-200 focus:outline-none ring-offset-2 ring-2 ring-transparent">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                </button>
              </div>

              {/* In-App Notifications */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary">app_registration</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm lg:text-base">In-App Notifications</p>
                    <p className="text-xs text-on-surface-variant hidden sm:block">Real-time alerts within the navigator</p>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-on-tertiary-container transition-colors duration-200 focus:outline-none ring-offset-2 ring-2 ring-transparent">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary">sms</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm lg:text-base">SMS Notifications</p>
                    <p className="text-xs text-on-surface-variant hidden sm:block">Urgent career alerts via mobile</p>
                  </div>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-300 transition-colors duration-200 focus:outline-none ring-offset-2 ring-2 ring-transparent">
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Privacy */}
          <div className="bg-surface-container-low p-6 lg:p-8 rounded-xl">
            <h3 className="text-xl font-bold text-on-surface mb-6">Account Privacy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm">
                <p className="font-semibold text-on-surface mb-1">Public Profile</p>
                <p className="text-xs text-on-surface-variant mb-4">Allow others to find your career path.</p>
                <button className="text-on-tertiary-container text-sm font-bold flex items-center gap-1 group">
                  Manage visibility
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
              <div className="bg-white p-5 rounded-xl border border-outline-variant/10 shadow-sm">
                <p className="font-semibold text-on-surface mb-1">Search Engine Indexing</p>
                <p className="text-xs text-on-surface-variant mb-4">List your profile in external search results.</p>
                <button className="text-on-tertiary-container text-sm font-bold flex items-center gap-1 group">
                  Opt-out
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section: Sticky Column */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-primary text-white p-6 lg:p-8 rounded-xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <h3 className="text-lg font-bold tracking-tight">Security Strength: High</h3>
              </div>
              <div className="h-2 bg-white/20 rounded-full mb-6">
                <div className="h-full w-[85%] bg-on-tertiary-container rounded-full"></div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Your account is well-protected with modern encryption standards. Update your password every 90 days for optimal safety.
              </p>
              <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-colors">
                Run Security Audit
              </button>
            </div>
          </div>

          <div className="bg-white border border-outline-variant/10 p-4 lg:p-6 rounded-xl space-y-2">
            {/* Action: Change Password */}
            <button 
              onClick={handleChangePassword} 
              disabled={isResetting}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors group text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">key</span>
                <div>
                  <p className="font-semibold text-on-surface">{isResetting ? "Sending Email..." : "Change Password"}</p>
                  <p className="text-xs text-on-surface-variant">Last updated 42 days ago</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            {/* Action: 2FA */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors group text-left">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">vibration</span>
                <div>
                  <p className="font-semibold text-on-surface">Two-Factor Auth</p>
                  <p className="text-xs text-teal-600 font-medium">Currently Enabled</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            {/* Action: Login Activity */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low rounded-xl transition-colors group text-left">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">devices</span>
                <div>
                  <p className="font-semibold text-on-surface">Login Activity</p>
                  <p className="text-xs text-on-surface-variant">2 devices currently active</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>

          {/* Tertiary Danger Zone */}
          <div className="p-4 lg:p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Critical Actions</h4>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 text-error text-sm font-semibold hover:bg-error-container/20 rounded-lg transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign out of all devices
              </button>
              <button className="w-full text-left px-4 py-2 text-error text-sm font-semibold hover:bg-error-container/20 rounded-lg transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                Deactivate Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
