from django.urls import path
from .views import *

urlpatterns = [
    # PDF Upload
    path("upload-chapter/", upload_chapter, name="upload_chapter"),
    
    # YouTube Videos
    path("add-video/", add_youtube_video, name="add_youtube_video"),
    
    # Interactive Q&A
    path("chat/", chat, name="chat"),
    path("chat-history/", get_chat_history, name="get_chat_history"),
    
    # Audio Dialogue (Two-Person Conversation)
    path("audio-dialogue/", audio_dialogue, name="audio_dialogue"),
    
    # Video Summaries
    path("video-summary/", video_summary, name="video_summary"),
    
    # Study Material Overview
    path("study-material/", study_material_overview, name="study_material_overview"),
    
    # Audio Transcription
    path("transcribe/", transcribe, name="transcribe"),
]
