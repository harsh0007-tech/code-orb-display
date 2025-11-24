import { Button } from "@/components/ui/button";
import { Download, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (item: string) => {
    if (item === "Contact") {
      navigate("/contact");
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollToSection(item.toLowerCase().replace(" ", "-")), 100);
      } else {
        scrollToSection(item.toLowerCase().replace(" ", "-"));
      }
    }
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className="font-mono font-bold text-primary hover:text-primary/80 transition-colors"
          >
            {"<Dev />"}
          </button>
          <div className="hidden md:flex gap-6">
            {["About", "Tech Stack", "Projects", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!user && (
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
          <a
            href="/Harsh_Kumar_Resume.jpg"
            download="Harsh_Kumar_Resume.jpg"
          >
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium hover-glow-primary rounded-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
