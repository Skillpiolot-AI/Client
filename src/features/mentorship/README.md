# Mentorship Feature

Complete mentorship system for connecting users with career mentors.

---

## Directory Structure

```
mentorship/
├── HomePage.jsx        # AI career assistant intro
├── Registor.jsx        # Mentor registration form
├── Form.jsx            # Form utilities
├── Tracker.jsx         # Activity tracking
├── MentoFeedback.jsx   # Feedback collection
├── application/        # Mentor application system
├── bookings/           # Session booking system
├── list/               # Mentor directory
├── profile/            # Mentor profiles
└── sessions/           # Appointment management
```

---

## Main Components

### HomePage.jsx
AI career assistant introduction:
- ProPilot AI assistant branding
- Career path selection inputs
- Start journey call-to-action

### Registor.jsx
Mentor registration form:
- Personal information
- Professional background
- Expertise areas
- Availability settings

---

## Subdirectories

### application/
Mentor application workflow:
- Application submission
- Status tracking
- Required documentation

### bookings/
Session booking system:
- **BookingModal.jsx** - Book session modal with time slots
- **MentorSessions.jsx** - Mentor's booked sessions view
- **MyBookings.jsx** - User's booking history

### list/
Mentor discovery:
- Browse all mentors
- Filter by expertise
- Search functionality
- Mentor cards display

### profile/
Detailed mentor profiles:
- Bio and background
- Expertise areas
- Availability calendar
- Ratings and reviews
- Book session button

### sessions/
Appointment management:
- **BookAppointment.jsx** - Schedule appointments
- **MentorAppointments.jsx** - Mentor's schedule
- **UserAppointment.jsx** - User's appointments
- **RateSession/** - Post-session rating

---

## Key Features
- 🎯 AI-powered career guidance
- 👨‍🏫 Browse and search mentors
- 📅 Real-time booking system
- 💬 Video call integration (Jitsi)
- ⭐ Session rating system
- 📊 Availability management

---

## User Flow
1. Browse mentor list or get AI recommendations
2. View mentor profile and availability
3. Book session via modal
4. Receive confirmation with video link
5. Attend session via Jitsi
6. Rate session after completion

---

## API Endpoints Used
- `GET /mentors` - List all mentors
- `GET /mentors/:id` - Mentor details
- `POST /bookings` - Create booking
- `GET /bookings/user` - User's bookings
- `GET /bookings/mentor` - Mentor's sessions
- `POST /sessions/:id/rate` - Rate session
