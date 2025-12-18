import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, CheckCircle } from 'lucide-react';

// ==================== CONFIGURATION ====================
const API_BASE_URL = 'http://localhost:3001/api';
const GEMINI_API_KEY = 'AIzaSyAbuB4tWH0u3wFSjDM4VeXAt1qX24mtglQ';

// ==================== MAIN CHATBOT COMPONENT ====================
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userRes.ok) throw new Error('Failed to fetch user');
      const user = await userRes.json();
      
      const assessmentRes = await fetch(
        `${API_BASE_URL}/assessments/user/${user.id}`,
        { headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      
      if (assessmentRes.ok) {
        const assessmentData = await assessmentRes.json();
        const hasCompleted = assessmentData.count > 0;
        setHasAssessment(hasCompleted);
        
        if (hasCompleted) {
          const latestAssessment = assessmentData.data[0];
          setUserProfile({
            ...user,
            hollandCode: latestAssessment.results.hollandCode,
            lastAssessment: latestAssessment,
            assessmentDate: latestAssessment.completedAt
          });
        } else {
          setUserProfile(user);
        }
      } else {
        setUserProfile(user);
      }
    } catch (error) {
      console.error('Profile load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      addBotMessage({
        text: `👋 Welcome to Skill-Pilot! I'm your AI Career Guide.\n\nPlease login to access personalized career guidance, assessments, and mentor connections.`,
        quickActions: [
          { id: 'login', label: 'Login', icon: '🔐' },
          { id: 'signup', label: 'Sign Up', icon: '📝' },
          { id: 'explore', label: 'Explore Features', icon: '🔍' }
        ]
      }, 500);
      return;
    }

    if (!hasAssessment && userProfile) {
      addBotMessage({
        text: `Hi ${userProfile.name}! 👋\n\nI noticed you haven't completed your **Holland Career Assessment** yet. This helps us understand your interests and recommend the best career paths.\n\nWould you like to take it now? It only takes 5-10 minutes!`,
        quickActions: [
          { id: 'take-assessment', label: '✨ Take Assessment', icon: '🧠' },
          { id: 'skip', label: 'Skip & Browse', icon: '⏭️' }
        ]
      }, 500);
    } else if (userProfile) {
      addBotMessage({
        text: `Welcome back, ${userProfile.name}! 🎉\n\nYour Holland Code: **${userProfile.hollandCode}**\n\nHow can I help you today?`,
        quickActions: [
          { id: 'view-careers', label: 'Career Matches', icon: '💼' },
          { id: 'find-mentors', label: 'Find Mentors', icon: '👨‍🏫' },
          { id: 'explore-colleges', label: 'Colleges', icon: '🎓' },
          { id: 'workshops', label: 'Workshops', icon: '📚' }
        ]
      }, 500);
    }
  };

  const addBotMessage = (message, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        type: 'bot',
        ...message,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      type: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  const handleQuickAction = async (actionId, data = null) => {
    const action = messages[messages.length - 1]?.quickActions?.find(a => a.id === actionId);
    if (action) {
      addUserMessage(action.label);
    }

    switch (actionId) {
      case 'login':
        window.location.href = '/login';
        break;
      case 'signup':
        window.location.href = '/signup';
        break;
      case 'take-assessment':
        window.location.href = '/assessment';
        setIsOpen(false);
        break;
      case 'skip':
        showMainMenu();
        break;
      case 'view-careers':
        await fetchCareerMatches();
        break;
      case 'find-mentors':
        await fetchMentors();
        break;
      case 'explore-colleges':
        await fetchColleges();
        break;
      case 'workshops':
        await fetchWorkshops();
        break;
      case 'filter-colleges':
        showCollegeFilters();
        break;
      case 'apply-filters':
        await applyCollegeFilters(data);
        break;
      case 'book-mentor':
        await bookMentorSession(data);
        break;
      case 'explore':
        showFeatures();
        break;
      case 'main-menu':
        showMainMenu();
        break;
      default:
        await handleCustomQuery(actionId);
    }
  };

  const showMainMenu = () => {
    addBotMessage({
      text: `What would you like to explore?`,
      quickActions: [
        { id: 'view-careers', label: 'Careers', icon: '💼' },
        { id: 'find-mentors', label: 'Mentors', icon: '👨‍🏫' },
        { id: 'explore-colleges', label: 'Colleges', icon: '🎓' },
        { id: 'workshops', label: 'Workshops', icon: '📚' }
      ]
    });
  };

  const showFeatures = () => {
    addBotMessage({
      text: `🌟 **Skill-Pilot Features**\n\n✅ Career Assessment\n✅ Personalized Recommendations\n✅ Expert Mentors\n✅ College Information\n✅ Workshops & Resources\n✅ Career Roadmaps`,
      quickActions: [
        { id: 'signup', label: 'Get Started', icon: '🚀' }
      ]
    });
  };

  const fetchCareerMatches = async () => {
    setIsTyping(true);
    try {
      if (!userProfile?.hollandCode) {
        addBotMessage({
          text: `Please complete your Holland Assessment first to get personalized career recommendations!`,
          quickActions: [
            { id: 'take-assessment', label: 'Take Assessment', icon: '🧠' }
          ]
        }, 0);
        setIsTyping(false);
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/careers/recommendations?hollandCode=${userProfile.hollandCode}&limit=5`
      );
      
      if (!res.ok) throw new Error('Failed to fetch careers');
      const data = await res.json();
      const careers = data.data;
      
      if (careers && careers.length > 0) {
        const careerList = careers.map((c, i) => 
          `${i + 1}. **${c.name}** (${c.matchScore}% match)\n   ${c.career_type} • ${c.cluster}`
        ).join('\n\n');

        addBotMessage({
          text: `🎯 **Top Career Matches** for your Holland Code (${userProfile.hollandCode}):\n\n${careerList}`,
          quickActions: [
            { id: 'find-mentors', label: 'Find Mentors', icon: '👨‍🏫' },
            { id: 'explore-colleges', label: 'Explore Colleges', icon: '🎓' }
          ]
        }, 0);
      }
    } catch (error) {
      addBotMessage({
        text: `Oops! I had trouble fetching careers. Please try again.`,
        quickActions: [{ id: 'view-careers', label: 'Retry', icon: '🔄' }]
      }, 0);
    }
    setIsTyping(false);
  };

  const fetchMentors = async () => {
    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE_URL}/all-mentors`);
      if (!res.ok) throw new Error('Failed to fetch mentors');
      const mentors = await res.json();
      const topMentors = mentors.slice(0, 5);

      if (topMentors.length > 0) {
        addBotMessage({
          text: `👨‍🏫 **Available Mentors**\n\nClick any mentor to book a session:`,
          quickActions: topMentors.map(m => ({
            id: 'book-mentor',
            label: `${m.name} - ${m.jobTitle}`,
            icon: '📅',
            data: m
          }))
        }, 0);
      }
    } catch (error) {
      addBotMessage({
        text: `I couldn't fetch mentors right now. Please try again!`,
        quickActions: [{ id: 'find-mentors', label: 'Retry', icon: '🔄' }]
      }, 0);
    }
    setIsTyping(false);
  };

  const bookMentorSession = async (mentor) => {
    setIsTyping(true);
    try {
      const token = localStorage.getItem('token');
      const userId = userProfile?.id;

      if (!userId || !token) {
        addBotMessage({
          text: `Please login to book a mentor session.`,
          quickActions: [{ id: 'login', label: 'Login', icon: '🔐' }]
        }, 0);
        setIsTyping(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/book-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mentorId: mentor._id,
          userId: userId,
          date: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Booking failed');

      addBotMessage({
        text: `✅ **Session Booked Successfully!**\n\nMentor: ${mentor.name}\nRole: ${mentor.jobTitle}\n\nYou'll receive a confirmation email shortly. The mentor will schedule the meeting and send you the link.`,
        quickActions: [
          { id: 'find-mentors', label: 'Book Another', icon: '📅' },
          { id: 'view-careers', label: 'Explore Careers', icon: '💼' }
        ]
      }, 0);
    } catch (error) {
      addBotMessage({
        text: `Failed to book session. Please try again.`,
        quickActions: [{ id: 'find-mentors', label: 'Try Again', icon: '🔄' }]
      }, 0);
    }
    setIsTyping(false);
  };

  const fetchColleges = async () => {
    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE_URL}/colleges/filter?limit=5`);
      if (!res.ok) throw new Error('Failed to fetch colleges');
      const data = await res.json();
      const colleges = data.data;

      if (colleges && colleges.length > 0) {
        const collegeList = colleges.map((c, i) => 
          `${i + 1}. **${c.name}**\n   ${c.displayLocationString}\n   Rating: ${c.averageCourseRating?.toFixed(1) || 'N/A'}⭐`
        ).join('\n\n');

        addBotMessage({
          text: `🎓 **Top Colleges**:\n\n${collegeList}`,
          quickActions: [
            { id: 'filter-colleges', label: 'Filter Colleges', icon: '🔍' }
          ]
        }, 0);
      }
    } catch (error) {
      addBotMessage({
        text: `I couldn't fetch colleges. Please try again!`,
        quickActions: [{ id: 'explore-colleges', label: 'Retry', icon: '🔄' }]
      }, 0);
    }
    setIsTyping(false);
  };

  const showCollegeFilters = () => {
    addBotMessage({
      text: `🔍 **Filter Colleges**\n\nWhat would you like to filter by?`,
      quickActions: [
        { id: 'filter-by-location', label: 'By Location', icon: '📍' },
        { id: 'filter-by-fees', label: 'By Fees', icon: '💰' },
        { id: 'filter-by-rating', label: 'By Rating', icon: '⭐' },
        { id: 'explore-colleges', label: 'View All', icon: '🎓' }
      ]
    });
  };

  const fetchWorkshops = async () => {
    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE_URL}/workshops`);
      if (!res.ok) throw new Error('Failed to fetch workshops');
      const workshops = await res.json();
      const topWorkshops = workshops.slice(0, 5);

      if (topWorkshops.length > 0) {
        const workshopList = topWorkshops.map((w, i) => 
          `${i + 1}. **${w.title}**\n   📍 ${w.location}\n   📅 ${new Date(w.date).toLocaleDateString()}`
        ).join('\n\n');

        addBotMessage({
          text: `📚 **Upcoming Workshops**:\n\n${workshopList}`,
          quickActions: [
            { id: 'main-menu', label: 'Main Menu', icon: '🏠' }
          ]
        }, 0);
      }
    } catch (error) {
      addBotMessage({
        text: `Couldn't load workshops. Try again!`,
        quickActions: [{ id: 'workshops', label: 'Retry', icon: '🔄' }]
      }, 0);
    }
    setIsTyping(false);
  };

  const handleCustomQuery = async (query) => {
    setIsTyping(true);
    
    try {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('college') || lowerQuery.includes('university')) {
        await fetchColleges();
        return;
      }
      
      if (lowerQuery.includes('mentor') || lowerQuery.includes('coach')) {
        await fetchMentors();
        return;
      }
      
      if (lowerQuery.includes('career') || lowerQuery.includes('job')) {
        if (hasAssessment) {
          await fetchCareerMatches();
        } else {
          addBotMessage({
            text: `To get personalized career recommendations, please complete the Holland Assessment first!`,
            quickActions: [
              { id: 'take-assessment', label: 'Take Assessment', icon: '🧠' }
            ]
          }, 0);
        }
        return;
      }

      if (lowerQuery.includes('workshop')) {
        await fetchWorkshops();
        return;
      }

      const context = `User: ${userProfile?.name || 'Guest'}, Has Assessment: ${hasAssessment}, Holland Code: ${userProfile?.hollandCode || 'None'}`;
      const aiResponse = await generateAIResponse(query, context);
      
      addBotMessage({
        text: aiResponse,
        quickActions: [
          { id: 'main-menu', label: 'Main Menu', icon: '🏠' }
        ]
      }, 0);
      
    } catch (error) {
      addBotMessage({
        text: `I'm having trouble understanding. Could you rephrase that?`,
        quickActions: [
          { id: 'main-menu', label: 'Main Menu', icon: '🏠' }
        ]
      }, 0);
    }
    
    setIsTyping(false);
  };

  const generateAIResponse = async (query, context) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an AI career guidance assistant for Skill-Pilot website. Context: ${context}\n\nUser Query: ${query}\n\nProvide a helpful, concise response (max 100 words) based on the website's features: assessments, mentors, careers, colleges, workshops, resources. Be friendly and guide users to relevant features.`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "I'm here to help! Could you provide more details?";
    } catch (error) {
      console.error('AI Error:', error);
      return "I'm having trouble processing that. Let me help you navigate our features instead!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    addUserMessage(userMessage);
    setInputValue('');

    await handleCustomQuery(userMessage);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            AI
          </span>
        </button>
      ) : (
        <div className="w-[95vw] max-w-[420px] h-[80vh] max-h-[650px] rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-white border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">AI Career Guide</h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Bar */}
          {userProfile && (
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium truncate">{userProfile.name}</span>
              </div>
              {hasAssessment && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Assessment Done</span>
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                onAction={handleQuickAction}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MESSAGE BUBBLE ====================
const MessageBubble = ({ message, onAction }) => {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end items-start gap-2 animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[75%] shadow-lg">
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 animate-fadeIn">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-white text-gray-900 rounded-2xl rounded-tl-none p-4 shadow-md max-w-[85%] border border-gray-100">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        
        {message.quickActions && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onAction(action.id, action.data)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 shadow-sm hover:shadow"
              >
                <span>{action.icon}</span>
                <span className="truncate max-w-[150px]">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== TYPING INDICATOR ====================
const TypingIndicator = () => (
  <div className="flex items-start gap-2">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md border border-gray-100">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

export default ChatBot;