from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment import analyze_mood
from recommender import get_recommendations, search_movies, get_similar_movies

app = Flask(__name__)
CORS(app)

user_ratings = {}

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    mood_text = data.get("mood_text", "").strip()
    if not mood_text:
        return jsonify({"error": "mood_text is required"}), 400
    if len(mood_text) > 500:
        return jsonify({"error": "mood_text too long (max 500 chars)"}), 400
    mood = analyze_mood(mood_text)
    movies = get_recommendations(
        genre_ids=mood["genre_ids"],
        emotion=mood["emotion"],
        sentiment=mood["sentiment"],
        user_ratings=user_ratings,
    )
    return jsonify({
        "mood_analysis": {
            "emotion": mood["emotion"],
            "sentiment": mood["sentiment"],
            "polarity": mood["polarity"],
        },
        "recommendations": movies,
    })

@app.route("/api/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "query is required"}), 400
    results = search_movies(query)
    return jsonify({"results": results})

@app.route("/api/similar/<movie_id>", methods=["GET"])
def similar(movie_id):
    results = get_similar_movies(movie_id)
    return jsonify({"results": results})

@app.route("/api/rate", methods=["POST"])
def rate_movie():
    data = request.get_json()
    movie_id = str(data.get("movie_id", ""))
    rating = data.get("rating")
    if not movie_id or rating is None:
        return jsonify({"error": "movie_id and rating are required"}), 400
    if not isinstance(rating, (int, float)) or not (1 <= rating <= 5):
        return jsonify({"error": "rating must be between 1 and 5"}), 400
    user_ratings[movie_id] = rating
    return jsonify({"message": "Rating saved", "movie_id": movie_id, "rating": rating})

@app.route("/api/ratings", methods=["GET"])
def get_ratings():
    return jsonify({"ratings": user_ratings})

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "CineMood backend running"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
