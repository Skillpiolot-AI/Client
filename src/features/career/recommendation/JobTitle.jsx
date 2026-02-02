
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import config from '../../config';

const RecommendationJobTitlesSearch = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${config.API_BASE_URL}/careers/job-titles`);
        console.log('Fetched job titles:', response.data);
        setJobTitles(response.data);
        setFilteredJobTitles(response.data);
      } catch (error) {
        console.error('Error fetching job titles:', error);
        setError('Failed to fetch job titles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobTitles();
  }, []);

  useEffect(() => {
    const filtered = jobTitles.filter(title =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobTitles(filtered);
  }, [searchTerm, jobTitles]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleJobSelect = async (jobTitle) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching details for job title:', jobTitle);
      const response = await axios.get(`${config.API_BASE_URL}/careers/suggestion`, {
        params: { jobTitle }
      });
      const jobDetails = response.data;
      console.log('Received job details:', jobDetails);
      if (jobDetails && !jobDetails.error) {
        navigate('/job-details', { state: { job: jobDetails } });
      } else {
        setError('Job details not found or error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching job details:', error.response?.data || error.message);
      setError('Failed to fetch job details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recommended Job Titles</h1>
      <Input
        type="text"
        placeholder="Search job titles..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading job titles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobTitles.length > 0 ? (
            filteredJobTitles.map((title, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="mb-2">{title}</p>
                  <Button 
                    onClick={() => handleJobSelect(title)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No job titles found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationJobTitlesSearch;