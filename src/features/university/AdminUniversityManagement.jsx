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
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  School, 
  Users, 
  MapPin, 
  RefreshCw, 
  AlertCircle, 
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Building
} from "lucide-react";
import config from '../../config';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook

export default function AdminUniversityManagement() {
  const { user, isAuthenticated, hasRole, logout } = useAuth(); // Use auth context
  
  // State management
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    location: {
      state: '',
      city: ''
    },
    accessMethod: 'registration',
    registrationNumbers: '',
    emails: '',
    passwordMethod: 'manual',
    defaultPassword: ''
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [expandedUniversity, setExpandedUniversity] = useState(null);

  // Initialize component
  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated()) {
      showMessage('Please login to access this page.', 'error');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    if (!hasRole('Admin')) {
      showMessage('Access denied. Administrator privileges required.', 'error');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }

    // Fetch universities if authenticated and authorized
    fetchUniversities();
  }, [user]);

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Handle authentication errors
  const handleAuthError = (error) => {
    console.error('API Authentication Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      showMessage('Session expired. Please login again.', 'error');
      logout(); // Use auth context logout
    } else if (error.response?.status === 403) {
      showMessage('Access forbidden. Administrator privileges required.', 'error');
    } else if (error.response?.status === 423) {
      showMessage('Account temporarily locked. Please try again later.', 'error');
    }
  };

  // Fetch universities from API
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      console.log('Fetching universities...');
      
      const headers = getAuthHeaders();
      const response = await axios.get(`${config.API_BASE_URL}/university/universities`, { headers });
      
      console.log('Universities API Response:', response.data);
      
      if (response.data.success) {
        setUniversities(response.data.universities || []);
        console.log(`Successfully loaded ${response.data.universities?.length || 0} universities`);
      } else {
        throw new Error(response.data.message || 'Failed to fetch universities');
      }
    } catch (error) {
      console.error('Fetch universities error:', error);
      handleAuthError(error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unable to fetch universities';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Display messages to user
  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push('University name is required');
    }
    
    if (!formData.url.trim()) {
      errors.push('University URL is required');
    } else {
      try {
        new URL(formData.url);
      } catch {
        errors.push('Please enter a valid URL');
      }
    }
    
    if (!formData.location.state.trim()) {
      errors.push('State is required');
    }
    
    if (!formData.location.city.trim()) {
      errors.push('City is required');
    }
    
    if (formData.accessMethod === 'registration' && !formData.registrationNumbers.trim()) {
      errors.push('Registration numbers are required for registration access method');
    }
    
    if (formData.accessMethod === 'gmail' && !formData.emails.trim()) {
      errors.push('Email addresses are required for Gmail access method');
    }
    
    if (formData.passwordMethod === 'manual' && !formData.defaultPassword.trim()) {
      errors.push('Default password is required for manual password method');
    }
    
    if (formData.passwordMethod === 'manual' && formData.defaultPassword.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
      showMessage(errors.join('. '), 'error');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('Submitting university creation with data:', formData);

    try {
      const headers = getAuthHeaders();
      const response = await axios.post(
        `${config.API_BASE_URL}/university/create-university`, 
        formData, 
        { headers }
      );

      console.log('University creation response:', response.data);

      if (response.data.success) {
        showMessage(
          `University "${formData.name}" created successfully! ${response.data.createdUsers} user accounts created.`, 
          'success'
        );
        
        // Handle Excel file download for auto-generated passwords
        if (response.data.excelFile) {
          try {
            const byteCharacters = atob(response.data.excelFile);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${formData.name.replace(/\s+/g, '_')}_credentials.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showMessage('Credentials file downloaded successfully!', 'success');
          } catch (downloadError) {
            console.error('File download error:', downloadError);
            showMessage('University created successfully, but credentials file download failed.', 'error');
          }
        }

        // Reset form to initial state
        setFormData({
          name: '',
          url: '',
          location: { state: '', city: '' },
          accessMethod: 'registration',
          registrationNumbers: '',
          emails: '',
          passwordMethod: 'manual',
          defaultPassword: ''
        });

        // Refresh university list
        fetchUniversities();
      } else {
        throw new Error(response.data.message || 'University creation failed');
      }
    } catch (error) {
      console.error('University creation error:', error);
      handleAuthError(error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create university';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Start editing a university
  const handleEdit = (university) => {
    setEditingId(university._id);
    setEditData({
      name: university.name,
      url: university.url,
      location: { ...university.location },
      isActive: university.isActive
    });
  };

  // Submit university updates
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!editData.name?.trim() || !editData.url?.trim() || 
        !editData.location?.state?.trim() || !editData.location?.city?.trim()) {
      showMessage('All fields are required for university update', 'error');
      return;
    }

    setLoading(true);
    console.log('Updating university:', editingId, editData);

    try {
      const headers = getAuthHeaders();
      const response = await axios.put(
        `${config.API_BASE_URL}/university/update-university/${editingId}`, 
        editData, 
        { headers }
      );

      if (response.data.success) {
        showMessage('University updated successfully!', 'success');
        setEditingId(null);
        setEditData({});
        fetchUniversities();
      } else {
        throw new Error(response.data.message || 'University update failed');
      }
    } catch (error) {
      console.error('University update error:', error);
      handleAuthError(error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update university';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete university
  const handleDelete = async (universityId, universityName) => {
    const confirmMessage = `Are you sure you want to delete "${universityName}"?\n\nThis will:\n- Deactivate the university\n- Potentially affect associated user accounts\n- This action cannot be undone`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    console.log('Deleting university:', universityId);

    try {
      const headers = getAuthHeaders();
      const response = await axios.delete(
        `${config.API_BASE_URL}/university/delete-university/${universityId}`, 
        { headers }
      );

      if (response.data.success) {
        showMessage(`University "${universityName}" deleted successfully!`, 'success');
        fetchUniversities();
      } else {
        throw new Error(response.data.message || 'University deletion failed');
      }
    } catch (error) {
      console.error('University deletion error:', error);
      handleAuthError(error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to delete university';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit operation
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Refresh universities list
  const handleRefresh = () => {
    console.log('Refreshing universities list...');
    fetchUniversities();
  };

  // Toggle university details expansion
  const toggleUniversityExpansion = (universityId) => {
    setExpandedUniversity(expandedUniversity === universityId ? null : universityId);
  };

  // Show unauthorized access if not authenticated or not admin
  if (!isAuthenticated() || !hasRole('Admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Access Denied</h2>
            <p className="text-gray-600 mb-6">Administrator privileges required to access this page.</p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/login'}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Go to Login
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Building className="w-10 h-10 text-blue-600" />
                University Management System
              </h1>
              <p className="text-gray-600 text-lg">
                Manage university access and permissions 
                <Badge variant="secondary" className="ml-2">Role: {user?.role}</Badge>
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 hover:bg-blue-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                Total Universities: {universities.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${
            messageType === 'error' 
              ? 'border-red-500 bg-red-50' 
              : 'border-green-500 bg-green-50'
          }`}>
            <div className="flex items-center gap-2">
              {messageType === 'error' ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <AlertDescription className={
                messageType === 'error' ? 'text-red-700' : 'text-green-700'
              }>
                {message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-blue-100">
              <Plus className="w-4 h-4" />
              Create University
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2 data-[state=active]:bg-blue-100">
              <School className="w-4 h-4" />
              Manage Universities ({universities.length})
            </TabsTrigger>
          </TabsList>

          {/* Create University Tab */}
          <TabsContent value="create">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Plus className="w-6 h-6" />
                  Create New University
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        University Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Massachusetts Institute of Technology"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-sm font-medium text-gray-700">
                        University URL *
                      </Label>
                      <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                          id="url"
                          name="url"
                          type="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          placeholder="https://www.university.edu"
                          required
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location.state" className="text-sm font-medium text-gray-700">
                        State *
                      </Label>
                      <Input
                        id="location.state"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleInputChange}
                        placeholder="e.g., California"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location.city" className="text-sm font-medium text-gray-700">
                        City *
                      </Label>
                      <Input
                        id="location.city"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleInputChange}
                        placeholder="e.g., Los Angeles"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Access Method */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                    <Label className="text-lg font-medium text-gray-800">Access Method *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="accessMethod"
                          value="registration"
                          checked={formData.accessMethod === 'registration'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-800">Registration Number</div>
                          <div className="text-sm text-gray-600">Use student registration numbers</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="accessMethod"
                          value="gmail"
                          checked={formData.accessMethod === 'gmail'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-800">Gmail</div>
                          <div className="text-sm text-gray-600">Use Gmail email addresses</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Access Credentials */}
                  {formData.accessMethod === 'registration' && (
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumbers" className="text-sm font-medium text-gray-700">
                        Registration Numbers *
                      </Label>
                      <Input
                        id="registrationNumbers"
                        name="registrationNumbers"
                        value={formData.registrationNumbers}
                        onChange={handleInputChange}
                        placeholder="2021001, 2021002, 2021003, 2021004"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-sm text-gray-500">
                        Enter registration numbers separated by commas. Each will create a UniAdmin account.
                      </p>
                    </div>
                  )}

                  {formData.accessMethod === 'gmail' && (
                    <div className="space-y-2">
                      <Label htmlFor="emails" className="text-sm font-medium text-gray-700">
                        Email Addresses *
                      </Label>
                      <Input
                        id="emails"
                        name="emails"
                        value={formData.emails}
                        onChange={handleInputChange}
                        placeholder="admin1@gmail.com, admin2@gmail.com, admin3@gmail.com"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-sm text-gray-500">
                        Enter Gmail addresses separated by commas. Each will create a UniAdmin account.
                      </p>
                    </div>
                  )}

                  {/* Password Method */}
                  <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                    <Label className="text-lg font-medium text-gray-800">Password Method *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="passwordMethod"
                          value="manual"
                          checked={formData.passwordMethod === 'manual'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-800">Manual Password</div>
                          <div className="text-sm text-gray-600">Set a default password for all users</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="passwordMethod"
                          value="auto"
                          checked={formData.passwordMethod === 'auto'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-gray-800">Auto Generate</div>
                          <div className="text-sm text-gray-600">Generate secure passwords automatically</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Manual Password Input */}
                  {formData.passwordMethod === 'manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="defaultPassword" className="text-sm font-medium text-gray-700">
                        Default Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="defaultPassword"
                          name="defaultPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.defaultPassword}
                          onChange={handleInputChange}
                          placeholder="Enter secure default password"
                          required
                          minLength="6"
                          className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Password must be at least 6 characters long. All UniAdmin accounts will use this password.
                      </p>
                    </div>
                  )}

                  {/* Auto Password Notice */}
                  {formData.passwordMethod === 'auto' && (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Automatic Password Generation</h4>
                          <p className="text-blue-700 text-sm">
                            Secure passwords will be automatically generated for all UniAdmin accounts. 
                            An Excel file containing all credentials will be downloaded immediately after creation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Creating University...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create University & Generate UniAdmin Access
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Universities Tab */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="w-5 h-5" />
                  Manage Universities ({universities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                    Loading universities...
                  </div>
                ) : universities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <School className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">No Universities Found</h3>
                    <p>Create your first university to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {universities.map((university) => (
                      <div key={university._id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        {editingId === university._id ? (
                          <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-name">University Name</Label>
                                <Input
                                  id="edit-name"
                                  name="name"
                                  value={editData.name || ''}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-url">University URL</Label>
                                <Input
                                  id="edit-url"
                                  name="url"
                                  type="url"
                                  value={editData.url || ''}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-state">State</Label>
                                <Input
                                  id="edit-state"
                                  name="location.state"
                                  value={editData.location?.state || ''}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-city">City</Label>
                                <Input
                                  id="edit-city"
                                  name="location.city"
                                  value={editData.location?.city || ''}
                                  onChange={handleEditInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="edit-active"
                                name="isActive"
                                checked={editData.isActive || false}
                                onChange={(e) => setEditData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 text-blue-600"
                              />
                              <Label htmlFor="edit-active">Active</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" size="sm" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-800">{university.name}</h3>
                                  <Badge variant={university.isActive ? "default" : "secondary"}>
                                    {university.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {university.location.city}, {university.location.state}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <a href={university.url} target="_blank" rel="noopener noreferrer" 
                                       className="text-blue-600 hover:underline">
                                      {university.url}
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(university)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(university._id, university.name)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Access Method</h4>
                                <Badge variant="outline" className="capitalize">
                                  {university.accessMethod}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Password Method</h4>
                                <Badge variant="outline" className="capitalize">
                                  {university.passwordMethod}
                                </Badge>
                              </div>
                              
                              {university.accessMethod === 'registration' && university.registrationNumbers?.length > 0 && (
                                <div className="md:col-span-2">
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Registration Numbers ({university.registrationNumbers.length})
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {university.registrationNumbers.slice(0, 5).map((regNum, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {regNum}
                                      </Badge>
                                    ))}
                                    {university.registrationNumbers.length > 5 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{university.registrationNumbers.length - 5} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              {university.accessMethod === 'gmail' && university.emails?.length > 0 && (
                                <div className="md:col-span-2">
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Email Addresses ({university.emails.length})
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {university.emails.slice(0, 3).map((email, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {email}
                                      </Badge>
                                    ))}
                                    {university.emails.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{university.emails.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="md:col-span-2 text-xs text-gray-500">
                                Created: {new Date(university.createdAt).toLocaleDateString()} | 
                                Last Updated: {new Date(university.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}