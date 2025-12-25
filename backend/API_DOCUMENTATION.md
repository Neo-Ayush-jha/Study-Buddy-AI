# Study Buddy AI - Backend API Documentation

## Overview
This is a Django REST API backend for an Interactive Study Tool inspired by NotebookLM. It provides endpoints for:
- PDF chapter upload and processing
- YouTube video transcript extraction
- Interactive Q&A with AI (Teacher-Student mode)
- Two-person dialogue generation
- Video summaries with exam tips
- Audio transcription

## Setup Instructions

### Prerequisites
- Python 3.10+
- MySQL Database
- Google Generative AI API Key (Gemini)

### Installation

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
Create a `.env` file in the `studytool` directory:
```
GEMINI_API_KEY=your_api_key_here
```

3. **Database Setup:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Run the server:**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

---

## API Endpoints

### 1. **Upload PDF Chapter**
**POST** `/api/upload-chapter/`

Upload and process an economics chapter PDF.

**Request:**
```bash
curl -X POST http://localhost:8000/api/upload-chapter/ \
  -F "file=@chapter.pdf" \
  -F "title=Chapter 1: Economics Basics"
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter uploaded successfully",
  "chapter_id": 1,
  "title": "Chapter 1: Economics Basics",
  "content_length": 15234
}
```

---

### 2. **Add YouTube Video**
**POST** `/api/add-video/`

Add a YouTube video and automatically extract its transcript.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=Ec19ljjvlCI",
  "title": "Economics Fundamentals"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video added successfully",
  "video_id": 1,
  "title": "Economics Fundamentals",
  "transcript_length": 5000
}
```

---

### 3. **Interactive Chat (Q&A)**
**POST** `/api/chat/`

Ask the AI teacher questions about the study material.

**Request:**
```json
{
  "question": "What is supply and demand?"
}
```

**Response:**
```json
{
  "success": true,
  "question": "What is supply and demand?",
  "answer": "Supply and demand is a fundamental concept in economics that explains how prices are determined in a market economy..."
}
```

---

### 4. **Generate Audio Dialogue**
**GET** `/api/audio-dialogue/`
**POST** `/api/audio-dialogue/` (with parameters)

Generate a teacher-student dialogue conversation.

**Request (POST):**
```json
{
  "num_exchanges": 5
}
```

**Response:**
```json
{
  "success": true,
  "dialogue": [
    {
      "speaker": "Teacher",
      "message": "Today we'll learn about supply and demand curves...",
      "order": 0
    },
    {
      "speaker": "Student",
      "message": "What exactly is the supply curve?",
      "order": 1
    }
  ],
  "raw_script": "Teacher: Today we'll learn... Student: What exactly..."
}
```

---

### 5. **Generate Video Summary**
**GET** `/api/video-summary/` (for first video)
**POST** `/api/video-summary/` (for specific video)

Get key points and exam tips from videos.

**Request (POST):**
```json
{
  "video_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "video_id": 1,
  "title": "Economics Fundamentals",
  "key_points": "1. Supply and demand determine prices...",
  "exam_tips": "- Always remember the law of supply and demand...\n- In exams, focus on the relationship between..."
}
```

---

### 6. **Get Study Material Overview**
**GET** `/api/study-material/`

Get a summary of all uploaded study materials.

**Response:**
```json
{
  "chapter": {
    "id": 1,
    "title": "Chapter 1: Economics Basics",
    "content_preview": "Economics is the study of how people allocate..."
  },
  "videos": [
    {
      "id": 1,
      "title": "Economics Fundamentals",
      "youtube_url": "https://www.youtube.com/watch?v=Ec19ljjvlCI"
    }
  ],
  "total_resources": 2
}
```

---

### 7. **Get Chat History**
**GET** `/api/chat-history/`

Retrieve all previous Q&A interactions.

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "id": 1,
      "question": "What is supply and demand?",
      "answer": "Supply and demand is...",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

### 8. **Transcribe Audio**
**POST** `/api/transcribe/`

Convert audio to text using Google Generative AI.

**Request:**
```
Binary audio data in WAV format
```

**Response:**
```json
{
  "success": true,
  "transcription": "What is the difference between macro and microeconomics?"
}
```

---

## Database Models

### Chapter
- `title`: String (200 chars)
- `content`: Text (PDF content)
- `created_at`: DateTime

### Video
- `youtube_url`: URL
- `title`: String (200 chars)
- `video_id`: String (unique, 20 chars)
- `transcript`: Text
- `created_at`: DateTime

### ChatHistory
- `question`: Text
- `answer`: Text
- `created_at`: DateTime

### Dialogue
- `chapter`: ForeignKey (Chapter)
- `speaker`: Choice (Teacher/Student)
- `message`: Text
- `order`: Integer
- `created_at`: DateTime

### VideoSummary
- `video`: OneToOneField (Video)
- `key_points`: Text
- `exam_tips`: Text
- `created_at`: DateTime

### UserContent
- `content_type`: Choice (PDF/Video)
- `title`: String (200 chars)
- `content`: Text
- `file_url`: URL (optional)
- `created_at`: DateTime

---

## Configuration

### CORS Settings
The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend)

### File Upload
- **Max file size**: Unlimited (configure in settings if needed)
- **Upload directory**: `media/`
- **Supported formats**: PDF, audio/wav

### AI Configuration
- **Model**: Gemini 2.5 Flash (for text generation)
- **Model**: Gemini 2.0 Flash Exp (for audio transcription)
- **API Key**: Required from Google Cloud

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Server Error

Error responses include a message:
```json
{
  "error": "Description of the error"
}
```

---

## Development Notes

### Adding a New Chapter
Before using the chat/dialogue endpoints, you must upload a chapter PDF.

### YouTube Video Processing
- Transcripts are automatically extracted when a video is added
- If transcript extraction fails, the video is still added with an empty transcript
- Video IDs are extracted from various YouTube URL formats

### AI Prompt Customization
Prompts are defined in `core/prompts.py`. Modify them to change AI behavior.

---

## Dependencies
- Django 6.0
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- mysql-connector-python 8.2.0
- google-generativeai 0.3.0
- PyPDF2 4.0.1
- youtube-transcript-api 0.6.2
- python-dotenv 1.0.0

---

## Future Enhancements
- [ ] User authentication
- [ ] Persistent dialogue storage with retrieval
- [ ] Advanced search in study materials
- [ ] Export summaries to PDF
- [ ] Multi-language support
- [ ] Integration with more video platforms
