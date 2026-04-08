import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';

export default function ChatBot() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatType, setChatType] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isChatbotOpen) {
      setIsChatbotOpen(false);
    }
  };

  const handleOptionClick = (type) => {
    if (type === 'roadmap' || type === 'mentorship') {
      // Handle navigation or specific actions for these options
      console.log(`Navigating to ${type}`);
      
    } else if (type === 'other') {
      startChat('other');
    }
  };

  const startChat = (type) => {
    setChatType(type);
    setIsModalOpen(false);
    setIsChatbotOpen(true);
    const greeting = "Welcome to our chatbot! How can I assist you today?";
    setMessages([{ text: greeting, sender: 'bot' }]);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      const currentInput = input;
      setInput('');
      
      try {
        const response = await axios.post(
          `${config.API_BASE_URL}/chatbot/chat`,
          {
            messages: [...messages, userMessage],
            mode: 'default'
          }
        );
    
        if (response.data.success && response.data.message) {
          setMessages(prevMessages => [...prevMessages, { text: response.data.message, sender: 'bot' }]);
        } else {
          throw new Error("Invalid response from backend");
        }
      } catch (error) {
        console.error("Error making API request:", error.message);
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, I encountered an error. Please try again later.", sender: 'bot' }]);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="fixed bottom-6 right-6">
        <Button onClick={toggleModal} className="flex items-center bg-gray-900 hover:bg-gray-600 text-white rounded-full p-4 shadow-lg z-100">
          <MessageCircle className="w-6 h-6 mr-2" />
          <span className="font-semibold">Ai Mentor</span>
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed bottom-24 right-6 w-72 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-900 text-white p-3">How can we help you?</div>
          <div className="p-3 space-y-2">
            <Link to="/combinedquiz">
              <button onClick={() => handleOptionClick('roadmap')} className="w-full p-2 bg-gray-100 rounded">Get Roadmap</button>
            </Link>

            <Link to="/mentorship">
            <button onClick={() => handleOptionClick('mentorship')} className="w-full p-2 bg-gray-100 rounded">Get Mentorship</button>
            </Link>
            <button onClick={() => handleOptionClick('other')} className="w-full p-2 bg-gray-100 rounded">Other Query</button>
          </div>
        </div>
      )}

      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-gray-900 text-white p-3 flex justify-between">
            <span>Chatbot</span>
            <button onClick={() => setIsChatbotOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((message, index) => (
              <div key={index} className={`${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}>
                  {message.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg"
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-gray-900 text-white p-2 rounded-r-lg">Send</button>
          </div>
        </div>
      )}
    </>
  );
}