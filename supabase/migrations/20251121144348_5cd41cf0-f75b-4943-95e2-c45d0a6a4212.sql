-- Drop all existing tables
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Drop the update trigger function if it exists
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop the is_admin function if it exists
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;