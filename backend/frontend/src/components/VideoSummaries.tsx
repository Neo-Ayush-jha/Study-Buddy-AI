import { useState, useEffect } from "react";
import {
  Play,
  Clock,
  BookmarkPlus,
  CheckCircle,
  Loader2,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getVideoSummary } from "@/lib/api";
import { toast } from "sonner";
import AddVideoForm from "./AddVideoForm";

// Helper function to extract YouTube ID from URL
const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If it's already just an ID (no URL), return it
  if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
    return url;
  }
  
  return null;
};

interface VideoSummary {
  id: string;
  title: string;
  duration: string;
  youtubeId?: string;
  youtube_url?: string;
  thumbnail?: string;
  topics?: string[];
  watched?: boolean;
}

interface VideoSummariesProps {
  videos: VideoSummary[];
  onPlayVideo: (id: string) => void;
}

export const VideoSummaries = ({
  videos,
  onPlayVideo,
}: VideoSummariesProps) => {
  const [keyPoints, setKeyPoints] = useState<string>("");
  const [examTips, setExamTips] = useState<string>("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  // Helper to get YouTube ID from video object
  const getYoutubeId = (video: VideoSummary): string | null => {
    if (video.youtubeId) return video.youtubeId;
    if (video.youtube_url) return extractYoutubeId(video.youtube_url);
    return null;
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getVideoSummary();
        setKeyPoints(response.key_points || "");
        setExamTips(response.exam_tips || "");
      } catch (error) {
        console.error("Failed to fetch video summary:", error);
        toast.error(
          "Failed to load summary. Make sure the backend server is running."
        );
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Video Player Modal */}
      {currentVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-card rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70"
              onClick={() => setCurrentVideo(null)}
            >
              <X className="w-5 h-5 text-white" />
            </Button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-serif text-xl text-foreground mb-1">
          Video Summaries
        </h2>
        <p className="text-sm text-muted-foreground">
          Visual explanations and exam tips
        </p>
      </div>

      {/* Summary Section */}
      <div className="p-4 border-b border-border surface-elevated max-h-[30vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-foreground">Exam Revision Summary</h3>
        </div>
        {isLoadingSummary ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading summary...</span>
          </div>
        ) : keyPoints || examTips ? (
          <div className="space-y-4 text-sm text-muted-foreground">
            {keyPoints && (
              <div>
                <p className="font-medium text-foreground mb-1">Key Points</p>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {keyPoints}
                </div>
              </div>
            )}
            {examTips && (
              <div>
                <p className="font-medium text-foreground mb-1">Exam Tips</p>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {examTips}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No summary available</p>
        )}
      </div>

      {/* Videos Grid */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {videos && videos.length > 0 ? (
          <div className="grid gap-4">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="surface-elevated rounded-xl overflow-hidden group animate-slide-up hover:shadow-elevated transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
              {/* Thumbnail */}
              <div
                className="relative aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 cursor-pointer"
                onClick={() => {
                  const ytId = getYoutubeId(video);
                  if (ytId) setCurrentVideo(ytId);
                }}
              >
                {getYoutubeId(video) ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYoutubeId(video)}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${getYoutubeId(video)}/hqdefault.jpg`;
                    }}
                  />
                ) : video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      const ytId = getYoutubeId(video);
                      if (ytId) {
                        setCurrentVideo(ytId);
                      } else {
                        onPlayVideo(video.id);
                      }
                    }}
                    className="shadow-elevated"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>

                {/* Watched indicator */}
                {video.watched && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Watched
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-medium text-foreground line-clamp-2">
                    {video.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {video.topics && video.topics.length > 0 ? (
                    video.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No topics</span>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No videos available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add videos to get started with video summaries
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSummaries;
