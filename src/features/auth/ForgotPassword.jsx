"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import config from '../../config/config'
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Auto-start countdown if we arrive at step 2 (e.g. via resend or manual step change)
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
      console.log('🔐 Sending forgot password request...')
      console.log('Email:', formData.email)

      const { data } = await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
        email: formData.email
      })

      console.log('📨 Response:', data)

      if (data.success) {
        toast.success(data.message)
        setStep(2)
        startCountdown()

        // Show debug info in development
        if (data.debug) {
          console.log('🔑 DEBUG - OTP:', data.debug.otp)
          console.log('⏰ Expires in:', data.debug.expiresIn)
          toast.success(`DEBUG: OTP is ${data.debug.otp}`, { duration: 10000 })
        }

        // Show preview URL in console for testing
        if (data.previewUrl) {
          console.log('📧 Preview Email:', data.previewUrl)
        }
      }
    } catch (error) {
      console.error("❌ Request OTP error:", error)
      console.error("Error response:", error.response?.data)

      const data = error.response?.data;
      const errorMessage = data?.message || error.message || "Failed to send reset code. Please try again.";
      const diagnosticInfo = data?.errorCode ? ` [Code: ${data.errorCode}]` : '';

      toast.error(`${errorMessage}${diagnosticInfo}`);
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
      console.log('🔍 Verifying OTP...')
      console.log('Email:', formData.email)
      console.log('OTP:', formData.otp)

      const { data } = await axios.post(`${config.API_BASE_URL}/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp
      })

      console.log('📨 Verify response:', data)

      if (data.success) {
        toast.success(data.message)
        setFormData({ ...formData, resetToken: data.resetToken })
        setStep(3)
      }
    } catch (error) {
      console.error("❌ Verify OTP error:", error)
      console.error("Error response:", error.response?.data)

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
      console.log('🔄 Resending OTP...')

      const { data } = await axios.post(`${config.API_BASE_URL}/auth/resend-otp`, {
        email: formData.email
      })

      console.log('📨 Resend response:', data)

      if (data.success) {
        toast.success(data.message)
        setFormData({ ...formData, otp: "" })
        startCountdown()

        // Show debug info
        if (data.debug) {
          console.log('🔑 DEBUG - New OTP:', data.debug.otp)
          toast.success(`DEBUG: New OTP is ${data.debug.otp}`, { duration: 10000 })
        }

        if (data.previewUrl) {
          console.log('📧 Preview Email:', data.previewUrl)
        }
      }
    } catch (error) {
      console.error("❌ Resend OTP error:", error)
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
      console.log('🔒 Resetting password...')

      const { data } = await axios.post(`${config.API_BASE_URL}/auth/reset-password`, {
        resetToken: formData.resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      console.log('📨 Reset response:', data)

      if (data.success) {
        toast.success(data.message)
        setStep(4)

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      console.error("❌ Reset password error:", error)
      console.error("Error response:", error.response?.data)

      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again."
      toast.error(errorMessage)
      setErrors({ ...errors, password: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#3F3FF3" }}>
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">Reset Your Password</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Don't worry! It happens. Enter your email and we'll send you a code to reset your password.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 Spark Career Guidance</span>
            <span className="cursor-pointer hover:text-white/90">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Back to login */}
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-[#3F3FF3]" />
                </div>
                <h2 className="text-3xl text-foreground font-semibold">Forgot Password?</h2>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a code to reset your password.
                </p>
              </div>

              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] ${errors.email ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200 rounded-lg shadow-none cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-[#3F3FF3]" />
                </div>
                <h2 className="text-3xl text-foreground font-semibold">Verify Code</h2>
                <p className="text-muted-foreground">
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                    Enter 6-Digit Code
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="000000"
                    required
                    className={`h-12 text-center text-2xl tracking-widest border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] ${errors.otp ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.otp}</span>
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200 rounded-lg shadow-none cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    {countdown > 0 ? (
                      <span className="text-gray-400">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="font-medium text-[#3F3FF3] hover:text-[#2F2FD3]"
                      >
                        Resend Code
                      </button>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Change email address
                </button>
              </form>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-[#3F3FF3]" />
                </div>
                <h2 className="text-3xl text-foreground font-semibold">Create New Password</h2>
                <p className="text-muted-foreground">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      className={`h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] ${errors.password ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200 rounded-lg shadow-none cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl text-foreground font-semibold">Password Reset Successfully!</h2>
                <p className="text-muted-foreground">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full h-12 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200 rounded-lg shadow-none cursor-pointer"
                >
                  Go to Login
                </Button>
                <p className="text-sm text-gray-500">
                  Redirecting to login in 3 seconds...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}