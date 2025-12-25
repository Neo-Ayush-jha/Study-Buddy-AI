from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import *
from .gemini import *
from .prompts import *
from .pdf_utils import extract_pdf_text
from .youtube import get_transcription, extract_video_id
from google import genai
import io
from django.core.files.storage import default_storage
from django.conf import settings
import json

# ==================== PDF Upload & Processing ====================

@api_view(['POST'])
def upload_chapter(req):
    """Upload and process PDF file to extract chapter content"""
    try:
        if 'file' not in req.FILES:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pdf_file = req.FILES['file']
        title = req.data.get('title', pdf_file.name)
        
        # Extract text from PDF
        text_content = extract_pdf_text(pdf_file)
        
        # Create or update Chapter
        chapter, created = Chapter.objects.get_or_create(
            title=title,
            defaults={'content': text_content}
        )
        
        if not created:
            chapter.content = text_content
            chapter.save()
        
        return Response({
            "success": True,
            "message": "Chapter uploaded successfully",
            "chapter_id": chapter.id,
            "title": chapter.title,
            "content_length": len(text_content)
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== YouTube Video Processing ====================

@api_view(['POST'])
def add_youtube_video(req):
    """Add YouTube video and extract transcript"""
    try:
        youtube_url = req.data.get('url')
        
        if not youtube_url:
            return Response(
                {"error": "YouTube URL required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract video ID
        video_id = extract_video_id(youtube_url)
        
        if not video_id:
            return Response(
                {"error": "Invalid YouTube URL"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if video already exists
        try:
            video = Video.objects.get(video_id=video_id)
            return Response({
                "message": "Video already exists",
                "video_id": video.id,
                "title": video.title
            })
        except Video.DoesNotExist:
            pass
        
        # Get transcript
        try:
            transcript = get_transcription(video_id)
        except Exception as e:
            transcript = ""
            print(f"Could not get transcript: {str(e)}")
        
        # Create video entry
        video = Video.objects.create(
            youtube_url=youtube_url,
            video_id=video_id,
            transcript=transcript,
            title=req.data.get('title', f"Video {video_id}")
        )
        
        return Response({
            "success": True,
            "message": "Video added successfully",
            "video_id": video.id,
            "title": video.title,
            "transcript_length": len(transcript)
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Interactive Chat ====================

@api_view(['POST'])
def chat(req):
    """Interactive Q&A with AI teacher based on study material"""
    try:
        question = req.data.get('question')
        
        if not question:
            return Response(
                {"error": "Question required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get chapter content
        chapter = Chapter.objects.first()
        
        if not chapter:
            return Response(
                {"error": "No study material uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate answer using Gemini
        prompt = teacher_student_prompt(chapter.content, question)
        answer = ask_gemini(prompt)
        
        # Save to chat history
        ChatHistory.objects.create(question=question, answer=answer)
        
        return Response({
            "success": True,
            "question": question,
            "answer": answer
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Audio Dialogue (Two-Person Conversation) ====================

@api_view(['GET', 'POST'])
def audio_dialogue(req):
    """Generate teacher-student dialogue conversation"""
    try:
        chapter = Chapter.objects.first()
        
        if not chapter:
            return Response(
                {"error": "No study material uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        num_exchanges = int(req.data.get('num_exchanges', 5)) if req.method == 'POST' else 5
        
        # Check if dialogue already exists
        existing_dialogues = Dialogue.objects.filter(chapter=chapter)
        
        if existing_dialogues.exists():
            # Return existing dialogue
            dialogues = list(existing_dialogues.values('speaker', 'message', 'order'))
            return Response({
                "success": True,
                "dialogue": dialogues
            })
        
        # Generate new dialogue
        prompt = audio_dialogue_prompt(chapter.content, num_exchanges=num_exchanges)
        script = ask_gemini(prompt)
        
        # Parse and save dialogue
        save_dialogue_from_script(chapter, script)
        
        # Get saved dialogue
        dialogues = list(Dialogue.objects.filter(chapter=chapter).values('speaker', 'message', 'order'))
        
        return Response({
            "success": True,
            "dialogue": dialogues,
            "raw_script": script
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def save_dialogue_from_script(chapter, script):
    """Parse dialogue script and save to database"""
    lines = script.split('\n')
    order = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        if line.startswith('Teacher:'):
            message = line.replace('Teacher:', '').strip()
            if message:
                Dialogue.objects.create(
                    chapter=chapter,
                    speaker='Teacher',
                    message=message,
                    order=order
                )
                order += 1
        
        elif line.startswith('Student:'):
            message = line.replace('Student:', '').strip()
            if message:
                Dialogue.objects.create(
                    chapter=chapter,
                    speaker='Student',
                    message=message,
                    order=order
                )
                order += 1


# ==================== Video Summaries ====================

@api_view(['GET', 'POST'])
def video_summary(req):
    """Generate video summary with key points and exam tips"""
    try:
        if req.method == 'POST':
            video_id = req.data.get('video_id')
            
            try:
                video = Video.objects.get(id=video_id)
            except Video.DoesNotExist:
                return Response(
                    {"error": "Video not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            video = Video.objects.first()
            
            if not video:
                return Response(
                    {"error": "No videos available"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if summary already exists
        try:
            summary = VideoSummary.objects.get(video=video)
            return Response({
                "success": True,
                "video_id": video.id,
                "title": video.title,
                "key_points": summary.key_points,
                "exam_tips": summary.exam_tips
            })
        except VideoSummary.DoesNotExist:
            pass
        
        # Generate summary from transcript
        content = video.transcript or video.title
        prompt = video_summary_prompt(content)
        summary_text = ask_gemini(prompt)
        
        # Parse summary
        key_points = ""
        exam_tips = ""
        
        if "KEY CONCEPTS" in summary_text or "KEY POINTS" in summary_text:
            parts = summary_text.split("EXAM TIPS")
            key_points = parts[0]
            exam_tips = parts[1] if len(parts) > 1 else ""
        else:
            key_points = summary_text
        
        # Save summary
        summary = VideoSummary.objects.create(
            video=video,
            key_points=key_points,
            exam_tips=exam_tips
        )
        
        return Response({
            "success": True,
            "video_id": video.id,
            "title": video.title,
            "key_points": key_points,
            "exam_tips": exam_tips
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Combined Study Material ====================

@api_view(['GET'])
def study_material_overview(req):
    """Get overview of all uploaded study material"""
    try:
        chapter = Chapter.objects.first()
        videos = Video.objects.all()
        
        chapter_data = {
            "id": chapter.id,
            "title": chapter.title,
            "content_preview": chapter.content[:500] + "..." if len(chapter.content) > 500 else chapter.content
        } if chapter else None
        
        videos_data = list(videos.values('id', 'title', 'youtube_url'))
        
        return Response({
            "chapter": chapter_data,
            "videos": videos_data,
            "total_resources": (1 if chapter else 0) + videos.count()
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Chat History ====================

@api_view(['GET'])
def get_chat_history(req):
    """Get all previous Q&A exchanges"""
    try:
        chats = ChatHistory.objects.all().values('id', 'question', 'answer', 'created_at')
        return Response({
            "success": True,
            "chats": list(chats),
            "total": ChatHistory.objects.count()
        })
    
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Audio Transcription ====================

@api_view(['POST'])
def transcribe(req):
    """Transcribe audio using Google Generative AI"""
    try:
        audio_data = req.body
        
        if not audio_data:
            return Response(
                {"error": "No audio data provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        model = genai.GenerativeModel("gemini-2.5-flash-lite")
        
        audio_file = {
            "mime_type": "audio/wav",
            "data": audio_data
        }
        
        response = model.generate_content([
            "Please transcribe the audio below. Return only the transcribed text:",
            audio_file
        ])
        
        transcription = response.text.strip()
        
        return Response({
            "success": True,
            "transcription": transcription
        })
    
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )