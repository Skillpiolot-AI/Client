

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import axios from 'axios'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
// import { Bold, EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
// import config from '../../config'
// import { toast } from 'react-hot-toast'

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showCredentials, setShowCredentials] = useState(false)
//   const [form, setForm] = useState({
//     username: '',
//     password: ''
//   })
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [role, setRole] = useState('')

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const userRole = localStorage.getItem('role')
//     if (token && userRole) {
//       setIsAuthenticated(true)
//       setRole(userRole)
//       // Redirect if already authenticated
//       redirectBasedOnRole(userRole)
//     }
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   const redirectBasedOnRole = (userRole) => {
//     console.log('Redirecting user with role:', userRole)
    
//     switch(userRole) {
//       case 'Admin':
//         window.location.href = '/amdashboard'
//         break
//       case 'UniAdmin':
//         window.location.href = '/uniAdminPortal'
//         break
//       case 'UniTeach':
//         window.location.href = '/teacher/dashboard' // You'll need to create this route
//         break
//       case 'Mentor':
//         window.location.href = '/mentorDashboard'
//         break
//       case 'User':
//       default:
//         window.location.href = '/'
//         break
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
    
//     try {
//       const { data } = await axios.post(`${config.API_BASE_URL}/auth/login`, form)
      
//       console.log('Login response:', data)
      
//       // Store authentication data
//       localStorage.setItem('token', data.token)
//       localStorage.setItem('role', data.role)
      
//       // Store additional user data if needed
//       if (data.user) {
//         localStorage.setItem('user', JSON.stringify(data.user))
//       }
      
//       setIsAuthenticated(true)
//       setRole(data.role)
      
//       // Show success message with user info
//       const welcomeMessage = data.user?.universityName 
//         ? `Welcome to ${data.user.universityName}!`
//         : "Welcome to the Spark Career Guidance Portal!"
      
//       toast.success(welcomeMessage)
      
//       // Redirect based on role with a small delay to ensure localStorage is updated
//       setTimeout(() => {
//         redirectBasedOnRole(data.role)
//       }, 100)
      
//     } catch (error) {
//       // Handle and display the specific error from the backend
//       const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials and try again."
//       toast.error(errorMessage)
//       console.error("Login error:", error.response?.data || error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Left side with background and text */}
//       <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/login.jpg')"}}>
//         <div className="w-full flex flex-col justify-center items-center bg-opacity-50 p-12">
//         </div>
//       </div>

//       {/* Right side with login form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md"
//         >
//           <Card className="bg-white shadow-xl border-t-4 border-indigo-600">
//             <CardHeader className="space-y-1">
//               <CardTitle className="text-2xl font-bold text-gray-800">Login to Your Account</CardTitle>
//               <CardDescription className="text-gray-600">
//                 Enter your username, email, or registration number to access the portal
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="username" className="text-gray-700">
//                     Username / Email / Registration Number
//                   </Label>
//                   <Input
//                     id="username"
//                     name="username"
//                     value={form.username}
//                     onChange={handleChange}
//                     placeholder="Enter your username, email, or registration number"
//                     required
//                     className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-gray-700">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       value={form.password}
//                       onChange={handleChange}
//                       placeholder="Enter your password"
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
//               </form>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4">
//               <Button 
//                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
//                 type="submit" 
//                 onClick={handleSubmit} 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   'Login'
//                 )}
//               </Button>
//               <Button 
//                 className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800" 
//                 type="button" 
//                 onClick={() => setShowCredentials(!showCredentials)}
//               >
//                 {showCredentials ? 'Hide Credentials' : 'Show Test Credentials'}
//               </Button>
//               {showCredentials && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-4 text-sm text-gray-800 bg-gray-100 p-4 rounded-md"
//                 >
//                   <div className="font-bold text-red-600">For testing purposes only:</div>
//                   <div>
//                     <strong>User:</strong> x<br />
//                     <strong>Password:</strong> x
//                   </div>
//                   <div>
//                     <strong>Mentor:</strong> xyzz<br />
//                     <strong>Password:</strong> xyzz
//                   </div>
//                   <div>
//                     <strong>Admin:</strong> xyz<br />
//                     <strong>Password:</strong> xyz
//                   </div>
//                   <div className="text-blue-600">
//                     <strong>University Users:</strong><br />
//                     Use your gmail or registration number provided by your university admin
//                   </div>
//                   <div>You can create your own account ❤️</div>
//                 </motion.div>
//               )}
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import config from "../../config"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: "",
    password: "",
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("role")
    if (token && userRole) {
      setIsAuthenticated(true)
      setRole(userRole)
      redirectBasedOnRole(userRole)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const redirectBasedOnRole = (userRole) => {
    console.log("Redirecting user with role:", userRole)

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
        window.location.href = "/mentorDashboard"
        break
      case "User":
      default:
        window.location.href = "/"
        break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/login`, form)

      console.log("Login response:", data)

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      setIsAuthenticated(true)
      setRole(data.role)

      const welcomeMessage = data.user?.universityName
        ? `Welcome to ${data.user.universityName}!`
        : "Welcome to the Spark Career Guidance Portal!"

      toast.success(welcomeMessage)

      setTimeout(() => {
        redirectBasedOnRole(data.role)
      }, 100)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials and try again."
      toast.error(errorMessage)
      console.error("Login error:", error.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#3F3FF3" }}>
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#3F3FF3" }}></div>
            </div>
            <h1 className="text-xl font-semibold text-white">Spark</h1>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">Effortlessly manage your career guidance.</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Log in to access your portal and manage your career path.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 Spark Career Guidance</span>
            <span className="cursor-pointer hover:text-white/90">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "#3F3FF3" }}
            >
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Spark</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl text-foreground font-semibold">Welcome Back</h2>
              <p className="text-muted-foreground">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]"
                />
              </div>

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
                    className="h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]"
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer"
                style={{ backgroundColor: "#3F3FF3" }}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
