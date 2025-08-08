-- Enum for application roles
create type if not exists public.app_role as enum ('admin', 'moderator', 'user');

-- Roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Helper function to check role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- Policies for user_roles
create policy if not exists "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy if not exists "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can insert roles"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update roles"
  on public.user_roles for update
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete roles"
  on public.user_roles for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Profiles table to store public user info
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy if not exists "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy if not exists "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update all profiles"
  on public.profiles for update
  using (public.has_role(auth.uid(), 'admin'));

-- Trigger to insert default profile on signup
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger if not exists on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Trigger to add default role 'user' on signup
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

create trigger if not exists on_auth_user_created_role
  after insert on auth.users
  for each row execute procedure public.handle_new_user_role();
