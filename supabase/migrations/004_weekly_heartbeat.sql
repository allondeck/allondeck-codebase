-- Enable the pg_cron extension if not already enabled
create extension if not exists pg_cron;

-- Create the heartbeat table
create table if not exists public.heartbeat (
  id bigint primary key generated always as identity,
  last_ping timestamp with time zone default now() not null
);

-- Enable Row Level Security (RLS) to keep it secure
alter table public.heartbeat enable row level security;

-- Unschedule the job first if it already exists to prevent duplication on migration reruns
select cron.unschedule('weekly-heartbeat')
where exists (
  select 1 from cron.job where jobname = 'weekly-heartbeat'
);

-- Schedule the weekly_heartbeat cron job to run every 3 days (at 12:00 AM UTC)
select cron.schedule(
  'weekly-heartbeat',
  '0 0 */3 * *',
  $$
  insert into public.heartbeat (last_ping) values (now());
  delete from public.heartbeat where last_ping < now() - interval '1 week';
  $$
);
