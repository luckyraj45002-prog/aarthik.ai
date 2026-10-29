-- ========================================================
-- AARTHIK.AI PRODUCTION SUPABASE SCHEMA (IDEMPOTENT & RE-RUNNABLE)
-- Safe to execute multiple times without "already exists" errors
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================================
-- 1. PUBLIC.PROFILES TABLE
-- Ensure profiles table exists and contains all required columns
-- ========================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  plan text default 'free',
  preferences jsonb default '{"currency": "INR", "language": "en"}'::jsonb,
  encrypted_data text default '{}',
  iv text default 'init',
  salt text default 'init',
  client_version int default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist even if the table was created earlier
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists plan text default 'free';
alter table public.profiles add column if not exists preferences jsonb default '{"currency": "INR", "language": "en"}'::jsonb;
alter table public.profiles add column if not exists encrypted_data text default '{}';
alter table public.profiles add column if not exists iv text default 'init';
alter table public.profiles add column if not exists salt text default 'init';
alter table public.profiles add column if not exists client_version int default 1;
alter table public.profiles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Drop existing policies first to prevent 42710 "policy already exists" error
drop policy if exists "Users can view only their own profile" on public.profiles;
drop policy if exists "Users can insert only their own profile" on public.profiles;
drop policy if exists "Users can update only their own profile" on public.profiles;
drop policy if exists "Users can delete only their own profile" on public.profiles;

-- Re-create strict per-user RLS policies
create policy "Users can view only their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert only their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update only their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete only their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ========================================================
-- 2. AUDIT LOGS TABLE
-- ========================================================
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  action text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

drop policy if exists "Users can view only their own audit logs" on public.audit_logs;
drop policy if exists "Users can insert audit logs for themselves" on public.audit_logs;

create policy "Users can view only their own audit logs"
  on public.audit_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert audit logs for themselves"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

-- ========================================================
-- 3. WEBHOOK / TRIGGER FOR USER LIFECYCLE (auth.users -> public.profiles)
-- Automatically initializes public.profiles on new sign-up
-- ========================================================
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, preferences)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    '{"currency": "INR", "language": "en"}'::jsonb
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger before creating to ensure clean execution
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- ========================================================
-- 4. AUTOMATIC UPDATED_AT TRIGGER
-- ========================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on public.profiles;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
