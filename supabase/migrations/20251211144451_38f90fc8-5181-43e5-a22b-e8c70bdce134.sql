-- Add validation constraints to contact_messages table
ALTER TABLE public.contact_messages 
ADD CONSTRAINT name_length CHECK (length(name) <= 200);

ALTER TABLE public.contact_messages 
ADD CONSTRAINT email_length CHECK (length(email) <= 255);

ALTER TABLE public.contact_messages 
ADD CONSTRAINT mobile_number_length CHECK (mobile_number IS NULL OR length(mobile_number) <= 20);

ALTER TABLE public.contact_messages 
ADD CONSTRAINT message_length CHECK (length(message) <= 5000);

-- Make chat-media bucket private
UPDATE storage.buckets SET public = false WHERE id = 'chat-media';

-- Drop the old public policy
DROP POLICY IF EXISTS "Users can view chat media" ON storage.objects;

-- Create new policy that requires authentication to view chat media
CREATE POLICY "Authenticated users can view chat media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'chat-media' AND auth.role() = 'authenticated');