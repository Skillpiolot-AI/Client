import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, FileText, Briefcase, Building, UserPlus, LogOut } from 'lucide-react';

const AMDashboard = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const mentorRoutes = [
    { path: '/my-sessions', name: 'My Sessions', icon: Calendar },
    { path: '/interestForm', name: 'Interest Management', icon: FileText },
    { path: '/StrengthForm', name: 'Strength Management', icon: FileText },
    { path: '/skillform', name: 'Skills Management', icon: FileText },
    { path: '/collegeform', name: 'Colleges Management', icon: Building },
    { path: '/recommendationForm', name: 'Recommendation Form', icon: FileText },
  ];

  const adminRoutes = [
    { path: '/JobForm', name: 'Job Titles Management', icon: Briefcase },
    { path: '/Companyform', name: 'Companies Management', icon: Building },
    { path: '/mentoapplication', name: 'Admin Applications', icon: FileText },
    { path: '/addmentor', name: 'Add Mentor', icon: UserPlus },
  ];

  const routes = role === 'Admin' ? [...mentorRoutes, ...adminRoutes] : mentorRoutes;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-8"
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome, {role}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Here's your dashboard. Manage your tasks and access various features.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route, index) => (
          <motion.div
            key={route.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{route.name}</CardTitle>
                <route.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full mt-4"
                  onClick={() => navigate(route.path)}
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: routes.length * 0.1 }}
        className="mt-8 flex justify-center"
      >
        <Button
          variant="destructive"
          className="flex items-center space-x-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AMDashboard;