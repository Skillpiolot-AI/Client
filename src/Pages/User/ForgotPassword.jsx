import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import config from "../../config"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Auto-start countdown if we arrive at step 2
  useEffect(() => {
    if (step === 2 && countdown === 0) {
      startCountdown()
    }
  }, [step])

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
    resetToken: ""
  })

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: ""
  })

  // Start countdown for resend OTP
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault()

    if (!formData.email) {
      setErrors({ ...errors, email: "Email is required" })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" })
      return
    }

    setIsLoading(true)

    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
        email: formData.email
      })

      if (data.success) {
        toast.success(data.message)
        setStep(2)
        startCountdown()

        if (data.debug) {
          toast.success(`DEBUG: OTP is ${data.debug.otp}`, { duration: 10000 })
        }
      }
    } catch (error) {
      const data = error.response?.data
      const errorMessage = data?.message || error.message || "Failed to send reset code. Please try again."
      toast.error(errorMessage)
      setErrors({ ...errors, email: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (!formData.otp) {
      setErrors({ ...errors, otp: "Please enter the OTP code" })
      return
    }

    if (formData.otp.length !== 6) {
      setErrors({ ...errors, otp: "OTP must be 6 digits" })
      return
    }

    setIsLoading(true)

    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp
      })

      if (data.success) {
        toast.success(data.message)
        setFormData({ ...formData, resetToken: data.resetToken })
        setStep(3)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again."
      toast.error(errorMessage)
      setErrors({ ...errors, otp: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return

    setIsLoading(true)

    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/resend-otp`, {
        email: formData.email
      })

      if (data.success) {
        toast.success(data.message)
        setFormData({ ...formData, otp: "" })
        startCountdown()

        if (data.debug) {
          toast.success(`DEBUG: New OTP is ${data.debug.otp}`, { duration: 10000 })
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!formData.newPassword || !formData.confirmPassword) {
      setErrors({ ...errors, password: "Both password fields are required" })
      return
    }

    if (formData.newPassword.length < 6) {
      setErrors({ ...errors, password: "Password must be at least 6 characters" })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ ...errors, password: "Passwords do not match" })
      return
    }

    setIsLoading(true)

    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/reset-password`, {
        resetToken: formData.resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      if (data.success) {
        toast.success(data.message)
        setStep(4)

        setTimeout(() => {
          navigate('/login')
        }, 5000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again."
      toast.error(errorMessage)
      setErrors({ ...errors, password: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const stepLabels = [
    { num: 1, label: "Identity" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Reset" },
    { num: 4, label: "Done" }
  ]

  return (
    <div className="bg-[#fff8f5] font-sans text-[#1f1b18] min-h-screen flex flex-col selection:bg-[#b9c7e0] selection:text-[#0d1c2f]">
        
        {/* TopAppBar Fake Nav Segment */}
        <header className="sticky top-0 z-50 bg-[#fff8f5]/80 backdrop-blur-xl border-b border-[#eae1dc]/30">
            <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center w-full">
                <div className="text-2xl font-black text-[#1d2b3e] font-serif tracking-tight">
                    SkillPilot
                </div>
                <Link to="/login" className="text-[#1d2b3e] font-medium flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>arrow_back</span>
                    <span className="font-sans uppercase tracking-widest text-[10px] font-bold">Back to login</span>
                </Link>
            </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-xl">
                
                {/* Progress Tracker */}
                <div className="flex justify-between mb-12 px-4 relative max-w-md mx-auto">
                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-[#eae1dc] -z-10 -translate-y-1/2"></div>
                    
                    {stepLabels.map((s) => {
                        const isActive = step >= s.num;
                        const isCurrent = step === s.num;
                        return (
                            <div key={s.num} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-[#fff8f5] transition-all ${isActive ? 'bg-[#1d2b3e] text-white' : 'bg-[#eae1dc] text-[#75777d]'}`}>
                                    {isActive && !isCurrent && s.num < 4 ? <span className="material-symbols-outlined text-[16px]">check</span> : s.num}
                                </div>
                                <span className={`font-sans text-[10px] uppercase tracking-tighter font-bold ${isActive ? 'text-[#1d2b3e]' : 'text-[#75777d]'}`}>{s.label}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-[2rem] p-10 shadow-[0px_20px_40px_rgba(31,27,24,0.06)] ring-1 ring-[#c5c6cd]/15">
                    
                    {/* STEP 1: EMAIL REQUEST */}
                    {step === 1 && (
                        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                                <h1 className="font-serif text-3xl font-extrabold text-[#1d2b3e] tracking-tight">Forgot password?</h1>
                                <p className="text-[#44474c] text-sm leading-relaxed">Enter the email address associated with your SkillPilot account and we'll send you a 6-digit verification code.</p>
                            </div>
                            
                            <form onSubmit={handleRequestOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-sans text-[11px] uppercase tracking-widest font-semibold text-[#75777d]" htmlFor="email">Email Address</label>
                                    <input 
                                        className={`w-full bg-[#eae1dc]/30 border-0 rounded-xl px-4 py-4 text-[#1f1b18] focus:ring-2 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all outline-none ${errors.email ? 'ring-2 ring-[#ba1a1a]/50' : ''}`}
                                        id="email" name="email" type="email" placeholder="name@company.com"
                                        value={formData.email} onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1 mt-1"><AlertCircle size={14} />{errors.email}</p>}
                                </div>
                                <button 
                                    type="submit" disabled={isLoading}
                                    className="w-full bg-gradient-to-br from-[#1d2b3e] to-[#334155] text-white py-4 rounded-full font-bold text-sm shadow-xl shadow-[#1d2b3e]/20 hover:-translate-y-0.5 transition-transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Processing...</> : 'Send Verification Code'}
                                </button>
                            </form>
                        </section>
                    )}

                    {/* STEP 2: OTP INPUT */}
                    {step === 2 && (
                        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2 text-center">
                                <h1 className="font-serif text-3xl font-extrabold text-[#1d2b3e] tracking-tight">Verify Identity</h1>
                                <p className="text-[#44474c] text-sm leading-relaxed">We've sent a code to <span className="font-bold text-[#1d2b3e] italic">{formData.email}</span></p>
                            </div>
                            
                            <form onSubmit={handleVerifyOTP} className="space-y-8">
                                <div className="space-y-2">
                                    <input 
                                        className={`w-full h-16 text-center text-3xl tracking-[1em] bg-[#eae1dc]/30 border-0 rounded-xl focus:ring-2 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] text-[#1f1b18] font-bold ${errors.otp ? 'ring-2 ring-[#ba1a1a]/50' : ''}`}
                                        maxLength={6} type="text" placeholder="------"
                                        name="otp" value={formData.otp} onChange={handleChange} autoFocus
                                    />
                                    {errors.otp && <p className="text-[#ba1a1a] text-xs font-bold flex justify-center items-center gap-1 mt-1"><AlertCircle size={14} />{errors.otp}</p>}
                                </div>
                                <div className="text-center">
                                    {countdown > 0 ? (
                                        <p className="text-xs text-[#75777d] font-medium">Resend code in <span className="text-[#1d2b3e] font-bold">{formatTime(countdown)}</span></p>
                                    ) : (
                                        <button type="button" onClick={handleResendOTP} disabled={isLoading} className="text-xs text-[#1d2b3e] font-bold hover:underline">Resend Code Now</button>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        type="submit" disabled={isLoading}
                                        className="w-full bg-gradient-to-br from-[#1d2b3e] to-[#334155] text-white py-4 rounded-full font-bold text-sm shadow-xl shadow-[#1d2b3e]/20 hover:-translate-y-0.5 transition-transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Verifying...</> : 'Verify & Proceed'}
                                    </button>
                                    <button type="button" onClick={() => setStep(1)} className="text-[#75777d] text-xs font-bold uppercase tracking-widest hover:text-[#1d2b3e]">
                                        Change Email
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* STEP 3: NEW PASSWORD */}
                    {step === 3 && (
                        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-2">
                                <h1 className="font-serif text-3xl font-extrabold text-[#1d2b3e] tracking-tight">New Password</h1>
                                <p className="text-[#44474c] text-sm leading-relaxed">Set a strong password to protect your professional journey.</p>
                            </div>
                            
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-sans text-[11px] uppercase tracking-widest font-semibold text-[#75777d]">New Password</label>
                                    <div className="relative">
                                        <input 
                                            className={`w-full bg-[#eae1dc]/30 border-0 rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all outline-none text-[#1f1b18] ${errors.password ? 'ring-2 ring-[#ba1a1a]/50' : ''}`}
                                            placeholder="••••••••" type={showPassword ? 'text' : 'password'}
                                            name="newPassword" value={formData.newPassword} onChange={handleChange}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#1d2b3e]">
                                            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-sans text-[11px] uppercase tracking-widest font-semibold text-[#75777d]">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            className={`w-full bg-[#eae1dc]/30 border-0 rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#1d2b3e]/20 focus:bg-[#fbf2ed] transition-all outline-none text-[#1f1b18] ${errors.password ? 'ring-2 ring-[#ba1a1a]/50' : ''}`}
                                            placeholder="••••••••" type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#1d2b3e]">
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1 mt-1"><AlertCircle size={14} />{errors.password}</p>}
                                </div>
                                
                                <div className="bg-[#fbf2ed] p-4 rounded-xl space-y-2 border border-[#c5c6cd]/10">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#75777d]">Security Strength</p>
                                    <div className="h-1 w-full bg-[#eae1dc] rounded-full overflow-hidden">
                                        {/* Auto-calculate simple visual strength */}
                                        <div className={`h-full transition-all ${formData.newPassword.length > 8 ? 'bg-[#004944] w-3/4' : formData.newPassword.length > 5 ? 'bg-[#80d5cb] w-1/2' : 'bg-[#ba1a1a]/50 w-1/4'}`}></div>
                                    </div>
                                    {formData.newPassword.length > 8 ? (
                                        <p className="text-[10px] text-[#00312d] font-medium">Strong: Contains sufficient characters.</p>
                                    ) : (
                                        <p className="text-[10px] text-[#75777d] font-medium text-opacity-80">Minimum 6 characters required.</p>
                                    )}
                                </div>

                                <button 
                                    type="submit" disabled={isLoading}
                                    className="w-full bg-gradient-to-br from-[#1d2b3e] to-[#334155] text-white py-4 rounded-full font-bold text-sm shadow-xl shadow-[#1d2b3e]/20 hover:-translate-y-0.5 transition-transform active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin"/> Processing...</> : 'Update Password'}
                                </button>
                            </form>
                        </section>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <section className="space-y-8 text-center py-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-[#9cf2e8] rounded-full flex items-center justify-center text-[#00312d]">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="font-serif text-3xl font-extrabold text-[#1d2b3e] tracking-tight">Success!</h1>
                                <p className="text-[#44474c] text-sm leading-relaxed px-4">Your password has been updated. You can now use your new credentials to sign in.</p>
                            </div>
                            <div className="pt-4">
                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#f6ece8] rounded-full">
                                    <div className="w-5 h-5 border-2 border-[#1d2b3e]/20 border-t-[#1d2b3e] rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold text-[#1d2b3e] uppercase tracking-widest">Redirecting to Login...</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/login')} className="w-full bg-[#eae1dc]/30 text-[#1d2b3e] py-4 rounded-full font-bold text-sm hover:bg-[#eae1dc] transition-colors mt-6">
                                Sign In Now
                            </button>
                        </section>
                    )}

                </div>

                {/* Contextual Footer Help */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-[#75777d] font-medium">Having trouble? <Link to="/contact" className="text-[#1d2b3e] underline decoration-[#1d2b3e]/20 underline-offset-4 hover:decoration-[#1d2b3e] transition-all font-bold">Contact Support</Link></p>
                </div>

            </div>
        </main>
    </div>
  )
}