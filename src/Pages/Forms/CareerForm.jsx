import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Save, Trash2 } from 'lucide-react';
import axios from 'axios';
import config from '../../config';

const CareerForm = ({ initialData, onSave, onDelete }) => {
  const [formData, setFormData] = useState(initialData || {
    industry: '',
    category: '',
    jobTitle: '',
    averageSalary: '',
    description: '',
    skills: [''],
    companies: [''],
    education: [''],
    workEnvironment: '',
    jobOutlook: '',
    challenges: [''],
    rewards: [''],
    topColleges: [{ name: '', fees: '', duration: '' }],
    hiringTrends: [{ year: '', hires: '' }],
    salaryTrends: [{ year: '', salary: '' }]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e, index, field, subfield) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      if (field) {
        const updatedField = [...prevData[field]];
        if (subfield) {
          updatedField[index] = { ...updatedField[index], [subfield]: value };
        } else {
          updatedField[index] = value;
        }
        return { ...prevData, [field]: updatedField };
      }
      return { ...prevData, [name]: value };
    });
  };

  const addField = (field) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: [...prevData[field], field === 'topColleges' ? { name: '', fees: '', duration: '' } : field === 'hiringTrends' || field === 'salaryTrends' ? { year: '', [field === 'hiringTrends' ? 'hires' : 'salary']: '' } : '']
    }));
  };

  const removeField = (field, index) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData && initialData._id) {
        // Update existing career
        await axios.put(`${config.API_BASE_URL}/careers/${initialData._id}`, formData);
      } else {
        // Create new career
        await axios.post(`${config.API_BASE_URL}/careers`, formData);
      }
      onSave(formData);
    } catch (error) {
      console.error('Error saving career data:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async () => {
    if (initialData && initialData._id) {
      try {
        await axios.delete(`${config.API_BASE_URL}/careers/${initialData._id}`);
        onDelete(initialData._id);
      } catch (error) {
        console.error('Error deleting career data:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="industry">
          Industry
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="industry"
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="Industry"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Category
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
          Job Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="jobTitle"
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Job Title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="averageSalary">
          Average Salary
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="averageSalary"
          type="text"
          name="averageSalary"
          value={formData.averageSalary}
          onChange={handleChange}
          placeholder="Average Salary"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="3"
        />
      </div>

      {['skills', 'companies', 'education', 'challenges', 'rewards'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          {formData[field].map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                type="text"
                value={item}
                onChange={(e) => handleChange(e, index, field)}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeField(field, index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <MinusCircle size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(field)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workEnvironment">
          Work Environment
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="workEnvironment"
          type="text"
          name="workEnvironment"
          value={formData.workEnvironment}
          onChange={handleChange}
          placeholder="Work Environment"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobOutlook">
          Job Outlook
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="jobOutlook"
          type="text"
          name="jobOutlook"
          value={formData.jobOutlook}
          onChange={handleChange}
          placeholder="Job Outlook"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Top Colleges
        </label>
        {formData.topColleges.map((college, index) => (
          <div key={index} className="flex mb-2">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              type="text"
              value={college.name}
              onChange={(e) => handleChange(e, index, 'topColleges', 'name')}
              placeholder="College Name"
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              type="text"
              value={college.fees}
              onChange={(e) => handleChange(e, index, 'topColleges', 'fees')}
              placeholder="Fees"
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              type="text"
              value={college.duration}
              onChange={(e) => handleChange(e, index, 'topColleges', 'duration')}
              placeholder="Duration"
            />
            <button
              type="button"
              onClick={() => removeField('topColleges', index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <MinusCircle size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField('topColleges')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <PlusCircle size={20} />
        </button>
      </div>

      {['hiringTrends', 'salaryTrends'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field === 'hiringTrends' ? 'Hiring Trends' : 'Salary Trends'}
          </label>
          {formData[field].map((trend, index) => (
            <div key={index} className="flex mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                type="number"
                value={trend.year}
                onChange={(e) => handleChange(e, index, field, 'year')}
                placeholder="Year"
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                type="number"
                value={trend[field === 'hiringTrends' ? 'hires' : 'salary']}
                onChange={(e) => handleChange(e, index, field, field === 'hiringTrends' ? 'hires' : 'salary')}
                placeholder={field === 'hiringTrends' ? 'Hires' : 'Salary'}
              />
              <button
                type="button"
                onClick={() => removeField(field, index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <MinusCircle size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(field)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
        >
          <Save size={20} className="mr-2" />
          Save
        </button>
        {initialData && initialData._id && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <Trash2 size={20} className="mr-2" />
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default CareerForm;