from django.contrib import admin
from .models import Chapter, Video, ChatHistory, UserContent, Dialogue, VideoSummary

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)
    readonly_fields = ('created_at',)

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'video_id', 'youtube_url', 'created_at')
    search_fields = ('title', 'video_id')
    readonly_fields = ('created_at',)

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('question', 'created_at')
    search_fields = ('question', 'answer')
    readonly_fields = ('created_at',)

@admin.register(UserContent)
class UserContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type', 'created_at')
    list_filter = ('content_type', 'created_at')
    search_fields = ('title',)
    readonly_fields = ('created_at',)

@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'speaker', 'order', 'created_at')
    list_filter = ('speaker', 'chapter')
    search_fields = ('message',)
    readonly_fields = ('created_at',)

@admin.register(VideoSummary)
class VideoSummaryAdmin(admin.ModelAdmin):
    list_display = ('video', 'created_at')
    readonly_fields = ('created_at',)

