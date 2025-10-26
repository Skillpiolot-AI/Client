"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../../AuthContext"
import config from "../../config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Search, Filter, Star, Calendar, Users, Award, Briefcase } from "lucide-react"

const MentorList = () => {
  const [mentors, setMentors] = useState([])
  const [filteredMentors, setFilteredMentors] = useState([])
  const [experienceLevels, setExperienceLevels] = useState([])
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [skills, setSkills] = useState([])
  const [companies, setCompanies] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMentors()
    fetchExperienceLevels()
    fetchSkills()
    fetchCompanies()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [mentors, selectedExperience, searchTerm, selectedSkills, selectedCompanies])

  const fetchMentors = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${config.API_BASE_URL}/mentors`)
      setMentors(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching mentors:", error)
      setError("Failed to fetch mentors. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExperienceLevels = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/experience-levels`)
      setExperienceLevels(response.data)
    } catch (error) {
      console.error("Error fetching experience levels:", error)
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/skills`)
      setSkills(response.data)
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/companies`)
      setCompanies(response.data)
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const filterMentors = () => {
    console.log("Mentors before filtering:", mentors)
    console.log("Selected experience:", selectedExperience)
    console.log("Search term:", searchTerm)
    console.log("Selected skills:", selectedSkills)
    console.log("Selected companies:", selectedCompanies)

    let filtered = mentors

    if (selectedExperience !== "all") {
      filtered = filtered.filter((mentor) => mentor.experience >= Number.parseInt(selectedExperience))
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(lowercasedTerm) || mentor.jobTitle.toLowerCase().includes(lowercasedTerm),
      )
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(
        (mentor) => mentor.skills && selectedSkills.every((skill) => mentor.skills.includes(skill)),
      )
    }

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.companiesJoined && mentor.companiesJoined.some((company) => selectedCompanies.includes(company)),
      )
    }

    console.log("Filtered mentors:", filtered)
    setFilteredMentors(filtered)
  }


  const handleBookAppointment = async (mentorId) => {
    if (!user) {
      navigate("/login", { state: { from: "/mentor-list" } })
      return
    }

    try {
      console.log('Booking appointment with:', {
        mentorId,
        userId: user._id || user.id,
        userObject: user
      });

      // Use user.id or user._id, whichever exists
      const userId = user._id || user.id;

      if (!userId) {
        toast.error('User ID not found. Please login again.');
        return;
      }

      const date = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).toISOString()

      const response = await axios.post(
        `${config.API_BASE_URL}/book-appointment`,
        {
          mentorId,
          userId: userId,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      console.log('Booking response:', response.data);
      toast.success("Appointment booked successfully!")
    } catch (error) {
      console.error("Error booking appointment:", error.response?.data || error)
      toast.error(error.response?.data?.message || "Failed to book appointment. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="text-lg text-gray-600 font-medium">Loading amazing mentors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <p className="text-lg text-red-600 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search mentors by name or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
              />
            </div>

            <Select onValueChange={setSelectedExperience} value={selectedExperience}>
              <SelectTrigger className="w-full lg:w-64 h-12 border-gray-200 focus:border-indigo-500 rounded-xl">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Experience</SelectItem>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    {`${level} year${level > 1 ? "s" : ""}+`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          {(selectedSkills.length > 0 || selectedCompanies.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                  {skill}
                  <button
                    onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                    className="ml-2 hover:text-indigo-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedCompanies.map((company) => (
                <Badge key={company} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {company}
                  <button
                    onClick={() => setSelectedCompanies(selectedCompanies.filter((c) => c !== company))}
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredMentors.length} Mentor{filteredMentors.length !== 1 ? "s" : ""} Available
              </h2>
            </div>

            {filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <Card
                    key={mentor._id}
                    className="group bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-white/20 hover:border-indigo-200 hover:-translate-y-1"
                  >
                    <CardHeader className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-600/20"></div>
                      <div className="relative flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-4 border-white/20 shadow-lg">
                            <AvatarImage
                              src={mentor.imageUrl || "/placeholder.svg?height=64&width=64&query=professional+mentor"}
                              alt={`${mentor.name}'s avatar`}
                            />
                            <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                              {mentor.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-xl font-bold truncate">{mentor.name}</CardTitle>
                          <div className="flex items-center mt-1 text-indigo-200">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            <span className="text-sm">4.9</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                          <span className="text-sm font-medium truncate">{mentor.jobTitle}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Award className="w-4 h-4 mr-2 text-indigo-500" />
                          <span className="text-sm">{mentor.experience} years experience</span>
                        </div>

                        {mentor.skills && mentor.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {mentor.skills.slice(0, 3).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {mentor.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                +{mentor.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <Button
                          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                          onClick={() => handleBookAppointment(mentor._id)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {user ? "Book Session" : "Login to Book"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No mentors found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedExperience("all")
                    setSelectedSkills([])
                    setSelectedCompanies([])
                  }}
                  className="rounded-xl"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-gray-900 to-indigo-900 p-6">
                <CardTitle className="text-white text-xl font-bold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Skills Filter */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-indigo-500" />
                    Skills ({selectedSkills.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSkills([...selectedSkills, skill])
                            } else {
                              setSelectedSkills(selectedSkills.filter((s) => s !== skill))
                            }
                          }}
                          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <label htmlFor={`skill-${skill}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Companies Filter */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                    Companies ({selectedCompanies.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {companies.map((company) => (
                      <div
                        key={company}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`company-${company}`}
                          checked={selectedCompanies.includes(company)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCompanies([...selectedCompanies, company])
                            } else {
                              setSelectedCompanies(selectedCompanies.filter((c) => c !== company))
                            }
                          }}
                          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <label htmlFor={`company-${company}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                          {company}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedSkills.length > 0 || selectedCompanies.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSkills([])
                      setSelectedCompanies([])
                    }}
                    className="w-full rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default MentorList
