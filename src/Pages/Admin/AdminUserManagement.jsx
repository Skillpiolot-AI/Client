import React, { useState } from 'react';
import { 
  UserPlus, Mail, Lock, User, Shield, CheckCircle, 
  XCircle, Send, Eye, EyeOff, AlertCircle, Loader2 
} from 'lucide-react';

const AdminUserManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'User',
    isVerified: false
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const roles = [
    { value: 'User', label: 'User', color: 'bg-blue-500' },
    { value: 'Mentor', label: 'Mentor', color: 'bg-purple-500' },
    { value: 'Admin', label: 'Admin', color: 'bg-red-500' },
    { value: 'UniAdmin', label: 'University Admin', color: 'bg-green-500' },
    { value: 'UniTeach', label: 'University Teacher', color: 'bg-yellow-500' }
  ];

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    showNotification('success', 'Password generated successfully!');
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification('error', 'Name is required');
      return false;
    }
    if (!formData.username.trim()) {
      showNotification('error', 'Username is required');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showNotification('error', 'Valid email is required');
      return false;
    }
    if (!generatedPassword) {
      showNotification('error', 'Please generate a password first');
      return false;
    }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3001/api/auth/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          password: generatedPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', `User ${formData.name} created successfully! ${formData.isVerified ? 'Welcome email sent.' : 'Verification email sent.'}`);
        // Reset form
        setFormData({
          name: '',
          username: '',
          email: '',
          role: 'User',
          isVerified: false
        });
        setGeneratedPassword('');
      } else {
        showNotification('error', data.message || 'Failed to create user');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          testEmail: 'ujjwaljha744@gmail.com',
          sampleData: {
            name: formData.name || 'Test User',
            username: formData.username || 'testuser',
            email: formData.email || 'test@example.com',
            role: formData.role,
            password: generatedPassword || 'SamplePass123!',
            isVerified: formData.isVerified
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Test email sent to ujjwaljha744@gmail.com successfully!');
      } else {
        showNotification('error', data.message || 'Failed to send test email');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error sending test email:', error);
    } finally {
      setTestEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-2xl">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-purple-300">Create and manage user accounts with email notifications</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="johndoe"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-medium">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-white font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  User Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value} className="bg-slate-800">
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Section */}
            <div className="mb-6">
              <label className="flex items-center text-white font-medium mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Generated Password
              </label>
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={generatedPassword}
                    readOnly
                    placeholder="Click 'Generate Password' button"
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  {generatedPassword && (
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                <button
                  onClick={generatePassword}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Verification Toggle */}
            <div className="mb-8">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-colors ${
                    formData.isVerified ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      formData.isVerified ? 'translate-x-6' : ''
                    }`} />
                  </div>
                </div>
                <span className="text-white font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Email Pre-Verified
                </span>
                <span className="text-purple-300 text-sm">
                  ({formData.isVerified ? 'Send welcome email' : 'Send verification email'})
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleCreateUser}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create User & Send Email
                  </>
                )}
              </button>

              <button
                onClick={handleTestEmail}
                disabled={testEmailLoading}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {testEmailLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-100 space-y-1">
                  <p className="font-medium">Test email will be sent to: ujjwaljha744@gmail.com</p>
                  <p className="text-blue-200">Use the test button to preview the email template before creating the actual user.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Information Card */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Role Descriptions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map(role => (
              <div key={role.value} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className={`w-3 h-3 ${role.color} rounded-full mt-1.5 flex-shrink-0`} />
                <div>
                  <h4 className="text-white font-medium">{role.label}</h4>
                  <p className="text-purple-300 text-sm">
                    {role.value === 'User' && 'Standard user access'}
                    {role.value === 'Mentor' && 'Can mentor students'}
                    {role.value === 'Admin' && 'Full system access'}
                    {role.value === 'UniAdmin' && 'Manages university'}
                    {role.value === 'UniTeach' && 'University teacher'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;