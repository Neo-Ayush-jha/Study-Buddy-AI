import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, User, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { getAudioDialogue } from '@/lib/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DialogueTurn {
  id: string;
  speaker: 'teacher' | 'student';
  text: string;
  timestamp: number;
}

const parseScript = (script: string): DialogueTurn[] => {
  const lines = script.split('\n').filter(line => line.trim());
  let timestamp = 0;
  
  return lines.map((line, index) => {
    const isTeacher = line.toLowerCase().startsWith('teacher:');
    const speaker: 'teacher' | 'student' = isTeacher ? 'teacher' : 'student';
    const text = line.replace(/^(teacher|student):\s*/i, '').trim();
    
    const turn: DialogueTurn = {
      id: String(index + 1),
      speaker,
      text,
      timestamp,
    };
    
    timestamp += Math.max(5, Math.ceil(text.length / 15));
    return turn;
  });
};

const parseDialogueList = (dialogue: { speaker: string; message: string; order: number }[]): DialogueTurn[] => {
  let timestamp = 0;
  return dialogue
    .sort((a, b) => a.order - b.order)
    .map((turn, index) => {
      const speaker: 'teacher' | 'student' = turn.speaker.toLowerCase() === 'teacher' ? 'teacher' : 'student';
      const text = turn.message;
      const result: DialogueTurn = {
        id: String(index + 1),
        speaker,
        text,
        timestamp,
      };
      timestamp += Math.max(5, Math.ceil(text.length / 15));
      return result;
    });
};

