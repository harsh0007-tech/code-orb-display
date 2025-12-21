-- Add images column to projects table for multiple images
ALTER TABLE public.projects 
ADD COLUMN images text[] DEFAULT NULL;

-- Create an index for better performance when querying images
CREATE INDEX IF NOT EXISTS idx_projects_images ON public.projects USING GIN(images);