
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Bold, EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import config from '../../config'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: ''
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')
    if (token && userRole) {
      setIsAuthenticated(true)
      setRole(userRole)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/login`, form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      setIsAuthenticated(true)
      setRole(data.role)
      toast.success("Login successful! Welcome to the Spark Career Guidance Portal.")
      
      // Redirect based on role
      if (data.role === 'Mentor' || data.role === 'Admin') {
        window.location.href = '/amdashboard'
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      // Handle and display the specific error from the backend
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials and try again."
      toast.error(errorMessage)
      console.error("Login error:", error.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left side with background and text */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/login.jpg')"}}>
        <div className="w-full flex flex-col justify-center items-center  bg-opacity-50 p-12">
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white shadow-xl border-t-4 border-indigo-600">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-800">Login to Your Account</CardTitle>
              <CardDescription className="text-gray-600">Enter your credentials to access the Spark portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                type="submit" 
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
              <Button 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800" 
                type="button" 
                onClick={() => setShowCredentials(!showCredentials)}
              >
                {showCredentials ? 'Hide Credentials' : 'Show Test Credentials'}
              </Button>
              {showCredentials && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-sm text-gray-800 bg-gray-100 p-4 rounded-md"
                >
                  <div className="font-bold text-red-600">For testing purposes only:</div>
                  <div>
                    <strong>User:</strong> x<br />
                    <strong>Password:</strong> x
                  </div>
                  <div>
                    <strong>Mentor:</strong> xyzz<br />
                    <strong>Password:</strong> xyzz
                  </div>
                  <div>
                    <strong>Admin:</strong> xyz<br />
                    <strong>Password:</strong> xyz
                  </div>
                  <div>You can create your own account ❤️</div>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}