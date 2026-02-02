import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, Plus, Users, School, MapPin, Calendar, Key, 
  UserCheck, UserX, Edit, Trash2, Clock, Eye, UserPlus,
  Search, Filter, BookOpen, GraduationCap, Shield, 
  ChevronDown, ChevronUp, Activity, LogIn, LogOut
} from "lucide-react";
import config from '../../config';

export default function EnhancedUniAdminPortal() {
  const [university, setUniversity] = useState(null);
  const [teacherAccess, setTeacherAccess] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentActivities, setStudentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  // Form state for teacher access
  const [teacherFormData, setTeacherFormData] = useState({
    accessMethod: 'registration',
    registrationNumbers: '',
    emails: '',
    passwordMethod: 'manual',
    defaultPassword: ''
  });

  // Form state for student management
  const [studentFormData, setStudentFormData] = useState({
    accessMethod: 'registration',
    registrationNumbers: '',
    emails: '',
    passwordMethod: 'manual',
    defaultPassword: '',
    department: '',
    year: '',
    course: ''
  });

  // Edit student form
  const [editStudentData, setEditStudentData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Suspension modal
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  const [suspensionData, setSuspensionData] = useState({
    studentId: null,
    days: 7,
    reason: ''
  });

  useEffect(() => {
    fetchUniversity();
    fetchTeacherAccess();
    fetchStudents();
  }, []);

  const fetchUniversity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/university/my-university`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUniversity(response.data.university);
    } catch (error) {
      showMessage('Error fetching university: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAccess = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/university/teacher-access`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTeacherAccess(response.data.teacherAccess);
    } catch (error) {
      showMessage('Error fetching teacher access: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/university/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      showMessage('Error fetching students: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const fetchStudentActivity = async (studentId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/university/student-activity/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudentActivities(response.data.activities || []);
    } catch (error) {
      showMessage('Error fetching student activity: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleInputChange = (e, formType = 'teacher') => {
    const { name, value } = e.target;
    if (formType === 'student') {
      setStudentFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setTeacherFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/university/create-teacher-access`, {
        ...teacherFormData,
        universityId: university._id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      showMessage(`Teacher access created successfully! ${response.data.createdUsers} teachers added.`, 'success');
      
      if (response.data.excelFile) {
        downloadExcelFile(response.data.excelFile, `${university.name}_teacher_credentials.xlsx`);
      }

      setTeacherFormData({
        accessMethod: 'registration',
        registrationNumbers: '',
        emails: '',
        passwordMethod: 'manual',
        defaultPassword: ''
      });

      fetchTeacherAccess();
    } catch (error) {
      showMessage('Error creating teacher access: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${config.API_BASE_URL}/university/create-student-access`, {
        ...studentFormData,
        universityId: university._id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      showMessage(`Student access created successfully! ${response.data.createdUsers} students added.`, 'success');
      
      if (response.data.excelFile) {
        downloadExcelFile(response.data.excelFile, `${university.name}_student_credentials.xlsx`);
      }

      setStudentFormData({
        accessMethod: 'registration',
        registrationNumbers: '',
        emails: '',
        passwordMethod: 'manual',
        defaultPassword: '',
        department: '',
        year: '',
        course: ''
      });

      fetchStudents();
    } catch (error) {
      showMessage('Error creating student access: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcelFile = (base64Data, filename) => {
    const blob = new Blob([new Uint8Array(atob(base64Data).split('').map(c => c.charCodeAt(0)))], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleStudentAction = async (studentId, action, additionalData = {}) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.API_BASE_URL}/university/student-action`, {
        studentId,
        action,
        ...additionalData
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      showMessage(response.data.message, 'success');
      fetchStudents();
      
      if (showSuspensionModal) {
        setShowSuspensionModal(false);
        setSuspensionData({ studentId: null, days: 7, reason: '' });
      }
    } catch (error) {
      showMessage('Error performing action: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${config.API_BASE_URL}/university/edit-student/${editStudentData._id}`, {
        name: editStudentData.name,
        email: editStudentData.email,
        department: editStudentData.department,
        year: editStudentData.year,
        course: editStudentData.course
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      showMessage('Student updated successfully', 'success');
      setShowEditModal(false);
      setEditStudentData(null);
      fetchStudents();
    } catch (error) {
      showMessage('Error updating student: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const openActivityModal = (student) => {
    setSelectedStudent(student);
    setShowActivityModal(true);
    fetchStudentActivity(student._id);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && student.isActive && !student.isSuspended) ||
                         (filterStatus === 'suspended' && student.isSuspended) ||
                         (filterStatus === 'inactive' && !student.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (!university && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <School className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No University Access</h2>
            <p className="text-gray-600">You don't have access to any university portal. Please contact your administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <School className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">University Management Portal</h1>
              <p className="text-gray-600">Complete Teacher & Student Management System</p>
            </div>
          </div>
          
          {university && (
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{university.name}</h2>
                    <div className="flex items-center gap-4 text-purple-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {university.location.city}, {university.location.state}
                      </div>
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4" />
                        <a href={university.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {university.url}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-white text-purple-700 mb-2">
                      UniAdmin Portal
                    </Badge>
                    <div className="text-sm text-purple-100">
                      <div>Teachers: {teacherAccess.reduce((acc, ta) => acc + ta.generatedCredentials.length, 0)}</div>
                      <div>Students: {students.length}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {message && (
          <Alert className={`mb-6 ${messageType === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
            <AlertDescription className={messageType === 'error' ? 'text-red-700' : 'text-green-700'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <School className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="add-teachers" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Teachers
            </TabsTrigger>
            <TabsTrigger value="add-students" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Add Students
            </TabsTrigger>
            <TabsTrigger value="manage-students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manage Students
            </TabsTrigger>
            <TabsTrigger value="manage-teachers" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Manage Teachers
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Students</p>
                      <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <GraduationCap className="w-12 h-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Active Students</p>
                      <p className="text-3xl font-bold">{students.filter(s => s.isActive && !s.isSuspended).length}</p>
                    </div>
                    <UserCheck className="w-12 h-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Suspended Students</p>
                      <p className="text-3xl font-bold">{students.filter(s => s.isSuspended).length}</p>
                    </div>
                    <Shield className="w-12 h-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Teachers</p>
                      <p className="text-3xl font-bold">{teacherAccess.reduce((acc, ta) => acc + ta.generatedCredentials.length, 0)}</p>
                    </div>
                    <BookOpen className="w-12 h-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Recent Student Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.slice(0, 5).map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${student.isActive && !student.isSuspended ? 'bg-green-500' : student.isSuspended ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last Login</p>
                        <p className="text-sm font-medium">{student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Teachers Tab */}
          <TabsContent value="add-teachers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  Add Teacher Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeacherSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label>Access Method *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="accessMethod"
                          value="registration"
                          checked={teacherFormData.accessMethod === 'registration'}
                          onChange={handleInputChange}
                        />
                        Registration Number
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="accessMethod"
                          value="gmail"
                          checked={teacherFormData.accessMethod === 'gmail'}
                          onChange={handleInputChange}
                        />
                        Gmail
                      </label>
                    </div>
                  </div>

                  {teacherFormData.accessMethod === 'registration' && (
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumbers">Teacher Registration Numbers *</Label>
                      <Input
                        id="registrationNumbers"
                        name="registrationNumbers"
                        value={teacherFormData.registrationNumbers}
                        onChange={handleInputChange}
                        placeholder="Enter teacher registration numbers separated by commas (e.g., T001, T002, T003)"
                        required
                      />
                      <p className="text-sm text-gray-500">Use commas to separate multiple registration numbers</p>
                    </div>
                  )}

                  {teacherFormData.accessMethod === 'gmail' && (
                    <div className="space-y-2">
                      <Label htmlFor="emails">Teacher Email Addresses *</Label>
                      <Input
                        id="emails"
                        name="emails"
                        type="email"
                        value={teacherFormData.emails}
                        onChange={handleInputChange}
                        placeholder="Enter teacher email addresses separated by commas"
                        required
                      />
                      <p className="text-sm text-gray-500">Use commas to separate multiple email addresses</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label>Password Method *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="passwordMethod"
                          value="manual"
                          checked={teacherFormData.passwordMethod === 'manual'}
                          onChange={handleInputChange}
                        />
                        Manual Password
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="passwordMethod"
                          value="auto"
                          checked={teacherFormData.passwordMethod === 'auto'}
                          onChange={handleInputChange}
                        />
                        Auto Generate Password
                      </label>
                    </div>
                  </div>

                  {teacherFormData.passwordMethod === 'manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="defaultPassword">Default Password for All Teachers *</Label>
                      <Input
                        id="defaultPassword"
                        name="defaultPassword"
                        type="password"
                        value={teacherFormData.defaultPassword}
                        onChange={handleInputChange}
                        placeholder="Enter default password for all teachers"
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                    {loading ? 'Creating Teacher Access...' : 'Create Teacher Access (UniTeach Role)'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Students Tab */}
          <TabsContent value="add-students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  Add Student Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label>Access Method *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="accessMethod"
                          value="registration"
                          checked={studentFormData.accessMethod === 'registration'}
                          onChange={(e) => handleInputChange(e, 'student')}
                        />
                        Registration Number
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="accessMethod"
                          value="gmail"
                          checked={studentFormData.accessMethod === 'gmail'}
                          onChange={(e) => handleInputChange(e, 'student')}
                        />
                        Gmail
                      </label>
                    </div>
                  </div>

                  {studentFormData.accessMethod === 'registration' && (
                    <div className="space-y-2">
                      <Label htmlFor="student-registrationNumbers">Student Registration Numbers *</Label>
                      <Input
                        id="student-registrationNumbers"
                        name="registrationNumbers"
                        value={studentFormData.registrationNumbers}
                        onChange={(e) => handleInputChange(e, 'student')}
                        placeholder="Enter student registration numbers separated by commas (e.g., S001, S002, S003)"
                        required
                      />
                    </div>
                  )}

                  {studentFormData.accessMethod === 'gmail' && (
                    <div className="space-y-2">
                      <Label htmlFor="student-emails">Student Email Addresses *</Label>
                      <Input
                        id="student-emails"
                        name="emails"
                        type="email"
                        value={studentFormData.emails}
                        onChange={(e) => handleInputChange(e, 'student')}
                        placeholder="Enter student email addresses separated by commas"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={studentFormData.department}
                        onChange={(e) => handleInputChange(e, 'student')}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        name="year"
                        value={studentFormData.year}
                        onChange={(e) => handleInputChange(e, 'student')}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        name="course"
                        value={studentFormData.course}
                        onChange={(e) => handleInputChange(e, 'student')}
                        placeholder="B.Tech"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Password Method *</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="passwordMethod"
                          value="manual"
                          checked={studentFormData.passwordMethod === 'manual'}
                          onChange={(e) => handleInputChange(e, 'student')}
                        />
                        Manual Password
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="passwordMethod"
                          value="auto"
                          checked={studentFormData.passwordMethod === 'auto'}
                          onChange={(e) => handleInputChange(e, 'student')}
                        />
                        Auto Generate Password
                      </label>
                    </div>
                  </div>

                  {studentFormData.passwordMethod === 'manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="student-defaultPassword">Default Password for All Students *</Label>
                      <Input
                        id="student-defaultPassword"
                        name="defaultPassword"
                        type="password"
                        value={studentFormData.defaultPassword}
                        onChange={(e) => handleInputChange(e, 'student')}
                        placeholder="Enter default password for all students"
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                    {loading ? 'Creating Student Access...' : 'Create Student Access (Student Role)'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Students Tab */}
          <TabsContent value="manage-students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Manage Students ({filteredStudents.length})
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Students</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
                    <p>No students match your current search and filter criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student._id} className="border rounded-lg p-6 bg-gradient-to-r from-white to-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                student.isActive && !student.isSuspended ? 'bg-green-500' : 
                                student.isSuspended ? 'bg-orange-500' : 'bg-red-500'
                              }`}></div>
                              <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                              <Badge variant="outline" className={
                                student.isActive && !student.isSuspended ? 'border-green-500 text-green-700' : 
                                student.isSuspended ? 'border-orange-500 text-orange-700' : 'border-red-500 text-red-700'
                              }>
                                {student.isSuspended ? 'Suspended' : student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Email: {student.email}</div>
                              <div>Registration: {student.registrationNumber || 'N/A'}</div>
                              {student.department && <div>Department: {student.department}</div>}
                              {student.year && <div>Year: {student.year}</div>}
                              {student.course && <div>Course: {student.course}</div>}
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Joined: {new Date(student.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <LogIn className="w-4 h-4" />
                                  Last Login: {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : 'Never'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openActivityModal(student)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Activity
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setEditStudentData(student);
                                setShowEditModal(true);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            {student.isActive && !student.isSuspended ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setSuspensionData({ ...suspensionData, studentId: student._id });
                                  setShowSuspensionModal(true);
                                }}
                                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                              >
                                <Shield className="w-4 h-4" />
                                Suspend
                              </Button>
                            ) : student.isSuspended ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleStudentAction(student._id, 'unsuspend')}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700"
                              >
                                <UserCheck className="w-4 h-4" />
                                Unsuspend
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleStudentAction(student._id, 'activate')}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700"
                              >
                                <UserCheck className="w-4 h-4" />
                                Activate
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete ${student.name}?`)) {
                                  handleStudentAction(student._id, 'delete');
                                }
                              }}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        {student.isSuspended && student.suspensionDetails && (
                          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-medium text-orange-800 mb-1">Suspension Details</h4>
                            <div className="text-sm text-orange-700">
                              <div>Reason: {student.suspensionDetails.reason}</div>
                              <div>Until: {new Date(student.suspensionDetails.until).toLocaleDateString()}</div>
                              <div>Suspended by: {student.suspensionDetails.suspendedBy}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Teachers Tab */}
          <TabsContent value="manage-teachers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Teacher Access Records ({teacherAccess.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading teacher access records...</div>
                ) : teacherAccess.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Teacher Access Records</h3>
                    <p>Create your first teacher access to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {teacherAccess.map((record) => (
                      <div key={record._id} className="border rounded-lg p-6 bg-gradient-to-r from-white to-purple-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Teacher Batch #{record._id.slice(-6)}
                              </h3>
                              <Badge variant="outline" className="capitalize">
                                {record.accessMethod}
                              </Badge>
                              <Badge variant={record.isActive ? "default" : "secondary"} className="bg-purple-600">
                                {record.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Created: {new Date(record.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Key className="w-4 h-4" />
                                  Password: {record.passwordMethod === 'auto' ? 'Auto Generated' : 'Manual'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {record.generatedCredentials.length} Teachers
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {record.generatedCredentials.length > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => downloadCredentials(record)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Credentials
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {record.accessMethod === 'registration' && record.registrationNumbers?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Registration Numbers</h4>
                              <div className="flex flex-wrap gap-1">
                                {record.registrationNumbers.slice(0, 5).map((regNum, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {regNum}
                                  </Badge>
                                ))}
                                {record.registrationNumbers.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{record.registrationNumbers.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {record.accessMethod === 'gmail' && record.emails?.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Email Addresses</h4>
                              <div className="flex flex-wrap gap-1">
                                {record.emails.slice(0, 3).map((email, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {email}
                                  </Badge>
                                ))}
                                {record.emails.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{record.emails.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {record.generatedCredentials.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium text-gray-700 mb-2">Generated Credentials Preview</h4>
                            <div className="bg-gray-50 rounded p-3 text-sm">
                              {record.generatedCredentials.slice(0, 3).map((cred, idx) => (
                                <div key={idx} className="flex justify-between items-center py-1">
                                  <span className="font-mono">{cred.identifier}</span>
                                  <span className="text-gray-500">****** (hidden)</span>
                                </div>
                              ))}
                              {record.generatedCredentials.length > 3 && (
                                <div className="text-center text-gray-500 pt-2">
                                  +{record.generatedCredentials.length - 3} more credentials
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Student Modal */}
        {showEditModal && editStudentData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Student</h3>
              <form onSubmit={handleEditStudent} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editStudentData.name}
                    onChange={(e) => setEditStudentData({...editStudentData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editStudentData.email}
                    onChange={(e) => setEditStudentData({...editStudentData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={editStudentData.department || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, department: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-year">Year</Label>
                  <Input
                    id="edit-year"
                    value={editStudentData.year || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, year: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-course">Course</Label>
                  <Input
                    id="edit-course"
                    value={editStudentData.course || ''}
                    onChange={(e) => setEditStudentData({...editStudentData, course: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Updating...' : 'Update Student'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowEditModal(false);
                      setEditStudentData(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suspension Modal */}
        {showSuspensionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Suspend Student</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleStudentAction(suspensionData.studentId, 'suspend', {
                  days: suspensionData.days,
                  reason: suspensionData.reason
                });
              }} className="space-y-4">
                <div>
                  <Label htmlFor="suspension-days">Suspension Duration (Days)</Label>
                  <Input
                    id="suspension-days"
                    type="number"
                    min="1"
                    max="365"
                    value={suspensionData.days}
                    onChange={(e) => setSuspensionData({...suspensionData, days: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="suspension-reason">Reason for Suspension</Label>
                  <Input
                    id="suspension-reason"
                    value={suspensionData.reason}
                    onChange={(e) => setSuspensionData({...suspensionData, reason: e.target.value})}
                    placeholder="Enter reason for suspension"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700">
                    {loading ? 'Suspending...' : 'Suspend Student'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowSuspensionModal(false);
                      setSuspensionData({ studentId: null, days: 7, reason: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Activity Modal */}
        {showActivityModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Activity Log - {selectedStudent.name}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedStudent(null);
                    setStudentActivities([]);
                  }}
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                {studentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No activity recorded for this student.</p>
                  </div>
                ) : (
                  studentActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.activityType === 'login' ? (
                          <LogIn className="w-5 h-5 text-green-600" />
                        ) : activity.activityType === 'logout' ? (
                          <LogOut className="w-5 h-5 text-red-600" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium capitalize">{activity.activityType.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.ipAddress}
                          </Badge>
                        </div>
                        {activity.details && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>User Agent: {activity.userAgent || 'Unknown'}</p>
                            {activity.details.loginMethod && (
                              <p>Login Method: {activity.details.loginMethod}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const downloadCredentials = (teacherAccessRecord) => {
    if (teacherAccessRecord.generatedCredentials.length === 0) {
      showMessage('No credentials available for download', 'error');
      return;
    }

    let csvContent = 'Identifier,Password,Role,Created Date\n';
    teacherAccessRecord.generatedCredentials.forEach(cred => {
      csvContent += `${cred.identifier},${cred.password},UniTeach,${new Date().toLocaleDateString()}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher_credentials_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
}