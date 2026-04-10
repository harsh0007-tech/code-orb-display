import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FolderKanban } from "lucide-react";

const SUPABASE_PROJECT_ID =
  import.meta.env.VITE_SUPABASE_PROJECT_ID || "tobjuupxhxryndweofsm";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYmp1dXB4aHhyeW5kd2VvZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTE3MTMsImV4cCI6MjA3MzkyNzcxM30.nXU7kT4FxbkCp8aGQd_Ae85Qwspop-uu_Nni9mgdSMc";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  live_link: string | null;
  code_link: string | null;
  tags: string[] | null;
  created_at: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const [pausedProjects, setPausedProjects] = useState<Record<string, boolean>>({});

  const DESCRIPTION_LIMIT = 100;

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const getProjectImages = (project: Project): string[] => {
    if (project.images && project.images.length > 0) return project.images;
    return project.image_url ? [project.image_url] : [];
  };

  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const next = { ...prev };
        projects.forEach((p) => {
          const imgs = getProjectImages(p);
          if (imgs.length > 1 && !pausedProjects[p.id]) {
            next[p.id] = ((prev[p.id] || 0) + 1) % imgs.length;
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [projects, pausedProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/get-projects`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const SectionHeader = () => (
    <>
      <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2 text-center fade-in-up">
        What I've built
      </p>
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center font-mono fade-in-up">
        Featured <span className="text-primary">Projects</span>
      </h2>
    </>
  );

  if (loading) {
    return (
      <section id="projects" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader />
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader />
          <div className="text-center py-10">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No projects yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon for featured work.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => {
            const images = getProjectImages(project);
            const currentIndex = imageIndexes[project.id] || 0;

            return (
              <div
                key={project.id}
                className="glass rounded-xl overflow-hidden hover:glass-strong transition-all duration-300 transform hover:scale-[1.03] fade-in-up group"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {images.length > 0 && (
                  <div
                    className="aspect-video overflow-hidden relative"
                    onMouseEnter={() =>
                      setPausedProjects((p) => ({ ...p, [project.id]: true }))
                    }
                    onMouseLeave={() =>
                      setPausedProjects((p) => ({ ...p, [project.id]: false }))
                    }
                  >
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${project.title} - ${i + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          i === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                        loading="lazy"
                      />
                    ))}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                              i === currentIndex ? "bg-primary" : "bg-background/60"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1.5 font-mono">{project.title}</h3>
                  {project.description && (
                    <div className="text-xs text-muted-foreground mb-3">
                      {project.description.length > DESCRIPTION_LIMIT &&
                      !expandedDescriptions[project.id] ? (
                        <>
                          <p>{project.description.slice(0, DESCRIPTION_LIMIT)}...</p>
                          <button
                            onClick={() => toggleDescription(project.id)}
                            className="text-primary hover:underline text-[11px] mt-1 font-medium"
                          >
                            Read more
                          </button>
                        </>
                      ) : (
                        <>
                          <p>{project.description}</p>
                          {project.description.length > DESCRIPTION_LIMIT && (
                            <button
                              onClick={() => toggleDescription(project.id)}
                              className="text-primary hover:underline text-[11px] mt-1 font-medium"
                            >
                              Show less
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {project.live_link && (
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                        asChild
                      >
                        <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          Live
                        </a>
                      </Button>
                    )}
                    {project.code_link && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs border-secondary/50 hover:bg-secondary/10"
                        asChild
                      >
                        <a href={project.code_link} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3.5 h-3.5 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
