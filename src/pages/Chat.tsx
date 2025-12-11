import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import MobileNav from "@/components/MobileNav";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import FloatingCrystals from "@/components/FloatingCrystals";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import { MessageCircle } from "lucide-react";

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { messages, loading: messagesLoading, sendMessage, deleteMessage, uploadMedia } = useChatMessages();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative h-screen bg-background flex flex-col overflow-hidden">
      <BackgroundOrbs />
      <FloatingCrystals />
      <MobileNav />
      <main className="container mx-auto px-4 pt-24 pb-4 flex-1 flex flex-col max-w-4xl overflow-hidden">
        <div className="glass rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-border shrink-0">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Chat</h1>
          </div>

          <div className="flex-1 overflow-hidden">
            {messagesLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ChatMessageList messages={messages} onDelete={deleteMessage} />
            )}
          </div>

          <div className="shrink-0">
            <ChatInput
              onSendMessage={sendMessage}
              onUploadMedia={uploadMedia}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
