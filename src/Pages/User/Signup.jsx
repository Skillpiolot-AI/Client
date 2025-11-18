
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

// // Replace with your actual Google Client ID from .env
// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "860946075972-h9p02v2019ad2n7rfco6dkil6resstqk.apps.googleusercontent.com";
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// function SignupPage() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     username: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle regular signup
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/auth/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           username: formData.username,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('✅ Signup successful:', data);
        
//         // Show success message
//         setShowSuccessMessage(true);
        
//         // Clear form
//         setFormData({
//           name: '',
//           email: '',
//           username: '',
//           password: '',
//           confirmPassword: ''
//         });
        
//         // Redirect to verify email page after 3 seconds
//         setTimeout(() => {
//           navigate('/verify-email', { 
//             state: { 
//               email: data.user?.email,
//               message: 'Please check your email to verify your account.' 
//             } 
//           });
//         }, 3000);
//       } else {
//         setErrors({ submit: data.message || 'Signup failed' });
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       setErrors({ submit: 'Network error. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Google signup success
//   const handleGoogleSuccess = async (credentialResponse) => {
//     setLoading(true);

//     try {
//       console.log('🔐 Google credential received');
      
//       const response = await fetch(`${API_URL}/api/auth/google`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           credential: credentialResponse.credential
//         })
//       });

//       const data = await response.json();
//       console.log('📦 Response:', data);

//       if (response.ok) {
//         // Check if email verification is required
//         if (data.requiresVerification) {
//           console.log('📧 Email verification required');
          
//           // Show success message
//           setShowSuccessMessage(true);
          
//           // Redirect to verify email page
//           setTimeout(() => {
//             navigate('/verify-email', { 
//               state: { 
//                 email: data.user?.email,
//                 message: data.message || 'Please check your email to verify your account.',
//                 fromGoogle: true
//               } 
//             });
//           }, 3000);
//         } else {
//           // User already exists and is verified - login successful
//           console.log('✅ Login successful');
          
//           // Store token
//           localStorage.setItem('token', data.token);
//           localStorage.setItem('user', JSON.stringify(data.user));
          
//           // Navigate to dashboard
//           navigate('/dashboard');
//         }
//       } else {
//         // Handle specific error codes
//         if (data.errorCode === 'EMAIL_NOT_VERIFIED') {
//           navigate('/verify-email', { 
//             state: { 
//               email: data.email,
//               message: data.message,
//               showResend: true
//             } 
//           });
//         } else {
//           setErrors({ submit: data.message || 'Google signup failed' });
//         }
//       }
//     } catch (error) {
//       console.error('Google signup error:', error);
//       setErrors({ submit: 'Network error. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Google signup failure
//   const handleGoogleError = () => {
//     console.error('❌ Google signup failed');
//     setErrors({ submit: 'Google signup failed. Please try again.' });
//   };

//   return (
//     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           {/* Success Message */}
//           {showSuccessMessage && (
//             <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
//               <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-green-800 font-semibold">Account Created!</p>
//                 <p className="text-green-700 text-sm mt-1">
//                   Please check your email to verify your account. Redirecting...
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
//               <p className="text-gray-600">Join Spark Career Guidance today</p>
//             </div>

//             {/* Google Sign Up Button */}
//             <div className="mb-6">
//               <GoogleLogin
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
//                 useOneTap
//                 size="large"
//                 width="100%"
//                 text="signup_with"
//                 shape="rectangular"
//                 theme="outline"
//                 logo_alignment="left"
//               />
//             </div>

//             {/* Divider */}
//             <div className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
//               </div>
//             </div>

//             {/* Signup Form */}
//             <form onSubmit={handleSignup} className="space-y-4">
//               {/* Name Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-3 border ${
//                       errors.name ? 'border-red-500' : 'border-gray-300'
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                     placeholder="John Doe"
//                   />
//                 </div>
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-500 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.name}
//                   </p>
//                 )}
//               </div>

//               {/* Username Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-3 border ${
//                       errors.username ? 'border-red-500' : 'border-gray-300'
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                     placeholder="johndoe"
//                   />
//                 </div>
//                 {errors.username && (
//                   <p className="mt-1 text-sm text-red-500 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.username}
//                   </p>
//                 )}
//               </div>

//               {/* Email Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-3 border ${
//                       errors.email ? 'border-red-500' : 'border-gray-300'
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                     placeholder="john@example.com"
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-500 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-12 py-3 border ${
//                       errors.password ? 'border-red-500' : 'border-gray-300'
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-500 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-12 py-3 border ${
//                       errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="mt-1 text-sm text-red-500 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Submit Error */}
//               {errors.submit && (
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
//                   <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
//                   <p className="text-sm text-red-600">{errors.submit}</p>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Creating Account...' : 'Sign Up'}
//               </button>
//             </form>

//             {/* Login Link */}
//             <p className="text-center text-sm text-gray-600 mt-6">
//               Already have an account?{' '}
//               <button
//                 onClick={() => navigate('/login')}
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 Log In
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// export default SignupPage;

// src/Pages/User/Signup.jsx - Updated Google OAuth Handler

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        console.log('✅ Signup successful:', response.data);
        
        setShowSuccessMessage(true);
        
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          navigate('/verify-email', { 
            state: { 
              email: response.data.user?.email,
              message: 'Please check your email to verify your account.' 
            } 
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: error.response?.data?.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Handle Google signup with profile completion redirect
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);

    try {
      console.log('🔐 Google credential received');
      
      const response = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential
      });

      const data = response.data;
      console.log('📦 Response:', data);

      // ✅ NEW USER - Redirect to profile completion
      if (data.requiresProfileCompletion) {
        console.log('📝 Redirecting to profile completion');
        
        toast.success('Google authentication successful! Please complete your profile.');
        
        // Redirect to profile completion page with Google data
        navigate('/complete-profile', { 
          state: { 
            googleData: data.googleData,
            suggestedUsernames: data.suggestedUsernames
          } 
        });
      }
      // ✅ EXISTING USER - Direct login
      else if (data.success && data.token) {
        console.log('✅ Login successful');
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Welcome back! 🎉');
        
        navigate('/dashboard');
      }
      // ❌ ERROR CASES
      else if (data.errorCode === 'EMAIL_NOT_VERIFIED') {
        navigate('/verify-email', { 
          state: { 
            email: data.email,
            message: data.message,
            showResend: true
          } 
        });
      } else {
        setErrors({ submit: data.message || 'Google signup failed' });
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setErrors({ submit: error.response?.data?.message || 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google signup failed');
    toast.error('Google signup failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold">Account Created!</p>
              <p className="text-green-700 text-sm mt-1">
                Please check your email to verify your account. Redirecting...
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Join Spark Career Guidance today</p>
          </div>

          {/* Google Sign Up Button */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
              theme="outline"
              logo_alignment="left"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Regular Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;