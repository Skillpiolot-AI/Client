


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import config from '../../config';

export default function RecommendationForm() {
  const [formData, setFormData] = useState({
    tenthPercentage: '',
    afterTenthStream: '',
    twelfthPercentage: '',
    jobPreference: '',
    interest: '',
    strength: '',
    jobTitle: '',
    averageSalary: '',
    jobDescription: '',
    topCompanies: [''],
    skills: [''],
    requiredEducation: [{ college: '', fees: '', duration: '' }],
    salaryTrends: Array.from({ length: 11 }, (_, i) => ({ year: 2014 + i, salary: '' })),
    hiringTrends: Array.from({ length: 11 }, (_, i) => ({ year: 2014 + i, hired: '' })),
    workEnvironment: '',
    challenges: [''],
    rewards: ['']
  });

  const [recommendations, setRecommendations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    interests: [],
    strengths: [],
    companies: [],
    skills: [],
    colleges: []
  });

  useEffect(() => {
    fetchRecommendations();
    fetchDropdownData();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      toast.error("Failed to fetch recommendations");
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [interestsRes, strengthsRes, companiesRes, skillsRes, collegesRes] = await Promise.all([
        axios.get(`${config.API_BASE_URL}/job/interests`),
        axios.get(`${config.API_BASE_URL}/job/strengths`),
        axios.get(`${config.API_BASE_URL}/job/companies`),
        axios.get(`${config.API_BASE_URL}/job/skills`),
        axios.get(`${config.API_BASE_URL}/job/colleges`)
      ]);
      setDropdownData({
        interests: interestsRes.data,
        strengths: strengthsRes.data,
        companies: companiesRes.data,
        skills: skillsRes.data,
        colleges: collegesRes.data
      });
    } catch (error) {
      toast.error("Failed to fetch dropdown data");
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => {
        if (i === index) {
          if (typeof value === 'object') {
            return { ...item, ...value };
          } else {
            return value;
          }
        }
        return item;
      })
    }));
  };

  const handleAddField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'requiredEducation' ? { college: '', fees: '', duration: '' } : '']
    }));
  };

  const handleRemoveField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const processedFormData = {
        ...formData,
        requiredEducation: formData.requiredEducation.map(edu => ({
          college: edu.college,
          fees: parseFloat(edu.fees) || 0,
          duration: edu.duration
        })).filter(edu => edu.college.trim() !== '')
      };
      
      if (editingId) {
        await axios.put(`${config.API_BASE_URL}/recommendations/${editingId}`, processedFormData);
        toast.success("Recommendation updated successfully");
      } else {
        await axios.post(`${config.API_BASE_URL}/recommendations`, processedFormData);
        toast.success("Recommendation added successfully");
      }
      
      fetchRecommendations();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit recommendation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (recommendation) => {
    setFormData(recommendation);
    setEditingId(recommendation._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recommendation?")) {
      try {
        await axios.delete(`${config.API_BASE_URL}/recommendations/${id}`);
        toast.success("Recommendation deleted");
        fetchRecommendations();
      } catch (error) {
        toast.error("Failed to delete recommendation");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tenthPercentage: '',
      afterTenthStream: '',
      twelfthPercentage: '',
      jobPreference: '',
      interest: '',
      strength: '',
      jobTitle: '',
      averageSalary: '',
      jobDescription: '',
      topCompanies: [''],
      skills: [''],
      requiredEducation: [{ college: '', fees: '', duration: '' }],
      salaryTrends: Array.from({ length: 11 }, (_, i) => ({ year: 2014 + i, salary: '' })),
      hiringTrends: Array.from({ length: 11 }, (_, i) => ({ year: 2014 + i, hired: '' })),
      workEnvironment: '',
      challenges: [''],
      rewards: ['']
    });
    setEditingId(null);
  };

  const renderSelect = (name, options, placeholder, index = null) => (
    <Select 
      onValueChange={(value) => index !== null ? handleArrayInputChange(index, name, value) : handleInputChange(name, value)} 
      value={index !== null ? formData[name][index] : formData[name]}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderSectionTitle = (title) => (
    <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">{title}</h3>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Career Recommendation Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderSectionTitle("Educational Background")}
          {renderSelect('tenthPercentage', 
            ['More than 50', 'More than 60', 'More than 70', 'More than 80', 'More than 90'].map(option => ({ value: option, label: option })),
            'Select 10th Percentage'
          )}

          {renderSelect('afterTenthStream', 
            ['Science', 'Commerce', 'Arts'].map(option => ({ value: option, label: option })),
            'Select Stream after 10th'
          )}

          {renderSelect('twelfthPercentage', 
            ['More than 50', 'More than 60', 'More than 70', 'More than 80', 'More than 90'].map(option => ({ value: option, label: option })),
            'Select 12th Percentage'
          )}

          {renderSectionTitle("Career Preferences")}
          {renderSelect('jobPreference', 
            ['Government', 'Private'].map(option => ({ value: option, label: option })),
            'Select Job Preference'
          )}

          {renderSelect('interest', 
            dropdownData.interests.map(interest => ({ value: interest.name, label: interest.name })),
            'Select Interest'
          )}

          {renderSelect('strength', 
            dropdownData.strengths.map(strength => ({ value: strength.name, label: strength.name })),
            'Select Strength'
          )}

          {renderSectionTitle("Job Details")}
          <Input
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="Job Title"
            className="w-full"
          />

          <Input
            value={formData.averageSalary}
            onChange={(e) => handleInputChange('averageSalary', e.target.value)}
            placeholder="Average Salary (in Rupees)"
            type="number"
            className="w-full"
          />

          <Textarea
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            placeholder="Job Description"
            className="w-full"
          />

          {renderSectionTitle("Top Companies")}
          {formData.topCompanies.map((company, index) => (
            <div key={index} className="flex space-x-2">
              {renderSelect('topCompanies', 
                dropdownData.companies.map(company => ({ value: company.name, label: company.name })),
                'Select Company',
                index
              )}
              <Button onClick={() => handleRemoveField('topCompanies', index)} size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddField('topCompanies')} type="button" variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Company
          </Button>

          {renderSectionTitle("Required Skills")}
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex space-x-2">
              {renderSelect('skills', 
                dropdownData.skills.map(skill => ({ value: skill.name, label: skill.name })),
                'Select Skill',
                index
              )}
              <Button onClick={() => handleRemoveField('skills', index)} size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddField('skills')} type="button" variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Skill
          </Button>

          {renderSectionTitle("Required Education")}
          {formData.requiredEducation.map((edu, index) => (
            <div key={index} className="flex space-x-2">
              <Select 
                onValueChange={(value) => handleArrayInputChange(index, 'requiredEducation', { ...edu, college: value })}value={edu.college}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select College" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData.colleges.map((college) => (
                      <SelectItem key={college.name} value={college.name}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={edu.fees}
                  onChange={(e) => handleArrayInputChange(index, 'requiredEducation', { ...edu, fees: e.target.value })}
                  placeholder="Fees"
                  type="number"
                  className="w-1/3"
                />
                <Input
                  value={edu.duration}
                  onChange={(e) => handleArrayInputChange(index, 'requiredEducation', { ...edu, duration: e.target.value })}
                  placeholder="Duration"
                  className="w-1/3"
                />
                <Button onClick={() => handleRemoveField('requiredEducation', index)} size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={() => handleAddField('requiredEducation')} type="button" variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Education
            </Button>
  
            {renderSectionTitle("Salary Trends")}
            <div className="grid grid-cols-2 gap-4">
              {formData.salaryTrends.map((trend, index) => (
                <Input
                  key={trend.year}
                  value={trend.salary}
                  onChange={(e) => handleArrayInputChange(index, 'salaryTrends', { ...trend, salary: e.target.value })}
                  placeholder={`Salary for ${trend.year}`}
                  type="number"
                  className="w-full"
                />
              ))}
            </div>
  
            {renderSectionTitle("Hiring Trends")}
            <div className="grid grid-cols-2 gap-4">
              {formData.hiringTrends.map((trend, index) => (
                <Input
                  key={trend.year}
                  value={trend.hired}
                  onChange={(e) => handleArrayInputChange(index, 'hiringTrends', { ...trend, hired: e.target.value })}
                  placeholder={`Hired in ${trend.year}`}
                  type="number"
                  className="w-full"
                />
              ))}
            </div>
  
            {renderSectionTitle("Work Environment")}
            {renderSelect('workEnvironment', 
              ['Offline', 'Online', 'Hybrid'].map(option => ({ value: option, label: option })),
              'Select Work Environment'
            )}
  
            {renderSectionTitle("Challenges")}
            {formData.challenges.map((challenge, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={challenge}
                  onChange={(e) => handleArrayInputChange(index, 'challenges', e.target.value)}
                  placeholder={`Challenge ${index + 1}`}
                  className="w-full"
                />
                <Button onClick={() => handleRemoveField('challenges', index)} size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={() => handleAddField('challenges')} type="button" variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Challenge
            </Button>
  
            {renderSectionTitle("Rewards")}
            {formData.rewards.map((reward, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={reward}
                  onChange={(e) => handleArrayInputChange(index, 'rewards', e.target.value)}
                  placeholder={`Reward ${index + 1}`}
                  className="w-full"
                />
                <Button onClick={() => handleRemoveField('rewards', index)} size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={() => handleAddField('rewards')} type="button" variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Reward
            </Button>
  
            <div className="flex space-x-4 mt-8">
              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingId ? 'Update' : 'Submit'} Recommendation
              </Button>
              {editingId && (
                <Button onClick={resetForm} type="button" className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
  
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Existing Recommendations</h3>
            {recommendations.map((rec) => (
              <div key={rec._id} className="border p-4 mb-4 rounded">
                <h4 className="font-bold">{rec.jobTitle}</h4>
                <p>Average Salary: ₹{rec.averageSalary}</p>
                <div className="mt-2">
                  <Button onClick={() => handleEdit(rec)} className="mr-2" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(rec._id)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }