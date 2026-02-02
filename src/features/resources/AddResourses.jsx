


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

const AddResourcePage = () => {
  const [formData, setFormData] = useState({
    imageLink: '',
    bookTitle: '',
    publishedDate: '',
    publisherName: '',
    description: '',
    manufactureCompanyName: '',
    pdfLink: '', // New field for PDF link
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_BASE_URL}/resources`, formData);
      alert('Resource added successfully!');
      navigate('/view-books');
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Add New Resource</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Image Link"
              name="imageLink"
              value={formData.imageLink}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Book Title"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleInputChange}
              required
            />
            <Input
              type="month"
              label="Published Date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Publisher Name"
              name="publisherName"
              value={formData.publisherName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="PDF Link"
              name="pdfLink"
              value={formData.pdfLink}
              onChange={handleInputChange}
              required
            />
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Manufacture Company Name"
              name="manufactureCompanyName"
              value={formData.manufactureCompanyName}
              onChange={handleInputChange}
              required
            />
          </form>
        </CardBody>
        <CardFooter>
          <Button color="primary" onClick={handleSubmit}>Add Resource</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddResourcePage;