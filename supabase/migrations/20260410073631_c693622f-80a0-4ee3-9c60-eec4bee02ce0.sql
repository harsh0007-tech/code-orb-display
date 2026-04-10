-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule keepalive every 15 days (at midnight on the 1st and 16th)
SELECT cron.schedule(
  'keepalive-every-15-days',
  '0 0 1,16 * *',
  $$
  SELECT net.http_post(
    url := 'https://tobjuupxhxryndweofsm.supabase.co/functions/v1/keepalive',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYmp1dXB4aHhyeW5kd2VvZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTE3MTMsImV4cCI6MjA3MzkyNzcxM30.nXU7kT4FxbkCp8aGQd_Ae85Qwspop-uu_Nni9mgdSMc"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Schedule db-keepalive every day at midnight
SELECT cron.schedule(
  'db-keepalive-daily',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://tobjuupxhxryndweofsm.supabase.co/functions/v1/db-keepalive',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYmp1dXB4aHhyeW5kd2VvZnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTE3MTMsImV4cCI6MjA3MzkyNzcxM30.nXU7kT4FxbkCp8aGQd_Ae85Qwspop-uu_Nni9mgdSMc"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);