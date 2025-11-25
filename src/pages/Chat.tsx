import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import FloatingCrystals from "@/components/FloatingCrystals";
import { MessageCircle } from "lucide-react";

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
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
    <div className="relative min-h-screen bg-background">
      <BackgroundOrbs />
      <FloatingCrystals />
      <Navbar />
      <main className="container mx-auto px-4 pt-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Chat</h1>
            </div>
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Chat feature coming soon!
              </p>
              <p className="text-muted-foreground/60 text-sm mt-2">
                This is where you'll be able to chat and interact.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
