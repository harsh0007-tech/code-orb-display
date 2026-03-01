
-- Fix: Change "Anyone can view projects" from RESTRICTIVE to PERMISSIVE
DROP POLICY "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects"
  ON public.projects
  FOR SELECT
  USING (true);
