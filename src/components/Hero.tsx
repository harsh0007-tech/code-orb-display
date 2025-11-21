import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import profileImage from "@/assets/profile.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto text-center fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="glass rounded-full p-2">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary glow-primary">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono">
          Building the Future
          <br />
          <span className="text-primary">with Code.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
          I am a <span className="text-foreground font-semibold">Fullstack Developer</span>
        </p>
        <p className="text-lg text-muted-foreground mb-12">
          & B.Tech Computer Science Student
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="glass-strong hover:glass text-foreground border-primary hover-glow-primary rounded-full text-lg px-8"
          >
            View My Work
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("contact")}
            className="border-2 border-primary/50 hover:border-primary hover:bg-primary/10 rounded-full text-lg px-8"
          >
            <Mail className="mr-2 w-5 h-5" />
            Contact Me
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
