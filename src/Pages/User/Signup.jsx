
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import config from '../../config';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    subscription: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (form.password !== form.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      const { data } = await axios.post(`${config.API_BASE_URL}/auth/signup`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      toast.success("Account created successfully! Welcome to the Spark Career Guidance Portal.");
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "There was a problem with your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left side with background and text */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/api/placeholder/1200/800')"}}>
        <div className="w-full flex flex-col justify-center items-center bg-black bg-opacity-50 p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Join Spark Career Guidance Portal</h1>
            <p className="text-xl mb-8">Start Your Journey to Professional Success</p>
            <ul className="text-left list-disc list-inside">
              <li className="mb-2">Personalized career assessments</li>
              <li className="mb-2">Connect with industry mentors</li>
              <li className="mb-2">Access exclusive job listings</li>
              <li>Continuous learning resources</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white shadow-xl border-t-4 border-indigo-600">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-800">Create Your Account</CardTitle>
              <CardDescription className="text-gray-600">Enter your information to join the Spark portal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" placeholder="cooluser123" value={form.username} onChange={handleChange} required className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" name="newsletter" checked={form.newsletter} onChange={handleChange} />
                  <Label htmlFor="newsletter" className="text-sm">Subscribe to newsletter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="subscription" name="subscription" checked={form.subscription} onChange={handleChange} />
                  <Label htmlFor="subscription" className="text-sm">Subscribe to premium plan</Label>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                type="submit" 
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}