import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, FolderKanban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});
  const [pausedProjects, setPausedProjects] = useState<{ [key: string]: boolean }>({});
  
  const DESCRIPTION_LIMIT = 100;

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getProjectImages = (project: Project): string[] => {
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    return project.image_url ? [project.image_url] : [];
  };

  // Auto-slide images every 2 seconds
  useEffect(() => {
    if (projects.length === 0) return;

    const interval = setInterval(() => {
      setImageIndexes(prev => {
        const newIndexes = { ...prev };
        projects.forEach(project => {
          const images = getProjectImages(project);
          if (images.length > 1 && !pausedProjects[project.id]) {
            const currentIndex = prev[project.id] || 0;
            newIndexes[project.id] = (currentIndex + 1) % images.length;
          }
        });
        return newIndexes;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [projects, pausedProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tobjuupxhxryndweofsm.supabase.co';
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYmp1dXB4aHhyeW5kd2VvZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTE3MTMsImV4cCI6MjA3MzkyNzcxM30.nXU7kT4FxbkCp8aGQd_Ae85Qwspop-uu_Nni9mgdSMc';
        
        const response = await fetch(
          `${supabaseUrl}/rest/v1/projects?select=*&order=created_at.desc`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Accept': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-mono fade-in-up">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-mono fade-in-up">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <div className="text-center py-12">
            <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">No projects yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon for featured work.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-mono fade-in-up">
          Featured <span className="text-primary">Projects</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="glass rounded-2xl overflow-hidden hover:glass-strong transition-all duration-300 transform hover:scale-105 fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {(() => {
                const images = getProjectImages(project);
                const currentIndex = imageIndexes[project.id] || 0;
                
                if (images.length === 0) return null;
                
                return (
                  <div 
                    className="aspect-video overflow-hidden relative"
                    onMouseEnter={() => setPausedProjects(prev => ({ ...prev, [project.id]: true }))}
                    onMouseLeave={() => setPausedProjects(prev => ({ ...prev, [project.id]: false }))}
                  >
                    {images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img}
                        alt={`${project.title} - ${imgIdx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          imgIdx === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        loading="lazy"
                      />
                    ))}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                              idx === currentIndex ? 'bg-primary' : 'bg-background/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 font-mono">{project.title}</h3>
                {project.description && (
                  <div className="text-sm text-muted-foreground mb-4">
                    {project.description.length > DESCRIPTION_LIMIT && !expandedDescriptions[project.id] ? (
                      <>
                        <p>{project.description.slice(0, DESCRIPTION_LIMIT)}...</p>
                        <button
                          onClick={() => toggleDescription(project.id)}
                          className="text-primary hover:underline text-xs mt-1 font-medium"
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
                            className="text-primary hover:underline text-xs mt-1 font-medium"
                          >
                            Show less
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {project.live_link && (
                    <Button
                      size="sm"
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                      asChild
                    >
                      <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live
                      </a>
                    </Button>
                  )}
                  {project.code_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-secondary/50 hover:bg-secondary/10"
                      asChild
                    >
                      <a href={project.code_link} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
