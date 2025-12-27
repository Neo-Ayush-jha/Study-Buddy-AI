from django.db import models
from django.utils import timezone

class Chapter(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class Video(models.Model):
    youtube_url = models.URLField()
    transcript = models.TextField(blank=True)
    title = models.CharField(max_length=200, blank=True)
    video_id = models.CharField(max_length=20, unique=True, auto_created=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title or self.youtube_url

class ChatHistory(models.Model):
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.question[:50]

class UserContent(models.Model):
    CONTENT_TYPES = [
        ('pdf', 'PDF Document'),
        ('video', 'YouTube Video'),
    ]
    
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    file_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class Dialogue(models.Model):
    """Store teacher-student dialogue conversations"""
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='dialogues')
    speaker = models.CharField(max_length=20, choices=[('Teacher', 'Teacher'), ('Student', 'Student')])
    message = models.TextField()
    order = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['chapter', 'order']

    def __str__(self):
        return f"{self.speaker} - {self.chapter.title}"

class VideoSummary(models.Model):
    """Store video summaries with key points and exam tips"""
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='summary')
    key_points = models.TextField()
    exam_tips = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Summary for {self.video.title}"