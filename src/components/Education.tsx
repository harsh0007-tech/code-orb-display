import { GraduationCap } from "lucide-react";

const Education = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-mono fade-in-up">
          <span className="text-primary">Education</span>
        </h2>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>
          
          <div className="glass rounded-2xl p-8 ml-16 fade-in-up hover:glass-strong transition-all duration-300">
            <div className="absolute left-4 p-2 glass-strong rounded-full">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2 font-mono">
                Bachelor of Technology
              </h3>
              <p className="text-primary font-semibold mb-2">Computer Science</p>
              <p className="text-muted-foreground mb-4">
                Currently pursuing B.Tech in Computer Science, focusing on modern software development, 
                algorithms, data structures, and full-stack web development.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary-accessible border border-secondary/20">
                  Data Structures
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary-accessible border border-secondary/20">
                  Algorithms
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary-accessible border border-secondary/20">
                  Web Development
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary-accessible border border-secondary/20">
                  Database Systems
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
