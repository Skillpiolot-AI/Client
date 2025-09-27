import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '../../AuthContext';
import config from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
    fetchExperienceLevels();
    fetchSkills();
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, selectedExperience, searchTerm, selectedSkills, selectedCompanies]);

  const fetchMentors = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/mentors`);
      setMentors(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setError('Failed to fetch mentors. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExperienceLevels = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/experience-levels`);
      setExperienceLevels(response.data);
    } catch (error) {
      console.error('Error fetching experience levels:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const filterMentors = () => {
    console.log('Mentors before filtering:', mentors);
    console.log('Selected experience:', selectedExperience);
    console.log('Search term:', searchTerm);
    console.log('Selected skills:', selectedSkills);
    console.log('Selected companies:', selectedCompanies);

    let filtered = mentors;

    if (selectedExperience !== 'all') {
      filtered = filtered.filter(mentor => mentor.experience >= parseInt(selectedExperience));
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(lowercasedTerm) ||
        mentor.jobTitle.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(mentor => 
        mentor.skills && selectedSkills.every(skill => mentor.skills.includes(skill))
      );
    }

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(mentor => 
        mentor.companiesJoined && mentor.companiesJoined.some(company => selectedCompanies.includes(company))
      );
    }

    console.log('Filtered mentors:', filtered);
    setFilteredMentors(filtered);
  };

  const handleBookAppointment = async (mentorId) => {
    if (!user) {
      navigate('/login', { state: { from: '/mentor-list' } });
      return;
    }
    
    try {
      const date = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).toISOString();
      await axios.post(`${config.API_BASE_URL}/book-appointment`, { 
        mentorId, 
        userId: user._id, 
        date 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading mentors...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen p-8">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Mentorship Program</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 mb-6">
              <Input 
                placeholder="Search mentors..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select onValueChange={setSelectedExperience} value={selectedExperience}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Experience</SelectItem>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>{`${level} year${level > 1 ? 's' : ''}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor) => (
                <Card key={mentor._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <CardHeader className="bg-gray-900 p-4">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage src={mentor.imageUrl || "/mentor-placeholder.png"} alt={`${mentor.name}'s avatar`} />
                        <AvatarFallback>{mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-white text-xl font-bold">{mentor.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-2">Job Title: {mentor.jobTitle}</p>
                    <p className="text-sm text-gray-600 mb-4">Experience: {mentor.experience} years</p>
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white" onClick={() => handleBookAppointment(mentor._id)}>
                      {user ? 'Book Appointment' : 'Login to Book'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">No mentors found matching your criteria.</div>
            )}
          </div>
        </div>
        <div className="md:w-1/4">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-900 p-4">
              <CardTitle className="text-white text-xl font-bold">Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Skills</h3>
              {skills.map((skill) => (
                <div key={skill} className="flex items-center mb-2">
                  <Checkbox 
                    id={`skill-${skill}`}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSkills([...selectedSkills, skill]);
                      } else {
                        setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      }
                    }}
                  />
                  <label htmlFor={`skill-${skill}`} className="ml-2">{skill}</label>
                </div>
              ))}
              <h3 className="font-semibold mb-2 mt-4">Companies</h3>
              {companies.map((company) => (
                <div key={company} className="flex items-center mb-2">
                  <Checkbox 
                    id={`company-${company}`}
                    checked={selectedCompanies.includes(company)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCompanies([...selectedCompanies, company]);
                      } else {
                        setSelectedCompanies(selectedCompanies.filter(c => c !== company));
                      }
                    }}
                  />
                  <label htmlFor={`company-${company}`} className="ml-2">{company}</label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MentorList;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';a
// import { useNavigate } from 'react-router-dom';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useAuth } from '../../AuthContext';
// import config from '../../config';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import BookAppointment from './BookAppointment';

// const MentorList = () => {
//   const [mentors, setMentors] = useState([]);
//   const [filteredMentors, setFilteredMentors] = useState([]);
//   const [experienceLevels, setExperienceLevels] = useState([]);
//   const [selectedExperience, setSelectedExperience] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [skills, setSkills] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [selectedCompanies, setSelectedCompanies] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchMentors();
//     fetchExperienceLevels();
//     fetchSkills();
//     fetchCompanies();
//   }, []);

//   useEffect(() => {
//     filterMentors();
//   }, [mentors, selectedExperience, searchTerm, selectedSkills, selectedCompanies]);

//   const fetchMentors = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${config.API_BASE_URL}/mentors`);
//       setMentors(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching mentors:', error);
//       setError('Failed to fetch mentors. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchExperienceLevels = async () => {
//     try {
//       const response = await axios.get(`${config.API_BASE_URL}/experience-levels`);
//       setExperienceLevels(response.data);
//     } catch (error) {
//       console.error('Error fetching experience levels:', error);
//     }
//   };

//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(`${config.API_BASE_URL}/skills`);
//       setSkills(response.data);
//     } catch (error) {
//       console.error('Error fetching skills:', error);
//     }
//   };

//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get(`${config.API_BASE_URL}/companies`);
//       setCompanies(response.data);
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//     }
//   };

//   const filterMentors = () => {
//     let filtered = mentors;

//     if (selectedExperience !== 'all') {
//       filtered = filtered.filter(mentor => mentor.experience >= parseInt(selectedExperience));
//     }

//     if (searchTerm) {
//       const lowercasedTerm = searchTerm.toLowerCase();
//       filtered = filtered.filter(mentor => 
//         mentor.name.toLowerCase().includes(lowercasedTerm) ||
//         mentor.jobTitle.toLowerCase().includes(lowercasedTerm)
//       );
//     }

//     if (selectedSkills.length > 0) {
//       filtered = filtered.filter(mentor => 
//         mentor.skills && selectedSkills.every(skill => mentor.skills.includes(skill))
//       );
//     }

//     if (selectedCompanies.length > 0) {
//       filtered = filtered.filter(mentor => 
//         mentor.companiesJoined && mentor.companiesJoined.some(company => selectedCompanies.includes(company))
//       );
//     }

//     setFilteredMentors(filtered);
//   };

//   const handleBookAppointment = (mentor) => {
//     if (!user) {
//       navigate('/login', { state: { from: '/mentor-list' } });
//       return;
//     }
//     setSelectedMentor(mentor);
//   };

//   const closeBookAppointment = () => {
//     setSelectedMentor(null);
//   };

//   if (isLoading) {
//     return <div className="text-center mt-8">Loading mentors...</div>;
//   }

//   if (error) {
//     return <div className="text-center mt-8 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen p-8">
//       <h2 className="text-4xl font-bold mb-8 text-indigo-800">Mentorship Program</h2>
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="md:w-3/4">
//           <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
//             <div className="flex flex-wrap gap-4 mb-6">
//               <Input 
//                 placeholder="Search mentors..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full md:w-64"
//               />
//               <Select onValueChange={setSelectedExperience} value={selectedExperience}>
//                 <SelectTrigger className="w-full md:w-64">
//                   <SelectValue placeholder="Select Experience" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">Any Experience</SelectItem>
//                   {experienceLevels.map((level) => (
//                     <SelectItem key={level} value={level.toString()}>{`${level} year${level > 1 ? 's' : ''}`}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredMentors.length > 0 ? (
//               filteredMentors.map((mentor) => (
//                 <Card key={mentor._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
//                   <CardHeader className="bg-indigo-900 p-4">
//                     <div className="flex items-center">
//                       <Avatar className="w-12 h-12 mr-4">
//                         <AvatarImage src={mentor.imageUrl || "/mentor-placeholder.png"} alt={`${mentor.name}'s avatar`} />
//                         <AvatarFallback>{mentor.name.charAt(0).toUpperCase()}</AvatarFallback>
//                       </Avatar>
//                       <CardTitle className="text-white text-xl font-bold">{mentor.name}</CardTitle>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="p-4">
//                     <p className="text-sm text-gray-600 mb-2">Job Title: {mentor.jobTitle}</p>
//                     <p className="text-sm text-gray-600 mb-4">Experience: {mentor.experience} years</p>
//                     <Button 
//                       className="bg-indigo-600 hover:bg-indigo-700 text-white" 
//                       onClick={() => handleBookAppointment(mentor)}
//                     >
//                       Book Appointment
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <div className="col-span-full text-center text-gray-500">No mentors found matching your criteria.</div>
//             )}
//           </div>
//         </div>
//         <div className="md:w-1/4">
//           <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
//             <CardHeader className="bg-indigo-900 p-4">
//               <CardTitle className="text-white text-xl font-bold">Filters</CardTitle>
//             </CardHeader>
//             <CardContent className="p-4">
//               <h3 className="font-semibold mb-2">Skills</h3>
//               {skills.map((skill) => (
//                 <div key={skill} className="flex items-center mb-2">
//                   <Checkbox 
//                     id={`skill-${skill}`}
//                     checked={selectedSkills.includes(skill)}
//                     onCheckedChange={(checked) => {
//                       if (checked) {
//                         setSelectedSkills([...selectedSkills, skill]);
//                       } else {
//                         setSelectedSkills(selectedSkills.filter(s => s !== skill));
//                       }
//                     }}
//                   />
//                   <label htmlFor={`skill-${skill}`} className="ml-2">{skill}</label>
//                 </div>
//               ))}
//               <h3 className="font-semibold mb-2 mt-4">Companies</h3>
//               {companies.map((company) => (
//                 <div key={company} className="flex items-center mb-2">
//                   <Checkbox 
//                     id={`company-${company}`}
//                     checked={selectedCompanies.includes(company)}
//                     onCheckedChange={(checked) => {
//                       if (checked) {
//                         setSelectedCompanies([...selectedCompanies, company]);
//                       } else {
//                         setSelectedCompanies(selectedCompanies.filter(c => c !== company));
//                       }
//                     }}
//                   />
//                   <label htmlFor={`company-${company}`} className="ml-2">{company}</label>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       {selectedMentor && (
//         <BookAppointment 
//           mentor={selectedMentor} 
//           onClose={closeBookAppointment} 
//         />
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default MentorList;