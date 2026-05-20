create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  password text,
  recovery_code text,
  created_at timestamp with time zone default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  distributor_email text not null,
  nombre text,
  telefono text,
  date bigint,
  report jsonb,
  history jsonb,
  prompt_original text,
  created_at timestamp with time zone default now()
);

create table if not exists public_reports (
  id uuid primary key default gen_random_uuid(),
  html text,
  created_at timestamp with time zone default now()
);

alter table users enable row level security;
alter table leads enable row level security;
alter table public_reports enable row level security;

drop policy if exists public_access on users;
drop policy if exists public_access on leads;
drop policy if exists public_access on public_reports;

create policy public_access on users for all using (true) with check (true);
create policy public_access on leads for all using (true) with check (true);
create policy public_access on public_reports for all using (true) with check (true);
