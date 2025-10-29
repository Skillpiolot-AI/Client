
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { toast } from 'react-hot-toast';
// import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
// import config from '../../config';

// export default function SignupPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [form, setForm] = useState({
//     username: '',
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     newsletter: false,
//     subscription: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       if (form.password !== form.confirmPassword) {
//         throw new Error("Passwords don't match");
//       }
//       const { data } = await axios.post(`${config.API_BASE_URL}/auth/signup`, form);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('role', data.role);
//       toast.success("Account created successfully! Welcome to the Spark Career Guidance Portal.");
//       window.location.href = '/';
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message || "There was a problem with your request.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Left side with background and text */}
//       <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/api/placeholder/1200/800')"}}>
//         <div className="w-full flex flex-col justify-center items-center bg-black bg-opacity-50 p-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-white text-center"
//           >
//             <h1 className="text-4xl font-bold mb-4">Join Spark Career Guidance Portal</h1>
//             <p className="text-xl mb-8">Start Your Journey to Professional Success</p>
//             <ul className="text-left list-disc list-inside">
//               <li className="mb-2">Personalized career assessments</li>
//               <li className="mb-2">Connect with industry mentors</li>
//               <li className="mb-2">Access exclusive job listings</li>
//               <li>Continuous learning resources</li>
//             </ul>
//           </motion.div>
//         </div>
//       </div>

//       {/* Right side with signup form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md"
//         >
//           <Card className="bg-white shadow-xl border-t-4 border-indigo-600">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl font-bold text-gray-800">Create Your Account</CardTitle>
//               <CardDescription className="text-gray-600">Enter your information to join the Spark portal</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input id="username" name="username" placeholder="cooluser123" value={form.username} onChange={handleChange} required className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input id="name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input id="email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       value={form.password}
//                       onChange={handleChange}
//                       required
//                       className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOffIcon className="h-4 w-4 text-gray-500" />
//                       ) : (
//                         <EyeIcon className="h-4 w-4 text-gray-500" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={form.confirmPassword}
//                       onChange={handleChange}
//                       required
//                       className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOffIcon className="h-4 w-4 text-gray-500" />
//                       ) : (
//                         <EyeIcon className="h-4 w-4 text-gray-500" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="newsletter" name="newsletter" checked={form.newsletter} onChange={handleChange} />
//                   <Label htmlFor="newsletter" className="text-sm">Subscribe to newsletter</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="subscription" name="subscription" checked={form.subscription} onChange={handleChange} />
//                   <Label htmlFor="subscription" className="text-sm">Subscribe to premium plan</Label>
//                 </div>
//               </form>
//             </CardContent>
//             <CardFooter>
//               <Button 
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
//                 type="submit" 
//                 onClick={handleSubmit} 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Account...
//                   </>
//                 ) : (
//                   'Create Account'
//                 )}
//               </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Mail } from "lucide-react"
// import axios from "axios"
// import { toast } from "react-hot-toast"
// import config from "../../config"
// import { Link, useNavigate } from "react-router-dom"

// // Password strength calculator
// const getPasswordStrength = (password) => {
//   if (!password) return { strength: 0, label: "", color: "" }
  
//   let strength = 0
//   if (password.length >= 8) strength++
//   if (password.length >= 12) strength++
//   if (/[a-z]/.test(password)) strength++
//   if (/[A-Z]/.test(password)) strength++
//   if (/[0-9]/.test(password)) strength++
//   if (/[^a-zA-Z0-9]/.test(password)) strength++

//   if (strength <= 2) return { strength: 1, label: "Weak", color: "bg-red-500" }
//   if (strength <= 4) return { strength: 2, label: "Medium", color: "bg-yellow-500" }
//   return { strength: 3, label: "Strong", color: "bg-green-500" }
// }

// export default function SignupPage() {
//   const navigate = useNavigate()
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [signupSuccess, setSignupSuccess] = useState(false)
//   const [form, setForm] = useState({
//     username: "",
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     newsletter: false,
//     subscription: false,
//   })
//   const [errors, setErrors] = useState({
//     username: "",
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     general: ""
//   })
//   const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: "", color: "" })

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     const newValue = type === "checkbox" ? checked : value
    
