const About = () => {
  return (
    <section id="about" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="fade-in-up">
            <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Who I am</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 font-mono">
              About <span className="text-primary">Me</span>
            </h2>
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>
                I'm <span className="text-foreground font-semibold">Harsh Kumar</span>, a passionate Full Stack Web Developer currently pursuing my B.Tech in Computer Science.
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
            <div className="glass rounded-xl p-5">
              <div className="font-mono text-xs">
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <span className="ml-2 text-[10px]">developer.profile</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-secondary">const</span>{" "}
                    <span className="text-primary">developer</span> = {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-accent">name</span>:{" "}
                    <span className="text-secondary">"Harsh Kumar"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-accent">role</span>:{" "}
                    <span className="text-secondary">"Full Stack Web Developer"</span>,
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
