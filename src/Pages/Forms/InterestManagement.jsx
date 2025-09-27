import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import config from '../../config';
import { toast } from 'react-hot-toast';

export default function InterestManagement() {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/job/interests`);
      setInterests(data);
    } catch (error) {
      toast.error("Failed to fetch interests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const interestsToAdd = newInterest.split(',').map(interest => interest.trim());
      await axios.post(`${config.API_BASE_URL}/job/interests`, { interests: interestsToAdd });
      toast.success("Interests added successfully");
      setNewInterest('');
      fetchInterests();
    } catch (error) {
      toast.error("Failed to add interests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/job/interests/${id}`);
      toast.success("Interest deleted successfully");
      fetchInterests();
    } catch (error) {
      toast.error("Failed to delete interest");
    }
  };

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        await axios.put(`${config.API_BASE_URL}/job/interests/${id}`, { name: editValue });
        toast.success("Interest updated successfully");
        setEditingId(null);
        fetchInterests();
      } catch (error) {
        toast.error("Failed to update interest");
      }
    } else {
      setEditingId(id);
      setEditValue(interests.find(interest => interest._id === id).name);
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
          <CardTitle className="text-2xl font-bold text-gray-800">Interest Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Enter interests (comma separated)"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Interests
            </Button>
          </form>
          <div className="mt-6 space-y-2">
            {interests.map((interest) => (
              <div key={interest._id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                {editingId === interest._id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow mr-2"
                  />
                ) : (
                  <span>{interest.name}</span>
                )}
                <div>
                  <Button onClick={() => handleEdit(interest._id)} size="sm" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(interest._id)} size="sm" variant="ghost" className="text-red-600">
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
