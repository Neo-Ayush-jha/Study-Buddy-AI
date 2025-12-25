import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'teacher' | 'student';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
}

export const ChatInterface = ({ onSendMessage, messages, isLoading }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-4 shadow-glow">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">Start a Conversation</h3>
            <p className="text-muted-foreground max-w-sm">
              Ask any question about your study materials. I'm here to help you understand complex topics.
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-slide-up",
              message.role === 'user' ? "flex-row-reverse" : ""
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0",
              message.role === 'user' 
                ? "bg-accent text-accent-foreground" 
                : message.role === 'teacher'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}>
              {message.role === 'user' ? '👤' : message.role === 'teacher' ? '👨‍🏫' : '🎓'}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3",
              message.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-br-md" 
                : "surface-elevated rounded-bl-md"
            )}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              👨‍🏫
            </div>
            <div className="surface-elevated rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask a question about the material..."
              className="w-full min-h-[48px] max-h-[200px] resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              rows={1}
            />
          </div>
          <Button
            type="button"
            variant={isListening ? "accent" : "outline"}
            size="icon"
            onClick={toggleListening}
            className="shrink-0"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