//     setForm((prev) => ({ ...prev, [name]: newValue }))
    
//     // Clear error for this field
//     setErrors((prev) => ({ ...prev, [name]: "", general: "" }))
    
//     // Update password strength
//     if (name === "password") {
//       setPasswordStrength(getPasswordStrength(value))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}
//     let isValid = true

//     // Username validation
//     if (!form.username.trim()) {
//       newErrors.username = "Username is required"
//       isValid = false
//     } else if (form.username.length < 3) {
//       newErrors.username = "Username must be at least 3 characters"
//       isValid = false
//     } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
//       newErrors.username = "Username can only contain letters, numbers, and underscores"
//       isValid = false
//     }

//     // Name validation
//     if (!form.name.trim()) {
//       newErrors.name = "Full name is required"
//       isValid = false
//     } else if (form.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters"
//       isValid = false
//     }

//     // Email validation
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required"
//       isValid = false
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Please enter a valid email address"
//       isValid = false
//     }

//     // Password validation
//     if (!form.password) {
//       newErrors.password = "Password is required"
//       isValid = false
//     } else if (form.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters"
//       isValid = false
//     } else if (passwordStrength.strength === 1) {
//       newErrors.password = "Password is too weak. Add uppercase, numbers, or special characters"
//       isValid = false
//     }

//     // Confirm password validation
//     if (!form.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password"
//       isValid = false
//     } else if (form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//       isValid = false
//     }

//     setErrors(newErrors)
//     return isValid
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     // Clear previous errors
//     setErrors({})

//     // Validate form
//     if (!validateForm()) {
//       toast.error("Please fix the errors before submitting")
//       return
//     }

//     setIsLoading(true)

//     try {
//       console.log('📝 Submitting signup form...')
      
//       const { data } = await axios.post(`${config.API_BASE_URL}/auth/signup`, form)

//       console.log('✅ Signup response:', data)

//       if (data.success) {
//         setSignupSuccess(true)
//         toast.success(data.message || "Account created! Please check your email.")
        
//         // Don't store token yet - wait for email verification
//         // Just show success message
//       } else {
//         toast.error(data.message || "Signup failed")
//       }
//     } catch (error) {
//       console.error("❌ Signup error:", error.response?.data || error.message)
      
//       const errorResponse = error.response?.data
      
//       if (error.response?.status === 400) {
//         const message = errorResponse?.message || ""
        
//         if (message.includes("Email already registered")) {
//           setErrors({ ...errors, email: "This email is already registered" })
//           toast.error("Email already registered. Please login or use forgot password.")
//         } else if (message.includes("username already taken")) {
//           setErrors({ ...errors, username: "This username is already taken" })
//           toast.error("Username already taken. Please choose another.")
//         } else if (message.includes("Passwords do not match")) {
//           setErrors({ ...errors, confirmPassword: "Passwords do not match" })
//           toast.error("Passwords do not match")
//         } else {
//           setErrors({ ...errors, general: message })
//           toast.error(message)
//         }
//       } else {
//         const message = errorResponse?.message || "Signup failed. Please try again."
//         setErrors({ ...errors, general: message })
//         toast.error(message)
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Show success screen
//   if (signupSuccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//         <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 text-center space-y-6">
//           <div className="flex justify-center">
//             <div className="bg-green-100 p-4 rounded-full">
//               <CheckCircle className="h-16 w-16 text-green-600" />
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <h2 className="text-2xl font-bold text-gray-900">Check Your Email!</h2>
//             <p className="text-gray-600">
//               We've sent a verification link to <strong>{form.email}</strong>
//             </p>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//             <div className="flex items-start space-x-3">
//               <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <div className="text-sm text-blue-800">
//                 <p className="font-medium mb-1">Next Steps:</p>
//                 <ol className="list-decimal list-inside space-y-1">
//                   <li>Check your inbox for our verification email</li>
//                   <li>Click the verification link</li>
//                   <li>Return here to log in</li>
//                 </ol>
//               </div>
//             </div>
//           </div>

