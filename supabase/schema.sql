-- Supabase CMS schema for Barkha Manral portfolio articles.
-- Run this in the Supabase SQL editor for the project backing the website.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  author text not null default 'Barkha Manral',
  category text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text
);

create index if not exists articles_published_at_idx on public.articles (published, published_at desc);
create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists articles_tags_idx on public.articles using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.articles enable row level security;

drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public"
on public.articles
for select
using (published = true or public.is_admin());

drop policy if exists "Admins can insert articles" on public.articles;
create policy "Admins can insert articles"
on public.articles
for insert
with check (public.is_admin());

drop policy if exists "Admins can update articles" on public.articles;
create policy "Admins can update articles"
on public.articles
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete articles" on public.articles;
create policy "Admins can delete articles"
on public.articles
for delete
using (public.is_admin());

-- Enable realtime change events for article publishing/listing updates.
do $$
begin
  alter publication supabase_realtime add table public.articles;
exception
  when duplicate_object then null;
end $$;

-- After creating the first admin user in Supabase Auth, run:
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000');
