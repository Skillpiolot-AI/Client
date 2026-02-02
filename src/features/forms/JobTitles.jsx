
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import config from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JobTitlesManagement() {
  const [jobTitles, setJobTitles] = useState([]);
  const [newJobTitles, setNewJobTitles] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchJobTitles();
  }, []);

  const fetchJobTitles = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/job/job-titles`);
      setJobTitles(data);
    } catch (error) {
      toast.error("Failed to fetch job titles");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const titlesToAdd = newJobTitles.split(',').map(title => title.trim());
      await axios.post(`${config.API_BASE_URL}/job/job-titles`, { titles: titlesToAdd });
      toast.success(`Job titles added successfully: ${titlesToAdd.join(', ')}`);
      setNewJobTitles('');
      fetchJobTitles();
    } catch (error) {
      toast.error("Failed to add job titles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/job/job-titles/${id}`);
      toast.success("Job title deleted successfully");
      fetchJobTitles();
    } catch (error) {
      toast.error("Failed to delete job title");
    }
  };

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        await axios.put(`${config.API_BASE_URL}/job/job-titles/${id}`, { title: editValue });
        toast.success("Job title updated successfully");
        setEditingId(null);
        fetchJobTitles();
      } catch (error) {
        toast.error("Failed to update job title");
      }
    } else {
      setEditingId(id);
      setEditValue(jobTitles.find(title => title._id === id).title);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Job Titles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={newJobTitles}
              onChange={(e) => setNewJobTitles(e.target.value)}
              placeholder="Enter job titles (comma separated)"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Job Titles
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            {jobTitles.map((title) => (
              <div key={title._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                {editingId === title._id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow mr-2"
                  />
                ) : (
                  <span>{title.title}</span>
                )}
                <div>
                  <Button onClick={() => handleEdit(title._id)} size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(title._id)} size="sm" variant="ghost" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
