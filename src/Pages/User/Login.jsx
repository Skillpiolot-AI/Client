
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

    // If user was trying to access a specific page before login, redirect them there
    if (from) {
      console.log("Redirecting to previous page:", from)
      window.location.href = from
      return
    }

    // Otherwise, redirect based on role
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
    <div className="min-h-screen flex font-sans">
      {/* Left side - Brand section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#3F3FF3" }}>
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">


          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight font-bold">
              Effortlessly manage your career guidance.
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Log in to access your portal and manage your career path.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 SkillPilot</span>
            <span className="cursor-pointer hover:text-white/90 transition-colors">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "#3F3FF3" }}
            >
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold text-foreground">SkillPilot</h1>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-3xl text-foreground font-semibold">Welcome Back</h2>
              <p className="text-muted-foreground">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{errors.general}</p>
                  {errors.general.includes("No account found") && (
                    <Link
                      to="/signup"
                      className="text-sm font-medium text-red-600 hover:text-red-700 mt-1 inline-block"
                    >
                      Create an account →
                    </Link>
                  )}
                  {errors.general.includes("locked") && (
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-red-600 hover:text-red-700 mt-1 inline-block"
                    >
                      Reset your password →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/Email Input */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username / Email / Registration Number
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username, email, or registration number"
                  required
                  className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] ${errors.username ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.username}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className={`h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] ${errors.password ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-[#3F3FF3] hover:text-[#2F2FD3] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer transition-opacity"
                style={{ backgroundColor: "#3F3FF3" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="384"
              />
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link
                to="/signup"
                className="font-medium text-[#3F3FF3] hover:text-[#2F2FD3] transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}