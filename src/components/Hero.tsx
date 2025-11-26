import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import profileImage from "@/assets/profile-256.webp";
const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20 pb-32">
      <div className="max-w-4xl mx-auto text-center fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="glass rounded-full p-2">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary border-blink">
              <img src={profileImage} alt="Harsh Kumar - Full Stack Web Developer Profile Picture" className="w-full h-full object-cover" width="128" height="128" loading="eager" fetchPriority="high" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono">
          Building the Future
          <br />
          <span className="text-primary">with Code.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
          I am <span className="text-foreground font-semibold">Harsh Kumar</span>
        </p>
        <p className="text-lg text-muted-foreground mb-12">
          Full Stack Web Developer & B.Tech Computer Science Student
        </p>
        
        
      </div>
    </section>;
};
export default Hero;