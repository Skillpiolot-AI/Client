# Authentication Feature

Complete user authentication system with multiple login methods, registration, and password recovery.

---

## Components

### Login.jsx
**User Login Page**
- Email/password authentication
- Google OAuth integration via `@react-oauth/google`
- Form validation with error handling
- Role-based redirect after login:
  - Admin → Admin Dashboard
  - Mentor → Mentor Sessions
  - University Admin → University Portal
  - Regular User → Dashboard

### Signup.jsx
**User Registration**
- New account creation with:
  - Username, Email, Password
- Email verification sent upon registration
- Success message prompts user to verify email

### ForgotPassword.jsx
**Password Recovery**
- Request password reset via email
- OTP-based verification
- Secure password reset flow

### ChangePassword.jsx
**Password Update**
- Change existing password
- OTP verification for security
- Password strength validation

### VerifyEmail.jsx
**Email Verification**
- Verify account email address
- Activation link handling
- Success/error state management

### VerifyLogin.jsx
**Two-Factor Authentication**
- Additional login verification
- QR code-based login option
- Secure session establishment

### GoogleProfileCompletion.jsx
**Google OAuth Profile Setup**
- Complete profile after Google sign-in
- Collect additional user information
- Seamless onboarding flow

---

## API Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - New registration
- `POST /auth/google` - Google OAuth
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/verify-email` - Email verification
- `GET /auth/me` - Get current user

---

## Key Features
- 🔐 Secure password handling
- 🌐 Google OAuth integration
- 📧 Email verification flow
- 🔄 Password recovery with OTP
- 👤 Role-based access control
