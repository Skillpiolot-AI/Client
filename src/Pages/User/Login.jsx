import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { GoogleLogin } from '@react-oauth/google'
import axios from "axios"
import { toast } from "react-hot-toast"
import config from "../../config"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page user was trying to access before login
  const from = location.state?.from || null

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: ""
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("role")
    if (token && userRole) {
      redirectBasedOnRole(userRole)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }))
  }

  const redirectBasedOnRole = (userRole) => {
    console.log("Redirecting user with role:", userRole)

    if (from) {
      console.log("Redirecting to previous page:", from)
      window.location.href = from
      return
    }

    switch (userRole) {
      case "Admin":
        window.location.href = "/amdashboard"
        break
      case "UniAdmin":
        window.location.href = "/uniAdminPortal"
        break
      case "UniTeach":
        window.location.href = "/teacher/dashboard"
        break
      case "Mentor":
        window.location.href = "/mentor-profile"
        break
      case "User":
      default:
        window.location.href = "/"
        break
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { username: "", password: "", general: "" }

    if (!form.username.trim()) {
      newErrors.username = "Username, email, or registration number is required"
      isValid = false
    }

    if (!form.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ username: "", password: "", general: "" })

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      console.log('🔐 Attempting login...')
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/login`, form)

      console.log("✅ Login response:", data)

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      const welcomeMessage = data.user?.universityName
        ? `Welcome to ${data.user.universityName}!`
        : "Welcome to SkillPilot!"

      toast.success(welcomeMessage)

      setTimeout(() => {
        redirectBasedOnRole(data.role)
      }, 100)
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message)

      const errorResponse = error.response?.data

      if (error.response?.status === 400) {
        setErrors({
          username: "",
          password: "",
          general: "Incorrect email/username or password. Please try again."
        })
        toast.error("Incorrect email/username or password")
      } else if (error.response?.status === 404) {
        setErrors({
          username: "",
          password: "",
          general: "No account found with these credentials. Please sign up first."
        })
        toast.error("Account not found. Please sign up.")
      } else if (error.response?.status === 423) {
        setErrors({
          username: "",
          password: "",
          general: errorResponse?.message || "Account is temporarily locked. Please use forgot password."
        })
        toast.error("Account locked due to multiple failed attempts")
      } else if (error.response?.status === 403) {
        setErrors({
          username: "",
          password: "",
          general: errorResponse?.message || "Your account has been suspended or deactivated."
        })
        toast.error(errorResponse?.message || "Account access denied")
      } else {
        const errorMessage = errorResponse?.message || "Login failed. Please try again."
        setErrors({
          username: "",
          password: "",
          general: errorMessage
        })
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('🔐 Google login initiated')

    try {
      setIsLoading(true)

      const { data } = await axios.post(`${config.API_BASE_URL}/auth/google`, {
        credential: credentialResponse.credential
      })

      console.log("✅ Google login response:", data)

      if (data.success) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.role)

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }

        toast.success(data.message || "Google login successful!")

        setTimeout(() => {
          redirectBasedOnRole(data.role)
        }, 100)
      }
    } catch (error) {
      console.error("❌ Google login error:", error)

      const errorMessage = error.response?.data?.message || "Google login failed. Please try again."
      setErrors({
        username: "",
        password: "",
        general: errorMessage
      })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Login Error
  const handleGoogleError = () => {
    console.error('❌ Google login failed')
    toast.error('Google login failed. Please try again.')
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans text-[#1f1b18] selection:bg-[#b9c7e0] selection:text-[#0d1c2f]">
        
        {/* Navbar area placeholder for spacing if needed */}
        <main className="min-h-screen flex items-center justify-center px-6 py-12 lg:py-24">
            
            {/* Main Layout Container: Intentional Asymmetry */}
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Branding/Editorial Column */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="inline-block">
                        <span className="font-serif font-black text-4xl tracking-tight text-[#1d2b3e]">SkillPilot</span>
                    </div>
                    
                    <h1 className="font-serif font-extrabold text-5xl lg:text-6xl text-[#1f1b18] leading-[1.1] tracking-tight">
                        Secure your next <span className="text-[#004944] bg-[#9cf2e8] px-2 rounded-xl">milestone.</span>
                    </h1>
                    
                    <p className="text-[#44474c] text-lg leading-relaxed max-w-md">
                        Access your personalized career dashboard, connect with top-tier mentors, and track your professional trajectory with precision.
                    </p>
                    
                    <div className="hidden lg:block pt-12">
                        <div className="bg-[#fbf2ed] p-8 rounded-full border border-[#c5c6cd]/15 relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#334155] flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">shield_person</span>
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-[#1f1b18]">Trusted Identity</p>
                                    <p className="text-sm text-[#44474c]">Enterprise-grade security for your data.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form Column */}
                <div className="lg:col-span-7 flex justify-center">
                    <div className="w-full max-w-md bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-[#c5c6cd]/15 relative">
                        
                        <div className="mb-10">
                            <h2 className="font-serif font-bold text-2xl text-[#1f1b18] mb-2">Welcome Back</h2>
                            <p className="text-[#44474c] text-sm">Please enter your details to continue your journey.</p>
                        </div>

                        {/* General Error State */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-[#ffdad6]/40 rounded-xl flex items-start gap-3 border border-[#ba1a1a]/10">
                                <span className="material-symbols-outlined text-[#ba1a1a] mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
                                <div>
                                    <p className="text-[#93000a] text-sm font-semibold">Security Alert</p>
                                    <p className="text-[#93000a] text-xs opacity-80">{errors.general}</p>
                                    {errors.general.includes("locked") && (
                                        <Link to="/forgot-password" className="text-xs font-bold text-[#ba1a1a] hover:underline mt-1 block">
                                            Reset your password →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Identity Input */}
                            <div className="space-y-2">
                                <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#44474c]" htmlFor="username">
                                    Username, Email, or Reg. No
                                </label>
                                <div className="relative group">
                                    <input 
                                        className={`w-full h-14 px-5 bg-[#eae1dc] rounded-xl border-0 focus:ring-0 focus:bg-white transition-all duration-300 placeholder:text-[#75777d] text-[#1f1b18] ${errors.username ? 'ring-2 ring-[#ba1a1a]/50' : ''}`}
                                        id="username" 
                                        name="username" 
                                        type="text"
                                        placeholder="e.g. navigator_pro"
                                        value={form.username}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-[#1d2b3e]/5 group-focus-within:ring-[#1d2b3e]/20 transition-all"></div>
                                </div>
                                {errors.username && <p className="text-[#ba1a1a] text-xs mt-1">{errors.username}</p>}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-[#44474c]" htmlFor="password">
                                        Password
                                    </label>
                                    <Link className="text-xs font-medium text-[#1d2b3e] hover:underline underline-offset-4" to="/forgot-password">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <input 
                                        className={`w-full h-14 px-5 bg-[#eae1dc] rounded-xl border-0 focus:ring-0 focus:bg-white transition-all duration-300 placeholder:text-[#75777d] text-[#1f1b18] pr-12 ${errors.password ? 'ring-2 ring-[#ba1a1a]/50' : ''}`}
                                        id="password" 
                                        name="password" 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#1f1b18] cursor-pointer outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-[#1d2b3e]/5 group-focus-within:ring-[#1d2b3e]/20 transition-all"></div>
                                </div>
                                {errors.password && <p className="text-[#ba1a1a] text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Sign In Button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-br from-[#1d2b3e] to-[#334155] w-full h-14 rounded-full text-white font-serif font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#1d2b3e]/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                                ) : (
                                    <>Sign In <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                                )}
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#c5c6cd]/30"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                    <span className="bg-white px-4 text-[#75777d]">or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign In Area */}
                            <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:w-full rounded-full overflow-hidden border border-[#c5c6cd]/15">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap
                                    theme="outline"
                                    size="large"
                                    text="signin_with"
                                    shape="circle"
                                    width="100%"
                                />
                            </div>

                        </form>

                        <p className="mt-8 text-center text-sm text-[#44474c]">
                            Don't have an account?{' '}
                            <Link className="text-[#1d2b3e] font-bold hover:underline underline-offset-4" to="/signup">
                                Get Started
                            </Link>
                        </p>

                        
                        {/* Quick Login Shortcuts for Development */}
                        {import.meta.env.DEV && (
                            <div className="mt-8 pt-4 border-t border-[#c5c6cd]/30 hidden md:block">
                            <p className="text-[10px] text-[#75777d] text-center font-bold uppercase tracking-widest mb-3">
                                ⚡ Dev Quick Login
                            </p>
                            <div className="flex flex-col gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => setForm({ username: 'admin@skillpilot.dev', password: 'Admin@Skill2024!' })}
                                    className="w-full bg-[#fbf2ed] text-left px-3 py-2 border border-[#eae1dc] text-[#93000a] text-xs rounded-lg hover:bg-white transition-colors font-medium flex justify-between"
                                >
                                    <span>🛡️ Super Admin</span>
                                    <span>admin@skillpilot.dev</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ username: 'ravi.gupta@user.dev', password: 'User@1234' })}
                                    className="w-full bg-[#fbf2ed] text-left px-3 py-2 border border-[#eae1dc] text-[#00504a] text-xs rounded-lg hover:bg-white transition-colors font-medium flex justify-between"
                                >
                                    <span>👤 User (Ravi)</span>
                                    <span>ravi.gupta@user.dev</span>
                                </button>
                            </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}