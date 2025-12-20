"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import config from "../../config"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function ChangePassword() {
    const navigate = useNavigate()
    const location = useLocation()

    // Starting directly at step 2 (OTP) since email is passed from Profile
    const [step, setStep] = useState(2) // 2: OTP, 3: New Password, 4: Success
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [countdown, setCountdown] = useState(0)

    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
        resetToken: ""
    })

    const [errors, setErrors] = useState({
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

    // Auto-start countdown on mount since we start at step 2
    useEffect(() => {
        if (!formData.email) {
            toast.error("Session expired or invalid access. Please try again from profile.")
            navigate('/profile')
            return
        }
        startCountdown()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: "" }))
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
            const { data } = await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
                email: formData.email
            })

            if (data.success) {
                toast.success("New verification code sent to your email")
                setFormData({ ...formData, otp: "" })
                startCountdown()
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
                toast.success("Password changed successfully")
                setStep(4)

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate('/profile')
                }, 3000)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to change password. Please try again."
            toast.error(errorMessage)
            setErrors({ ...errors, password: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#6366F1" }}>
                <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
                    <div className="flex-1 flex flex-col justify-center text-white">
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Secure Your Account</h2>
                        <p className="text-white/90 text-lg leading-relaxed mb-8">
                            Changing your password regularly helps keep your account and personal information safe.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <span>OTP-verified security</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <span>Encrypted password storage</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-white/70 text-sm">
                        <span>Copyright © 2025 SkillPilot AI</span>
                        <span className="cursor-pointer hover:text-white/90">Support</span>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Back link */}
                    <Link
                        to="/profile"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Profile
                    </Link>

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="h-8 w-8 text-[#6366F1]" />
                                </div>
                                <h2 className="text-3xl text-foreground font-semibold">Change Password</h2>
                                <p className="text-muted-foreground">
                                    A 6-digit verification code has been sent to <strong>{formData.email}</strong>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                                        Verification Code
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
                                        className={`h-12 text-center text-2xl tracking-widest border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#6366F1] ${errors.otp ? 'border-red-300 focus:border-red-500' : ''
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
                                    className="w-full h-12 text-sm font-medium text-white rounded-lg shadow-none cursor-pointer bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200"
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
                                                className="font-medium text-[#6366F1] hover:text-[#4F46E5]"
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="h-8 w-8 text-[#6366F1]" />
                                </div>
                                <h2 className="text-3xl text-foreground font-semibold">New Password</h2>
                                <p className="text-muted-foreground">
                                    Please enter a new secure password for your account.
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
                                            className={`h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#6366F1] ${errors.password ? 'border-red-300 focus:border-red-500' : ''
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
                                            className={`h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#6366F1] ${errors.password ? 'border-red-300 focus:border-red-500' : ''
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

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-sm font-medium text-white rounded-lg shadow-none cursor-pointer bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
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
                                <h2 className="text-3xl text-foreground font-semibold">Success!</h2>
                                <p className="text-muted-foreground">
                                    Your password has been changed successfully.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate('/profile')}
                                    className="w-full h-12 text-sm font-medium text-white rounded-lg shadow-none cursor-pointer bg-[#6366F1] hover:bg-[#4F46E5] transition-all duration-200"
                                >
                                    Back to Profile
                                </Button>
                                <p className="text-sm text-gray-500">
                                    Redirecting to profile in 3 seconds...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
