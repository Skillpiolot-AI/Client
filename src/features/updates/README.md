# Updates Feature

Platform updates and announcements for users and admins.

---

## Components

### UpdatesPage.jsx
**User Updates View**
- View platform updates
- Announcement cards
- Update categories
- Read more links
- Chronological display

### AdminUpdatesPage.jsx
**Admin Updates Management**
- Create new updates
- Edit existing updates
- Delete updates
- Publish/unpublish toggle
- Rich text editor
- Schedule updates

---

## Features
- 📢 Platform announcements
- ✏️ Admin update creation
- 📅 Scheduled publishing
- 📱 User-friendly display
- 🏷️ Category organization

---

## User View
1. Access updates from dashboard
2. View all published updates
3. Sorted by date
4. Click for full details

## Admin View
1. Access from admin panel
2. Create new updates
3. Edit/delete existing
4. Preview before publish
5. Schedule future updates

---

## API Endpoints Used
- `GET /updates` - List updates
- `POST /updates` - Create update (admin)
- `PUT /updates/:id` - Edit update
- `DELETE /updates/:id` - Delete update
