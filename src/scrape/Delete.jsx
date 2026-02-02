import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import config from '../../config';
import EditMentorForm from './EditMentorForm';

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [editingMentor, setEditingMentor] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/all-mentors`);
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/delete-mentor/${id}`);
      fetchMentors();
    } catch (error) {
      console.error('Error deleting mentor:', error);
    }
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
  };

  const handleUpdate = () => {
    setEditingMentor(null);
    fetchMentors();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mentors</h2>
      {editingMentor ? (
        <EditMentorForm mentor={editingMentor} onUpdate={handleUpdate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <Card key={mentor._id}>
              <CardHeader>
                <CardTitle>{mentor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={mentor.imageUrl} alt={mentor.name} className="w-full h-48 object-cover mb-4" />
                <p>Email: {mentor.email}</p>
                <p>Job Title: {mentor.jobTitle}</p>
                <p>Experience: {mentor.experience} years</p>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleEdit(mentor)}>Edit</Button>
                  <Button onClick={() => handleDelete(mentor._id)} variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorList;
