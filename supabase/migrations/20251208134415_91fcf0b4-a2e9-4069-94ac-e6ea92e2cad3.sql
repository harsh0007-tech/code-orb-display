-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  live_link TEXT,
  code_link TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can view projects
CREATE POLICY "Anyone can view projects"
ON public.projects
FOR SELECT
USING (true);

-- Only admins can manage projects
CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();