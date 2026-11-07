-- The Learning Room: one isolated teacher workspace per deployed instance.
create extension if not exists pgcrypto;

create type public.account_role as enum ('teacher', 'student');
create type public.enrollment_status as enum ('pending', 'active', 'paused', 'ended');
create type public.lesson_status as enum ('draft', 'uploading', 'processing', 'ready', 'failed', 'archived');
create type public.live_status as enum ('scheduled', 'idle', 'live', 'completed', 'failed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  role public.account_role not null default 'student',
  full_name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_teacher_is_self check (role <> 'teacher' or teacher_id = id)
);
create index profiles_teacher_idx on public.profiles(teacher_id);

create table public.teacher_settings (
  teacher_id uuid primary key references public.profiles(id) on delete cascade,
  brand_name text not null default 'The Learning Room',
  teacher_name text not null default 'Ms. Ananya Sharma',
  logo_url text,
  primary_color text not null default '#153f34',
  accent_color text not null default '#bd9958',
  contact_email text,
  contact_phone text,
  course_details jsonb not null default '[]'::jsonb,
  domain text,
  updated_at timestamptz not null default now()
);

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null default '',
  grade text not null default '',
  status text not null default 'active' check (status in ('active','upcoming','archived')),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index batches_teacher_status_idx on public.batches(teacher_id,status) where archived = false;

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  batch_id uuid not null references public.batches(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.enrollment_status not null default 'pending',
  enrolled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(batch_id, student_id)
);
create index enrollments_student_status_idx on public.enrollments(student_id,status);
create index enrollments_teacher_batch_idx on public.enrollments(teacher_id,batch_id,status);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  batch_id uuid not null references public.batches(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '',
  sort_order integer not null default 0,
  duration_minutes integer check (duration_minutes is null or duration_minutes between 1 and 1440),
  status public.lesson_status not null default 'draft',
  mux_upload_id text unique,
  mux_asset_id text unique,
  mux_playback_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index lessons_batch_order_idx on public.lessons(batch_id,sort_order) where status <> 'archived';
create index lessons_teacher_idx on public.lessons(teacher_id);

create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  batch_id uuid not null references public.batches(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '',
  starts_at timestamptz not null,
  status public.live_status not null default 'scheduled',
  mux_live_stream_id text unique,
  mux_playback_id text,
  recording_asset_id text,
  recording_playback_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index live_sessions_batch_starts_idx on public.live_sessions(batch_id,starts_at,status);
create index live_sessions_teacher_idx on public.live_sessions(teacher_id,starts_at);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  body text not null check (char_length(body) between 3 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index announcements_teacher_created_idx on public.announcements(teacher_id,created_at desc);
create index announcements_batch_created_idx on public.announcements(batch_id,created_at desc);

create table public.study_materials (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  batch_id uuid not null references public.batches(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '',
  file_type text not null default 'PDF',
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index materials_batch_created_idx on public.study_materials(batch_id,created_at desc);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  watched_seconds integer not null default 0 check (watched_seconds >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(student_id,lesson_id)
);
create index progress_student_updated_idx on public.lesson_progress(student_id,updated_at desc);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  assigned_teacher uuid;
begin
  select p.id into assigned_teacher from public.profiles p where p.role = 'teacher' order by p.created_at limit 1;
  insert into public.profiles (id, teacher_id, full_name, email)
  values (new.id, assigned_teacher, coalesce(new.raw_user_meta_data ->> 'full_name',''), coalesce(lower(new.email),''));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- SECURITY DEFINER helpers avoid recursive policy evaluation on enrollments.
create or replace function public.is_teacher_for(target_teacher uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'teacher' and p.teacher_id = p.id and p.id = target_teacher)
$$;
create or replace function public.is_enrolled_in(target_batch uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.enrollments e join public.batches b on b.id=e.batch_id where e.batch_id = target_batch and e.student_id = (select auth.uid()) and e.status = 'active' and b.archived = false)
$$;
create or replace function public.is_teacher_student(target_student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.enrollments e where e.student_id = target_student and e.teacher_id = (select auth.uid()) and e.status in ('active','pending','paused'))
$$;

create or replace function public.protect_profile_privileges() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(),'') = 'authenticated' and (new.role is distinct from old.role or new.teacher_id is distinct from old.teacher_id or new.email is distinct from old.email) then
    raise exception 'Role and workspace assignment are managed by an administrator';
  end if;
  return new;
end;
$$;
create trigger protect_profile_privileges before update on public.profiles
for each row execute procedure public.protect_profile_privileges();

create or replace function public.validate_batch_workspace() returns trigger
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid;
begin
  if new.batch_id is null then return new; end if;
  select b.teacher_id into owner_id from public.batches b where b.id = new.batch_id;
  if owner_id is null or owner_id <> new.teacher_id then
    raise exception 'Batch does not belong to this teacher workspace';
  end if;
  return new;
end;
$$;
create trigger enrollments_validate_workspace before insert or update on public.enrollments
for each row execute procedure public.validate_batch_workspace();
create trigger lessons_validate_workspace before insert or update on public.lessons
for each row execute procedure public.validate_batch_workspace();
create trigger live_sessions_validate_workspace before insert or update on public.live_sessions
for each row execute procedure public.validate_batch_workspace();
create trigger announcements_validate_workspace before insert or update on public.announcements
for each row execute procedure public.validate_batch_workspace();
create trigger materials_validate_workspace before insert or update on public.study_materials
for each row execute procedure public.validate_batch_workspace();

create or replace function public.validate_enrollment_student_workspace() returns trigger
language plpgsql security definer set search_path = '' as $$
declare student_teacher uuid;
begin
  select p.teacher_id into student_teacher from public.profiles p where p.id=new.student_id and p.role='student';
  if student_teacher is null or student_teacher <> new.teacher_id then
    raise exception 'Student account does not belong to this teacher workspace';
  end if;
  return new;
end;
$$;
create trigger enrollment_student_workspace before insert or update on public.enrollments
for each row execute procedure public.validate_enrollment_student_workspace();

alter table public.profiles enable row level security;
alter table public.teacher_settings enable row level security;
alter table public.batches enable row level security;
alter table public.enrollments enable row level security;
alter table public.lessons enable row level security;
alter table public.live_sessions enable row level security;
alter table public.announcements enable row level security;
alter table public.study_materials enable row level security;
alter table public.lesson_progress enable row level security;

create policy "profiles_read_self_or_rostered" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_teacher_for(teacher_id) or public.is_teacher_student(id) or exists(select 1 from public.enrollments e where e.student_id=(select auth.uid()) and e.teacher_id=profiles.id and e.status='active'));
create policy "profiles_update_self" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "teacher_settings_teacher_all" on public.teacher_settings for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "teacher_settings_student_read" on public.teacher_settings for select to authenticated using (exists(select 1 from public.batches b where b.teacher_id=teacher_settings.teacher_id and public.is_enrolled_in(b.id)));
create policy "teacher_settings_public_read" on public.teacher_settings for select to anon, authenticated using (true);

create policy "batches_teacher_all" on public.batches for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "batches_enrolled_read" on public.batches for select to authenticated using (public.is_enrolled_in(id));

create policy "enrollments_teacher_manage" on public.enrollments for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "enrollments_student_read_self" on public.enrollments for select to authenticated using (student_id=(select auth.uid()));

create policy "lessons_teacher_manage" on public.lessons for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "lessons_enrolled_ready_read" on public.lessons for select to authenticated using (status='ready' and public.is_enrolled_in(batch_id));

create policy "live_sessions_teacher_manage" on public.live_sessions for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "live_sessions_enrolled_read" on public.live_sessions for select to authenticated using (public.is_enrolled_in(batch_id));

create policy "announcements_teacher_manage" on public.announcements for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "announcements_enrolled_read" on public.announcements for select to authenticated using (batch_id is null or public.is_enrolled_in(batch_id));

create policy "materials_teacher_manage" on public.study_materials for all to authenticated using (public.is_teacher_for(teacher_id)) with check (public.is_teacher_for(teacher_id));
create policy "materials_enrolled_read" on public.study_materials for select to authenticated using (public.is_enrolled_in(batch_id));

create policy "progress_teacher_read" on public.lesson_progress for select to authenticated using (public.is_teacher_for(teacher_id));
create policy "progress_student_read_self" on public.lesson_progress for select to authenticated using (student_id=(select auth.uid()));
create policy "progress_student_write_self" on public.lesson_progress for insert to authenticated with check (student_id=(select auth.uid()) and public.is_enrolled_in((select batch_id from public.lessons where id=lesson_id)));
create policy "progress_student_update_self" on public.lesson_progress for update to authenticated using (student_id=(select auth.uid())) with check (student_id=(select auth.uid()) and public.is_enrolled_in((select batch_id from public.lessons where id=lesson_id)));

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.teacher_settings, public.batches, public.enrollments, public.lessons, public.live_sessions, public.announcements, public.study_materials, public.lesson_progress to authenticated;
grant select on public.teacher_settings to anon;

-- Private materials bucket. Files are delivered through short-lived signed URLs after RLS checks.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('study-materials','study-materials',false,20971520,array['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;
create policy "materials_teacher_storage_all" on storage.objects for all to authenticated using (bucket_id='study-materials' and public.is_teacher_for((storage.foldername(name))[1]::uuid)) with check (bucket_id='study-materials' and public.is_teacher_for((storage.foldername(name))[1]::uuid));
create policy "materials_student_storage_read" on storage.objects for select to authenticated using (bucket_id='study-materials' and exists(select 1 from public.study_materials m where m.storage_path=name and public.is_enrolled_in(m.batch_id)));
