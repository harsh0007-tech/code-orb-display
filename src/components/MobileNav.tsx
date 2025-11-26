import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MoreVertical, Download, LogIn, Home, User, Code, FolderOpen, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    if (item === "Contact") {
      navigate("/contact");
    } else if (item === "Home") {
      navigate("/");
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollToSection(item.toLowerCase().replace(" ", "-")), 100);
      } else {
        scrollToSection(item.toLowerCase().replace(" ", "-"));
      }
    }
  };

  const navItems = [
    { label: "Home", icon: Home },
    { label: "About", icon: User },
    { label: "Tech Stack", icon: Code },
    { label: "Projects", icon: FolderOpen },
    { label: "Contact", icon: Mail },
  ];

  return (
    <div className="fixed top-6 left-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="glass rounded-full h-12 w-12 border-border/50 hover:bg-accent/20"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-background/95 backdrop-blur-xl border-border/50">
          <div className="flex flex-col h-full pt-8">
            <div className="mb-8">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
                className="font-mono font-bold text-2xl text-primary hover:text-primary/80 transition-colors"
              >
                {"<Dev />"}
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.label)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/20 transition-all text-left"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
              {!user && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    navigate("/auth");
                  }}
                  className="w-full justify-start gap-3"
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </Button>
              )}
              <a
                href="/Harsh_Kumar_Resume.jpg"
                download="Harsh_Kumar_Resume.jpg"
                className="w-full"
              >
                <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Download className="h-5 w-5" />
                  Download Resume
                </Button>
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
