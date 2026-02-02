import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import config from '../../config';
import { toast } from 'react-hot-toast';

export default function CollegesManagement() {
  const [colleges, setColleges] = useState([]);
  const [newCollege, setNewCollege] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/job/colleges`);
      setColleges(data);
    } catch (error) {
      toast.error("Failed to fetch colleges");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const collegesToAdd = newCollege.split(',').map(college => college.trim());
      await axios.post(`${config.API_BASE_URL}/job/colleges`, { colleges: collegesToAdd });
      toast.success("Colleges added successfully");
      setNewCollege('');
      fetchColleges();
    } catch (error) {
      toast.error("Failed to add colleges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/job/colleges/${id}`);
      toast.success("College deleted successfully");
      fetchColleges();
    } catch (error) {
      toast.error("Failed to delete college");
    }
  };

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        await axios.put(`${config.API_BASE_URL}/job/colleges/${id}`, { name: editValue });
        toast.success("College updated successfully");
        setEditingId(null);
        fetchColleges();
      } catch (error) {
        toast.error("Failed to update college");
      }
    } else {
      setEditingId(id);
      setEditValue(colleges.find(college => college._id === id).name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Colleges Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={newCollege}
              onChange={(e) => setNewCollege(e.target.value)}
              placeholder="Enter college names (comma separated)"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Colleges
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            {colleges.map((college) => (
              <div key={college._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                {editingId === college._id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow mr-2"
                  />
                ) : (
                  <span>{college.name}</span>
                )}
                <div>
                  <Button onClick={() => handleEdit(college._id)} size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(college._id)} size="sm" variant="ghost" className="text-red-600">
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
