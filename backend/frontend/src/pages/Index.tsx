import { useState, useEffect } from 'react';
import { MessageSquare, Video, Sparkles, Menu, X, Wand2, BookOpen, Zap, Brain, FileText, Grid, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { SourcesSidebar } from '@/components/SourcesSidebar';
import { VideoSummaries } from '@/components/VideoSummaries';
import { AudioDialogue } from '@/components/AudioDialogue';
import { cn } from '@/lib/utils';
import { chatApi, getVideos } from '@/lib/api';
import { toast } from 'sonner';

type ViewMode = 'chat' | 'video' | 'dialogue' | 'overview' | 'mindmap' | 'flashcards' | 'quiz' | 'notes';

interface Message {
  id: string;
  role: 'user' | 'teacher' | 'student';
  content: string;
  timestamp: Date;
}

type SourceType = 'document' | 'video' | 'book';
type Source = { id: string; title: string; type: SourceType; description?: string };

const initialSources: Source[] = [
  {
    id: '1',
    title: 'Microeconomics Chapter 4',
    type: 'book',
    description: 'Supply and Demand Analysis',
  },
];

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string>();
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(true);
  const [videos, setVideos] = useState([]);

  // Fetch videos from backend API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
      }
    };
    fetchVideos();
  }, []);

  // Studio feature options
  const studioFeatures = [
    { id: 'overview', label: 'Audio Overview', icon: Play, color: 'from-blue-500 to-cyan-500' },
    { id: 'video', label: 'Video Overview', icon: Video, color: 'from-purple-500 to-pink-500' },
    { id: 'mindmap', label: 'Mind Map', icon: Brain, color: 'from-green-500 to-emerald-500' },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen, color: 'from-orange-500 to-red-500' },
    { id: 'quiz', label: 'Quiz', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { id: 'notes', label: 'Study Notes', icon: FileText, color: 'from-gray-500 to-slate-500' },
  ];

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const selected = sources.find((s) => s.id === selectedSourceId);
      const contextType = selected?.type === 'document' ? 'pdf' : selected?.type === 'video' ? 'video' : undefined;
      const response = await chatApi(content, selectedSourceId, contextType as any);
      const teacherMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'teacher',
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, teacherMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      toast.error('Failed to get response. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceAdded = (source: Source) => {
    setSources((prev) => [source, ...prev]);
    setSelectedSourceId(source.id);
  };

  const handlePlayVideo = (id: string) => {
    console.log('Playing video:', id);
    // Video player would be implemented here
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "w-72 shrink-0 transition-all duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full absolute z-10"
      )}>
        <SourcesSidebar
          sources={sources}
          selectedSourceId={selectedSourceId}
          onSelectSource={setSelectedSourceId}
          onSourceAdded={handleSourceAdded}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="font-serif text-xl text-foreground">StudyMate AI</h1>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <Button
              variant={viewMode === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('chat')}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            <Button
              variant={viewMode === 'dialogue' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('dialogue')}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Dialogue</span>
            </Button>
            <Button
              variant={viewMode === 'video' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('video')}
              className="gap-2"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Videos</span>
            </Button>
          </div>

          {/* Studio Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStudioOpen(!studioOpen)}
            className="ml-auto hidden lg:flex"
          >
            {studioOpen ? <X className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
          </Button>
        </header>

        {/* Content Area with Studio */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'chat' && (
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            )}
            {viewMode === 'dialogue' && (
              <AudioDialogue />
            )}
            {viewMode === 'video' && (
              <VideoSummaries
                videos={videos}
                onPlayVideo={handlePlayVideo}
              />
            )}
            {viewMode === 'overview' && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Audio Overview - Coming Soon</p>
              </div>
            )}
            {viewMode === 'mindmap' && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Mind Map - Coming Soon</p>
              </div>
            )}
            {viewMode === 'flashcards' && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Flashcards - Coming Soon</p>
              </div>
            )}
            {viewMode === 'quiz' && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Quiz - Coming Soon</p>
              </div>
            )}
            {viewMode === 'notes' && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Study Notes - Coming Soon</p>
              </div>
            )}
          </div>

          {/* Studio Panel - Right Sidebar */}
          <aside className={cn(
            "border-l border-border bg-card/50 overflow-hidden transition-all duration-300 shrink-0",
            studioOpen ? "w-80" : "w-0 border-l-0"
          )}>
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Studio Header */}
              <div className="p-4 border-b border-border sticky top-0 bg-card/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <Wand2 className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <h2 className="font-semibold text-foreground">Studio</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Create AI-powered learning materials
                </p>
              </div>

              {/* Studio Features Grid */}
              <div className="p-4 space-y-3">
                {studioFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => setViewMode(feature.id as ViewMode)}
                      className={cn(
                        "w-full p-4 rounded-lg border transition-all duration-200",
                        "hover:shadow-md active:scale-95",
                        viewMode === feature.id
                          ? `border-primary/50 bg-gradient-to-br ${feature.color} bg-opacity-10 ring-2 ring-primary/20`
                          : "border-border hover:border-primary/30 bg-card/50 hover:bg-card/80"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg shrink-0",
                          viewMode === feature.id
                            ? `bg-gradient-to-br ${feature.color}`
                            : "bg-secondary"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            viewMode === feature.id ? "text-white" : "text-foreground/60"
                          )} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">
                            {feature.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {feature.id === 'overview' && 'Audio conversation'}
                            {feature.id === 'video' && 'Video summaries'}
                            {feature.id === 'mindmap' && 'Visual concepts'}
                            {feature.id === 'flashcards' && 'Quick review'}
                            {feature.id === 'quiz' && 'Test knowledge'}
                            {feature.id === 'notes' && 'Organized notes'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Coming Soon Section */}
              <div className="p-4 border-t border-border mt-auto">
                <p className="text-xs text-muted-foreground mb-3">
                  More features coming soon:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-secondary/30 text-muted-foreground">
                    📊 Infographic
                  </div>
                  <div className="p-2 rounded bg-secondary/30 text-muted-foreground">
                    📈 Reports & Analytics
                  </div>
                  <div className="p-2 rounded bg-secondary/30 text-muted-foreground">
                    🎬 Slide Deck Generator
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;
