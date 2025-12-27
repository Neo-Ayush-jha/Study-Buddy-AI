import { useRef, useState, ChangeEvent } from 'react';
import { FileText, Video, BookOpen, Plus, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { uploadPdf, addYoutubeVideo } from '@/lib/api';
import { toast } from 'sonner';

interface Source {
  id: string;
  title: string;
  type: 'document' | 'video' | 'book';
  description?: string;
}

interface SourcesSidebarProps {
  sources: Source[];
  selectedSourceId?: string;
  onSelectSource: (id: string) => void;
  onSourceAdded?: (source: Source) => void;
}

const sourceIcons = {
  document: FileText,
  video: Video,
  book: BookOpen,
};

export const SourcesSidebar = ({ sources, selectedSourceId, onSelectSource, onSourceAdded }: SourcesSidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [showAddVideoForm, setShowAddVideoForm] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let uploaded;
      if (file.type === 'application/pdf') {
        uploaded = await uploadPdf(file, file.name);
        toast.success('PDF uploaded successfully');
        onSourceAdded?.({
          id: String(Date.now()),
          title: file.name,
          type: 'document',
          description: 'Uploaded PDF',
        });
      } else if (file.type.startsWith('video/')) {
        // For videos, ask user for YouTube URL instead of uploading the file
        const url = window.prompt('Paste the YouTube video URL for this source:');
        if (!url) {
          toast.error('YouTube URL is required for video sources.');
          return;
        }
        uploaded = await addYoutubeVideo(url, file.name);
        toast.success('YouTube video added successfully');
        onSourceAdded?.({
          id: String(Date.now()),
          title: file.name,
          type: 'video',
          description: url,
        });
      } else {
        toast.error('Only PDF or video files are supported');
      }
    } catch (error) {
      console.error('Failed to upload source:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input so selecting the same file again still triggers change
      event.target.value = '';
    }
  };

  const handleAddYoutubeLink = async () => {
    const url = window.prompt('Enter the YouTube video URL to add:');
    if (!url) return;
    setIsAddingVideo(true);
    try {
      const uploaded = await addYoutubeVideo(url);
      toast.success('YouTube video added successfully');
      onSourceAdded?.({
        id: String(Date.now()),
        title: uploaded?.title || 'YouTube Video',
        type: 'video',
        description: url,
      });
    } catch (error) {
      console.error('Failed to add YouTube video:', error);
      toast.error('Failed to add video. Please try again.');
    } finally {
      setIsAddingVideo(false);
    }
  };

  const handleSubmitVideoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    setIsAddingVideo(true);
    try {
      await addYoutubeVideo(videoUrl.trim(), videoTitle.trim() || undefined);
      toast.success('YouTube video added successfully');
      onSourceAdded?.({
        id: String(Date.now()),
        title: videoTitle.trim() || 'YouTube Video',
        type: 'video',
        description: videoUrl.trim(),
      });
      setVideoUrl('');
      setVideoTitle('');
    } catch (error) {
      console.error('Failed to add YouTube video:', error);
      toast.error('Failed to add video. Please try again.');
    } finally {
      setIsAddingVideo(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-lg text-foreground">Sources</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddVideoForm(v => !v)}>
                <Plus className="w-4 h-4" />
              </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {sources.length} source{sources.length !== 1 ? 's' : ''} loaded
        </p>
        {showAddVideoForm && (
          <form onSubmit={handleSubmitVideoForm} className="mt-3 space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">Add YouTube Video</p>
              <Input
                type="url"
                placeholder="YouTube URL (https://www.youtube.com/watch?v=...)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Optional title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isAddingVideo}>
                {isAddingVideo ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Adding...</span>
                ) : (
                  'Add Video'
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={handleAddYoutubeLink} disabled={isAddingVideo}>
                Quick Add (Prompt)
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sources.map((source, index) => {
          const Icon = sourceIcons[source.type];
          const isSelected = selectedSourceId === source.id;
          
          return (
            <button
              key={source.id}
              onClick={() => onSelectSource(source.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 animate-slide-up",
                isSelected 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-secondary border border-transparent"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={cn(
                  "text-sm font-medium truncate",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {source.title}
                </h3>
                {source.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {source.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Study Tips */}
      <div className="p-4 border-t border-border">
        <div className="surface-sunken rounded-xl p-3">
          <p className="text-xs font-medium text-foreground mb-1">💡 Study Tip</p>
          <p className="text-xs text-muted-foreground">
            Ask follow-up questions to deepen your understanding of key concepts.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
