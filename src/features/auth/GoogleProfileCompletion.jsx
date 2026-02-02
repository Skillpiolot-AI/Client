import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function GoogleProfileCompletion() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleData = location.state?.googleData;
  const suggestedUsernames = location.state?.suggestedUsernames || [];

  const [formData, setFormData] = useState({
    username: '',
    newsletter: false,
    subscription: false
  });
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if no Google data
  useEffect(() => {
    if (!googleData) {
      toast.error('Invalid access. Please sign up with Google first.');
      navigate('/signup');
    }
  }, [googleData, navigate]);

  // Check username availability
  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus({ checking: false, available: false, message: '' });
      return;
    }

    setUsernameStatus({ checking: true, available: null, message: '' });

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/check-username`, { username });
      
      setUsernameStatus({
        checking: false,
        available: data.available,
        message: data.message
      });
    } catch (error) {
      setUsernameStatus({ 
        checking: false, 
        available: false, 
        message: 'Error checking username' 
      });
    }
  };

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username) {
        checkUsername(formData.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData({ ...formData, username: value });
  };

  const selectSuggestedUsername = (username) => {
    setFormData({ ...formData, username });
    checkUsername(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameStatus.available) {
      toast.error('Please choose an available username');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/google/complete-profile`, {
        googleData,
        username: formData.username,
        newsletter: formData.newsletter,
        subscription: formData.subscription
      });

      if (data.success) {
        // Store auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success('Welcome to Spark! Your account is ready! 🎉');

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!googleData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Almost There!</h1>
            <p className="text-gray-600">Complete your profile to get started</p>
          </div>

          {/* Google Account Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src={googleData.picture} 
                alt={googleData.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{googleData.name}</p>
                <p className="text-sm text-gray-600">{googleData.email}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    usernameStatus.available === false
                      ? 'border-red-500 focus:ring-red-500'
                      : usernameStatus.available === true
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="cooluser123"
                  required
                  minLength={3}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {usernameStatus.checking && (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  )}
                  {!usernameStatus.checking && usernameStatus.available === true && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {!usernameStatus.checking && usernameStatus.available === false && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              
              {/* Username Status Message */}
              {usernameStatus.message && (
                <p className={`mt-2 text-sm flex items-center ${
                  usernameStatus.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  {usernameStatus.available ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-1" />
                  )}
                  {usernameStatus.message}
                </p>
              )}

              {/* Username Requirements */}
              <p className="mt-2 text-xs text-gray-500">
                • At least 3 characters • Only letters, numbers, and underscores
              </p>
            </div>

            {/* Suggested Usernames */}
            {suggestedUsernames.length > 0 && !formData.username && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggested Usernames
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedUsernames.map((username) => (
                    <button
                      key={username}
                      type="button"
                      onClick={() => selectSuggestedUsername(username)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full hover:from-blue-200 hover:to-indigo-200 transition duration-200 text-sm font-medium"
                    >
                      {username}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.newsletter}
                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="newsletter" className="ml-3 text-sm text-gray-700">
                <Mail className="inline w-4 h-4 mr-1 text-gray-500" />
                Subscribe to newsletter for career tips and updates
              </label>
            </div>

            {/* Subscription Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="subscription"
                checked={formData.subscription}
                onChange={(e) => setFormData({ ...formData, subscription: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="subscription" className="ml-3 text-sm text-gray-700">
                <Sparkles className="inline w-4 h-4 mr-1 text-gray-500" />
                Interested in premium features (optional)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !usernameStatus.available}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Signup
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-800">
                <strong>Your email is verified!</strong> Your Google account email has been automatically verified.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By completing signup, you agree to our{' '}
          <button className="text-blue-600 hover:underline">Terms of Service</button>
          {' '}and{' '}
          <button className="text-blue-600 hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}