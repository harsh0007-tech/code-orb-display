import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import FloatingCrystals from "@/components/FloatingCrystals";

const Index = () => {
  return <div className="relative min-h-screen bg-background">
      <BackgroundOrbs />
      <FloatingCrystals />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <TechStack />
        <Education />
        <Contact />
      </main>
    </div>;
};
export default Index;