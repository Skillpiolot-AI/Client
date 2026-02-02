
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BookOpen, Sparkles, Building, DollarSign, School, MapPin, 
  TrendingUp, Briefcase, Heart, ChevronLeft, BarChart2, 
  Code, Coffee, Zap, Clock, Users, Award
} from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

export default function JobDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (location.state && location.state.job) {
      setJob(location.state.job)
    } else {
      setError("Job details not found. Please try selecting a job again.")
    }
  }, [location])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
              <p>{error}</p>
              <Button onClick={() => navigate(-1)} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const TabContent = ({ icon: Icon, title, children }) => (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold flex items-center text-indigo-700">
        <Icon className="mr-3 h-8 w-8" /> {title}
      </h3>
      {children}
    </div>
  )

  const ListItem = ({ icon: Icon, children }) => (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-3 mb-3"
    >
      <Icon className="h-5 w-5 text-indigo-500" />
      <span className="text-lg">{children}</span>
    </motion.li>
  )

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start p-2 bg-indigo-50">
                <TabsTrigger value="overview" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Overview</TabsTrigger>
                <TabsTrigger value="education" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Education</TabsTrigger>
                <TabsTrigger value="trends" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Trends</TabsTrigger>
                <TabsTrigger value="details" className="text-lg px-6 py-3 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Details</TabsTrigger>
              </TabsList>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-10"
                  >
                    <TabsContent value="overview">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TabContent icon={BookOpen} title="Job Description">
                          <p className="text-xl leading-relaxed text-gray-700">{job.description}</p>
                        </TabContent>
                        <TabContent icon={Sparkles} title="Key Skills">
                          <ul className="grid grid-cols-2 gap-4">
                            {job.skills && job.skills.map((skill, index) => (
                              <ListItem key={index} icon={Code}>{skill}</ListItem>
                            ))}
                          </ul>
                        </TabContent>
                        <TabContent icon={Building} title="Top Companies">
                          <ul className="grid grid-cols-2 gap-4">
                            {job.companies && job.companies.map((company, index) => (
                              <ListItem key={index} icon={Building}>{company}</ListItem>
                            ))}
                          </ul>
                        </TabContent>
                        <TabContent icon={School} title="Required Education">
                          <ul className="grid grid-cols-1 gap-4">
                            {job.education && job.education.map((edu, index) => (
                              <ListItem key={index} icon={Award}>{edu}</ListItem>
                            ))}
                          </ul>
                        </TabContent>
                      </div>
                    </TabsContent>
                    <TabsContent value="education">
                      <TabContent icon={School} title="Top Colleges">
                        <ScrollArea className="h-[600px] pr-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {job.topColleges && job.topColleges.map((college, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                              >
                                <h4 className="text-xl font-bold mb-2 text-indigo-700">{college.name}</h4>
                                <p className="text-lg text-gray-700">Fees: <span className="font-semibold">{college.fees}</span></p>
                                <p className="text-lg text-gray-700">Duration: <span className="font-semibold">{college.duration}</span></p>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabContent>
                    </TabsContent>
                    <TabsContent value="trends">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TabContent icon={DollarSign} title="Salary Trends">
                          {job.salaryTrends && job.salaryTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                              <AreaChart data={job.salaryTrends}>
                                <defs>
                                  <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="salary" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSalary)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : (
                            <p className="text-lg text-gray-700">No salary trend data available.</p>
                          )}
                        </TabContent>
                        <TabContent icon={BarChart2} title="Hiring Trends">
                          {job.hiringTrends && job.hiringTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                              <AreaChart data={job.hiringTrends}>
                                <defs>
                                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="hires" stroke="#10B981" fillOpacity={1} fill="url(#colorHires)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          ) : (
                            <p className="text-lg text-gray-700">No hiring trend data available.</p>
                          )}
                        </TabContent>
                      </div>
                    </TabsContent>
                    <TabsContent value="details">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TabContent icon={MapPin} title="Work Environment">
                          <p className="text-xl leading-relaxed text-gray-700">{job.workEnvironment}</p>
                        </TabContent>
                        <TabContent icon={TrendingUp} title="Job Outlook">
                          <p className="text-xl leading-relaxed text-gray-700">{job.jobOutlook}</p>
                        </TabContent>
                        <TabContent icon={Briefcase} title="Challenges">
                          <ul className="space-y-2">
                            {job.challenges && job.challenges.map((challenge, index) => (
                              <ListItem key={index} icon={Coffee}>{challenge}</ListItem>
                            ))}
                          </ul>
                        </TabContent>
                        <TabContent icon={Heart} title="Rewards">
                          <ul className="space-y-2">
                            {job.rewards && job.rewards.map((reward, index) => (
                              <ListItem key={index} icon={Zap}>{reward}</ListItem>
                            ))}
                          </ul>
                        </TabContent>
                        <TabContent icon={Clock} title="Work-Life Balance">
                          <p className="text-xl leading-relaxed text-gray-700">{job.workLifeBalance}</p>
                        </TabContent>
                        <TabContent icon={Users} title="Team Dynamics">
                          <p className="text-xl leading-relaxed text-gray-700">{job.teamDynamics}</p>
                        </TabContent>
                      </div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}