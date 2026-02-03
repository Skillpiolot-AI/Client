# Career Feature

Career guidance tools including quiz, recommendations, and roadmaps.

---

## Directory Structure

```
career/
├── quiz/                 # Career aptitude quiz
│   ├── Quiz.jsx          # Quiz component
│   ├── Prediction.jsx    # Result predictions
│   └── data.json         # Quiz questions
├── recommendation/       # Job recommendations
│   ├── Recommendation.jsx
│   ├── RecommDetails.jsx
│   ├── JobTitle.jsx
│   ├── jobinfo.jsx
│   └── DummyInfo.jsx
└── roadmap/              # Career path roadmaps
    ├── Roadmap.jsx
    ├── Frontend.jsx
    └── DataScientist.jsx
```

---

## Subdirectories

### quiz/
**Career Aptitude Quiz**

#### Quiz.jsx
- Interactive career quiz
- Multiple choice questions
- Progress tracking
- Answer validation

#### Prediction.jsx
- Career predictions based on quiz
- Match percentages
- Career suggestions
- Detailed analysis

#### data.json
- Quiz question bank
- Answer options
- Scoring criteria

---

### recommendation/
**Job Recommendations**

#### Recommendation.jsx
- Personalized job recommendations
- Based on profile and assessments
- Filter and sort options

#### RecommDetails.jsx
- Detailed recommendation view
- Job requirements
- Skill matching

#### JobTitle.jsx & jobinfo.jsx
- Job title display components
- Job information cards

---

### roadmap/
**Career Path Roadmaps**

#### Roadmap.jsx
- Career path selection
- Interactive roadmap display

#### Frontend.jsx
Frontend Developer roadmap:
- HTML/CSS/JavaScript
- Frameworks (React, Vue)
- Tools and deployment

#### DataScientist.jsx
Data Scientist roadmap:
- Python/R programming
- Machine learning
- Data visualization

---

## Features
- 🧠 Career aptitude quiz
- 🎯 AI-powered predictions
- 💼 Job recommendations
- 🗺️ Visual career roadmaps
- 📊 Skill gap analysis

---

## How It Works
1. **Quiz Flow:**
   - Take career aptitude quiz
   - Answer personality/interest questions
   - Receive career predictions

2. **Recommendations:**
   - View personalized job matches
   - Explore job details
   - See required skills

3. **Roadmaps:**
   - Select career path
   - View step-by-step guide
   - Track learning progress

---

## API Endpoints Used
- `POST /career/quiz` - Submit quiz answers
- `GET /career/recommendations` - Get recommendations
- `GET /career/roadmaps` - Fetch roadmaps
