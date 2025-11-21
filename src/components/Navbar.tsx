import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollToSection("hero")}
            className="font-mono font-bold text-primary hover:text-primary/80 transition-colors"
          >
            {"<Dev />"}
          </button>
          <div className="hidden md:flex gap-6">
            {["About", "Tech Stack", "Projects", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium hover-glow-primary rounded-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Resume
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
