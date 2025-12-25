from youtube_transcript_api import YouTubeTranscriptApi
import re
from urllib.parse import urlparse, parse_qs

def extract_video_id(youtube_url):
    """
    Extract video ID from various YouTube URL formats
    Supports: youtu.be/, youtube.com/watch?v=, youtube.com/embed/, etc.
    """
    patterns = [
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)',
        r'(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)',
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)',
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, youtube_url)
        if match:
            return match.group(1)
    
    return None

def get_transcription(video_id):
    """Get YouTube transcript for a video"""
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([t['text'] for t in transcript])
    except Exception as e:
        print(f"Error getting transcript: {str(e)}")
        # Try with auto-generated captions
        try:
            transcript = YouTubeTranscriptApi.get_transcript(
                video_id,
                languages=['en', 'auto']
            )
            return " ".join([t['text'] for t in transcript])
        except:
            return ""