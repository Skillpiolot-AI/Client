# SkillPilot – Client Frontend

Welcome to the frontend repository for **SkillPilot**, a comprehensive career guidance and mentorship platform built as a MERN-stack application.

## 🚀 Overview

SkillPilot bridges the gap between students, aspiring professionals, and experienced mentors by providing tools for self-assessment, mentorship discovery, real-time communication, and AI-driven career guidance.

This frontend is built with **React 18** and **Vite**, offering a fast, responsive, and highly interactive user experience.

## 🛠 Technology Stack

- **Framework:** React 18 (via Vite)
- **Routing:** React Router v6 (60+ defined routes)
- **HTTP Client:** Axios (with global interceptors for automatic JWT handling)
- **Styling:** Vanilla CSS + TailwindCSS
- **State Management:** React Context API (`AuthContext`, `GroupContext`, `CurrencyContext`)
- **Real-time:** WebSockets (for live admin server logs)

## ✨ Key Features

- **RIASEC Career Assessment:** A standalone multi-step psychometric assessment module that calculates Holland Code (RIASEC) scores and recommends careers.
- **Topmate-style Mentor Marketplace:** Discover mentors, view rich profiles (`/mentor/:handle`), and book 1:1 sessions, mock interviews, or resume reviews.
- **Role-Based Dashboards:** 
  - **Mentee/Student:** Track bookings, priority DMs, and profile completion.
  - **Mentor:** Manage services, discount coupons, availability slots, and session earnings.
  - **University Admin & Teacher:** Bulk onboard and manage students.
  - **System Admin:** Access analytics, approve mentors, manage users, and view real-time server logs.
- **AI Career Advisor Chatbot:** A persistent, floating AI widget powered by the Google Gemini API to assist with interview prep and resume tips.
- **Priority Direct Messaging:** An asynchronous thread-based DM system for direct mentee-mentor communication.
- **Integrated Payments:** Seamless checkout flow for booking paid mentorship sessions (via Stripe/Razorpay).

## 📁 Project Structure

```text
src/
├── App.jsx                    # Root component defining all application routes
├── main.jsx                   # Entry point wrapping App with Context Providers
├── AuthContext.jsx            # Global auth state + Axios interceptors
├── config.jsx                 # API configuration settings
│
├── Assesment/                 # RIASEC Career Assessment module
├── Pages/
│   ├── User/                  # Auth flows (Login, Signup, Verify, etc.)
│   ├── Profile/               # Dynamic user profile builder
│   ├── MentorShip/            # Mentor search, profiles, bookings, and DMs
│   ├── Admin/                 # Admin control panel, analytics, user management
│   ├── University/            # UniAdmin and Teacher portals
│   ├── Quiz/                  # Career quizzes and AI prediction pages
│   ├── Roadmap/               # AI-generated career roadmaps
│   └── updates/               # Platform announcements and updates
│
├── chatbot/                   # Floating ChatBot widget components
└── homepage/                  # Landing page and promotional sections
```

## 🔒 Routing & Security

The frontend enforces Role-Based Access Control (RBAC) heavily:
- **`ProtectedRoute`**: Wraps secure routes, checking `localStorage` for valid JWTs.
- **`RoleGuard`**: Used inline to render UI elements conditionally based on `['User', 'Mentor', 'Admin', 'UniAdmin']`.

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd Client-landing-page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.
