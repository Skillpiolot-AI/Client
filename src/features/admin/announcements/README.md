# Admin Announcements Feature

Platform-wide announcement management system.

---

## Components

### index.jsx
**Main Announcements Page**
- Announcement management container
- Tab navigation
- Action handlers

### CreateAnnouncement.jsx
**Create Announcement**
- Title and content editor
- Category selection
- Publish options:
  - Immediate
  - Scheduled
- Preview before publish

### EmailAnnouncement.jsx
**Email Announcement**
- Send announcements via email
- Email template selection
- Bulk email sending
- Delivery tracking

### RecipientSelector.jsx
**Recipient Selection**
- Select announcement recipients
- Filter by:
  - User role
  - Registration date
  - Activity status
- Select all / specific users

### AnnouncementList.jsx
**Announcement List**
- View all announcements
- Edit/delete options
- Status indicators
- Sort and filter

### styles.css
Announcement styling and themes

---

## Features
- 📢 Create announcements
- 📧 Email distribution
- 👥 Targeted recipients
- 📅 Scheduled publishing
- ✏️ Edit/delete management

---

## Announcement Types
| Type | Method | Recipients |
|------|--------|------------|
| Platform | In-app | All users |
| Email | Email | Selected users |
| Targeted | Both | Filtered users |

---

## How It Works
1. Admin creates announcement
2. Select distribution method
3. Choose recipients
4. Preview and publish
5. Track delivery status

---

## API Endpoints Used
- `GET /admin/announcements` - List all
- `POST /admin/announcements` - Create new
- `PUT /admin/announcements/:id` - Update
- `DELETE /admin/announcements/:id` - Delete
- `POST /admin/announcements/email` - Send email
