import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, X } from "lucide-react"

export default function ScheduleSession() {
  const [selectedCoach, setSelectedCoach] = useState("Ashish Tiwari")

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Session</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coach" className="text-red-500">Coach</Label>
              <div className="relative">
                <Input 
                  id="coach" 
                  value={selectedCoach} 
                  readOnly 
                  className="pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setSelectedCoach('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-red-500">Choose Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sales Leader Excellence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Leader Excellence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-red-500">Choose Coaching Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Talent Multiplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="talent">Talent Multiplier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic" className="text-red-500">Choose Coaching Topic</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topic1">Topic 1</SelectItem>
                  <SelectItem value="topic2">Topic 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="30 mins" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 mins</SelectItem>
                    <SelectItem value="60">60 mins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="relative">
                  <Input id="date" placeholder="Select Date" />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9am">9:00 AM</SelectItem>
                    <SelectItem value="10am">10:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="longTerm" />
              <Label htmlFor="longTerm">Tag to Long Term</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective" className="text-red-500">What is your objective for this Session ?</Label>
              <Textarea id="objective" placeholder="Session Objective" />
            </div>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coach Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Dr. Amritpal Singh" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Dr. Amritpal Singh</h3>
                <p className="text-sm text-gray-500">Developer, CDSI Team</p>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500"># of Sessions</p>
                <p className="font-semibold">1</p>
              </div>
              <div>
                <p className="text-sm text-gray-500"># of Coachees</p>
                <p className="font-semibold">1</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Certifications & Trainings</h4>
              <ul className="text-sm space-y-1">
                <li>Professional Certified Coach</li>
                <li>Associate Certified Coach</li>
                <li>The Coaching Impact</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Schedule Session</Button>
        <Button>Begin Session Now</Button>
      </div>
    </div>
  )
}