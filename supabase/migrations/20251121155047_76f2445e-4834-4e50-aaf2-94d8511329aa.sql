-- Create page_visits table for tracking visitor analytics
CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert visits (for anonymous tracking)
CREATE POLICY "Anyone can track visits"
  ON public.page_visits
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view analytics
CREATE POLICY "Admins can view visits"
  ON public.page_visits
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete visits
CREATE POLICY "Admins can delete visits"
  ON public.page_visits
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON public.page_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_visitor_id ON public.page_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_path ON public.page_visits(page_path);