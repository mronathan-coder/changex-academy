-- Run this in the Supabase SQL Editor

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  email       text not null unique,
  company     text not null,
  country     text not null,
  created_at  timestamptz not null default now()
);

-- Allow anonymous inserts (public subscribe form)
alter table public.subscribers enable row level security;

create policy "anyone can subscribe"
  on public.subscribers
  for insert
  to anon
  with check (true);
