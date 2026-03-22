import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function SignupPage() {
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
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: error.response?.data?.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);

    try {
      console.log('🔐 Google credential received');

      const response = await axios.post(`${API_URL}/api/auth/google`, {
        credential: credentialResponse.credential
      });

      const data = response.data;
      console.log('📦 Response:', data);

      if (data.requiresProfileCompletion) {
        console.log('📝 Redirecting to profile completion');

        toast.success('Google authentication successful! Please complete your profile.');

        navigate('/complete-profile', {
          state: {
            googleData: data.googleData,
            suggestedUsernames: data.suggestedUsernames
          }
        });
      }
      else if (data.success && data.token) {
        console.log('✅ Login successful');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success('Welcome back! 🎉');

        const from = navigate.state?.from || location?.state?.from || '/dashboard';
        navigate(from);
      }
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
    <div className="min-h-screen bg-[#fff8f5] font-sans text-[#1f1b18] flex flex-col selection:bg-[#b9c7e0] selection:text-[#0d1c2f]">
        
        {/* Decorative Gradients (from Stitch HTML) */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-[#80d5cb]/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-[#b9c7e0]/10 rounded-full blur-[100px]"></div>
        </div>

        <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative z-10 w-full">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Side: Editorial Content */}
                <div className="hidden lg:block space-y-10">
                    <div className="space-y-4">
                        <span className="font-sans text-[#004944] bg-[#00312d]/5 px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">The Journey Begins</span>
                        <h1 className="font-serif text-6xl font-extrabold text-[#1d2b3e] leading-[1.1] tracking-tighter">
                            Chart your <br /> professional <br /> <span className="text-[#004944]">evolution.</span>
                        </h1>
                    </div>
                    <p className="text-[#44474c] text-lg leading-relaxed max-w-md">
                        Join an ecosystem designed for high-end editorial clarity and curated career growth. Your path is not a transaction; it's a journey.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#fbf2ed] p-6 rounded-xl space-y-2 border border-[#c5c6cd]/15">
                            <span className="material-symbols-outlined text-[#00312d]" style={{fontVariationSettings: "'FILL' 1"}}>explore</span>
                            <h3 className="font-serif font-bold text-[#1d2b3e]">Strategic Guidance</h3>
                            <p className="text-sm text-[#44474c]">Expert-led mentorship for your specific industry goals.</p>
                        </div>
                        <div className="bg-[#fbf2ed] p-6 rounded-xl space-y-2 border border-[#c5c6cd]/15">
                            <span className="material-symbols-outlined text-[#00312d]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                            <h3 className="font-serif font-bold text-[#1d2b3e]">Premium Network</h3>
                            <p className="text-sm text-[#44474c]">Connect with elite professionals in a noise-free space.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="relative group lg:pl-4">
                    
                    {/* Decorative element to break the grid lock */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#80d5cb]/20 rounded-full blur-3xl -z-10 group-hover:bg-[#80d5cb]/30 transition-colors duration-500"></div>
                    
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0px_20px_40px_rgba(31,27,24,0.06)] ring-1 ring-[#c5c6cd]/15 relative overflow-hidden">
                        
                        {/* ---------------- SUCCESS OVERLAY ---------------- */}
                        {showSuccessMessage && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-10 bg-white shadow-[0px_20px_40px_rgba(31,27,24,0.06)] ring-1 ring-[#c5c6cd]/15 text-center space-y-6">
                                <div className="w-20 h-20 bg-[#9cf2e8] rounded-full flex items-center justify-center">
                                    <CheckCircle className="text-[#00312d] w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="font-serif text-3xl font-extrabold text-[#1d2b3e]">Registration Complete</h2>
                                    <p className="text-[#44474c] leading-relaxed max-w-sm mt-2">
                                        We've sent a verification link to <span className="text-[#1d2b3e] font-bold">{formData.email}</span>. Please check your inbox to activate your account and begin your journey.
                                    </p>
                                </div>
                                <div className="pt-6 flex flex-col gap-3 w-full max-w-[200px] mx-auto">
                                    <button onClick={() => navigate('/login')} className="bg-[#1d2b3e] py-3 rounded-full text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all w-full">Go to Login</button>
                                </div>
                            </div>
                        )}
                        {/* ---------------- END SUCCESS OVERLAY ---------------- */}

                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="font-serif text-3xl font-extrabold text-[#1d2b3e] tracking-tight">Create Account</h2>
                                <p className="text-[#44474c] text-sm mt-1">Start your curated experience today.</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="text-xs text-[#75777d] font-sans uppercase tracking-[0.2em] font-bold block">SkillPilot</span>
                            </div>
                        </div>

                        {/* Social Signup */}
                        <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full rounded-xl overflow-hidden border border-[#c5c6cd]/30 focus-within:ring-2 ring-[#b9c7e0]/50 transition-all">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                size="large"
                                width="100%"
                                text="signup_with"
                                shape="rectangular"
                                theme="outline"
                                logo_alignment="center"
                            />
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#c5c6cd]/20"></div></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-bold"><span className="bg-white px-4 text-[#75777d]">or via email</span></div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSignup} className="space-y-5">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#44474c] ml-1" htmlFor="name">Full Name</label>
                                    <input 
                                        className={`w-full bg-[#eae1dc]/50 border-0 rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all text-[#1f1b18] ${errors.name ? 'ring-1 ring-[#ba1a1a]/50' : ''}`}
                                        id="name" name="name" type="text" placeholder="Alex Rivers"
                                        value={formData.name} onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-[#ba1a1a] text-[10px] uppercase mt-1 ml-1 font-bold">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#44474c] ml-1" htmlFor="username">Username</label>
                                    <input 
                                        className={`w-full bg-[#eae1dc]/50 border-0 rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all text-[#1f1b18] ${errors.username ? 'ring-1 ring-[#ba1a1a]/50' : ''}`}
                                        id="username" name="username" type="text" placeholder="arivers_92"
                                        value={formData.username} onChange={handleChange}
                                    />
                                    {errors.username && <p className="text-[#ba1a1a] text-[10px] uppercase mt-1 ml-1 font-bold">{errors.username}</p>}
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#44474c] ml-1" htmlFor="email">Email Address</label>
                                <input 
                                    className={`w-full bg-[#eae1dc]/50 border-0 rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all text-[#1f1b18] ${errors.email ? 'ring-1 ring-[#ba1a1a]/50' : ''}`}
                                    id="email" name="email" type="email" placeholder="alex@company.com"
                                    value={formData.email} onChange={handleChange}
                                />
                                {errors.email && <p className="text-[#ba1a1a] text-[10px] uppercase mt-1 ml-1 font-bold">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 relative">
                                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#44474c] ml-1" htmlFor="password">Password</label>
                                    <div className="relative">
                                        <input 
                                            className={`w-full bg-[#eae1dc]/50 border-0 rounded-xl pl-4 pr-10 py-3.5 text-sm focus:ring-1 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all text-[#1f1b18] ${errors.password ? 'ring-1 ring-[#ba1a1a]/50' : ''}`}
                                            id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                                            value={formData.password} onChange={handleChange}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#1d2b3e]">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-[#ba1a1a] text-[10px] uppercase mt-1 ml-1 font-bold">{errors.password}</p>}
                                </div>
                                <div className="space-y-1.5 relative">
                                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-[#44474c] ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            className={`w-full bg-[#eae1dc]/50 border-0 rounded-xl pl-4 pr-10 py-3.5 text-sm focus:ring-1 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all text-[#1f1b18] ${errors.confirmPassword ? 'ring-1 ring-[#ba1a1a]/50' : ''}`}
                                            id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••"
                                            value={formData.confirmPassword} onChange={handleChange}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#1d2b3e]">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-[#ba1a1a] text-[10px] uppercase mt-1 ml-1 font-bold">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            {errors.submit && (
                                <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/10 rounded-xl flex items-start">
                                    <AlertCircle className="w-4 h-4 text-[#93000a] mr-2 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs font-bold text-[#93000a]">{errors.submit}</p>
                                </div>
                            )}

                            <div className="pt-4">
                                <button 
                                    disabled={loading}
                                    className="bg-gradient-to-br from-[#1d2b3e] to-[#334155] w-full py-4 rounded-full text-white font-bold text-sm tracking-wide shadow-lg shadow-[#1d2b3e]/10 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-70" 
                                    type="submit"
                                >
                                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Creating...</span> : 'Create Your Account'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-[11px] text-[#44474c] uppercase tracking-wider font-bold">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#1d2b3e] hover:underline underline-offset-4 decoration-[#c5c6cd]/50 hover:decoration-[#1d2b3e]/50 transition-colors">Log In</Link> 
                        </p>
                    </div>
                </div>

            </div>
        </main>

    </div>
  );
}