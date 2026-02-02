// Client-landing-page/src/Pages/User/VerifyLogin.jsx

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, CheckCircle, XCircle, Loader2, MapPin, Clock, Monitor, Globe, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

export default function VerifyLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');
  const [loginDetails, setLoginDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = searchParams.get('token');
  const action = searchParams.get('action');

  useEffect(() => {
    if (token) {
      if (action === 'verify' || action === 'deny') {
        handleAction(action);
      } else {
        fetchLoginDetails();
      }
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      setLoading(false);
    }
  }, [token, action]);

  const fetchLoginDetails = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/auth/login-verification/${token}`);
      
      if (data.success) {
        setLoginDetails(data.verification);
        setStatus('pending');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to fetch login details');
      }
    } catch (error) {
      console.error('Error fetching login details:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to load verification details');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    setStatus('verifying');
    setLoading(true);

    try {
      const endpoint = actionType === 'verify' 
        ? `${config.API_BASE_URL}/auth/verify-login`
        : `${config.API_BASE_URL}/auth/deny-login`;

      const { data } = await axios.post(endpoint, { token });

      if (data.success) {
        setStatus(actionType === 'verify' ? 'success' : 'denied');
        setMessage(data.message);
        
        setTimeout(() => {
          if (actionType === 'verify') {
            navigate('/login');
          } else {
            navigate('/forgot-password');
          }
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing login:`, error);
      setStatus('error');
      setMessage(error.response?.data?.message || `Failed to ${actionType} login`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading verification details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            {status === 'pending' && (
              <div className="bg-orange-100 p-4 rounded-full">
                <Shield className="h-16 w-16 text-orange-600" />
              </div>
            )}
            {status === 'verifying' && (
              <div className="bg-blue-100 p-4 rounded-full">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="bg-green-100 p-4 rounded-full animate-bounce">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            )}
            {status === 'denied' && (
              <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="h-16 w-16 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'pending' && '🔐 Security Verification Required'}
            {status === 'verifying' && 'Processing...'}
            {status === 'success' && '✅ Login Verified'}
            {status === 'denied' && '🛡️ Login Blocked'}
            {status === 'error' && '❌ Verification Error'}
          </CardTitle>
          
          {message && (
            <CardDescription className="text-base mt-2">
              {message}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {status === 'pending' && loginDetails && (
            <>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-900 mb-1">Unusual Login Detected</h3>
                    <p className="text-sm text-orange-800">
                      We detected a login to your account from a new or unrecognized location. 
                      Please verify if this was you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Login Details</h3>
                
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">
                        {loginDetails.location?.city || 'Unknown'}, {loginDetails.location?.region || 'Unknown'}, {loginDetails.location?.country || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">IP Address</p>
                      <p className="text-sm text-gray-600">{loginDetails.ipAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Monitor className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Device & Browser</p>
                      <p className="text-sm text-gray-600">
                        {loginDetails.deviceInfo?.device || 'Unknown Device'} - {loginDetails.deviceInfo?.browser || 'Unknown Browser'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(loginDetails.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Was this you?</h3>
                <p className="text-sm text-blue-800 mb-4">
                  If you recognize this login attempt, click "Yes, This Was Me" to continue. 
                  If you don't recognize it, click "No, Secure My Account" immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleAction('verify')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Yes, This Was Me
                </Button>

                <Button
                  onClick={() => handleAction('deny')}
                  variant="destructive"
                  className="w-full h-12"
                  size="lg"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  No, Secure My Account
                </Button>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 mb-2">Login Verified Successfully</h3>
                <p className="text-sm text-green-800">
                  Thank you for confirming. You can now log in to your account.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Redirecting to login page...
                </p>
              </div>

              <Link to="/login" className="block">
                <Button className="w-full bg-[#3F3FF3] hover:bg-[#2F2FD3]" size="lg">
                  Continue to Login
                </Button>
              </Link>
            </>
          )}

          {status === 'denied' && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-red-900 mb-2">Account Secured</h3>
                <p className="text-sm text-red-800 mb-3">
                  The suspicious login attempt has been blocked. We recommend changing your password immediately.
                </p>
                <p className="text-xs text-red-600">
                  Redirecting to password reset page...
                </p>
              </div>

              <Link to="/forgot-password" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  Reset Password Now
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 text-center">
                  {message || 'An error occurred during verification'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Back to Login
                  </Button>
                </Link>

                <Link to="/forgot-password" className="block">
                  <Button className="w-full bg-[#3F3FF3] hover:bg-[#2F2FD3]" size="lg">
                    Reset Password
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}