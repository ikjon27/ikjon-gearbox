-- =====================================================================
-- IKJON Consulting Centre portal — database setup for Supabase
-- Paste ALL of this into Supabase → SQL Editor → New query → Run.
-- Safe to run again: it only creates what is missing and refreshes rules.
--
-- Security model (row-level security on every table):
--   owner   – sees and manages everything
--   teacher – sees their own groups, the students in them, and posts to them
--   student – sees only their own groups' courses, timetable and announcements,
--             and only their OWN progress and certificates
--   nobody can sign up publicly; logins are created by the owner/teachers
--   through the "create-user" function (which checks the caller's role).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 80),
  role text not null default 'student' check (role in ('owner','teacher','student')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  teacher_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid references public.groups(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (group_id, user_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 2000),
  group_id uuid references public.groups(id) on delete cascade,   -- null = whole centre
  author_id uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.timetable (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),          -- 0 = Monday
  starts time not null, ends time not null, room text default '',
  check (ends > starts)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null, icon text default '📘', position int default 0
);
create table if not exists public.course_groups (
  course_id uuid references public.courses(id) on delete cascade,
  group_id uuid references public.groups(id) on delete cascade,
  primary key (course_id, group_id)
);
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null, position int default 0,
  status text not null default 'locked' check (status in ('open','scheduled','locked')),
  open_from date,
  link text default ''          -- e.g. a lesson page in the learning app
);

create table if not exists public.progress (
  user_id uuid references public.profiles(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  pct smallint not null default 0 check (pct between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

create table if not exists public.levels (
  user_id uuid references public.profiles(id) on delete cascade,
  level text not null,
  status text not null default 'now' check (status in ('done','now','next')),
  pct smallint not null default 0 check (pct between 0 and 100),
  primary key (user_id, level)
);

create table if not exists public.certificates (
  id text primary key,                                    -- e.g. IK-2026-0142
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, issued_on date not null default current_date,
  issued_by uuid references public.profiles(id) on delete set null default auth.uid()
);

-- ---------- helper functions (run with definer rights, read-only) ----------
create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as
$$ select role from profiles where id = auth.uid() and active $$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(my_role() = 'owner', false) $$;

create or replace function public.my_group_ids() returns setof uuid
language sql stable security definer set search_path = public as
$$ select group_id from group_members where user_id = auth.uid()
   union select id from groups where teacher_id = auth.uid() $$;

create or replace function public.teaches(g uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists(select 1 from groups where id = g and teacher_id = auth.uid()) and coalesce(my_role() = 'teacher', false) $$;

create or replace function public.teaches_student(s uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(my_role() = 'teacher', false) and exists(
     select 1 from group_members m join groups g on g.id = m.group_id
     where m.user_id = s and g.teacher_id = auth.uid()) $$;

-- ---------- row-level security ----------
do $$ declare t text; begin
  foreach t in array array['profiles','groups','group_members','announcements','timetable','courses','course_groups','units','progress','levels','certificates'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
  end loop;
end $$;

-- drop old policies so this script can be re-run
do $$ declare r record; begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('profiles','groups','group_members','announcements','timetable','courses','course_groups','units','progress','levels','certificates')
  loop execute format('drop policy %I on public.%I', r.policyname, r.tablename); end loop;
end $$;

-- profiles: see yourself; teachers see their students; owner sees all. Only owner edits.
-- everyone signed in may see staff names (owner/teachers) so timetables and announcements show who posted
create policy p_profiles_read on public.profiles for select using (id = auth.uid() or is_owner() or teaches_student(id) or (my_role() is not null and role in ('owner','teacher')));
create policy p_profiles_owner on public.profiles for all using (is_owner()) with check (is_owner());

-- groups
create policy p_groups_read on public.groups for select using (is_owner() or id in (select my_group_ids()));
create policy p_groups_owner on public.groups for all using (is_owner()) with check (is_owner());

-- group members: owner all; teacher manages their own groups; student sees own membership
create policy p_gm_read on public.group_members for select using (is_owner() or user_id = auth.uid() or teaches(group_id));
create policy p_gm_teacher on public.group_members for insert with check (is_owner() or teaches(group_id));
create policy p_gm_teacher_del on public.group_members for delete using (is_owner() or teaches(group_id));

-- announcements: centre-wide (group_id null) visible to every active user; group posts to that group
create policy p_ann_read on public.announcements for select using (my_role() is not null and (group_id is null or is_owner() or group_id in (select my_group_ids())));
create policy p_ann_write on public.announcements for insert with check (author_id = auth.uid() and (is_owner() or (group_id is not null and teaches(group_id))));
create policy p_ann_edit on public.announcements for update using (is_owner() or author_id = auth.uid()) with check (is_owner() or (author_id = auth.uid() and group_id is not null and teaches(group_id)));
create policy p_ann_del on public.announcements for delete using (is_owner() or author_id = auth.uid());

-- timetable
create policy p_tt_read on public.timetable for select using (is_owner() or group_id in (select my_group_ids()));
create policy p_tt_write on public.timetable for all using (is_owner() or teaches(group_id)) with check (is_owner() or teaches(group_id));

-- courses / units (teachers open and schedule units for courses linked to their groups)
create policy p_courses_read on public.courses for select using (is_owner() or id in (select course_id from course_groups where group_id in (select my_group_ids())));
create policy p_courses_owner on public.courses for all using (is_owner()) with check (is_owner());
create policy p_cg_read on public.course_groups for select using (is_owner() or group_id in (select my_group_ids()));
create policy p_cg_owner on public.course_groups for all using (is_owner()) with check (is_owner());
create policy p_units_read on public.units for select using (is_owner() or course_id in (select course_id from course_groups where group_id in (select my_group_ids())));
create policy p_units_teacher on public.units for update using (is_owner() or exists(select 1 from course_groups cg where cg.course_id = units.course_id and teaches(cg.group_id)))
  with check (is_owner() or exists(select 1 from course_groups cg where cg.course_id = units.course_id and teaches(cg.group_id)));
create policy p_units_owner on public.units for all using (is_owner()) with check (is_owner());

-- progress, levels, certificates: students see ONLY their own; teachers their students; owner all
create policy p_prog_read on public.progress for select using (user_id = auth.uid() or is_owner() or teaches_student(user_id));
create policy p_prog_self on public.progress for insert with check (user_id = auth.uid() or is_owner() or teaches_student(user_id));
create policy p_prog_upd on public.progress for update using (user_id = auth.uid() or is_owner() or teaches_student(user_id)) with check (user_id = auth.uid() or is_owner() or teaches_student(user_id));
create policy p_lv_read on public.levels for select using (user_id = auth.uid() or is_owner() or teaches_student(user_id));
create policy p_lv_write on public.levels for all using (is_owner() or teaches_student(user_id)) with check (is_owner() or teaches_student(user_id));
create policy p_cert_read on public.certificates for select using (user_id = auth.uid() or is_owner() or teaches_student(user_id));
create policy p_cert_write on public.certificates for all using (is_owner()) with check (is_owner());

-- ---------- permissions: signed-in users only; anonymous visitors get nothing ----------
revoke all on all tables in schema public from anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke execute on all functions in schema public from anon, public;
grant execute on function public.my_role(), public.is_owner(), public.my_group_ids(), public.teaches(uuid), public.teaches_student(uuid) to authenticated;

-- ---------- make yourself the owner ----------
-- 1) Supabase → Authentication → Users → "Add user" → your email + a strong password (tick "Auto confirm").
-- 2) Then run this line with YOUR email:
--    insert into public.profiles (id, full_name, role) select id, 'Ikromjon', 'owner' from auth.users where email = 'YOUR-EMAIL-HERE'
--    on conflict (id) do update set role = 'owner';
