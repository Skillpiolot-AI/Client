import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, Sparkles, School, MapPin, 
  TrendingUp, Briefcase, Heart, ChevronLeft, BarChart2, 
  Code, Coffee, Zap, DollarSign
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Dummy data
const dummyJob = {
  jobTitle: "Software Engineer",
  averageSalary: "$95,000",
  description: "Design, develop, and maintain software applications using various programming languages and frameworks.",
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Git"],
  topColleges: [
    { name: "MIT", fees: "$50,000/year", duration: "4 years" },
    { name: "Stanford", fees: "$52,000/year", duration: "4 years" },
    { name: "Carnegie Mellon", fees: "$55,000/year", duration: "4 years" },
    { name: "UC Berkeley", fees: "$45,000/year", duration: "4 years" },
    { name: "Georgia Tech", fees: "$40,000/year", duration: "4 years" },
  ],
  salaryTrends: [
    { year: 2018, salary: 75000 },
    { year: 2019, salary: 80000 },
    { year: 2020, salary: 85000 },
    { year: 2021, salary: 90000 },
    { year: 2022, salary: 95000 },
  ],
  hiringTrends: [
    { year: 2018, hires: 50000 },
    { year: 2019, hires: 55000 },
    { year: 2020, hires: 60000 },
    { year: 2021, hires: 65000 },
    { year: 2022, hires: 70000 },
  ],
  workEnvironment: "Software engineers typically work in office settings, with opportunities for remote work. They collaborate with cross-functional teams and often work on projects with tight deadlines.",
  challenges: [
    "Keeping up with rapidly evolving technologies",
    "Debugging complex issues",
    "Balancing technical debt with new feature development",
    "Estimating project timelines accurately",
  ],
  rewards: [
    "Competitive salaries and bonuses",
    "Opportunities for career growth and learning",
    "Solving interesting technical problems",
    "Creating impactful products used by millions",
  ],
};

const DummyJobInfo = () => {
  const navigate = useNavigate();
  const job = dummyJob;

  const renderSkills = () => {
    return (
      <ul className="grid grid-cols-2 gap-4">
        {job.skills.map((skill, index) => (
          <li key={index} className="flex items-center space-x-3 mb-3">
            <Code className="h-5 w-5 text-indigo-500" />
            <span className="text-lg">{skill}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderEducation = () => {
    return (
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {job.topColleges.map((edu, index) => (
            <Card key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold mb-2 text-indigo-700">{edu.name}</h4>
              <p className="text-lg text-gray-700">Fees: <span className="font-semibold">{edu.fees}</span></p>
              <p className="text-lg text-gray-700">Duration: <span className="font-semibold">{edu.duration}</span></p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const renderSalaryTrends = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="hover:bg-indigo-100 text-indigo-700 border-indigo-300">
            <ChevronLeft className="mr-2 h-5 w-5" /> Back to Jobs
          </Button>
          <h1 className="text-4xl font-extrabold text-indigo-800">{job.jobTitle}</h1>
          <div className="text-2xl font-semibold text-indigo-700">
            Average Salary: {job.averageSalary}
          </div>
        </div>

        <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start p-2 bg-indigo-50">
                <TabsTrigger value="overview" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Overview</TabsTrigger>
                <TabsTrigger value="education" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Education</TabsTrigger>
                <TabsTrigger value="trends" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Trends</TabsTrigger>
                <TabsTrigger value="details" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Details</TabsTrigger>
              </TabsList>

              <div className="p-8">
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <BookOpen className="mr-3 h-8 w-8" /> Job Description
                      </h3>
                      <p className="text-xl leading-relaxed text-gray-700">{job.description}</p>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <Sparkles className="mr-3 h-8 w-8" /> Key Skills
                      </h3>
                      {renderSkills()}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="education">
                  <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                    <School className="mr-3 h-8 w-8" /> Top Colleges
                  </h3>
                  {renderEducation()}
                </TabsContent>

                <TabsContent value="trends">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <DollarSign className="mr-3 h-8 w-8" /> Salary Trends
                      </h3>
                      {renderSalaryTrends()}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <BarChart2 className="mr-3 h-8 w-8" /> Hiring Trends
                      </h3>
                      {renderHiringTrends()}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <MapPin className="mr-3 h-8 w-8" /> Work Environment
                      </h3>
                      <p className="text-xl leading-relaxed text-gray-700">{job.workEnvironment}</p>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <Briefcase className="mr-3 h-8 w-8" /> Challenges
                      </h3>
                      <ul className="space-y-2">
                        {job.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-center space-x-3 mb-3">
                            <Coffee className="h-5 w-5 text-indigo-500" />
                            <span className="text-lg">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold flex items-center text-indigo-700 mb-4">
                        <Heart className="mr-3 h-8 w-8" /> Rewards
                      </h3>
                      <ul className="space-y-2">
                        {job.rewards.map((reward, index) => (
                          <li key={index} className="flex items-center space-x-3 mb-3">
                            <Zap className="h-5 w-5 text-indigo-500" />
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

export default DummyJobInfo;