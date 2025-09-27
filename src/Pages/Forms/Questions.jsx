import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobDetailsModal from './JobDetail';
import config from '../../config';

const questions = [
  {
    id: 'tenthPercentage',
    question: "What percentage did you score in your 10th-grade exams?",
    options: [
      { value: 'More than 50', meme: "Every journey starts with a single step! 🚶‍♂️" },
      { value: 'More than 60', meme: "Slow and steady wins the race! 🐢" },
      { value: 'More than 70', meme: "Now we're cooking with gas! 🔥" },
      { value: 'More than 80', meme: "Einstein, is that you? 🧠" },
      { value: 'More than 90', meme: "You're on fire! 🚒 Someone call the fire department!" }
    ]
  },
  {
    id: 'afterTenthStream',
    question: "What subject did you choose after your 10th grade?",
    options: [
      { value: 'Science', meme: "Welcome to the world of explosions! 🧪💥" },
      { value: 'Commerce', meme: "Money, money, money! 💰 Cha-ching!" },
      { value: 'Arts', meme: "Paint me like one of your French girls! 🎨" }
    ]
  },
  {
    id: 'twelfthPercentage',
    question: "What percentage did you score in your 12th-grade exams?",
    options: [
      { value: 'More than 50', meme: "You're climbing that mountain! ⛰️" },
      { value: 'More than 60', meme: "Look at you go! 🏃‍♂️💨" },
      { value: 'More than 70', meme: "You're a star in the making! ⭐" },
      { value: 'More than 80', meme: "Is it a bird? Is it a plane? No, it's you! 🦸‍♂️" },
      { value: 'More than 90', meme: "Alert! We have a genius over here! 🚨🧠" }
    ]
  },
  {
    id: 'jobPreference',
    question: "Do you prefer working in a government job or a private job?",
    options: [
      { value: 'Government', meme: "Welcome to the bureaucracy! Here's your stamp. ✅" },
      { value: 'Private', meme: "Time to hustle! 💼 Let's get this bread! 🍞" }
    ]
  },
  {
    id: 'interest',
    question: "What is something you are really interested in?",
    options: [] // Will be populated from the database
  },
  {
    id: 'strength',
    question: "What is your strength or something you are good at?",
    options: [] // Will be populated from the database
  },
  {
    id: 'workEnvironment',
    question: "Where do you prefer to work?",
    options: [
      { value: 'Offline', meme: "Time to dust off those office clothes! 👔" },
      { value: 'Online', meme: "Pants optional, webcam mandatory! 🖥️" },
      { value: 'Hybrid', meme: "Best of both worlds! Work from bed AND the office! 🛌🏢" }
    ]
  }
];

const CareerRecommendationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [careers, setCareers] = useState([]);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [meme, setMeme] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchInterests();
    fetchStrengths();
  }, []);

  useEffect(() => {
    if (isFormCompleted && !error) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isFormCompleted, error]);

  const fetchInterests = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/job/interests`);
      questions.find(q => q.id === 'interest').options = data.map(interest => ({ 
        value: interest.name, 
        meme: `${interest.name}? You're going places! 🚀` 
      }));
    } catch (error) {
      console.error("Failed to fetch interests:", error);
      setError("Failed to fetch interests. Please try again.");
    }
  };

  const fetchStrengths = async () => {
    try {
      const { data } = await axios.get(`${config.API_BASE_URL}/job/strengths`);
      questions.find(q => q.id === 'strength').options = data.map(strength => ({ 
        value: strength.name, 
        meme: `${strength.name}? You're a superhero! 🦸‍♀️` 
      }));
    } catch (error) {
      console.error("Failed to fetch strengths:", error);
      setError("Failed to fetch strengths. Please try again.");
    }
  };

  const handleAnswer = (answer) => {
    const question = questions[currentStep];
    const selectedOption = question.options.find(option => option.value === answer);
    setAnswers({ ...answers, [question.id]: answer });
    setMeme(selectedOption.meme);
    setTimeout(() => setMeme(''), 3000);
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      fetchCareers();
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const fetchCareers = async () => {
    try {
      const { data } = await axios.post(`${config.API_BASE_URL}/recommendations`, answers);
      setCareers(data);
      setIsFormCompleted(true);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch careers:", error);
      setError(error.response?.data?.message || 'Failed to fetch career recommendations');
      setIsFormCompleted(true);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsFormCompleted(false);
    setCareers([]);
    setError(null);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-400 via-emerald-500 to-green-500 p-4">
      <Card className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Career Compass</h1>
          <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <AnimatePresence mode="wait">
            {!isFormCompleted ? (
              <motion.div
                key={currentStep}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">{questions[currentStep].question}</h2>
                {questions[currentStep].id === 'interest' || questions[currentStep].id === 'strength' ? (
                  <Select onValueChange={handleAnswer}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {questions[currentStep].options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <RadioGroup onValueChange={handleAnswer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentStep].options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} className="text-green-600" />
                        <Label htmlFor={option.value} className="flex-grow cursor-pointer">{option.value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {meme && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center text-xl font-bold text-green-600 mt-4"
                  >
                    {meme}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Your Career Destiny Awaits!</h2>
                {error ? (
                  <p className="text-red-500 text-center">{error}</p>
                ) : careers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {careers.map((career, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition cursor-pointer"
                        onClick={() => handleJobClick(career)}
                      >
                        <p className="font-semibold text-xl text-green-600 mb-2">{career.jobTitle}</p>
                        <p className="text-gray-600">Average Salary: ${career.averageSalary.toLocaleString()}</p>
                        <p className="text-gray-600">Interest: {career.interest}</p>
                        <p className="text-gray-600">Strength: {career.strength}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">No career recommendations found for your criteria.</p>
                )}
                <Button onClick={resetForm} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-lg py-3">Embark on a New Quest!</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        {!isFormCompleted && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <Button
              onClick={prevQuestion}
              disabled={currentStep === 0}
              className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition text-lg"
            >
              {currentStep === questions.length - 1 ? 'Reveal My Destiny!' : 'Next Adventure'}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}
      </Card>
      
      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerRecommendationForm;