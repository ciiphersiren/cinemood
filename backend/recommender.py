import requests
from textblob import TextBlob
import os
from dotenv import load_dotenv

load_dotenv()

TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

def get_api_key():
    key = os.environ.get("TMDB_API_KEY", "")
    if not key:
        raise ValueError("TMDB_API_KEY not set. Add it to backend/.env")
    return key

def score_overview(overview: str) -> float:
    if not overview:
        return 0.0
    return round(TextBlob(overview).sentiment.polarity, 3)

def format_movie(movie: dict, user_ratings: dict = {}) -> dict:
    movie_id = str(movie.get("id"))
    overview = movie.get("overview", "")
    poster_path = movie.get("poster_path")
    return {
        "id": movie_id,
        "title": movie.get("title", "Unknown"),
        "overview": overview,
        "poster": f"{TMDB_IMAGE_BASE}{poster_path}" if poster_path else None,
        "release_year": (movie.get("release_date") or "")[:4],
        "tmdb_rating": movie.get("vote_average", 0),
        "popularity": movie.get("popularity", 0),
        "genre_ids": movie.get("genre_ids", []),
        "sentiment_score": score_overview(overview),
        "user_rating": user_ratings.get(movie_id),
    }

def fetch_movies_by_genres(genre_ids: list, page: int = 1) -> list:
    genre_str = ",".join(str(g) for g in genre_ids)
    params = {
        "api_key": get_api_key(),
        "with_genres": genre_str,
        "sort_by": "popularity.desc",
        "vote_count.gte": 100,
        "page": page,
        "language": "en-US",
    }
    try:
        res = requests.get(f"{TMDB_BASE}/discover/movie", params=params, timeout=8)
        res.raise_for_status()
        return res.json().get("results", [])
    except Exception as e:
        print(f"TMDB genre fetch error: {e}")
        return []

def search_movies(query: str) -> list:
    """Search TMDB for movies by title/keyword."""
    params = {
        "api_key": get_api_key(),
        "query": query,
        "language": "en-US",
        "page": 1,
        "include_adult": False,
    }
    try:
        res = requests.get(f"{TMDB_BASE}/search/movie", params=params, timeout=8)
        res.raise_for_status()
        results = res.json().get("results", [])
        return [format_movie(m) for m in results[:20]]
    except Exception as e:
        print(f"TMDB search error: {e}")
        return []

def get_similar_movies(movie_id: str) -> list:
    """Fetch similar movies from TMDB for a given movie ID."""
    try:
        res = requests.get(
            f"{TMDB_BASE}/movie/{movie_id}/similar",
            params={"api_key": get_api_key(), "language": "en-US", "page": 1},
            timeout=8,
        )
        res.raise_for_status()
        results = res.json().get("results", [])
        return [format_movie(m) for m in results[:12]]
    except Exception as e:
        print(f"TMDB similar fetch error: {e}")
        return []

def get_recommendations(genre_ids: list, emotion: str, sentiment: str, user_ratings: dict = {}) -> list:
    raw = fetch_movies_by_genres(genre_ids, 1) + fetch_movies_by_genres(genre_ids, 2)
    seen = set()
    unique = []
    for m in raw:
        if m["id"] not in seen:
            seen.add(m["id"])
            unique.append(m)

    formatted = [format_movie(m, user_ratings) for m in unique]

    def rank_score(movie):
        base = movie["tmdb_rating"] * 0.5
        sent = movie["sentiment_score"]
        sentiment_bonus = sent * 2 if sentiment == "positive" else abs(sent) * 1.5 if sentiment == "negative" else 0
        personalization = 1.5 if (movie.get("user_rating") or 0) >= 4 else 0
        return base + sentiment_bonus + personalization

    return sorted(formatted, key=rank_score, reverse=True)[:20]
