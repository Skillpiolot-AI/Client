


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Play, X, Star, Book, Calendar, Building2 } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-white flex items-center  space-x-20 justify-center  space-x-4">
      <main className="container mx-auto px-4   space-x-20 py-8">
        <div className="flex flex-col md:flex-row items-start justify-between max-w-4xl mx-auto">
          <div className="md:w-2/5 mb-8 md:mb-0 text-left">
            <h2 className="text-red-500 font-bold mb-2 text-sm">Hi I'm ProPilot</h2>
            <h1 className="text-3xl font-bold mb-3">Your Personal AI Career Assistant</h1>
            <p className="text-gray-600 mb-4 text-sm">Tell me your career goal, and I'll help you achieve it - the fastest route, no detours.</p>
            <Button size="sm" className="mb-4">Get My Roadmap</Button>
          </div>
          <div className="md:w-1/2">
            <div className="relative bg-white rounded-xl shadow-lg p-4 max-w-sm w-full">
              <div className="absolute -top-3 -left-3 bg-blue-100 rounded-full w-24 h-24 z-0" />
              <div className="absolute top-1/4 right-0 bg-yellow-100 rounded-full w-16 h-16 z-0" />
              
              <div className="relative z-10">
                <div className="bg-white rounded-lg shadow p-2 mb-4 inline-block">
                  <div className="flex items-center">
                    <Play className="text-blue-500 w-4 h-4 mr-1" />
                    <span className="font-semibold text-xs">Trained on 15000+</span>
                  </div>
                  <div className="text-sm font-bold">Mentorship Sessions</div>
                </div>

                <div className="flex items-center mb-3">
                  <div className="bg-orange-400 p-1 rounded-md mr-2">
                    <Star className="text-white w-4 h-4" />
                  </div>
                  <p className="text-gray-700 text-xs">
                    Let me guide you to your{" "}
                    <span className="text-purple-600 font-medium">career destination</span>
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center bg-gray-100 rounded-md p-1">
                    <MapPin className="text-gray-400 w-4 h-4 mr-1" />
                    <Input
                      placeholder="Select your starting point..."
                      className="border-0 bg-transparent focus:ring-0 text-xs"
                    />
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-md p-1">
                    <MapPin className="text-purple-600 w-4 h-4 mr-1" />
                    <Input
                      placeholder="Choose your career destination"
                      className="border-0 bg-transparent focus:ring-0 text-xs"
                    />
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1">
                  Start My Career Journey
                </Button>
              </div>

              <div className="absolute top-1 right-1 bg-red-400 rounded-full p-1">
                <X className="text-white w-3 h-3" />
              </div>

              <div className="flex justify-end mt-2 space-x-1">
                <Book className="text-gray-400 w-3 h-3" />
                <Calendar className="text-gray-400 w-3 h-3" />
                <Building2 className="text-gray-400 w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}