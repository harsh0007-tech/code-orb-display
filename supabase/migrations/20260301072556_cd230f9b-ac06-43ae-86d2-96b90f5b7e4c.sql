
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
CREATE POLICY "Anyone can view projects"
  ON public.projects
  FOR SELECT
  USING (true);
