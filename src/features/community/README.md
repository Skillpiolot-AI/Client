# Community Feature

Social community feed with posts, comments, and user interactions.

---

## Components

### community.jsx
**Main Community Feed**
- Create and view posts
- Like and comment on posts
- View user profiles
- Follow/unfollow users
- Search users and posts
- Community disclaimer acceptance

---

## Features

### Post Management
- Create new posts with text content
- View all community posts in feed
- Animated post transitions with Framer Motion
- Real-time feed updates

### Comments System
- Comment on any post
- View all comments per post
- Expandable comment sections
- User avatars on comments

### Social Interactions
- 👍 Like posts
- 💬 Comment on posts
- 👤 View user profiles
- ➕ Follow/unfollow users
- 🔍 Search functionality

### User Profiles
- Click username to view profile
- See user's posts and activity
- Follow/unfollow from profile
- Followers/following counts

---

## How It Works
1. User enters community feed
2. First-time users see disclaimer modal
3. Posts displayed in chronological order
4. Create posts from top input card
5. Click posts to expand comments
6. Interact via like/comment buttons
7. Click usernames to view profiles

---

## API Endpoints Used
- `GET /posts` - Fetch all posts
- `POST /posts` - Create new post
- `POST /posts/:id/like` - Like a post
- `POST /posts/:id/comments` - Add comment
- `GET /posts/:id/comments` - Get comments
- `POST /users/:id/follow` - Follow user
- `GET /users/random` - Suggested users

---

## UI Components Used
- Avatar with fallback
- Card components
- Input fields
- Animated transitions
- Modal dialogs
