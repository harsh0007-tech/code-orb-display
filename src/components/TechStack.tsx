const TechStack = () => {
  const technologies = [
    { name: "React", icon: "⚛️", color: "text-primary" },
    { name: "TypeScript", icon: "📘", color: "text-primary" },
    { name: "Vite", icon: "⚡", color: "text-accent" },
    { name: "Shadcn-UI", icon: "🎨", color: "text-secondary" },
    { name: "Tailwind CSS", icon: "💨", color: "text-primary" },
    { name: "Supabase", icon: "🔥", color: "text-accent" },
  ];

  return (
    <section id="tech-stack" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-mono fade-in-up">
          Tech <span className="text-primary">Stack</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="glass rounded-2xl p-6 hover:glass-strong hover-glow-primary transition-all duration-300 transform hover:scale-105 fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{tech.icon}</div>
                <h3 className={`font-mono font-semibold ${tech.color}`}>
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
