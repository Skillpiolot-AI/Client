import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Calendar, FileText, Briefcase, Building, 
  UserPlus, LogOut, MessageSquare, Inbox, Settings, Users, TrendingUp 
} from 'lucide-react';

const AMDashboard = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const mentorSections = [
    {
      title: "🚀 Core Management",
      routes: [
        { path: '/mentorDashboard', name: 'Overview', icon: LayoutDashboard, description: 'View earning metrics & summary stats.' },
        { path: '/mentorDashboard?tab=services', name: 'Manage Services', icon: Settings, description: 'Create, edit, or disable bookable services/packages.' },
        { path: '/mentor-dms', name: 'Student DMs', icon: MessageSquare, description: 'Reply to Student Priority DM requests async.' },
        { path: '/mentor-sessions', name: 'Sessions Queue', icon: Calendar, description: 'Update scheduled sessions and active calendars.' }
      ]
    },
    {
      title: "📋 Forms & Reviews",
      routes: [
        { path: '/recommendationForm', name: 'Recommendations', icon: FileText, description: 'Approve or send student recommendations form.' }
      ]
    },
    {
      title: "📂 Personal Configurations",
      routes: [
        { path: '/skillform', name: 'Skills', icon: FileText, description: 'Manage mapped technical or core items.' },
        { path: '/collegeform', name: 'Colleges', icon: Building, description: 'View mapped academic directory routes.' },
        { path: '/interestForm', name: 'Interests', icon: FileText, description: 'Configure mapped topic interest buffers.' },
        { path: '/StrengthForm', name: 'Strengths', icon: FileText, description: 'Analyze your soft strengths mapping.' }
      ]
    }
  ];

  const adminSections = [
    {
      title: "⚙️ System Control",
      routes: [
        { path: '/dashboardAdmin', name: 'Admin Control', icon: Settings, description: 'Configure overall platform settings for operations.' },
        { path: '/admin/user-management', name: 'User Management', icon: Users, description: 'Search, approve, or override application roles.' },
        { path: '/analytics', name: 'System Analytics', icon: TrendingUp, description: 'Review usage curves, visits and metric streams.' },
        { path: '/mentoapplication', name: 'Mentor Onboard', icon: FileText, description: 'Verify new mentor registration profiles.' }
      ]
    },
    {
      title: "📋 Database Management",
      routes: [
        { path: '/JobForm', name: 'Jobs Dictionary', icon: Briefcase, description: 'Setup structured job title repositories on server.' },
        { path: '/Companyform', name: 'Companies index', icon: Building, description: 'Sync corporate listings mapping buffers.' }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const sections = role === 'Admin' ? [...mentorSections, ...adminSections] : mentorSections;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 p-6 md:p-10 font-inter"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Roll */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-8 mb-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome to Portal, {role}!</h1>
            <p className="opacity-80 text-sm md:text-md mt-1 font-medium">Quick links directory for all your assigned operations.</p>
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Categories rendering */}
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="mb-12">
            <h2 className="text-xl font-extrabold text-slate-800 mb-5 border-b-2 border-slate-200 pb-2 inline-block">
              {sec.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sec.routes.map((route, index) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (sIdx * 4 + index) * 0.05 }}
                  onClick={() => navigate(route.path)}
                  className="cursor-pointer group"
                >
                  <Card className="h-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group-hover:border-indigo-200">
                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <route.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {route.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {route.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </motion.div>
  );
};

export default AMDashboard;