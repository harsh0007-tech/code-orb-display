import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Left (desktop) / Top (mobile): Avatar with orbital dots */}
        <div
          className={`flex justify-center md:justify-start order-first transition-all duration-700 delay-200 ${
            isVisible
              ? "opacity-100 translate-y-0 md:translate-x-0"
              : "opacity-0 translate-y-10 md:-translate-x-10"
          }`}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-primary/60 shadow-[0_0_6px_hsl(var(--primary)/0.6)]" />
            </div>
            <div className="absolute inset-[-16px] rounded-full border border-secondary/15 animate-[spin_28s_linear_infinite_reverse]">
              <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_hsl(var(--secondary))]" />
              <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary/50 shadow-[0_0_6px_hsl(var(--secondary)/0.5)]" />
            </div>
            <div className="absolute inset-[-32px] rounded-full border border-primary/10 animate-[spin_35s_linear_infinite]">
              <span className="absolute bottom-0 right-1/4 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_4px_hsl(var(--primary)/0.4)]" />
            </div>
            <div className="absolute inset-4 rounded-full bg-primary/10 blur-2xl animate-pulse" />
            <div className="absolute inset-6 rounded-full overflow-hidden border-2 border-primary/40 shadow-[0_0_30px_hsl(var(--primary)/0.25)]">
              <img
                src="/profile.webp"
                alt="Harsh Kumar - Full Stack Web Developer Profile Picture"
                className="w-full h-full object-cover"
                width="280"
                height="280"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        {/* Right (desktop) / Bottom (mobile): Text */}
        <div
          className={`transition-all duration-700 text-center md:text-left ${
            isVisible
              ? "opacity-100 translate-y-0 md:translate-x-0"
              : "opacity-0 translate-y-10 md:translate-x-10"
          }`}
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            Hello, I'm
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-mono leading-[1.1] mb-4">
            Harsh
            <br />
            <span className="text-primary">Kumar.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-6 max-w-md mx-auto md:mx-0">
            Full Stack Web Developer & B.Tech Computer Science Student — crafting
            modern, performant web experiences.
          </p>
          <button
            onClick={() => scrollToSection("projects")}
            className="group inline-flex items-center gap-2 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
          >
            View my work
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection("projects")}
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
