# StudyMate AI - Quick Start Guide

## First Time Setup

### Step 1: Backend Setup
```powershell
# Navigate to backend directory
cd studytool

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example and fill in your details)
copy .env.example .env

# Edit .env file and add your:
# - GEMINI_API_KEY
# - MySQL credentials
```

### Step 2: Database Setup
```sql
-- Open MySQL and create database
CREATE DATABASE studytool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```powershell
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
```

### Step 3: Add Sample Data
1. Start Django server: `python manage.py runserver`
2. Open admin panel: http://localhost:8000/admin
3. Login with superuser credentials
4. Go to "Chapters" section
5. Click "Add Chapter"
6. Add title and Economics content (paste your chapter text)
7. Save

### Step 4: Frontend Setup
```powershell
# Open new terminal
cd ..\study-buddy-ai-00-main

# Install dependencies
npm install

# Start frontend
npm run dev
```

### Step 5: Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## Daily Development

### Start Backend
```powershell
cd studytool
.\venv\Scripts\activate
python manage.py runserver
```

### Start Frontend
```powershell
cd study-buddy-ai-00-main
npm run dev
```

## Testing the Features

### 1. Test Chat Feature
- Go to frontend (http://localhost:5173)
- Click "Chat" tab
- Ask: "What is supply and demand?"
- AI teacher will respond with context from your chapter

### 2. Test Audio Dialogue
- Click "Dialogue" tab
- See teacher-student conversation generated from chapter content
- Dialogue simulates natural classroom discussion

### 3. Test Video Summaries
- Click "Videos" tab
- See exam-oriented summary with key points
- Format designed for quick revision

## Common Issues & Solutions

### Issue: Backend not starting
**Solution**: 
- Check if MySQL is running
- Verify database credentials in .env
- Make sure port 8000 is not in use

### Issue: Frontend can't connect to backend
**Solution**:
- Ensure backend is running on port 8000
- Check CORS settings in Django settings.py
- Verify API_BASE_URL in frontend (src/lib/api.ts)

### Issue: Gemini API errors
**Solution**:
- Verify GEMINI_API_KEY in .env
- Check API quota on Google AI Studio
- Ensure internet connection is working

### Issue: No data showing
**Solution**:
- Add at least one Chapter in Django admin
- Restart backend server after adding data
- Check browser console for errors

## Project Structure Quick Reference

```
backend/
├── studytool/                 # Django Backend
│   ├── core/                 # Main app with AI logic
│   │   ├── views.py         # API endpoints
│   │   ├── gemini.py        # Gemini integration
│   │   └── prompts.py       # AI prompts
│   ├── studytool/           # Django settings
│   └── .env                 # Environment variables (create this)
│
└── study-buddy-ai-00-main/   # React Frontend
    ├── src/
    │   ├── components/      # UI components
    │   ├── lib/api.ts      # Backend API calls
    │   └── pages/          # Main pages
    └── package.json
```

## API Endpoints Reference

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/chat/` | POST | `{ "question": "your question" }` | `{ "answer": "AI response" }` |
| `/api/audio-dialogue/` | GET | - | `{ "script": "dialogue text" }` |
| `/api/video-summary/` | GET | - | `{ "summary": "summary text" }` |

## Environment Variables Template

Create `.env` file in `studytool/` directory:

```env
# Gemini API (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Database
DB_NAME=studytool
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Django
DJANGO_SECRET_KEY=your_long_random_secret_key_here
```

## Next Steps

1. ✅ Complete setup following steps above
2. ✅ Add your Economics chapter content in admin
3. ✅ Test all three features (Chat, Dialogue, Videos)
4. 🚀 Customize prompts in `prompts.py` for your needs
5. 🎨 Customize frontend styling if desired
6. 📝 Add more chapters and content

## Tips for Best Results

- **Chapter Content**: Add detailed, well-structured Economics content
- **Questions**: Ask specific questions related to the chapter
- **Prompts**: Customize prompts in `prompts.py` for different subjects
- **Multiple Chapters**: Add multiple chapters to expand knowledge base

## Getting Help

If you encounter issues:
1. Check this guide's "Common Issues" section
2. Verify all environment variables are set correctly
3. Check Django logs in terminal
4. Check browser console for frontend errors
5. Ensure both frontend and backend are running

---

**Ready to Start?** Follow Step 1 above! 🚀
