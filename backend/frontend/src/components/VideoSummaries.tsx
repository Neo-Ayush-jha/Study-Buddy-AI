import { useState, useEffect } from 'react';
import { Play, Clock, BookmarkPlus, CheckCircle, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getVideoSummary } from '@/lib/api';
import { toast } from 'sonner';

interface VideoSummary {
  id: string;
  title: string;
  duration: string;
  thumbnail?: string;
  topics: string[];
  watched?: boolean;
}

interface VideoSummariesProps {
  videos: VideoSummary[];
  onPlayVideo: (id: string) => void;
}

export const VideoSummaries = ({ videos, onPlayVideo }: VideoSummariesProps) => {
  const [keyPoints, setKeyPoints] = useState<string>('');
  const [examTips, setExamTips] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getVideoSummary();
        setKeyPoints(response.key_points || '');
        setExamTips(response.exam_tips || '');
      } catch (error) {
        console.error('Failed to fetch video summary:', error);
        toast.error('Failed to load summary. Make sure the backend server is running.');
      } finally {
        setIsLoadingSummary(false);
      }
    };
    
    fetchSummary();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-serif text-xl text-foreground mb-1">Video Summaries</h2>
        <p className="text-sm text-muted-foreground">
          Visual explanations and exam tips
        </p>
      </div>

      {/* Summary Section */}
      <div className="p-4 border-b border-border surface-elevated">
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
                <div className="whitespace-pre-wrap leading-relaxed">{keyPoints}</div>
              </div>
            )}
            {examTips && (
              <div>
                <p className="font-medium text-foreground mb-1">Exam Tips</p>
                <div className="whitespace-pre-wrap leading-relaxed">{examTips}</div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No summary available</p>
        )}
      </div>

      {/* Videos Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="surface-elevated rounded-xl overflow-hidden group animate-slide-up hover:shadow-elevated transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20">
                {video.thumbnail ? (
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
                    onClick={() => onPlayVideo(video.id)}
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
                  <h3 className="font-medium text-foreground line-clamp-2">{video.title}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <BookmarkPlus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {video.topics.map((topic) => (
                    <span 
                      key={topic}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
