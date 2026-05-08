import React, { useState } from 'react';
import {
  UserPlus, Mail, Lock, User, Shield, CheckCircle,
  XCircle, Send, Eye, EyeOff, AlertCircle, Loader2
} from 'lucide-react';
import config from '../../config';

const AdminUserManagement = () => {
  const [formData, setFormData] = useState({ name: '', username: '', email: '', role: 'User', isVerified: false });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const roles = [
    { value: 'User', label: 'User', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    { value: 'Mentor', label: 'Mentor', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
    { value: 'Admin', label: 'Admin', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    { value: 'UniAdmin', label: 'University Admin', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    { value: 'UniTeach', label: 'University Teacher', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  ];

  const roleDescriptions = {
    User: 'Standard platform access — can take assessments, book mentors, and explore career resources.',
    Mentor: 'Can create a mentor profile, list services, accept bookings, and guide students.',
    Admin: 'Full system access including user management, analytics, and all admin controls.',
    UniAdmin: 'Manages university-specific settings, student access, and institutional analytics.',
    UniTeach: 'University teacher with access to student progress and mentor tools.',
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedPassword(password);
    showNotification('success', 'Password generated successfully');
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { showNotification('error', 'Name is required'); return false; }
    if (!formData.username.trim()) { showNotification('error', 'Username is required'); return false; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { showNotification('error', 'Valid email is required'); return false; }
    if (!generatedPassword) { showNotification('error', 'Please generate a password first'); return false; }
    return true;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/admin/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ...formData, password: generatedPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification('success', `User ${formData.name} created. ${formData.isVerified ? 'Welcome email sent.' : 'Verification email sent.'}`);
        setFormData({ name: '', username: '', email: '', role: 'User', isVerified: false });
        setGeneratedPassword('');
      } else showNotification('error', data.message || 'Failed to create user');
    } catch { showNotification('error', 'Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/admin/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          testEmail: 'ujjwaljha744@gmail.com',
          sampleData: { name: formData.name || 'Test User', username: formData.username || 'testuser', email: formData.email || 'test@example.com', role: formData.role, password: generatedPassword || 'SamplePass123!', isVerified: formData.isVerified },
        }),
      });
      const data = await response.json();
      if (response.ok) showNotification('success', 'Test email sent to ujjwaljha744@gmail.com');
      else showNotification('error', data.message || 'Failed to send test email');
    } catch { showNotification('error', 'Network error.'); }
    finally { setTestEmailLoading(false); }
  };

  const selectedRole = roles.find(r => r.value === formData.role);

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
              <p className="text-gray-500 text-sm">Add a user account and send a welcome or verification email</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {[
              { id: 'name', label: 'Full Name', icon: <User className="w-4 h-4 text-gray-400" />, type: 'text', placeholder: 'John Doe' },
              { id: 'username', label: 'Username', icon: <User className="w-4 h-4 text-gray-400" />, type: 'text', placeholder: 'johndoe' },
              { id: 'email', label: 'Email Address', icon: <Mail className="w-4 h-4 text-gray-400" />, type: 'email', placeholder: 'john@example.com' },
            ].map(f => (
              <div key={f.id} className={f.id === 'email' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">{f.icon}</span>
                  <input type={f.type} name={f.id} value={formData[f.id]} onChange={handleInputChange} placeholder={f.placeholder}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            ))}

            {/* Role */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gray-400" /> User Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {roles.map(role => (
                  <button key={role.value} type="button" onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                    className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center ${formData.role === role.value ? `border-primary ${role.color}` : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}>
                    {role.label}
                  </button>
                ))}
              </div>
              {selectedRole && (
                <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <strong>{selectedRole.label}:</strong> {roleDescriptions[selectedRole.value]}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-gray-400" /> Generated Password
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input type={showPassword ? 'text' : 'password'} value={generatedPassword} readOnly placeholder="Click Generate Password"
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none font-mono" />
                {generatedPassword && (
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <button onClick={generatePassword} className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl text-sm hover:opacity-90 transition-all">
                Generate
              </button>
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleInputChange} className="sr-only" />
                <div className={`w-11 h-6 rounded-full transition-colors ${formData.isVerified ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.isVerified ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Pre-verify email</span>
                <span className="ml-2 text-xs text-gray-400">({formData.isVerified ? 'Welcome email will be sent' : 'Verification email will be sent'})</span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleCreateUser} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</> : <><UserPlus className="w-4 h-4" />Create User & Send Email</>}
            </button>
            <button onClick={handleTestEmail} disabled={testEmailLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {testEmailLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <><Send className="w-4 h-4" />Send Test Email</>}
            </button>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-0.5">Test email destination: ujjwaljha744@gmail.com</p>
            <p className="text-blue-600 text-xs">Use the test button to preview the email template before creating the actual user account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;