//           <div className="text-sm text-gray-600">
//             <p>Didn't receive the email?</p>
//             <button
//               onClick={() => {
//                 // Trigger resend verification
//                 axios.post(`${config.API_BASE_URL}/auth/resend-verification`, { email: form.email })
//                   .then(() => toast.success("Verification email resent!"))
//                   .catch(() => toast.error("Failed to resend email"))
//               }}
//               className="text-[#3F3FF3] hover:text-[#2F2FD3] font-medium"
//             >
//               Resend verification email
//             </button>
//           </div>

//           <Link to="/login" className="block">
//             <Button className="w-full bg-[#3F3FF3] hover:bg-[#2F2FD3]">
//               Go to Login
//             </Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex font-sans">
//       {/* Left side - Brand section */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#3F3FF3" }}>
//         <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
//           <div>
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
//                 <div className="w-6 h-6 bg-[#3F3FF3] rounded"></div>
//               </div>
//               <span className="text-2xl font-bold text-white">Spark</span>
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col justify-center">
//             <h2 className="text-4xl text-white mb-6 leading-tight font-bold">
//               Start Your Career Journey Today
//             </h2>
//             <p className="text-white/90 text-lg leading-relaxed mb-8">
//               Join thousands of professionals who have transformed their careers with Spark.
//             </p>
//             <ul className="space-y-3 text-white/90">
//               <li className="flex items-center">
//                 <CheckCircle className="h-5 w-5 mr-3" />
//                 <span>Personalized career assessments</span>
//               </li>
//               <li className="flex items-center">
//                 <CheckCircle className="h-5 w-5 mr-3" />
//                 <span>Connect with industry mentors</span>
//               </li>
//               <li className="flex items-center">
//                 <CheckCircle className="h-5 w-5 mr-3" />
//                 <span>Access exclusive job listings</span>
//               </li>
//               <li className="flex items-center">
//                 <CheckCircle className="h-5 w-5 mr-3" />
//                 <span>Continuous learning resources</span>
//               </li>
//             </ul>
//           </div>

//           <div className="flex justify-between items-center text-white/70 text-sm">
//             <span>Copyright © 2025 Spark Career Guidance</span>
//             <span className="cursor-pointer hover:text-white/90 transition-colors">Privacy Policy</span>
//           </div>
//         </div>
//       </div>

//       {/* Right side - Signup form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
//         <div className="w-full max-w-md space-y-6">
//           {/* Mobile logo */}
//           <div className="lg:hidden text-center">
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
//               style={{ backgroundColor: "#3F3FF3" }}
//             >
//               <div className="w-4 h-4 bg-white rounded-sm"></div>
//             </div>
//             <h1 className="text-xl font-semibold text-foreground">Spark</h1>
//           </div>

//           <div className="space-y-2 text-center">
//             <h2 className="text-3xl text-foreground font-semibold">Create Account</h2>
//             <p className="text-muted-foreground">Join our community today</p>
//           </div>

//           {/* General Error */}
//           {errors.general && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
//               <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-red-800">{errors.general}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Username */}
//             <div className="space-y-2">
//               <Label htmlFor="username" className="text-sm font-medium">
//                 Username
//               </Label>
//               <Input
//                 id="username"
//                 name="username"
//                 placeholder="cooluser123"
//                 value={form.username}
//                 onChange={handleChange}
//                 className={`h-12 ${errors.username ? 'border-red-300 focus:border-red-500' : ''}`}
//               />
//               {errors.username && (
//                 <p className="text-sm text-red-600 flex items-center space-x-1">
//                   <AlertCircle className="h-4 w-4" />
//                   <span>{errors.username}</span>
//                 </p>
//               )}
//             </div>

//             {/* Name */}
//             <div className="space-y-2">
//               <Label htmlFor="name" className="text-sm font-medium">
//                 Full Name
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="John Doe"
//                 value={form.name}
//                 onChange={handleChange}
//                 className={`h-12 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
//               />
//               {errors.name && (
//                 <p className="text-sm text-red-600 flex items-center space-x-1">
//                   <AlertCircle className="h-4 w-4" />
//                   <span>{errors.name}</span>
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 value={form.email}
//                 onChange={handleChange}
//                 className={`h-12 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-600 flex items-center space-x-1">
//                   <AlertCircle className="h-4 w-4" />
//                   <span>{errors.email}</span>
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={form.password}
//                   onChange={handleChange}
//                   className={`h-12 pr-10 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
              
