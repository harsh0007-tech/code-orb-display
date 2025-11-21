import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import BackgroundOrbs from "@/components/BackgroundOrbs";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundOrbs />
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Education />
      <Contact />
      
      <footer className="py-8 px-6 text-center text-muted-foreground border-t border-border/50">
        <p className="font-mono">
          © 2024 Built with 💙 using React & Tailwind
        </p>
      </footer>
    </div>
  );
};

export default Index;
