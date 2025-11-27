import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/hooks/useChatMessages";
import { Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatMessageListProps {
  messages: ChatMessage[];
  onDelete: (id: string) => void;
}

const AudioPlayer = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
      <Button size="icon" variant="ghost" onClick={togglePlay} className="h-8 w-8">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <span className="text-sm text-muted-foreground">Voice message</span>
    </div>
  );
};

const ChatMessageList = ({ messages, onDelete }: ChatMessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
      <div className="space-y-4 py-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isAdmin = message.is_admin || false;
            
            return (
              <div
                key={message.id}
                className={`group flex items-start gap-2 ${isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                {!isAdmin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isAdmin 
                    ? 'bg-secondary text-secondary-foreground rounded-bl-md' 
                    : 'bg-primary text-primary-foreground rounded-br-md'
                }`}>
                  {isAdmin && (
                    <span className="text-xs font-semibold block mb-1 opacity-70">
                      Admin
                    </span>
                  )}
                  {message.message_type === "text" && (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                  {message.message_type === "image" && message.media_url && (
                    <img
                      src={message.media_url}
                      alt="Uploaded image"
                      className="rounded-lg max-w-full max-h-64 object-cover"
                    />
                  )}
                  {message.message_type === "video" && message.media_url && (
                    <video
                      src={message.media_url}
                      controls
                      className="rounded-lg max-w-full max-h-64"
                    />
                  )}
                  {message.message_type === "voice" && message.media_url && (
                    <AudioPlayer url={message.media_url} />
                  )}
                  <span className="text-xs opacity-70 mt-1 block">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
