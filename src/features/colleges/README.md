# Colleges Feature

College directory with search, filtering, and detailed college information.

---

## Components

### CollegeList.jsx
**Main College Directory**
- List of all colleges
- Search functionality
- Pagination or infinite scroll
- Grid/list view toggle

### CollegeCard.jsx
**College Card Component**
- College name and logo
- Location information
- Key statistics
- Quick action buttons
- Click to view details

### FilterBar.jsx
**Quick Filter Bar**
- Common filter buttons
- Sort options
- View toggles

### FilterSidebar.jsx
**Advanced Filters**
- Location filter
- Course/program filter
- Fee range filter
- Rating filter
- Accreditation filter

---

## Features
- 🔍 Search colleges by name
- 🏫 Browse all colleges
- 📍 Filter by location
- 💰 Filter by fee range
- ⭐ Sort by rating
- 📋 Detailed college cards

---

## How It Works
1. User opens college directory
2. All colleges displayed as cards
3. Use search bar for quick search
4. Use sidebar for advanced filters
5. Click college card for details
6. View programs, fees, and requirements

---

## API Endpoints Used
- `GET /colleges` - List all colleges
- `GET /colleges/:id` - College details
- `GET /colleges/search` - Search colleges
