import { GraduationCap } from "lucide-react";

const Education = () => {
  const subjects = [
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Database Systems",
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2 text-center fade-in-up">
          Academic background
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center font-mono fade-in-up">
          <span className="text-primary">Education</span>
        </h2>

        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="glass rounded-xl p-6 flex gap-5 items-start hover:glass-strong transition-all duration-300">
            <div className="shrink-0 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1 font-mono">
                Bachelor of Technology
              </h3>
              <p className="text-primary font-semibold text-sm mb-2">
                Computer Science
              </p>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                Currently pursuing B.Tech in Computer Science, focusing on modern
                software development, algorithms, data structures, and full-stack
                web development.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {subjects.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary-accessible border border-secondary/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