//               {/* Password Strength */}
//               {form.password && (
//                 <div className="space-y-1">
//                   <div className="flex items-center space-x-2">
//                     <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div
//                         className={`h-full transition-all ${passwordStrength.color}`}
//                         style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
//                       />
//                     </div>
//                     <span className="text-xs font-medium">{passwordStrength.label}</span>
//                   </div>
//                 </div>
//               )}
              
//               {errors.password && (
//                 <p className="text-sm text-red-600 flex items-center space-x-1">
//                   <AlertCircle className="h-4 w-4" />
//                   <span>{errors.password}</span>
//                 </p>
//               )}
              
//               <p className="text-xs text-gray-600">
//                 At least 6 characters. Use uppercase, numbers, and symbols for a stronger password.
//               </p>
//             </div>

//             {/* Confirm Password */}
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword" className="text-sm font-medium">
//                 Confirm Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   className={`h-12 pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-sm text-red-600 flex items-center space-x-1">
//                   <AlertCircle className="h-4 w-4" />
//                   <span>{errors.confirmPassword}</span>
//                 </p>
//               )}
//             </div>

//             {/* Checkboxes */}
//             <div className="space-y-3">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="newsletter"
//                   checked={form.newsletter}
//                   onCheckedChange={(checked) => setForm({ ...form, newsletter: checked })}
//                 />
//                 <Label htmlFor="newsletter" className="text-sm cursor-pointer">
//                   Subscribe to newsletter for updates
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="subscription"
//                   checked={form.subscription}
//                   onCheckedChange={(checked) => setForm({ ...form, subscription: checked })}
//                 />
//                 <Label htmlFor="subscription" className="text-sm cursor-pointer">
//                   Subscribe to premium plan (optional)
//                 </Label>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 bg-[#3F3FF3] hover:bg-[#2F2FD3]"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating Account...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </Button>
//           </form>

//           {/* Login Link */}
//           <div className="text-center text-sm">
//             <span className="text-muted-foreground">Already have an account? </span>
//             <Link to="/login" className="font-medium text-[#3F3FF3] hover:text-[#2F2FD3]">
//               Log in
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// SignupPage.jsx - Complete with Google OAuth and Email Verification
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

// Replace with your actual Google Client ID from .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "860946075972-h9p02v2019ad2n7rfco6dkil6resstqk.apps.googleusercontent.com";
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
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

  // Handle regular signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Signup successful:', data);
        
        // Show success message
        setShowSuccessMessage(true);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to verify email page after 3 seconds
        setTimeout(() => {
          navigate('/verify-email', { 
            state: { 
              email: data.user?.email,
              message: 'Please check your email to verify your account.' 
            } 
          });
        }, 3000);
      } else {
        setErrors({ submit: data.message || 'Signup failed' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);

    try {
      console.log('🔐 Google credential received');
      
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();
      console.log('📦 Response:', data);

      if (response.ok) {
        // Check if email verification is required
        if (data.requiresVerification) {
          console.log('📧 Email verification required');
          
          // Show success message
          setShowSuccessMessage(true);
          
          // Redirect to verify email page
          setTimeout(() => {
            navigate('/verify-email', { 
              state: { 
                email: data.user?.email,
                message: data.message || 'Please check your email to verify your account.',
                fromGoogle: true
              } 
            });
          }, 3000);
        } else {
          // User already exists and is verified - login successful
          console.log('✅ Login successful');
          
          // Store token
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Navigate to dashboard
          navigate('/dashboard');
        }
      } else {
        // Handle specific error codes
        if (data.errorCode === 'EMAIL_NOT_VERIFIED') {
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
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup failure
  const handleGoogleError = () => {
    console.error('❌ Google signup failed');
    setErrors({ submit: 'Google signup failed. Please try again.' });
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success Message */}
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

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
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

            {/* Signup Form */}
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
    </GoogleOAuthProvider>
  );
}

export default SignupPage;