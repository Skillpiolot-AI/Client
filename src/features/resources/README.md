# Resources Feature

Learning resources management and viewing.

---

## Components

### AddResourses.jsx
**Add Resources (Admin)**
- Upload new resources
- Resource metadata:
  - Title
  - Description
  - Category
  - File/URL

### ViewResourses.jsx
**View Resources**
- Browse all resources
- Filter by category
- Search functionality
- Download/access links

---

## Features
- 📁 Resource library
- 📥 Download materials
- 🏷️ Category organization
- 🔍 Search resources

---

## How It Works
1. Admin adds resources via form
2. Resources stored with metadata
3. Users browse resource library
4. Filter by category or search
5. Access/download resources

---

## API Endpoints Used
- `GET /resources` - List resources
- `POST /resources` - Add resource (admin)
- `DELETE /resources/:id` - Remove resource
