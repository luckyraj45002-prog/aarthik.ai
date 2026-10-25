-- ========================================================
-- AARTHIK.AI PRODUCTION SUPABASE SCHEMA
-- ZERO-KNOWLEDGE ARCHITECTURE WITH ROW-LEVEL SECURITY (RLS)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Stores ONLY Client-Encrypted Zero-Knowledge Payloads)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  encrypted_data text not null,
  iv text not null,
  salt text not null,
  client_version int default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Strict Per-User RLS Policies
create policy "Users can view only their own encrypted profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert only their own encrypted profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update only their own encrypted profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete only their own encrypted profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- 2. AUDIT LOGS TABLE
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  action text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

create policy "Users can view only their own audit logs"
  on public.audit_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert audit logs for themselves"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

-- 3. Automatic updated_at Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
