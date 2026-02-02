import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from 'lucide-react'
import config from '../../config'

export default function CareerExplorerWithFilters() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    tenthPercentage: '',
    twelfthPercentage: '',
    interest: '',
    strength: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [careerSuggestions, setCareerSuggestions] = useState([])
  const [interests, setInterests] = useState([])
  const [strengths, setStrengths] = useState([])

  useEffect(() => {
    fetchInterestsAndStrengths()
  }, [])

  const fetchInterestsAndStrengths = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/careers/options`)
      const data = await response.json()
      setInterests(data.interests)
      setStrengths(data.strengths)
    } catch (error) {
      console.error('Error fetching interests and strengths:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handlePredict = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${config.API_BASE_URL}/careers/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const suggestions = await response.json()
      setCareerSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching career suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobClick = (job) => {
    navigate(`/job-details/${job.jobTitle}`, { 
      state: { 
        job: {
          ...job,
          skills: job.skills || [],
          companies: job.companies || [],
          education: job.education || [],
          challenges: job.challenges || [],
          rewards: job.rewards || [],
          topColleges: job.topColleges || [],
          hiringTrends: job.hiringTrends || [],
          salaryTrends: job.salaryTrends || []
        } 
      } 
    })
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
      <Card className="w-full bg-gradient-to-r from-blue-100 to-purple-100">
        <CardHeader>
          <CardTitle className="text-2xl">Career Explorer</CardTitle>
          <CardDescription>Filter and find your ideal career path</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tenthPercentage">10th Grade Percentage</Label>
            <Input
              id="tenthPercentage"
              name="tenthPercentage"
              type="number"
              min="0"
              max="100"
              value={formData.tenthPercentage}
              onChange={handleInputChange}
              placeholder="Enter percentage"
            />
          </div>
          <div>
            <Label htmlFor="twelfthPercentage">12th Grade Percentage</Label>
            <Input
              id="twelfthPercentage"
              name="twelfthPercentage"
              type="number"
              min="0"
              max="100"
              value={formData.twelfthPercentage}
              onChange={handleInputChange}
              placeholder="Enter percentage"
            />
          </div>
          <div>
            <Label htmlFor="interest">Area of Interest</Label>
            <Select onValueChange={(value) => handleInputChange({ target: { name: 'interest', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your interest" />
              </SelectTrigger>
              <SelectContent>
                {interests.map((interest) => (
                  <SelectItem key={interest} value={interest}>
                    {interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="strength">Your Biggest Strength</Label>
            <Select onValueChange={(value) => handleInputChange({ target: { name: 'strength', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your strength" />
              </SelectTrigger>
              <SelectContent>
                {strengths.map((strength) => (
                  <SelectItem key={strength} value={strength}>
                    {strength}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handlePredict} 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Predicting...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Predict Careers
          </>
        )}
      </Button>

      {careerSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Career Suggestions</CardTitle>
            <CardDescription>Based on your filters and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {careerSuggestions.map((job, index) => (
                <li 
                  key={index} 
                  className="p-2 bg-gray-100 rounded-md flex justify-between items-center hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => handleJobClick(job)}
                >
                  <span className="font-medium text-blue-600 hover:underline">{job.jobTitle}</span>
                  <span className="text-green-600">{job.averageSalary}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// import React, { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
// import config from '../../config'

// export default function CareerExplorer() {
//   const [formData, setFormData] = useState({
//     tenthPercentage: '',
//     twelfthPercentage: '',
//     interest: '',
//     strength: ''
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [careerSuggestions, setCareerSuggestions] = useState([])
//   const [interests, setInterests] = useState([])
//   const [strengths, setStrengths] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const itemsPerPage = 20

//   useEffect(() => {
//     fetchInterestsAndStrengths()
//     fetchAllCareers()
//   }, [])

//   const fetchInterestsAndStrengths = async () => {
//     try {
//       const response = await fetch(`${config.API_BASE_URL}/careers/options`)
//       const data = await response.json()
//       setInterests(data.interests)
//       setStrengths(data.strengths)
//     } catch (error) {
//       console.error('Error fetching interests and strengths:', error)
//     }
//   }

//   const fetchAllCareers = async (page = 1) => {
//     setIsLoading(true)
//     try {
//       const response = await fetch(`${config.API_BASE_URL}/careers?page=${page}&limit=${itemsPerPage}`)
//       const data = await response.json()
//       setCareerSuggestions(data.careers)
//       setTotalPages(data.totalPages)
//       setCurrentPage(page)
//     } catch (error) {
//       console.error('Error fetching all careers:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }))
//   }

//   const handlePredict = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch(`${config.API_BASE_URL}/careers/suggestions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })
//       const suggestions = await response.json()
//       setCareerSuggestions(suggestions)
//       setTotalPages(1)
//       setCurrentPage(1)
//     } catch (error) {
//       console.error('Error fetching career suggestions:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       if (Object.values(formData).some(value => value !== '')) {
//         handlePredict()
//       } else {
//         fetchAllCareers(newPage)
//       }
//     }
//   }

