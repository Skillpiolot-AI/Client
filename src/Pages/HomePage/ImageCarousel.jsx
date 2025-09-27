
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import config from '../../config';

const ImageCarousel = () => {
  const [workshops, setWorkshops] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    if (workshops.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % workshops.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [workshops]);

  const fetchWorkshops = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/workshops`);
      setWorkshops(response.data);
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + workshops.length) % workshops.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % workshops.length);
  };

  if (workshops.length === 0) {
    return null; // Or a loading indicator
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 50}%)` }}
      >
        {workshops.map((workshop, index) => (
          <Card 
            key={workshop._id} 
            className="w-1/2 flex-shrink-0 m-2 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <img 
              src={`${config.API_BASE_URL1}${workshop.banner}`}
              alt={workshop.title} 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{workshop.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(workshop.date).toLocaleDateString()} | {workshop.time}
              </p>
            </div>
          </Card>
        ))}
      </div>
      <Button 
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button 
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ImageCarousel;