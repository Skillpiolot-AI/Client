# Profile Feature

User profile management with personal information, academic history, and preferences.

---

## Components

### Profile.jsx
**Main Profile Page**
- View and edit personal information
- Academic grades management
- Job role preferences
- Password change functionality via modal
- Profile picture display with avatar fallback

### index.jsx
**Profile Container**
- Profile page routing wrapper
- Data fetching and state management

### Model.jsx
**Profile Modal Component**
- Reusable modal for profile actions

### components/
Contains modular profile UI components:
- Profile sections
- Edit forms
- Avatar management
- Academic history display

### hooks/
Custom hooks for profile data management

---

## Features
- 👤 Personal information editing
- 📚 Academic grades tracking
- 💼 Job role preferences
- 🔒 Secure password change
- 🖼️ Profile picture management

---

## API Endpoints Used
- `GET /auth/me` - Fetch current user profile
- `PUT /users/profile` - Update profile information
- `POST /auth/change-password` - Change password

---

## How It Works
1. User navigates to profile page
2. Current profile data is fetched from backend
3. User can edit fields and save changes
4. Password change triggers OTP verification
5. Changes are persisted to the backend
