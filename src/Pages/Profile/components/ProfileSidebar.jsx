import React from 'react';
import { User, GraduationCap, School, Briefcase, Share2, Bell, Shield } from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'education', label: 'Education', icon: School },
  { id: 'higher-education', label: 'Higher Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'social-links', label: 'Social Links', icon: Share2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Privacy', icon: Shield }
];

export default function ProfileSidebar({ activeSection, onSectionChange, user }) {
  return (
    <aside className="hidden lg:flex flex-col w-72 border-r bg-slate-50 dark:bg-slate-950 p-6 h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Career Navigator</h1>
        <p className="font-manrope text-sm font-medium tracking-wide text-teal-700 dark:text-teal-400 mt-1">Professional Profile</p>
      </div>

      <nav className="flex-1 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeSection === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-left ${
                isActive
                  ? 'text-teal-700 dark:text-teal-400 font-semibold border-r-4 border-teal-600 dark:border-teal-400 bg-slate-100 dark:bg-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <IconComponent size={20} className={isActive ? "text-teal-600" : "text-slate-400"} />
              <span className="font-manrope text-sm tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
            <img 
              src={user?.imageUrl || user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAlALyjCco-lGT6YyVmprGJDquxq3bPTSyRfFe17NjIrUldxc0OPqwB5Bp8HfjVJcYaGeJEHDUM71Z1ELhVm82cYDMRRe_LL9gGsORjIjNC8BgWzWT6rUfuHIpIXamMcU0rtbVZMUWITrqmLGqvXDAHzxt0e9Cz9yNCNfHZ_D7v-GQyurOU7e2fqftujHp7r72z2HNZXwdPoOsxQ9mgG7GlVt3C1evrx7CvnFCDAEOfZ2nVuLiDom7QE9tiy6xJshmqvcm710C0nBg"} 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name || user?.firstName || "Professional"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.headline || "Navigator User"}</p>
          </div>
        </div>
        <button className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          View Public Profile
        </button>
      </div>
    </aside>
  );
}
