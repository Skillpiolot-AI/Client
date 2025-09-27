import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const interests = [
  "Technology", "Science", "Arts", "Business", "Healthcare",
  "Education", "Sports", "Environment", "Social Sciences", "Engineering"
];

const strengths = [
  "Problem Solving", "Communication", "Leadership", "Creativity",
  "Analytical Thinking", "Teamwork", "Adaptability", "Time Management",
  "Technical Skills", "Emotional Intelligence"
];

const jobTitles = {
  "Technology": ["Software Developer", "Data Analyst", "Network Administrator"],
  "Science": ["Research Scientist", "Lab Technician", "Environmental Scientist"],
  "Arts": ["Graphic Designer", "Multimedia Artist", "Art Teacher"],
  "Business": ["Business Analyst", "Marketing Specialist", "Entrepreneur"],
  "Healthcare": ["Nurse", "Medical Technician", "Healthcare Administrator"],
  "Education": ["Teacher", "Educational Consultant", "Instructional Designer"],
  "Sports": ["Sports Coach", "Athletic Trainer", "Sports Analyst"],
  "Environment": ["Environmental Engineer", "Conservation Scientist", "Sustainability Consultant"],
  "Social Sciences": ["Psychologist", "Social Worker", "Market Research Analyst"],
  "Engineering": ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer"]
};

const Message = ({ content, isUser, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-start space-x-2 mb-4"
  >
    {!isUser && (
      <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">
        {icon}
      </div>
    )}
    <div className={`p-3 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
      {content}
    </div>
  </motion.div>
);

const OptionButton = ({ text, onClick }) => (
  <Button
    variant="outline"
    className="mr-2 mb-2"
    onClick={onClick}
  >
    {text}
  </Button>
);

export default function ChatCareerAdvisor() {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Initial messages
    addMessage("Welcome! I'm your Career Advisor. Let's create your roadmap!", false, "👋");
    setTimeout(() => addMessage("First, are you a student or a professional?", false, "🤔"), 1000);
  }, []);

  const addMessage = (content, isUser = false, icon = "") => {
    setMessages(prev => [...prev, { content, isUser, icon }]);
  };

  const handleOptionClick = (option) => {
    addMessage(option, true);
    processUserInput(option);
  };

  const processUserInput = (input) => {
    switch (currentStep) {
      case 0:
        setUserType(input);
        if (input === "Student") {
          addMessage("Great! Are you in 10th or 12th class?", false, "🎓");
        } else {
          setCurrentStep(2);
          addMessage("Excellent! Let's talk about your interests.", false, "🌟");
          addMessage("What are your top interests? (Select up to 3)", false, "🤔");
        }
        setCurrentStep(1);
        break;
      case 1:
        setStudentClass(input);
        setCurrentStep(2);
        addMessage("Perfect! Now, let's talk about your interests.", false, "🌟");
        addMessage("What are your top interests? (Select up to 3)", false, "🤔");
        break;
      case 2:
        setSelectedInterests(prev => [...prev, input]);
        if (selectedInterests.length === 2) {
          setCurrentStep(3);
          addMessage("Great choices! Now, let's identify your strengths.", false, "💪");
          addMessage("What are your top strengths? (Select up to 3)", false, "🤔");
        }
        break;
      case 3:
        setSelectedStrengths(prev => [...prev, input]);
        if (selectedStrengths.length === 2) {
          setCurrentStep(4);
          const jobs = selectedInterests.flatMap(interest => jobTitles[interest] || []).slice(0, 5);
          setRecommendedJobs(jobs);
          addMessage("Based on your profile, here are some job titles you might be interested in:", false, "🚀");
          jobs.forEach((job, index) => {
            setTimeout(() => addMessage(job, false, `${index + 1}️⃣`), (index + 1) * 500);
          });
          setTimeout(() => addMessage("Would you like to explore any of these career paths?", false, "🤔"), (jobs.length + 1) * 500);
        }
        break;
      case 4:
        if (input === "Yes") {
          addMessage("Great! Which career would you like to explore? Just type the job title.", false, "👍");
        } else {
          addMessage("No problem! If you have any other questions or if you'd like to start over, just let me know.", false, "👍");
          setCurrentStep(0);
        }
        break;
      default:
        addMessage("I'm not sure how to respond to that. Would you like to start over?", false, "😅");
        break;
    }
  };

  const renderOptions = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <OptionButton text="Student" onClick={() => handleOptionClick("Student")} />
            <OptionButton text="Professional" onClick={() => handleOptionClick("Professional")} />
          </>
        );
      case 1:
        return (
          <>
            <OptionButton text="10th" onClick={() => handleOptionClick("10th")} />
            <OptionButton text="12th" onClick={() => handleOptionClick("12th")} />
          </>
        );
      case 2:
        return interests
          .filter(interest => !selectedInterests.includes(interest))
          .map(interest => (
            <OptionButton key={interest} text={interest} onClick={() => handleOptionClick(interest)} />
          ));
      case 3:
        return strengths
          .filter(strength => !selectedStrengths.includes(strength))
          .map(strength => (
            <OptionButton key={strength} text={strength} onClick={() => handleOptionClick(strength)} />
          ));
      case 4:
        return (
          <>
            <OptionButton text="Yes" onClick={() => handleOptionClick("Yes")} />
            <OptionButton text="No" onClick={() => handleOptionClick("No")} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Your Career Roadmap</h1>
          <X className="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 mb-4">Just starting out or want to move to the next level? Your Career Advisor has got you covered!</p>
          <AnimatePresence>
            {messages.map((message, index) => (
              <Message key={index} content={message.content} isUser={message.isUser} icon={message.icon} />
            ))}
          </AnimatePresence>
          <div className="mt-4">
            {renderOptions()}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}