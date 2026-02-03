# Notifications Feature

User notification center for platform alerts and updates.

---

## Components

### index.jsx
**Notification Center**
- List all notifications
- Mark as read/unread
- Notification types:
  - System alerts
  - Booking confirmations
  - Session reminders
  - Community mentions
- Click to navigate

### styles.css
**Notification Styling**
- Read/unread states
- Notification icons
- Hover effects
- Responsive design

---

## Features
- 🔔 Real-time notifications
- 📬 Notification history
- ✅ Mark as read
- 🏷️ Notification types
- 🔗 Quick navigation

---

## Notification Types
| Type | Icon | Description |
|------|------|-------------|
| System | ⚙️ | Platform updates |
| Booking | 📅 | Session confirmations |
| Reminder | ⏰ | Upcoming sessions |
| Community | 👥 | Mentions, follows |
| Announcement | 📢 | Admin announcements |

---

## How It Works
1. Notifications received automatically
2. Bell icon shows unread count
3. Click to open notification center
4. View all notifications in list
5. Click notification to navigate
6. Mark as read automatically

---

## API Endpoints Used
- `GET /notifications` - User notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all read
