const TechStack = () => {
  const technologies = [
    { name: "React", icon: "⚛️" },
    { name: "TypeScript", icon: "📘" },
    { name: "Vite", icon: "⚡" },
    { name: "Shadcn-UI", icon: "🎨" },
    { name: "Tailwind CSS", icon: "💨" },
    { name: "Supabase", icon: "🔥" },
  ];

  return (
    <section id="tech-stack" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2 text-center fade-in-up">
          Tools I use
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center font-mono fade-in-up">
          Tech <span className="text-primary">Stack</span>
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="glass rounded-xl p-4 hover:glass-strong hover-glow-primary transition-all duration-300 transform hover:scale-105 fade-in-up cursor-pointer group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <h3 className="font-mono text-xs font-semibold text-primary">
                  {tech.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
