-- Add is_admin field to chat_messages to distinguish admin replies
ALTER TABLE chat_messages 
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policies to allow admins to insert messages as admin
CREATE POLICY "Admins can insert admin messages"
ON chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) AND is_admin = true
);