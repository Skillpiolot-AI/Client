# Admin Settings Feature

Platform configuration and settings management.

---

## Components

### index.jsx
**Settings Dashboard**
- Platform configuration options
- Grouped settings sections:
  - General settings
  - Email configuration
  - Security settings
  - Feature toggles
- Save/reset functionality

### styles.css
Settings page styling

---

## Settings Categories

### General Settings
- Platform name
- Logo and branding
- Contact information
- Timezone settings

### Email Configuration
- SMTP settings
- Email templates
- Sender information
- Test email function

### Security Settings
- Password policies
- Session timeout
- 2FA settings
- IP restrictions

### Feature Toggles
- Enable/disable features
- Maintenance mode
- Beta features

---

## Features
- ⚙️ Platform configuration
- 📧 Email setup
- 🔒 Security policies
- 🎛️ Feature toggles
- 💾 Save configurations

---

## How It Works
1. Admin opens settings
2. Navigate setting categories
3. Modify configurations
4. Preview changes
5. Save or reset settings

---

## API Endpoints Used
- `GET /admin/settings` - Get settings
- `PUT /admin/settings` - Update settings
- `POST /admin/settings/test-email` - Test email
