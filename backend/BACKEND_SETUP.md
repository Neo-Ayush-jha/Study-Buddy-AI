# Backend Setup & Running Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database
Edit `studytool/settings.py` - Update MySQL credentials:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'studytool',
        'USER': 'root',
        'PASSWORD': '',  # Your password
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

**Create the database:**
```bash
mysql -u root -p
> CREATE DATABASE studytool;
> EXIT;
```

### 3. Set Up Environment Variables
Create `.env` file in `studytool/` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: https://ai.google.dev/

### 4. Run Migrations
```bash
cd studytool
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Server
```bash
python manage.py runserver
```

The backend will run at: **http://localhost:8000**

API endpoints will be available at: **http://localhost:8000/api/**

---

## Testing the API

### 1. Upload a Chapter
```bash
curl -X POST http://localhost:8000/api/upload-chapter/ \
  -F "file=@economics_chapter.pdf" \
  -F "title=Economics Chapter 1"
```

### 2. Add YouTube Videos
```bash
curl -X POST http://localhost:8000/api/add-video/ \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=Ec19ljjvlCI",
    "title": "Economics Fundamentals"
  }'
```

### 3. Ask a Question
```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is supply and demand?"
  }'
```

### 4. Generate Dialogue
```bash
curl -X GET http://localhost:8000/api/audio-dialogue/
```

### 5. Get Video Summary
```bash
curl -X GET http://localhost:8000/api/video-summary/
```

---

## Directory Structure
```
backend/
├── studytool/              # Main Django project
│   ├── settings.py         # Configuration
│   ├── urls.py             # URL routing
│   └── wsgi.py             # WSGI config
├── core/                   # Main app
│   ├── models.py           # Database models
│   ├── views.py            # API endpoints
│   ├── urls.py             # App URLs
│   ├── gemini.py           # AI integration
│   ├── youtube.py          # YouTube API
│   ├── pdf_utils.py        # PDF processing
│   ├── prompts.py          # AI prompts
│   └── migrations/         # Database migrations
├── manage.py               # Django CLI
├── requirements.txt        # Dependencies
└── media/                  # Uploaded files (auto-created)
```

---

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running
- Check credentials in `settings.py`
- Create the database: `CREATE DATABASE studytool;`

### Missing Dependencies
```bash
pip install -r requirements.txt --upgrade
```

### Gemini API Error
- Verify API key in `.env`
- Check quota limits at https://ai.google.dev/
- Ensure API is enabled in Google Cloud

### Port Already in Use
```bash
python manage.py runserver 8001
```

### Database Migration Issues
```bash
python manage.py showmigrations
python manage.py migrate --fake core 0001  # If needed
```

---

## Production Deployment

### Update Settings
In `studytool/settings.py`:
```python
DEBUG = False
SECRET_KEY = 'your-secret-key-here'
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
```

### Use PostgreSQL
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'studytool',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Deploy with Gunicorn
```bash
pip install gunicorn
gunicorn studytool.wsgi:application --bind 0.0.0.0:8000
```

---

## Full Implementation Checklist

✅ PDF upload and processing  
✅ YouTube video extraction  
✅ Interactive Q&A with Gemini AI  
✅ Two-person dialogue generation  
✅ Video summaries with exam tips  
✅ Chat history storage  
✅ Audio transcription support  
✅ Comprehensive error handling  
✅ CORS configuration for frontend  
✅ Database models with relationships  

---

## Next Steps

1. **Run the backend**: `python manage.py runserver`
2. **Test API endpoints** using the curl commands above
3. **Connect frontend** from `study-buddy-ai-00-main/` directory
4. **Update frontend** API URLs to match your backend address

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete endpoint reference.
