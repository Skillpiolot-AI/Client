import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import config from '../../config';
import { toast } from 'react-hot-toast';

export default function MentorRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    companiesJoined: [],
    experience: '',
    password: '',
    username: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchJobTitles();
    fetchCompanies();
  }, []);

  const fetchJobTitles = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/job/job-titles`);
      setJobTitles(response.data);
    } catch (error) {
      console.error('Error fetching job titles:', error);
      toast.error("Failed to load job titles. Please try again.");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/job/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error("Failed to load companies. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleJobTitleChange = (value) => {
    setForm(prev => ({ ...prev, jobTitle: value }));
  };

  const handleCompanyChange = (companyName) => {
    setForm(prev => ({
      ...prev,
      companiesJoined: prev.companiesJoined.includes(companyName)
        ? prev.companiesJoined.filter(company => company !== companyName)
        : [...prev.companiesJoined, companyName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${config.API_BASE_URL}/register-mentor`, form);
      toast.success("Mentor registered successfully! Check your email for details.");
      setForm({
        name: '',
        email: '',
        phoneNumber: '',
        jobTitle: '',
        companiesJoined: [],
        experience: '',
        password: '',
        username: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error during mentor registration:', error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-800">Register as a Mentor</CardTitle>
          <CardDescription className="text-gray-600">Fill in your details to register as a mentor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-gray-700">Job Title</Label>
              <Select onValueChange={handleJobTitleChange} value={form.jobTitle}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a job title" />
                </SelectTrigger>
                <SelectContent>
                  {jobTitles.map(title => (
                    <SelectItem key={title._id} value={title.title}>{title.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companiesJoined" className="text-gray-700">Companies Joined</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white">
                {companies.map(company => (
                  <Button
                    key={company._id}
                    type="button"
                    variant={form.companiesJoined.includes(company.name) ? "default" : "outline"}
                    onClick={() => handleCompanyChange(company.name)}
                    className="m-1 text-sm"
                  >
                    {company.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700">Experience (years)</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="1"
                max="50"
                value={form.experience}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-gray-700">Profile Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/profile-image.jpg"
                className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
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
                Registering...
              </>
            ) : (
              'Register as Mentor'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
