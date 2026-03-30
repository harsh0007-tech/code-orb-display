-- Fix 1: Restrict certificates bucket write access to admins only
DROP POLICY "Anyone can delete certificates" ON storage.objects;
DROP POLICY "Anyone can update certificates" ON storage.objects;
DROP POLICY "Anyone can upload certificates" ON storage.objects;

CREATE POLICY "Admins can upload certificates" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update certificates" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete certificates" ON storage.objects FOR DELETE TO public USING (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Add Realtime RLS policies for chat_messages
-- Users can only subscribe to channels matching their own user_id
CREATE POLICY "Users receive own chat messages" ON realtime.messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.chat_messages cm
    WHERE cm.user_id = auth.uid()
  )
);

-- Admins can receive all chat messages
CREATE POLICY "Admins receive all chat messages" ON realtime.messages FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);