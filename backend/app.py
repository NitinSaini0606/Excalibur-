
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all topic files from data folder
DATA_FOLDER = "data"
documents = {}

for file in os.listdir(DATA_FOLDER):
    if file.endswith(".txt"):
        topic = os.path.splitext(file)[0].lower()  # e.g. anxiety.txt -> anxiety
        with open(os.path.join(DATA_FOLDER, file), "r", encoding="utf-8") as f:
            documents[topic] = f.read()

print(f"Loaded topics: {list(documents.keys())}")

# Utility functions
def clean_text(text):
    return re.sub(r"[^\w\s]", "", text.lower())

STOPWORDS = {"the", "is", "a", "an", "of", "in", "on", "for", "and", "to"}

def tokenize(text):
    return [w for w in clean_text(text).split() if w not in STOPWORDS]

# Detect topic from question
def detect_topic(user_query):
    user_query_lower = user_query.lower()
    for topic in documents.keys():
        if topic in user_query_lower:
            return topic
    return None  # fallback to all docs

# Improved search logic with relevance scoring
def find_best_answer(user_query):
    query_tokens = tokenize(user_query)
    topic = detect_topic(user_query)

    best_sentence = None
    best_score = 0

    # Choose the document(s) to search
    search_docs = [documents[topic]] if topic else documents.values()

    for doc in search_docs:
        for sentence in doc.split("."):
            sentence_clean = clean_text(sentence)
            if not sentence_clean.strip():
                continue

            # Scoring: token overlap + partial word match bonus
            score = sum(1 for word in query_tokens if word in sentence_clean)
            for word in query_tokens:
                if any(word in s_word for s_word in sentence_clean.split()):
                    score += 0.5  # partial match bonus

            if score > best_score:
                best_score = score
                best_sentence = sentence.strip()

    # Fallback message
    if best_sentence and best_score > 0:
        return best_sentence
    else:
        return "I'm sorry, I couldn't find specific information for that. Could you please rephrase?"

# Request model
class Query(BaseModel):
    question: str

# Chat endpoint
@app.post("/chat")
def chat_endpoint(query: Query):
    user_question = query.question.strip().lower()

    greetings = {"hi", "hello", "hey", "hola"}
    if user_question in greetings:
        return {"answer": "Hello! I'm here to help you. How are you feeling today?"}

    answer = find_best_answer(query.question)
    return {"answer": answer}

# Health check route
@app.get("/")
def home():
    return {"message": "FastAPI chatbot backend is running with topic-based retrieval!"}
