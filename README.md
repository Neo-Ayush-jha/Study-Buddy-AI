# Study Buddy AI - Interactive Learning Tool 📚

An interactive study tool inspired by NotebookLM, designed for students to learn Economics through:
- **Interactive Q&A**: Ask questions about study material
- **Audio Dialogues**: Teacher-student conversations
- **Video Summaries**: Key concepts and exam tips from videos
- **Audio Transcription**: Convert audio notes to text

---

## 🎯 Features

### 1. **PDF Chapter Management**
- Upload economics chapters as PDF files
- Automatic text extraction and storage
- Full-text content available for Q&A

### 2. **YouTube Video Integration**
- Add YouTube videos by URL
- Automatic transcript extraction
- Generate summaries with key concepts

### 3. **Interactive Teacher-Student Q&A**
- Ask questions about the study material
- AI responds as an expert teacher
- Answers based strictly on provided content
- Chat history maintained

### 4. **Two-Person Dialogue Generation**
- Creates realistic teacher-student conversations
- Configurable number of exchanges
- Educational and engaging format
- Can be used for audio playback

### 5. **Exam-Focused Summaries**
- Key concepts extraction
- Exam tips and important formulas
- Quick revision guides
- Covers common misconceptions

### 6. **Audio Support**
- Transcribe audio notes to text
- Audio processing via Google AI
- Integration with dialogue system

---

## 📁 Project Structure

```
backend/
├── studytool/                  # Django project settings
│   ├── settings.py             # Configuration
│   ├── urls.py                 # Main URL routing
│   └── wsgi.py                 # WSGI app
├── core/                       # Main application
│   ├── models.py               # Database models (6 models)
│   ├── views.py                # API endpoints (10+ endpoints)
│   ├── urls.py                 # App URL patterns
│   ├── gemini.py               # Google Gemini integration
│   ├── youtube.py              # YouTube API utilities
│   ├── pdf_utils.py            # PDF processing
│   ├── prompts.py              # AI prompt templates
│   ├── admin.py                # Django admin config
│   └── migrations/             # Database migrations
├── media/                      # User uploads (auto-created)
├── manage.py                   # Django CLI
├── requirements.txt            # Python dependencies
├── BACKEND_SETUP.md           # Setup instructions
├── API_DOCUMENTATION.md        # Complete API reference
└── README.md                   # This file

study-buddy-ai-00-main/        # React frontend
├── src/
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities (API calls)
└── package.json               # Node dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- MySQL Database
- Google Generative AI API Key

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure database:**
   - Create MySQL database: `CREATE DATABASE studytool;`
   - Update credentials in `studytool/settings.py`

3. **Set environment variables:**
   - Create `.env` file in `studytool/` with your Gemini API key:
     ```
     GEMINI_API_KEY=your_key_here
     ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd study-buddy-ai-00-main
   bun install  # or npm install
   ```

2. **Update API URL:**
   - Edit `src/lib/api.ts` - set backend URL to `http://localhost:8000`

3. **Start dev server:**
   ```bash
   bun run dev  # or npm run dev
   ```

Frontend will be available at: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload-chapter/` | Upload PDF chapter |
| POST | `/api/add-video/` | Add YouTube video |
| POST | `/api/chat/` | Ask question (Q&A) |
| GET | `/api/audio-dialogue/` | Get teacher-student dialogue |
| POST | `/api/audio-dialogue/` | Generate new dialogue |
| GET | `/api/video-summary/` | Get video summary |
| POST | `/api/video-summary/` | Generate summary for video |
| GET | `/api/study-material/` | Get overview of all materials |
| GET | `/api/chat-history/` | Get all Q&A history |
| POST | `/api/transcribe/` | Transcribe audio |

See [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for detailed endpoint documentation.

---

## 🗄️ Database Models

### Chapter
- Store uploaded PDF content
- Title and full text content
- Created timestamp

### Video
- YouTube video metadata
- Video ID and transcript
- Created timestamp

### ChatHistory
- Q&A exchanges
- Question and answer pairs
- Created timestamp

### Dialogue
- Teacher-student conversations
- Speaker (Teacher/Student)
- Message order and content

### VideoSummary
- Key points from videos
- Exam tips and formulas
- One-to-one relationship with Video

### UserContent
- Generic content storage
- Supports PDF and Video types
- File URL and metadata

---

## 🛠️ Technology Stack

### Backend
- **Django 6.0** - Web framework
- **Django REST Framework** - API
- **Google Generative AI (Gemini)** - AI responses
- **PyPDF2** - PDF processing
- **youtube-transcript-api** - Video transcripts
- **MySQL** - Database

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

---

## 📚 Usage Examples

### 1. Upload Study Material
```bash
# Upload PDF
curl -X POST http://localhost:8000/api/upload-chapter/ \
  -F "file=@chapter.pdf" \
  -F "title=Economics Chapter 1"