export const AudioDialogue = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [dialogue, setDialogue] = useState<DialogueTurn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const voicesRef = useRef<SpeechSynthesisVoice[] | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Separate voice settings for Teacher and Student
  const [teacherVolume, setTeacherVolume] = useState(1.0);
  const [studentVolume, setStudentVolume] = useState(1.0);
  const [teacherPitch, setTeacherPitch] = useState(1.0);
  const [studentPitch, setStudentPitch] = useState(1.1);
  const [teacherRate, setTeacherRate] = useState(1.0);
  const [studentRate, setStudentRate] = useState(0.95);

  const totalDuration = dialogue.length > 0 
    ? dialogue[dialogue.length - 1].timestamp + 10 
    : 65;

  useEffect(() => {
    // Load available voices for TTS
    if (!speechSupported) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null as any;
    };
  }, [speechSupported]);

  useEffect(() => {
    return () => {
      // Stop any ongoing speech when unmounting
      try { if (speechSupported) window.speechSynthesis.cancel(); } catch {}
    };
  }, [speechSupported]);

  useEffect(() => {
    const fetchDialogue = async () => {
      try {
        setError(null);
        const response = await getAudioDialogue();
        if (response.dialogue && response.dialogue.length) {
          setDialogue(parseDialogueList(response.dialogue));
        } else if (response.raw_script) {
          setDialogue(parseScript(response.raw_script));
        } else {
          setError('No dialogue available. Please upload a chapter first.');
          setDialogue([]);
        }
      } catch (error) {
        console.error('Failed to fetch dialogue:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to load dialogue';
        setError(errorMsg);
        toast.error('Failed to load dialogue. Make sure you have a chapter uploaded and backend is running.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDialogue();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Control speech synthesis when play/pause changes
  useEffect(() => {
    if (!speechSupported || !audioEnabled) return;
    if (isPlaying) {
      // If paused, resume; otherwise start speaking from current index
      if (window.speechSynthesis.paused) {
        try { window.speechSynthesis.resume(); } catch {}
      } else {
        cancelSpeech();
        speakTurn(activeDialogueIndex);
      }
    } else {
      try { window.speechSynthesis.pause(); } catch {}
    }
    // Cleanup on unmount
    return () => {
      try { window.speechSynthesis.pause(); } catch {}
    };
  }, [isPlaying, audioEnabled, activeDialogueIndex, speechSupported]);

  useEffect(() => {
    const activeIndex = dialogue.findIndex((turn, index) => {
      const nextTurn = dialogue[index + 1];
      return currentTime >= turn.timestamp && (!nextTurn || currentTime < nextTurn.timestamp);
    });
    if (activeIndex !== -1) {
      setActiveDialogueIndex(activeIndex);
    }
  }, [currentTime, dialogue]);

  // Speech helpers
  const cancelSpeech = () => {
    if (!speechSupported) return;
    try {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    } catch {}
  };

  const speakTurn = (index: number) => {
    if (!speechSupported || !audioEnabled) return;
    if (!dialogue[index]) return;
    const turn = dialogue[index];
    const u = new SpeechSynthesisUtterance(turn.text);
    // Prefer a natural voice if available
    const voices = voicesRef.current || [];
    const preferred = voices.find(v => /en-US|hi-IN|English|Hindi/i.test(`${v.lang} ${v.name}`));
    if (preferred) u.voice = preferred;
    
    // Apply speaker-specific settings
    if (turn.speaker === 'teacher') {
      u.volume = teacherVolume;
      u.pitch = teacherPitch;
      u.rate = teacherRate;
    } else {
      u.volume = studentVolume;
      u.pitch = studentPitch;
      u.rate = studentRate;
    }
    
    u.onend = () => {
      // Advance to next turn automatically if still playing
      setActiveDialogueIndex((prev) => {
        const next = prev + 1;
        if (next < dialogue.length && isPlaying) {
          // Slight delay to avoid overlapping
          setTimeout(() => speakTurn(next), 50);
        } else if (next >= dialogue.length) {
          setIsPlaying(false);
        }
        return next >= dialogue.length ? dialogue.length - 1 : next;
      });
    };
    u.onerror = () => {
      // Fallback silently to visual playback
    };
    utteranceRef.current = u;
    try {
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      setCurrentTime(percentage * totalDuration);
      // Jump active turn based on timestamp
      const idx = dialogue.findIndex((turn, i) => {
        const next = dialogue[i + 1];
        const t = percentage * totalDuration;
        return t >= turn.timestamp && (!next || t < next.timestamp);
      });
      if (idx !== -1) {
        setActiveDialogueIndex(idx);
        if (isPlaying && audioEnabled) {
          cancelSpeech();
          speakTurn(idx);
        }
      }
    }
  };

  const skipBack = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10));
    const t = Math.max(0, currentTime - 10);
    const idx = dialogue.findIndex((turn, i) => {
      const next = dialogue[i + 1];
      return t >= turn.timestamp && (!next || t < next.timestamp);
    });
    if (idx !== -1) {
      setActiveDialogueIndex(idx);
      if (isPlaying && audioEnabled) {
        cancelSpeech();
        speakTurn(idx);
      }
    }
  };

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(totalDuration, prev + 10));
    const t = Math.min(totalDuration, currentTime + 10);
    const idx = dialogue.findIndex((turn, i) => {
      const next = dialogue[i + 1];
      return t >= turn.timestamp && (!next || t < next.timestamp);
    });
    if (idx !== -1) {
      setActiveDialogueIndex(idx);
      if (isPlaying && audioEnabled) {
        cancelSpeech();
        speakTurn(idx);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-serif text-xl text-foreground mb-1">Two-Person Dialogue</h2>
        <p className="text-sm text-muted-foreground">
          Interactive teacher-student conversation generated from your uploaded chapter
        </p>
      </div>

      {/* Dialogue Transcript */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading dialogue...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : dialogue.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No dialogue available. Upload a chapter to generate a teacher-student dialogue.
            </div>
          ) : (
            dialogue.map((turn, index) => (
              <div
                key={turn.id}
                className={cn(
                  "flex gap-3 p-4 rounded-xl transition-all duration-300",
                  index === activeDialogueIndex 
                    ? "surface-elevated ring-2 ring-primary/30 shadow-glow" 
                    : index < activeDialogueIndex
                    ? "opacity-60"
                    : "opacity-40",
                  turn.speaker === 'student' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  turn.speaker === 'teacher' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-accent text-accent-foreground"
                )}>
                  {turn.speaker === 'teacher' ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className={cn(
                  "flex-1",
                  turn.speaker === 'student' ? "text-right" : ""
                )}>
                  <p className="text-xs text-muted-foreground mb-1 capitalize">
                    {turn.speaker} • {formatTime(turn.timestamp)}
                  </p>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    index === activeDialogueIndex ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {turn.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-2 bg-secondary rounded-full mb-4 cursor-pointer overflow-hidden"
          >
            <div 
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground w-12">
              {formatTime(currentTime)}
            </span>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={skipBack}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                variant="gradient" 
                size="lg"
                className="rounded-full w-14 h-14"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={skipForward}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-32 justify-end">
              {!speechSupported ? (
                <span className="text-[10px] text-muted-foreground">No voice support</span>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <Toggle
                    aria-label="Toggle voice playback"
                    pressed={audioEnabled}
                    onPressedChange={(v) => {
                      setAudioEnabled(!!v);
                      if (!v) {
                        cancelSpeech();
                      } else if (isPlaying) {
                        speakTurn(activeDialogueIndex);
                      }
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    {audioEnabled ? 'Voice On' : 'Voice Off'}
                  </Toggle>
                </>
              )}
            </div>
          </div>

          {/* Speed Control */}
          <div className="flex justify-center mt-4 gap-2">
            {['0.75x', '1x', '1.25x', '1.5x'].map((speed) => (
              <Button
                key={speed}
                variant={speed === '1x' ? 'secondary' : 'ghost'}
                size="sm"
                className="text-xs"
              >
                {speed}
              </Button>
            ))}
          </div>

          {/* Dual Volume Controls */}
          {speechSupported && audioEnabled && dialogue.length > 0 && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border">
              <p className="text-xs font-semibold text-foreground mb-3">🎙️ Voice Settings</p>
              <div className="space-y-4">
                {/* Teacher Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">Teacher Voice</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.round(teacherVolume * 100)}%</span>
                  </div>
                  <Slider
                    value={[teacherVolume]}
                    onValueChange={(v) => setTeacherVolume(v[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Student Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-foreground">Student Voice</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.round(studentVolume * 100)}%</span>
                  </div>
                  <Slider
                    value={[studentVolume]}
                    onValueChange={(v) => setStudentVolume(v[0])}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTeacherVolume(1.0);
                      setStudentVolume(0.7);
                    }}
                    className="text-xs flex-1"
                  >
                    Focus Teacher
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTeacherVolume(0.7);
                      setStudentVolume(1.0);
                    }}
                    className="text-xs flex-1"
                  >
                    Focus Student
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTeacherVolume(1.0);
                      setStudentVolume(1.0);
                    }}
                    className="text-xs flex-1"
                  >
                    Equal
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Info About Data Source */}
          {!isLoading && dialogue.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">📊 About This Dialogue:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Generated from your uploaded chapter using AI</li>
                <li>Real voice playback using browser Text-to-Speech</li>
                <li>Teacher and student messages are highlighted as they play</li>
                <li>Use play/pause and skip buttons to navigate</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
