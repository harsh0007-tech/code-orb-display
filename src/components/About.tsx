const About = () => {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
              About <span className="text-primary">Me</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a passionate <span className="text-foreground font-semibold">Fullstack Developer</span> currently pursuing my B.Tech in Computer Science. 
                I thrive on transforming complex problems into elegant, user-friendly solutions.
              </p>
              <p>
                My journey in tech is driven by curiosity and a constant desire to learn. 
                From crafting pixel-perfect interfaces to architecting robust backend systems, 
                I enjoy every aspect of bringing ideas to life through code.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, 
                contributing to open-source projects, or mentoring fellow developers in their journey.
              </p>
            </div>
          </div>
          
          <div className="fade-in-up">
            <div className="glass rounded-2xl p-6">
              <div className="font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-2">developer.profile</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-secondary">const</span>{" "}
                    <span className="text-primary">developer</span> = {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-accent">name</span>:{" "}
                    <span className="text-secondary">"Fullstack Developer"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-accent">education</span>:{" "}
                    <span className="text-secondary">"B.Tech CS"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-accent">skills</span>: [
                  </div>
                  <div className="pl-8">
                    <span className="text-secondary">"React"</span>,{" "}
                    <span className="text-secondary">"Node.js"</span>,
                  </div>
                  <div className="pl-8">
                    <span className="text-secondary">"TypeScript"</span>,{" "}
                    <span className="text-secondary">"Python"</span>
                  </div>
                  <div className="pl-4">],</div>
                  <div className="pl-4">
                    <span className="text-accent">passion</span>:{" "}
                    <span className="text-secondary">"Building Amazing Things"</span>
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
