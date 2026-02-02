import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

const questions = [
  {
    question: "Which subject do you enjoy the most?",
    options: [
      { value: 'a', label: 'Mathematics or Computer Science' },
      { value: 'b', label: 'Natural Sciences (Physics, Chemistry, Biology)' },
      { value: 'c', label: 'Social Sciences or Humanities' },
      { value: 'd', label: 'Languages or Creative Arts' },
    ],
  },
  {
    question: "When faced with a problem, how do you prefer to solve it?",
    options: [
      { value: 'a', label: 'Using logic, algorithms, or data analysis' },
      { value: 'b', label: 'Through experimentation and empirical observation' },
      { value: 'c', label: 'By considering historical context or social implications' },
      { value: 'd', label: 'Through creative expression or communication' },
    ],
  },
  {
    question: "Which of these activities do you find most engaging?",
    options: [
      { value: 'a', label: 'Coding or working with advanced technologies' },
      { value: 'b', label: 'Conducting scientific research or experiments' },
      { value: 'c', label: 'Analyzing societal trends or engaging in debates' },
      { value: 'd', label: 'Creating digital content or multimedia projects' },
    ],
  },
  {
    question: "What type of project excites you the most?",
    options: [
      { value: 'a', label: 'Developing an AI algorithm or a blockchain application' },
      { value: 'b', label: 'Designing a sustainable energy solution or a new medical treatment' },
      { value: 'c', label: 'Creating a policy proposal or a social impact initiative' },
      { value: 'd', label: 'Producing a digital marketing campaign or a multimedia presentation' },
    ],
  },
  {
    question: "How do you prefer to learn new concepts?",
    options: [
      { value: 'a', label: 'Through interactive coding platforms or data visualization' },
      { value: 'b', label: 'Via virtual labs or augmented reality simulations' },
      { value: 'c', label: 'By participating in online forums or digital think tanks' },
      { value: 'd', label: 'Through creative software or collaborative online platforms' },
    ],
  },
];

const careerSuggestions = {
  a: {
    career: "Technology and Data Science",
    jobs: ["Software Engineer", "Data Scientist", "AI Specialist", "Cybersecurity Analyst"],
    description: "You show a strong aptitude for logical thinking and working with technology. Careers in this field involve developing cutting-edge software, analyzing complex data sets, and creating innovative tech solutions."
  },
  b: {
    career: "Scientific Research and Innovation",
    jobs: ["Research Scientist", "Biotech Engineer", "Environmental Scientist", "Quantum Physicist"],
    description: "Your interest in scientific exploration and experimentation is evident. These careers focus on pushing the boundaries of scientific knowledge and applying discoveries to solve real-world problems."
  },
  c: {
    career: "Social Impact and Policy",
    jobs: ["Policy Analyst", "Social Entrepreneur", "International Relations Specialist", "Sustainable Development Consultant"],
    description: "You have a keen interest in understanding and shaping society. These careers involve analyzing social trends, developing policies, and working towards positive societal change."
  },
  d: {
    career: "Digital Media and Creative Technology",
    jobs: ["UX/UI Designer", "Digital Content Creator", "Virtual Reality Developer", "Creative Technologist"],
    description: "Your creative inclination combined with technological interest suits you for careers at the intersection of art and technology. These roles involve creating engaging digital experiences and innovative media solutions."
  },
};

const combinedSuggestions = {
  ab: {
    career: "Computational Science and Engineering",
    jobs: ["Bioinformatics Specialist", "Quantum Computing Researcher", "Robotics Engineer"],
    description: "Your interests bridge technology and scientific research. These careers apply advanced computational methods to solve complex scientific problems and drive technological innovation."
  },
  ac: {
    career: "Tech Policy and Ethics",
    jobs: ["AI Ethics Researcher", "Tech Policy Advisor", "Digital Rights Advocate"],
    description: "You're well-suited for roles that navigate the societal implications of technology. These careers involve shaping policies and ethical frameworks for emerging technologies."
  },
  ad: {
    career: "Creative Technology",
    jobs: ["AR/VR Experience Designer", "Creative Coder", "Interactive Media Artist"],
    description: "Your blend of technical skills and creativity is perfect for roles that push the boundaries of digital art and interactive experiences."
  },
  bc: {
    career: "Sustainable Science and Policy",
    jobs: ["Climate Change Policy Analyst", "Sustainable Technology Researcher", "Science Diplomat"],
    description: "These careers combine scientific expertise with policy-making, focusing on addressing global challenges through evidence-based solutions."
  },
  bd: {
    career: "Science Communication and Visualization",
    jobs: ["Data Visualization Specialist", "Scientific Illustrator", "Science Journalist"],
    description: "Your skills are suited for roles that bridge the gap between complex scientific concepts and public understanding through creative and engaging communication."
  },
  cd: {
    career: "Digital Humanities and Cultural Technology",
    jobs: ["Digital Archaeologist", "Cultural Data Analyst", "Digital Curator"],
    description: "These innovative careers apply digital technologies to humanities and cultural studies, preserving and analyzing cultural heritage in the digital age."
  },
};

const CareerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);

  const handleAnswer = (value) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (currentAnswer !== null) {
      setAnswers({ ...answers, [currentQuestion]: currentAnswer });
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setProgress((currentQuestion + 2) / questions.length * 100);
        setCurrentAnswer(null);
      } else {
        setShowResult(true);
        setProgress(100);
      }
    }
  };

  const getResult = () => {
    const counts = Object.values(answers).reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topTwo = sortedCounts.slice(0, 2).map(entry => entry[0]).sort().join('');

    if (sortedCounts[0][1] >= 3) {
      return careerSuggestions[sortedCounts[0][0]];
    } else if (combinedSuggestions[topTwo]) {
      return combinedSuggestions[topTwo];
    } else {
      return careerSuggestions[sortedCounts[0][0]];
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setProgress(0);
    setCurrentAnswer(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (showResult) {
    const result = getResult();
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 shadow-lg">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Your Career Suggestion</h2>
            <Sparkles className="w-6 h-6 text-yellow-500 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{result.career}</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.description}</p>
            <div>
              <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Potential job titles:</h4>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {result.jobs.map((job, index) => (
                  <li key={index}>{job}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 shadow-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Career Exploration Quiz</h2>
          <Progress value={progress} className="w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-gray-700 dark:text-gray-300">{questions[currentQuestion].question}</p>
          <RadioGroup onValueChange={handleAnswer} value={currentAnswer} className="space-y-2">
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleNext} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={currentAnswer === null}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "See Results"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CareerQuiz;