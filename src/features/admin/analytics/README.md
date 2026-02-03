# Admin Analytics Feature

Platform analytics dashboard with metrics and visualizations.

---

## Directory Structure

```
analytics/
├── AnalyticsDashboard.jsx    # Main analytics page
└── components/               # Chart components (5 files)
```

---

## Main Component

### AnalyticsDashboard.jsx
**Analytics Dashboard**
- Overview metrics cards
- User statistics
- Session analytics
- Revenue tracking
- Time-based charts

### components/
Visualization components:
- Line charts (trends)
- Bar charts (comparisons)
- Pie charts (distribution)
- Metric cards
- Data tables

---

## Metrics Tracked
| Metric | Description |
|--------|-------------|
| Total Users | Registered users |
| Active Users | Daily/monthly active |
| Sessions | Mentorship sessions |
| Bookings | Session bookings |
| Revenue | Platform revenue |
| Engagement | User engagement |

---

## Features
- 📊 Real-time metrics
- 📈 Trend visualization
- 📉 Comparison charts
- 📅 Date range filtering
- 📥 Export data

---

## How It Works
1. Admin opens analytics dashboard
2. Key metrics displayed in cards
3. Charts show trends over time
4. Filter by date range
5. Export data as needed

---

## API Endpoints Used
- `GET /admin/analytics` - Dashboard data
- `GET /admin/analytics/users` - User stats
- `GET /admin/analytics/sessions` - Session stats
