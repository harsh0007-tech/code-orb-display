import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import FloatingCrystals from "@/components/FloatingCrystals";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MessageCircle, LogOut, LogIn } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundOrbs />
      <FloatingCrystals />
      
      {/* User buttons - top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {user ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/chat")}
              className="rounded-full gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="rounded-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/auth")}
            className="rounded-full gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        )}
      </div>
      
      <MobileNav />
      <main>
        <Hero />
        <Projects />
        <About />
        <TechStack />
        <Education />
      </main>
    </div>
  );
};

export default Index;