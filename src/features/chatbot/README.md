# ChatBot Feature

AI-powered career assistant providing personalized guidance.

---

## Directory Structure

```
chatbot/
├── ChatBot.jsx         # Main chatbot component
├── components/         # UI components
├── contexts/           # State contexts
├── hooks/              # Custom hooks
└── utils/              # Utilities
```

---

## Main Component

### ChatBot.jsx
**AI Career Assistant**

Core Functions:
- `loadSuggestions()` - Load quick suggestions
- `loadUserProfile()` - Get user context
- `initializeChat()` - Start conversation
- `handleQuickAction()` - Process quick actions
- `fetchCareerMatches()` - Get career recommendations
- `fetchMentors()` - Find mentors
- `bookMentorSession()` - Book with mentor
- `fetchColleges()` - College search
- `fetchWorkshops()` - Workshop discovery
- `handleCustomQuery()` - Free-form questions

### MessageBubble
- User and bot message display
- Copy to clipboard functionality
- Action buttons in messages

### TypingIndicator
- Animated typing dots
- Shows when bot is responding

---

## Quick Action Categories
| Category | Icon | Purpose |
|----------|------|---------|
| Career | Briefcase | Career guidance |
| Resume | FileText | Resume help |
| Interview | Users | Interview prep |
| Skills | BookOpen | Skill development |

---

## Features
- 💬 Natural conversation interface
- 🎯 Career match suggestions
- 👨‍🏫 Mentor recommendations
- 🏫 College/workshop discovery
- 📋 Copy responses to clipboard
- 🔄 Chat reset functionality
- ✨ Context-aware responses

---

## How It Works
1. Open chatbot (floating button)
2. View welcome message & suggestions
3. Click quick action OR type question
4. Bot processes and responds
5. Interactive cards for:
   - Career matches (with apply button)
   - Mentors (with book button)
   - Colleges (with details)
6. Continue conversation or reset

---

## Conversation Flow
```
Welcome → Main Menu → Select Topic
                    ↓
        Career | Mentors | Colleges | Workshops
                    ↓
        Detailed responses with actions
                    ↓
        Book session | View details | Continue
```

---

## API Endpoints Used
- `GET /chatbot/suggestions` - Quick suggestions
- `POST /chatbot/query` - Process question
- `GET /career/matches` - Career matches
- `GET /mentors` - Mentor list
- `GET /colleges` - College list
- `GET /workshops` - Workshop list
