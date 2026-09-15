-- NAVORA: assessment_results — persistent final assessment for Dashboard & AI Advisor
-- Run this in Supabase SQL Editor if table does not exist.
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_type text,
  education_stage text,
  assessment_data jsonb default '{}'::jsonb,
  result_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for latest lookup
create index if not exists idx_assessment_results_user_created on public.assessment_results(user_id, created_at desc);

-- RLS: user can only see/manage own rows
alter table public.assessment_results enable row level security;

drop policy if exists "Users can insert own results" on public.assessment_results;
create policy "Users can insert own results" on public.assessment_results
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can select own results" on public.assessment_results;
create policy "Users can select own results" on public.assessment_results
  for select using (auth.uid() = user_id);

drop policy if exists "Users can update own results" on public.assessment_results;
create policy "Users can update own results" on public.assessment_results
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own results" on public.assessment_results;
create policy "Users can delete own results" on public.assessment_results
  for delete using (auth.uid() = user_id);
