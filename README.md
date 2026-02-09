# 📘 AI Question Generator

An AI-powered web application that converts learning content into high-quality questions such as MCQs, fill-in-the-blanks, and long-answer questions.  
Users can upload PDFs, paste text, or provide website content, customize difficulty and age level, and download questions as PDF or TXT.

---

## 🚀 Features

- 📄 Generate questions from:
  - Plain text
  - PDFs
  - Website URLs
- 🧠 AI-powered question generation
- ❓ Question types:
  - Multiple Choice Questions (MCQ)
  - Fill in the blanks
  - Long answer questions
- 🎯 Customization:
  - Difficulty level (easy / medium / hard)
  - Age group selection
  - Number of questions
- 📥 Download options:
  - PDF or TXT
  - With or without answers
- 🔐 Secure OpenAI API usage (key never exposed to frontend)

---

## 🏗️ Architecture Overview


- Frontend handles UI and user input
- Backend handles content processing, AI orchestration, and exporting
- OpenAI is accessed only from the backend

---

## 🧑‍💻 Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6)
- Fetch API
- Custom CSS

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- Pydantic
- LangChain
- OpenAI API
- BeautifulSoup (web scraping)
- PDF processing libraries

### DevOps / Hosting
- Git & GitHub
- Render (Backend – Free tier)
- Vercel (Frontend – Free tier)

---

## 📁 Project Structure



