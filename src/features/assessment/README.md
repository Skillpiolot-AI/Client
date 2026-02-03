# Assessment Feature

Career assessment system with questionnaires, analysis, and results visualization.

---

## Directory Structure

```
assessment/
├── AssessmentApp.jsx       # Main app container
├── index.jsx               # Entry point
├── App.css                 # Global styles
├── components/
│   ├── Assessment/         # Assessment pages
│   ├── Home/               # Home components
│   ├── Results/            # Results display
│   ├── Shared/             # Shared components
│   ├── QuestionnaireForm.jsx
│   └── ResultsGraphs.jsx
├── data/                   # Assessment data
├── services/               # API services
├── styles/                 # CSS styles
└── utils/                  # Utilities
```

---

## Main Components

### AssessmentApp.jsx
**Main Container**
- Page state management (assessment/results)
- Assessment data handling
- Navigation between pages

### components/Assessment/
Assessment question pages:
- Multi-step questionnaire
- Progress tracking
- Answer validation

### components/Results/
Results visualization:
- Score breakdown
- Career match percentages
- Personality analysis
- Recommendations

### ResultsGraphs.jsx
**Data Visualization**
- Charts and graphs for results
- Visual score representation

### QuestionnaireForm.jsx
**Question Form Component**
- Dynamic question rendering
- Answer selection
- Form validation

---

## How It Works
1. User starts assessment from dashboard
2. Multi-step questionnaire presented
3. Answers captured and validated
4. Data sent to backend for analysis
5. Results page shows:
   - Career matches
   - Personality traits
   - Recommendations
6. Option to retake assessment

---

## Features
- 📝 Interactive questionnaires
- 📊 Visual results with graphs
- 🎯 Career match analysis
- 🧠 Personality insights
- 🔄 Retake functionality

---

## API Endpoints Used
- `POST /assessments` - Submit assessment
- `GET /assessments/:id` - Get results
- `GET /assessments/user` - User's assessments
