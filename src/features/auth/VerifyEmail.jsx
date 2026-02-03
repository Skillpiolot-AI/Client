import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import config from '../../config/config';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, expired
  const [message, setMessage] = useState('Verifying your email...');
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      console.log('🔐 Verifying email with token:', verificationToken);
      
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/verify-email`, {
        token: verificationToken
      });

      console.log('✅ Verification response:', data);

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        setEmail(data.email);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('❌ Email verification error:', error);
      
      if (error.response?.status === 400) {
        setStatus('expired');
        setMessage(error.response.data.message || 'Verification link has expired');
        setEmail(error.response.data.email);
      } else {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      }
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage('Email not found. Please sign up again.');
      return;
    }

    setResendLoading(true);
    
    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/resend-verification`, {
        email: email
      });

      if (data.success) {
        setMessage('✅ New verification email sent! Please check your inbox.');
        setStatus('success');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      setMessage('Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
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
            {(status === 'error' || status === 'expired') && (
              <div className="bg-red-100 p-4 rounded-full">
                {status === 'expired' ? (
                  <AlertCircle className="h-16 w-16 text-orange-600" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-600" />
                )}
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'verifying' && 'Verifying Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'expired' && 'Link Expired'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-800 font-medium">
                  Your account is now active!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Redirecting to login page...
                </p>
              </div>

              <Link to="/login" className="block">
                <Button 
                  className="w-full bg-[#3F3FF3] hover:bg-[#2F2FD3]"
                  size="lg"
                >
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800 text-center">
                  Your verification link has expired. Click below to receive a new one.
                </p>
              </div>

              <Button
                onClick={resendVerification}
                disabled={resendLoading}
                className="w-full bg-[#3F3FF3] hover:bg-[#2F2FD3]"
                size="lg"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Link to="/signup" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Back to Sign Up
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 text-center">
                  {message}
                </p>
              </div>

              <Link to="/signup" className="block">
                <Button 
                  className="w-full bg-[#3F3FF3] hover:bg-[#2F2FD3]"
                  size="lg"
                >
                  Try Signing Up Again
                </Button>
              </Link>

              <Link to="/login" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Back to Login
                </Button>
              </Link>
            </>
          )}

          {status === 'verifying' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Please wait while we verify your email...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}