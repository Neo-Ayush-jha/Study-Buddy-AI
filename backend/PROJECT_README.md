# 📚 StudyMate AI - Interactive Study Tool

An AI-powered study tool inspired by NotebookLM that helps students understand academic topics through interactive learning, summarized content, and conversational explanations.

## 🎯 Project Overview

This project demonstrates a full-stack AI-driven educational application with:
- **Student-Teacher Interactive Mode**: Context-aware Q&A system for Economics chapters
- **Audio Dialogue Feature**: Natural conversation simulation between teacher and student
- **Video Summary Feature**: Concise exam-oriented summaries with key concepts
- **Multiple Learning Sources**: Support for textbook chapters and YouTube video transcripts

## 🏗️ Tech Stack

### Frontend
- **React.js** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide Icons** for icons

### Backend
- **Django 6.0** (Python)
- **Django REST Framework** for RESTful APIs
- **MySQL** for database
- **Google Gemini API** for AI-powered responses

## 📁 Project Structure

```
backend/
├── study-buddy-ai-00-main/    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── lib/              # API and utilities
│   │   └── pages/            # Page components
│   └── package.json
│
└── studytool/                 # Backend (Django)
    ├── core/                  # Main app
    │   ├── views.py          # API endpoints
    │   ├── models.py         # Database models
    │   ├── gemini.py         # Gemini API integration
    │   ├── prompts.py        # AI prompts
    │   └── urls.py           # URL routing
    ├── studytool/            # Project settings
    └── manage.py
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Google Gemini API Key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd studytool
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   venv\\Scripts\\activate  # Windows
   # or
   source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the `studytool` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DB_NAME=studytool
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   DJANGO_SECRET_KEY=your_secret_key_here
   ```

5. **Setup MySQL database**
   ```sql
   CREATE DATABASE studytool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Add sample data**
   - Open Django admin: `http://localhost:8000/admin`
   - Add a Chapter with Economics content

9. **Start backend server**
   ```bash
   python manage.py runserver
   ```
   Backend will run on `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd study-buddy-ai-00-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/` | POST | Interactive Q&A with teacher AI |
| `/api/audio-dialogue/` | GET | Generate teacher-student dialogue |
| `/api/video-summary/` | GET | Generate exam-oriented summary |

### Example Request
```javascript
// Chat API
const response = await fetch('http://127.0.0.1:8000/api/chat/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: 'Explain supply and demand' })
});
const data = await response.json();
console.log(data.answer);
```

## 🎨 Features

### 1. Interactive Chat Interface
- Real-time Q&A with AI teacher
- Context-aware responses based on study material
- Simple Hinglish explanations with examples

### 2. Audio Dialogue Mode
- Simulated teacher-student conversation
- Natural learning experience
- Helps grasp concepts like live classroom

### 3. Video Summaries
- Concise exam-oriented summaries
- Key concepts and revision points
- Bullet-point format for easy review

## 🔧 Configuration

### Backend CORS Settings
The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend port)

### Database Models
- **Chapter**: Store study material content
- **Video**: Store YouTube video transcripts
- **ChatHistory**: Track Q&A interactions

## 📝 Usage

1. **Start both servers** (backend on 8000, frontend on 5173)
2. **Open browser** to `http://localhost:5173`
3. **Choose a mode**:
   - **Chat**: Ask questions about Economics
   - **Dialogue**: Listen to teacher-student conversation
   - **Videos**: View exam summaries

## 🛠️ Development

### Adding New Content
1. Access Django admin: `http://localhost:8000/admin`
2. Add new chapters or video transcripts
3. Content is automatically available in the frontend

### Customizing AI Prompts
Edit prompts in `studytool/core/prompts.py`:
- `teacher_student_prompt()`: Chat responses
- `audio_dialogue_prompt()`: Dialogue generation
- `video_summary_prompt()`: Summary generation

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Change default SECRET_KEY in production
- Enable HTTPS in production
- Restrict CORS origins for production

## 📦 Production Deployment

### Backend
1. Set `DEBUG = False` in settings
2. Configure proper SECRET_KEY
3. Setup PostgreSQL/MySQL
4. Use gunicorn/uwsgi for serving
5. Configure static files with whitenoise
6. Setup proper CORS origins

### Frontend
1. Build production bundle: `npm run build`
2. Serve `dist/` folder with nginx/Apache
3. Update API_BASE_URL for production backend

## 🤝 Contributing

This is a personal project showcasing full-stack AI application development.

## 📄 License

This project is for educational and portfolio purposes.

## 👤 Author

**Aadit**
- Full-Stack Developer
- AI & ML Enthusiast

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- NotebookLM for inspiration
- shadcn/ui for beautiful components

---

**Note**: This project demonstrates skills in:
- Full-stack web development
- AI integration (Gemini API)
- RESTful API design
- Database design
- User-focused educational tools
- React.js and Django frameworks
