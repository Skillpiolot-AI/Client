# Admin Users Feature

User management and mentor review system for administrators.

---

## Components

### AdminUserManagement.jsx
**Create Users**
- Create new user accounts
- Set user role (user/admin/mentor)
- Generate secure passwords
- Send credentials via email
- Test email functionality

Functions:
- `generatePassword()` - Secure password generator
- `handleCreateUser()` - Create user account
- `handleTestEmail()` - Send test email
- `validateForm()` - Form validation

### UserManagementDashboard.jsx
**User Dashboard**
- View all platform users
- Search and filter users
- User actions:
  - Edit user details
  - Change roles
  - Suspend/activate accounts
  - Delete users
- Bulk operations
- Export user data

### MentorProfileReview.jsx
**Mentor Application Review**
- Review pending mentor applications
- View applicant details:
  - Professional background
  - Expertise areas
  - Certifications
- Approval workflow:
  - Approve mentor
  - Reject application
  - Request more info
- Verification checks

---

## Features
- 👤 Create new users
- 📋 View all users
- ✏️ Edit user details
- 🔄 Change user roles
- ⏸️ Suspend accounts
- 🗑️ Delete users
- 👨‍🏫 Review mentor applications
- ✅ Approve/reject mentors

---

## User Roles
| Role | Access Level |
|------|--------------|
| User | Standard access |
| Mentor | Mentorship features |
| Admin | Full admin access |
| University Admin | University portal |

---

## Mentor Review Process
```
Application Submitted → Admin Review → Decision
                                     ↓
                        Approved | Rejected | More Info
```

---

## API Endpoints Used
- `GET /admin/users` - List users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/mentors/pending` - Pending applications
- `PUT /admin/mentors/:id/approve` - Approve mentor
- `PUT /admin/mentors/:id/reject` - Reject mentor
