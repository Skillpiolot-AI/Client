import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, ChevronDown, Clock, FileText, Heart, LayoutDashboard, MessageSquare, PieChart, Search, Settings, Share2, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const trainingData = [
  { name: 'Jan', courses: 4 },
  { name: 'Feb', courses: 3 },
  { name: 'Mar', courses: 5 },
  { name: 'Apr', courses: 7 },
  { name: 'May', courses: 2 },
  { name: 'Jun', courses: 6 },
]

const teamMembers = [
  { name: 'Emma Watson', role: 'UI Designer', status: 'Absent' },
  { name: 'Walter White', role: 'Backend Developer', status: 'Away' },
  { name: 'Dwayne Johnson', role: 'DevOps Engineer', status: 'Available' },
]

export default function AdminDashboard() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    let interval
    if (isTracking) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newSeconds = prevTime.seconds + 1
          const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60)
          const newHours = prevTime.hours + Math.floor(newMinutes / 60)
          return {
            hours: newHours % 24,
            minutes: newMinutes % 60,
            seconds: newSeconds % 60
          }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking])

   const formatTime = (time) => {
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`
  }
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white p-6 flex flex-col shadow-lg"
      >
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3">
            G
          </div>
          <div>
            <h2 className="font-bold text-xl">Admin</h2>
            <p className="text-gray-500 text-sm">Skill Pilot</p>
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li><a href="#" className="flex items-center text-purple-500 hover:bg-purple-50 p-2 rounded-md transition-colors"><LayoutDashboard className="mr-3" /> Dashboard</a></li>
            <li><a href="#" className="flex items-center text-gray-500 hover:bg-purple-50 p-2 rounded-md transition-colors"><Users className="mr-3" /> Teams</a></li>
            <li><a href="#" className="flex items-center text-gray-500 hover:bg-purple-50 p-2 rounded-md transition-colors"><PieChart className="mr-3" /> Integrations</a></li>
            <li><a href="#" className="flex items-center text-gray-500 hover:bg-purple-50 p-2 rounded-md transition-colors"><Calendar className="mr-3" /> Calendar</a></li>
            <li><a href="#" className="flex items-center text-gray-500 hover:bg-purple-50 p-2 rounded-md transition-colors"><Clock className="mr-3" /> Time Off</a></li>
            <li><a href="#" className="flex items-center text-gray-500 hover:bg-purple-50 p-2 rounded-md transition-colors"><FileText className="mr-3" /> Projects</a></li>
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium">Steve Jobs</p>
              <p className="text-sm text-gray-500">steve@apple.com</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Steve Jobs</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="text" placeholder="Search..." className="w-64" />
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline">Schedule</Button>
            <Button>+ Create request</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {/* Training Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Training Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">12 courses</div>
              <div className="text-sm text-gray-500 mb-4">Completed in this quarter</div>
              <div className="flex space-x-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trainingData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="courses" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Time Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">App Design</div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-4xl font-bold mb-4">{formatTime(time)}</div>
              <Button className="w-full" onClick={() => setIsTracking(!isTracking)}>
                {isTracking ? 'Stop Time Tracker' : 'Start Time Tracker'}
              </Button>
              <div className="mt-4">
                <div className="font-semibold mb-2">Previous Tasks</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <PieChart className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium">Loom recording</div>
                      <div className="text-sm text-gray-500">03:45</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Tracker */}
          <Card>
            <CardHeader>
              <CardTitle> Meeting Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${member.name.charAt(0)}`} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </div>
                    <div className="ml-auto">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        member.status === 'Absent' ? 'bg-red-100 text-red-800' :
                        member.status === 'Away' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 mr-4">
                  <Progress value={65} className="h-full w-full" />
                </div>
                <div>
                  <h3 className="font-semibold">User experience Training</h3>
                  <p className="text-sm text-gray-500">Designed for frontend developer to understand user behaviour.</p>
                  <a href="#" className="text-purple-500 text-sm">Resume Course</a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Spotlight */}
          <Card>
            <CardHeader>
              <CardTitle>Student Spotlight</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="flex items-center mt-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=DJ" alt="Dwayne Johnson" />
                      <AvatarFallback>DJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Dwayne Johnson</div>
                      <div className="text-sm text-gray-500">Looks insane! 🔥</div>
                    </div>
                    <Heart className="ml-auto text-red-500 cursor-pointer" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
