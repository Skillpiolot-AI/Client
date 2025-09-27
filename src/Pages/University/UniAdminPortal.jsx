import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Plus, Users, School, MapPin, Calendar, Key } from "lucide-react";
import config from '../../config';

export default function UniAdminPortal() {
  const [university, setUniversity] = useState(null);
  const [teacherAccess, setTeacherAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Form state for teacher access
  const [teacherFormData, setTeacherFormData] = useState({
    accessMethod: 'registration',
    registrationNumbers: '',
    emails: '',
    passwordMethod: 'manual',
    defaultPassword: ''
  });

  useEffect(() => {
    fetchUniversity();
    fetchTeacherAccess();
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

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
      
      // Download Excel file if auto password was used
      if (response.data.excelFile) {
        const blob = new Blob([new Uint8Array(atob(response.data.excelFile).split('').map(c => c.charCodeAt(0)))], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${university.name}_teacher_credentials.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      // Reset form
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

  const downloadCredentials = (teacherAccessRecord) => {
    if (teacherAccessRecord.generatedCredentials.length === 0) {
      showMessage('No credentials available for download', 'error');
      return;
    }

    // Create CSV content
    let csvContent = 'Identifier,Password,Role,Created Date\n';
    teacherAccessRecord.generatedCredentials.forEach(cred => {
      csvContent += `${cred.identifier},${cred.password},UniTeach,${new Date(cred.createdAt).toLocaleDateString()}\n`;
    });

    // Create and download file
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
              <h1 className="text-3xl font-bold text-gray-800">University Portal</h1>
              <p className="text-gray-600">Teacher Management System</p>
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
                  <Badge variant="secondary" className="bg-white text-purple-700">
                    UniAdmin Portal
                  </Badge>
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

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Teachers
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manage Teacher Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Add Teacher Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter teacher email addresses separated by commas (e.g., teacher1@gmail.com, teacher2@gmail.com)"
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

                  {teacherFormData.passwordMethod === 'auto' && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-purple-700 text-sm">
                        <strong>Auto Password Generation:</strong> Unique passwords will be automatically generated for each teacher. 
                        An Excel file with all credentials will be automatically downloaded after creation.
                      </p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                    {loading ? 'Creating Teacher Access...' : 'Create Teacher Access (UniTeach Role)'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Teacher Access Records ({teacherAccess.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading teacher access records...</div>
                ) : teacherAccess.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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
      </div>
    </div>
  );
}