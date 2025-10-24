# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import os
# import re

# # Initialize FastAPI app
# app = FastAPI()

# # Enable CORS for your React frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # or ["http://localhost:5173"] if you want to restrict
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load all .txt files from the data folder
# DATA_FOLDER = "data"
# documents = []

# for file in os.listdir(DATA_FOLDER):
#     if file.endswith(".txt"):
#         with open(os.path.join(DATA_FOLDER, file), "r", encoding="utf-8") as f:
#             text = f.read()
#             documents.append(text)

# print(f"Loaded {len(documents)} documents from /data")

# # Utility: clean and normalize text
# def clean_text(text):
#     return re.sub(r"[^\w\s]", "", text.lower())

# STOPWORDS = {"the", "is", "a", "an", "of", "in", "on", "for", "and", "to"}




# # Core search logic
# def find_best_answer(user_query):
#     cleaned_query = clean_text(user_query)
#     query_words = [w for w in cleaned_query.split() if w not in STOPWORDS]

#     best_sentence = None
#     best_score = 0

#     for doc in documents:
#         for sentence in doc.split("."):
#             sentence_clean = clean_text(sentence)
#             score = sum(word in sentence_clean for word in query_words)
#             if score > best_score:
#                 best_score = score
#                 best_sentence = sentence.strip()

#     if best_sentence:
#         return best_sentence
    

#     else:
#         return "Sorry, I couldn't find an answer for that."


# # def find_best_answer(user_query):
# #     cleaned_query = clean_text(user_query)
# #     query_words = [w for w in cleaned_query.split() if w not in STOPWORDS]

# #     best_sentence = None
# #     best_score = 0

# #     for filename in os.listdir(DATA_FOLDER):
# #         if filename.endswith(".txt"):
# #             filepath = os.path.join(DATA_FOLDER, filename)
# #             with open(filepath, "r", encoding="utf-8") as f:
# #                 doc = f.read()

# #             # Give a small boost if the topic (file name) appears in the question
# #             topic_name = os.path.splitext(filename)[0]
# #             topic_boost = 2 if topic_name in cleaned_query else 0

# #             for sentence in doc.split("."):
# #                 sentence_clean = clean_text(sentence)
# #                 score = sum(word in sentence_clean for word in query_words) + topic_boost
# #                 if score > best_score:
# #                     best_score = score
# #                     best_sentence = sentence.strip()

# #     if best_sentence:
# #         return best_sentence
# #     else:
# #         return "Sorry, I couldn't find an answer for that."

# # Request model
# class Query(BaseModel):
#     question: str

# # Endpoint
# @app.post("/chat")
# def chat_endpoint(query: Query):
#     user_question = query.question.lower().strip()



#     if user_question in ["hi","Hi", "hello","Hey", "Hello","hey"]:
#         return {"answer": "Hello! I'm here to help you. How are you feeling today?"}
    
#     answer = find_best_answer(query.question)
#     return {"answer": answer}

# # Simple check route
# @app.get("/")
# def home():
#     return {"message": "FastAPI chatbot backend is running!"}



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
