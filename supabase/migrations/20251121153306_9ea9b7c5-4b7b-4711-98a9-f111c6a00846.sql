-- Add admin role for the portfolio owner
INSERT INTO public.user_roles (user_id, role)
VALUES ('2787a8b9-2b30-4130-81cc-72cb9ea7126a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;