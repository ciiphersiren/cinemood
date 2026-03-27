# 🎬 CineMood — Mood-Based Movie Recommendation System

> Type how you feel. Get the perfect film for this moment.

CineMood is a full-stack web application that uses **Natural Language Processing** to analyze a user's mood from free-text input and recommends movies using real-time data from the TMDB API. Users can also search movies directly, rate films, and explore similar titles — all in a Netflix-inspired dark UI.

---

## ✨ Features

- **Mood Analysis** — NLP sentiment analysis (TextBlob + NLTK) detects emotion and polarity from natural text input
- **Mood-to-Genre Mapping** — Maps detected emotions (happy, sad, fearful, romantic, etc.) to TMDB genre IDs
- **Smart Ranking** — Scores and ranks movies using a weighted formula: TMDB rating + overview sentiment alignment + user rating personalization
- **Direct Search** — Search any movie by title for browsing or rating
- **Movie Detail Modal** — Click any film to see full overview, ratings, and sentiment score
- **"More Like This"** — Fetches similar movies via TMDB's recommendation engine
- **5-Star Rating System** — Rate films to personalize future recommendations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, CSS3 (custom Netflix-dark theme) |
| Backend | Python, Flask, Flask-CORS |
| NLP / ML | NLTK, TextBlob (sentiment analysis) |
| Data | TMDB API (live movie data, posters, similar films) |
| Fonts | Bebas Neue, DM Sans (Google Fonts) |

---

## 🧠 How the NLP Pipeline Works

```
User Input: "I feel lonely and a little sad tonight"
        ↓
TextBlob Sentiment Analysis
  polarity: -0.3  →  "negative"
  subjectivity: 0.6
        ↓
Keyword Emotion Detection
  "lonely", "sad"  →  emotion: "sad"
        ↓
Mood-to-Genre Mapping
  sad  →  [Drama (18), Romance (10749), History (36)]
        ↓
TMDB API: /discover/movie?with_genres=18,10749,36
        ↓
Ranking Formula
  score = (tmdb_rating × 0.5)
        + (overview_sentiment_bonus)
        + (user_rating_personalization)
        ↓
Top 20 Ranked Recommendations
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Free [TMDB API Key](https://www.themoviedb.org/settings/api)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt')"
```

Open `recommender.py` and add your TMDB API key:
```python
def get_api_key():
    return "your_tmdb_api_key_here"
```

Start the Flask server:
```bash
python app.py
```

Server runs at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

---

## 📁 Project Structure

```
cinemood/
├── backend/
│   ├── app.py            # Flask REST API (5 routes)
│   ├── sentiment.py      # NLP mood analysis pipeline
│   ├── recommender.py    # TMDB integration + ranking logic
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx               # Root component + state
        ├── App.css               # Netflix-dark theme
        └── components/
            ├── MoodInput.jsx     # Mood text input + quick chips
            ├── SearchInput.jsx   # Direct movie title search
            ├── MovieGrid.jsx     # Responsive poster grid
            ├── MovieModal.jsx    # Detail modal + similar films
            ├── StarRating.jsx    # Interactive 5-star rating
            └── RatedMovies.jsx   # Personal ratings list
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommend` | Analyze mood text → return ranked movies |
| POST | `/api/search` | Search movies by title via TMDB |
| GET | `/api/similar/:id` | Fetch similar movies for a given movie ID |
| POST | `/api/rate` | Save a user rating for a movie |
| GET | `/api/ratings` | Retrieve all stored user ratings |
| GET | `/api/health` | Health check |

---

## 📸 Screenshots

> Add screenshots here after deployment

---

## 🔮 Future Improvements

- [ ] Persistent ratings with a database (MongoDB / PostgreSQL)
- [ ] User authentication
- [ ] Watchlist feature
- [ ] Deploy frontend to Vercel + backend to Render
- [ ] Improve NLP with a fine-tuned transformer model (HuggingFace)

---

## 📄 License

MIT License — feel free to fork and build on this.

---

*Built with React, Flask, and TextBlob. Movie data provided by [TMDB](https://www.themoviedb.org/).*