# Add YouTube video
curl -X POST http://localhost:8000/api/add-video/ \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://youtu.be/Ec19ljjvlCI",
    "title": "Economics Basics"
  }'
```

### 2. Ask Questions
```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{"question": "What is supply and demand?"}'
```

### 3. Generate Dialogue
```bash
curl -X GET http://localhost:8000/api/audio-dialogue/
```

### 4. Get Summaries
```bash
curl -X GET http://localhost:8000/api/video-summary/
```

---

## ⚙️ Configuration

### CORS Settings
By default, the API accepts requests from:
- `http://localhost:5173` (Vite)
- `http://localhost:3000`

### File Upload
- **Location**: `media/` directory
- **Formats**: PDF, WAV audio
- **Max size**: Configurable in settings

### AI Configuration
- **Model**: Gemini 2.5 Flash (text)
- **Model**: Gemini 2.0 Flash Exp (audio)
- **API**: Google Cloud AI

---

## 🔒 Security Notes

⚠️ **Development Only**: Current settings are for development.

For production:
1. Set `DEBUG = False` in settings
2. Use strong `SECRET_KEY`
3. Configure proper `ALLOWED_HOSTS`
4. Use environment variables for secrets
5. Enable HTTPS
6. Set up proper database backups

---

## 🐛 Troubleshooting

### Backend issues
- **Port 8000 in use?** - Run on different port: `python manage.py runserver 8001`
- **Database error?** - Ensure MySQL is running and credentials are correct
- **API key error?** - Check `.env` file for valid Gemini API key
- **Migration error?** - Run `python manage.py makemigrations && python manage.py migrate`

### Frontend issues
- **API not responding?** - Check backend is running on correct port
- **CORS error?** - Verify frontend URL is in `CORS_ALLOWED_ORIGINS`
- **Vite error?** - Delete `node_modules` and reinstall: `bun install`

---

## 📝 Documentation

- **[BACKEND_SETUP.md](backend/BACKEND_SETUP.md)** - Detailed backend setup
- **[API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)** - Complete API reference
- **[Frontend README](study-buddy-ai-00-main/README.md)** - Frontend details

---

## 🎓 Learning Resources

The tool is designed for economics learning. You'll need to provide:
1. An economics chapter PDF
2. YouTube videos about economics topics

The AI will generate:
- Answers to student questions
- Teacher-student dialogue conversations
- Exam-focused summaries
- Video transcripts and key points

---

## ✨ Features Implemented

✅ PDF upload and text extraction  
✅ YouTube video transcript extraction  
✅ Interactive Q&A with Gemini AI  
✅ Two-person dialogue generation  
✅ Video summaries with exam tips  
✅ Chat history storage and retrieval  
✅ Audio transcription support  
✅ Comprehensive error handling  
✅ CORS configuration for frontend  
✅ Django admin interface  
✅ Full API documentation  

---

## 🚀 Future Enhancements

- [ ] User authentication and accounts
- [ ] Persistent user study sessions
- [ ] Advanced search and filtering
- [ ] Export summaries to PDF
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Real audio generation for dialogues
- [ ] Quiz generation from material
- [ ] Study progress tracking
- [ ] Integration with more platforms

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review API endpoint examples
3. Check Django logs: `python manage.py` output
4. Verify database connectivity
5. Validate API keys and credentials

---

## 📄 License

This project is for educational purposes.

---

## 🎯 Assignment Completion

✅ **Feature 1: Audio Two-Person Dialogue Mode**
- Implemented via `/api/audio-dialogue/` endpoint
- Generates realistic teacher-student conversations
- Can be used with audio synthesis

✅ **Feature 2: Video Summaries**
- Implemented via `/api/video-summary/` endpoint
- Extracts key concepts
- Provides exam tips
- Covers common misconceptions

✅ **Working with Study Material**
- PDF upload system ready
- YouTube video integration ready
- Uses provided economics content
- Interactive Q&A for clarifications

✅ **Full Implementation**
- Complete backend API
- Database models
- Error handling
- Documentation

---

**Ready to learn! Upload your economics chapter and start studying.** 📚✨
