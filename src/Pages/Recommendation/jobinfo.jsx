import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import config from '../../config'
import { 
  BookOpen, Sparkles, Building, DollarSign, School, MapPin, 
  TrendingUp, Briefcase, Heart, ChevronLeft, BarChart2, 
  Code, Coffee, Zap, Clock, Users, Award, Loader
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const JobInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const jobTitle = location.state?.jobTitle;

  useEffect(() => {
    if (jobTitle) {
      fetchJobDetails(jobTitle);
    }
  }, [jobTitle]);

  const fetchJobDetails = async (title) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/job-info/${title}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-16 w-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
              <p>Job details not found. Please try selecting a job again.</p>
              <Button onClick={() => navigate(-1)} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderSkills = () => {
    if (!job.skills || job.skills.length === 0) {
      return <p>No skills information available.</p>;
    }
    return (
      <ul className="grid grid-cols-2 gap-4">
        {job.skills.map((skill, index) => (
          <li key={index} className="flex items-center space-x-3 mb-3">
            <Code className="h-5 w-5 text-gray-500" />
            <span className="text-lg">{skill}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderEducation = () => {
    if (!job.topColleges || job.topColleges.length === 0) {
      return <p>No education information available.</p>;
    }
    return (
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {job.topColleges.map((edu, index) => (
            <Card key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold mb-2 text-gray-700">{edu.name}</h4>
              <p className="text-lg text-gray-700">Fees: <span className="font-semibold">{edu.fees}</span></p>
              <p className="text-lg text-gray-700">Duration: <span className="font-semibold">{edu.duration}</span></p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const renderSalaryTrends = () => {
    if (!job.salaryTrends || job.salaryTrends.length === 0) {
      return <p>No salary trend data available.</p>;
    }
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={job.salaryTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="salary" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderHiringTrends = () => {
    if (!job.hiringTrends || job.hiringTrends.length === 0) {
      return <p>No hiring trend data available.</p>;
    }
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={job.hiringTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="hires" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="hover:bg-indigo-100 text-gray-700 border-indigo-300">
            <ChevronLeft className="mr-2 h-5 w-5" /> Back to Jobs
          </Button>
          <h1 className="text-4xl font-extrabold text-gray-800">{job.jobTitle}</h1>
          <div className="text-2xl font-semibold text-gray-700">
            Average Salary: {job.averageSalary}
          </div>
        </div>

        <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start p-2 bg-grays-50">
                <TabsTrigger value="overview" className="text-lg px-6 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">Overview</TabsTrigger>
                <TabsTrigger value="education" className="text-lg px-6 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">Education</TabsTrigger>
                <TabsTrigger value="trends" className="text-lg px-6 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">Trends</TabsTrigger>
                <TabsTrigger value="details" className="text-lg px-6 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">Details</TabsTrigger>
              </TabsList>

              <div className="p-8">
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <BookOpen className="mr-3 h-8 w-8" /> Job Description
                      </h3>
                      <p className="text-xl leading-relaxed text-gray-700">{job.description || 'No job description available.'}</p>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <Sparkles className="mr-3 h-8 w-8" /> Key Skills
                      </h3>
                      {renderSkills()}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="education">
                  <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                    <School className="mr-3 h-8 w-8" /> Top Colleges
                  </h3>
                  {renderEducation()}
                </TabsContent>

                <TabsContent value="trends">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <DollarSign className="mr-3 h-8 w-8" /> Salary Trends
                      </h3>
                      {renderSalaryTrends()}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <BarChart2 className="mr-3 h-8 w-8" /> Hiring Trends
                      </h3>
                      {renderHiringTrends()}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <MapPin className="mr-3 h-8 w-8" /> Work Environment
                      </h3>
                      <p className="text-xl leading-relaxed text-gray-700">{job.workEnvironment || 'No work environment information available.'}</p>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <Briefcase className="mr-3 h-8 w-8" /> Challenges
                      </h3>
                      <ul className="space-y-2">
                        {job.challenges && job.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-center space-x-3 mb-3">
                            <Coffee className="h-5 w-5 text-gray-500" />
                            <span className="text-lg">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-gray-700 mb-4">
                        <Heart className="mr-3 h-8 w-8" /> Rewards
                      </h3>
                      <ul className="space-y-2">
                        {job.rewards && job.rewards.map((reward, index) => (
                          <li key={index} className="flex items-center space-x-3 mb-3">
                            <Zap className="h-5 w-5 text-gray-500" />
                            <span className="text-lg">{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobInfo;