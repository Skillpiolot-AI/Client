
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Briefcase, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import config from '../../config';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    tenthGrade: { percentage: '', maths: '', science: '', english: '' },
    twelfthGrade: { percentage: '', maths: '', physics: '', chemistry: '' },
    jobRolesPredicted: ['', '', '']
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(response.data);
      setFormData({
        tenthGrade: response.data.tenthGrade,
        twelfthGrade: response.data.twelfthGrade,
        jobRolesPredicted: response.data.jobRolesPredicted
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e, grade, subject) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [subject]: value
      }
    }));
  };

  const handleJobRoleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      jobRolesPredicted: prev.jobRolesPredicted.map((role, i) => i === index ? value : role)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_BASE_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile && !isEditing) {
    return (
      <div className="bg-orange-50 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <Button onClick={() => setIsEditing(true)}>Add Profile Details</Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-orange-50 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">10th Grade</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tenth-percentage">Overall Percentage</Label>
                  <Input
                    id="tenth-percentage"
                    value={formData.tenthGrade.percentage}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'percentage')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tenth-maths">Maths</Label>
                  <Input
                    id="tenth-maths"
                    value={formData.tenthGrade.maths}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'maths')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tenth-science">Science</Label>
                  <Input
                    id="tenth-science"
                    value={formData.tenthGrade.science}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'science')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tenth-english">English</Label>
                  <Input
                    id="tenth-english"
                    value={formData.tenthGrade.english}
                    onChange={(e) => handleInputChange(e, 'tenthGrade', 'english')}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">12th Grade</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twelfth-percentage">Overall Percentage</Label>
                  <Input
                    id="twelfth-percentage"
                    value={formData.twelfthGrade.percentage}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'percentage')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="twelfth-maths">Maths</Label>
                  <Input
                    id="twelfth-maths"
                    value={formData.twelfthGrade.maths}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'maths')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="twelfth-physics">Physics</Label>
                  <Input
                    id="twelfth-physics"
                    value={formData.twelfthGrade.physics}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'physics')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="twelfth-chemistry">Chemistry</Label>
                  <Input
                    id="twelfth-chemistry"
                    value={formData.twelfthGrade.chemistry}
                    onChange={(e) => handleInputChange(e, 'twelfthGrade', 'chemistry')}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Predicted Job Roles</h2>
              <div className="space-y-2">
                {formData.jobRolesPredicted.map((role, index) => (
                  <Input
                    key={index}
                    value={role}
                    onChange={(e) => handleJobRoleChange(index, e.target.value)}
                    placeholder={`Job Role ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Student" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">Student</p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">10th Grade %</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.tenthGrade.percentage}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Maths: {profile.tenthGrade.maths}%, Science: {profile.tenthGrade.science}%, English: {profile.tenthGrade.english}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">12th Grade %</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.twelfthGrade.percentage}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Maths: {profile.twelfthGrade.maths}%, Physics: {profile.twelfthGrade.physics}%, Chemistry: {profile.twelfthGrade.chemistry}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Roles Predicted</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {profile.jobRolesPredicted.map((role, index) => (
                  <li key={index} className="text-sm">{role}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="projects" className="bg-white rounded-lg shadow">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Projects</h2>
              <Link to="/add-project">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </Link>
            </div>
            <ul className="space-y-4">
              {profile.projects.map((project, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.technologies.join(', ')}</p>
                  </div>
                  <span className={`font-medium ${
                    project.status === 'Completed' ? 'text-green-500' :
                    project.status === 'In Progress' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>{project.status}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="certifications" className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Certifications</h2>
              <Link to="/add-certification">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </Link>
            </div>
            <ul className="space-y-4">
              {profile.certifications.map((cert, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{cert.title}</h3>
                    <p className="text-sm text-gray-500">{cert.issuer}</p>
                  </div>
                  <span className={`font-medium ${
                    cert.status === 'Achieved' ? 'text-green-500' :
                    cert.status === 'In Progress' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>{cert.status}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="goals" className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Goals</h2>
              <Link to="/add-goal">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </Link>
            </div>
            <ul className="space-y-4">
              {profile.goals.map((goal, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                  <span className={`font-medium ${
                    goal.status === 'Completed' ? 'text-green-500' :
                    goal.status === 'In Progress' ? 'text-yellow-500' :
                    goal.status === 'Ongoing' ? 'text-blue-500' :
                    'text-gray-500'
                  }`}>{goal.status}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../AuthContext';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { GraduationCap, Briefcase, Plus } from "lucide-react";
// import config from '../../config';
// import Modal from './Model'; // Ensure correct path

// export default function Profile() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     tenthGrade: { percentage: '', maths: '', science: '', english: '' },
//     twelfthGrade: { percentage: '', maths: '', physics: '', chemistry: '' },
//     jobRolesPredicted: ['', '', '']
//   });

//   // Modal states
//   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
//   const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
//   const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

//   // Form states
//   const [projectData, setProjectData] = useState({ title: '', description: '', technologies: '', status: 'Planned' });
//   const [certificationData, setCertificationData] = useState({ title: '', issuer: '', status: 'Planned' });
//   const [goalData, setGoalData] = useState({ title: '', description: '', status: 'Not Started' });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const response = await axios.get(`${config.API_BASE_URL}/profile`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setProfile(response.data);
//       setFormData({
//         tenthGrade: response.data.tenthGrade,
//         twelfthGrade: response.data.twelfthGrade,
//         jobRolesPredicted: response.data.jobRolesPredicted
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     }
//   };

//   const handleInputChange = (e, grade, subject) => {
//     const { value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [grade]: {
//         ...prev[grade],
//         [subject]: value
//       }
//     }));
//   };

//   const handleJobRoleChange = (index, value) => {
//     setFormData(prev => ({
//       ...prev,
//       jobRolesPredicted: prev.jobRolesPredicted.map((role, i) => i === index ? value : role)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${config.API_BASE_URL}/profile`, formData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setIsEditing(false);
//       fetchProfile();
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };

//   const handleProjectSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${config.API_BASE_URL}/profile/project`, {
//         ...projectData,
//         technologies: projectData.technologies.split(',').map(tech => tech.trim())
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setIsProjectModalOpen(false);
//       setProjectData({ title: '', description: '', technologies: '', status: 'Planned' });
//       fetchProfile();
//     } catch (error) {
//       console.error('Error adding project:', error);
//     }
//   };

//   const handleCertificationSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${config.API_BASE_URL}/profile/certification`, certificationData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setIsCertificationModalOpen(false);
//       setCertificationData({ title: '', issuer: '', status: 'Planned' });
//       fetchProfile();
//     } catch (error) {
//       console.error('Error adding certification:', error);
//     }
//   };

//   const handleGoalSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${config.API_BASE_URL}/profile/goal`, goalData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setIsGoalModalOpen(false);
//       setGoalData({ title: '', description: '', status: 'Not Started' });
//       fetchProfile();
//     } catch (error) {
//       console.error('Error adding goal:', error);
//     }
//   };

//   if (!profile && !isEditing) {
//     return (
//       <div className="bg-orange-50 min-h-screen p-8">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
//           <Button onClick={() => setIsEditing(true)}>Add Profile Details</Button>
//         </div>
//       </div>
//     );
//   }

//   if (isEditing) {
//     return (
//       <div className="bg-orange-50 min-h-screen p-8">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Add form fields for editing profile here */}
//             <Button type="submit">Save Profile</Button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-orange-50 min-h-screen p-8">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Avatar className="w-20 h-20">
//               <AvatarImage src="/placeholder-avatar.jpg" alt="Student" />
//               <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div>
//               <h1 className="text-2xl font-bold">{user.name}</h1>
//               <p className="text-gray-500">Student</p>
//             </div>
//           </div>
//           <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">10th Grade %</CardTitle>
//               <GraduationCap className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{profile.tenthGrade.percentage}%</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Maths: {profile.tenthGrade.maths}%, Science: {profile.tenthGrade.science}%, English: {profile.tenthGrade.english}%
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">12th Grade %</CardTitle>
//               <GraduationCap className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{profile.twelfthGrade.percentage}%</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Maths: {profile.twelfthGrade.maths}%, Physics: {profile.twelfthGrade.physics}%, Chemistry: {profile.twelfthGrade.chemistry}%
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Job Roles Predicted</CardTitle>
//               <Briefcase className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-1">
//                 {profile.jobRolesPredicted.map((role, index) => (
//                   <li key={index} className="text-sm">{role}</li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="projects" className="bg-white rounded-lg shadow">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="projects">Projects</TabsTrigger>
//             <TabsTrigger value="certifications">Certifications</TabsTrigger>
//             <TabsTrigger value="goals">Goals</TabsTrigger>
//           </TabsList>

//           <TabsContent value="projects">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Projects</h2>
//               <Button onClick={() => setIsProjectModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Project</Button>
//             </div>
//             <ul className="space-y-4">
//               {profile.projects.map((project, index) => (
//                 <li key={index} className="border rounded p-4">
//                   <h3 className="text-md font-bold">{project.title}</h3>
//                   <p className="text-sm mt-1">{project.description}</p>
//                   <p className="text-sm mt-1"><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
//                   <p className="text-sm mt-1"><strong>Status:</strong> {project.status}</p>
//                 </li>
//               ))}
//             </ul>
//           </TabsContent>

//           <TabsContent value="certifications">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Certifications</h2>
//               <Button onClick={() => setIsCertificationModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Certification</Button>
//             </div>
//             <ul className="space-y-4">
//               {profile.certifications.map((certification, index) => (
//                 <li key={index} className="border rounded p-4">
//                   <h3 className="text-md font-bold">{certification.title}</h3>
//                   <p className="text-sm mt-1"><strong>Issuer:</strong> {certification.issuer}</p>
//                   <p className="text-sm mt-1"><strong>Status:</strong> {certification.status}</p>
//                 </li>
//               ))}
//             </ul>
//           </TabsContent>

//           <TabsContent value="goals">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Goals</h2>
//               <Button onClick={() => setIsGoalModalOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Goal</Button>
//             </div>
//             <ul className="space-y-4">
//               {profile.goals.map((goal, index) => (
//                 <li key={index} className="border rounded p-4">
//                   <h3 className="text-md font-bold">{goal.title}</h3>
//                   <p className="text-sm mt-1">{goal.description}</p>
//                   <p className="text-sm mt-1"><strong>Status:</strong> {goal.status}</p>
//                 </li>
//               ))}
//             </ul>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Project Modal */}
//       <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Add Project">
//         <form onSubmit={handleProjectSubmit}>
//           <div className="mb-4">
//             <Label htmlFor="projectTitle">Project Title</Label>
//             <Input
//               id="projectTitle"
//               value={projectData.title}
//               onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="projectDescription">Description</Label>
//             <Input
//               id="projectDescription"
//               value={projectData.description}
//               onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="projectTechnologies">Technologies (comma-separated)</Label>
//             <Input
//               id="projectTechnologies"
//               value={projectData.technologies}
//               onChange={(e) => setProjectData({ ...projectData, technologies: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="projectStatus">Status</Label>
//             <select
//               id="projectStatus"
//               value={projectData.status}
//               onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
//               className="border p-2 rounded-md w-full"
//             >
//               <option value="Planned">Planned</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>
//           <Button type="submit">Add Project</Button>
//         </form>
//       </Modal>

//       {/* Certification Modal */}
//       <Modal isOpen={isCertificationModalOpen} onClose={() => setIsCertificationModalOpen(false)} title="Add Certification">
//         <form onSubmit={handleCertificationSubmit}>
//           <div className="mb-4">
//             <Label htmlFor="certificationTitle">Certification Title</Label>
//             <Input
//               id="certificationTitle"
//               value={certificationData.title}
//               onChange={(e) => setCertificationData({ ...certificationData, title: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="certificationIssuer">Issuer</Label>
//             <Input
//               id="certificationIssuer"
//               value={certificationData.issuer}
//               onChange={(e) => setCertificationData({ ...certificationData, issuer: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="certificationStatus">Status</Label>
//             <select
//               id="certificationStatus"
//               value={certificationData.status}
//               onChange={(e) => setCertificationData({ ...certificationData, status: e.target.value })}
//               className="border p-2 rounded-md w-full"
//             >
//               <option value="Planned">Planned</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>
//           <Button type="submit">Add Certification</Button>
//         </form>
//       </Modal>

//       {/* Goal Modal */}
//       <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title="Add Goal">
//         <form onSubmit={handleGoalSubmit}>
//           <div className="mb-4">
//             <Label htmlFor="goalTitle">Goal Title</Label>
//             <Input
//               id="goalTitle"
//               value={goalData.title}
//               onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="goalDescription">Description</Label>
//             <Input
//               id="goalDescription"
//               value={goalData.description}
//               onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <Label htmlFor="goalStatus">Status</Label>
//             <select
//               id="goalStatus"
//               value={goalData.status}
//               onChange={(e) => setGoalData({ ...goalData, status: e.target.value })}
//               className="border p-2 rounded-md w-full"
//             >
//               <option value="Not Started">Not Started</option>
//               <option value="Ongoing">Ongoing</option>
//               <option value="Completed">Completed</option>
//             </select>
//           </div>
//           <Button type="submit">Add Goal</Button>
//         </form>
//       </Modal>
//     </div>
//   );
// }