//   const resetFilters = () => {
//     setFormData({
//       tenthPercentage: '',
//       twelfthPercentage: '',
//       interest: '',
//       strength: ''
//     })
//     fetchAllCareers()
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
//       <Card className="w-full bg-gradient-to-r from-blue-100 to-purple-100">
//         <CardHeader>
//           <CardTitle className="text-2xl">Career Explorer</CardTitle>
//           <CardDescription>Filter and find your ideal career path</CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="tenthPercentage">10th Grade Percentage</Label>
//             <Input
//               id="tenthPercentage"
//               name="tenthPercentage"
//               type="number"
//               min="0"
//               max="100"
//               value={formData.tenthPercentage}
//               onChange={handleInputChange}
//               placeholder="Enter percentage"
//             />
//           </div>
//           <div>
//             <Label htmlFor="twelfthPercentage">12th Grade Percentage</Label>
//             <Input
//               id="twelfthPercentage"
//               name="twelfthPercentage"
//               type="number"
//               min="0"
//               max="100"
//               value={formData.twelfthPercentage}
//               onChange={handleInputChange}
//               placeholder="Enter percentage"
//             />
//           </div>
//           <div>
//             <Label htmlFor="interest">Area of Interest</Label>
//             <Select onValueChange={(value) => handleInputChange({ target: { name: 'interest', value } })}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select your interest" />
//               </SelectTrigger>
//               <SelectContent>
//                 {interests.map((interest) => (
//                   <SelectItem key={interest} value={interest}>
//                     {interest}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="strength">Your Biggest Strength</Label>
//             <Select onValueChange={(value) => handleInputChange({ target: { name: 'strength', value } })}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select your strength" />
//               </SelectTrigger>
//               <SelectContent>
//                 {strengths.map((strength) => (
//                   <SelectItem key={strength} value={strength}>
//                     {strength}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex space-x-4">
//         <Button 
//           onClick={handlePredict} 
//           className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Predicting...
//             </>
//           ) : (
//             <>
//               <Sparkles className="mr-2 h-4 w-4" />
//               Predict Careers
//             </>
//           )}
//         </Button>
//         <Button 
//           onClick={resetFilters}
//           className="bg-gray-200 text-gray-800 hover:bg-gray-300"
//         >
//           Reset Filters
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Career Suggestions</CardTitle>
//           <CardDescription>
//             {Object.values(formData).some(value => value !== '') 
//               ? 'Based on your filters and preferences' 
//               : 'Showing all career options'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : (
//             <>
//               <ul className="space-y-2">
//                 {careerSuggestions.map((job, index) => (
//                   <li key={index} className="p-2 bg-gray-100 rounded-md flex justify-between items-center hover:bg-gray-200 transition-colors">
//                     <span className="font-medium">{job.jobTitle}</span>
//                     <span className="text-green-600">{job.averageSalary}</span>
//                   </li>
//                 ))}
//               </ul>
//               <div className="flex justify-between items-center mt-4">
//                 <Button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   variant="outline"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-2" />
//                   Previous
//                 </Button>
//                 <span>Page {currentPage} of {totalPages}</span>
//                 <Button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   variant="outline"
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }