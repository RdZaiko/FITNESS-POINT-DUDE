-- One-time first-teacher bootstrap for a single-teacher deployment.
-- Run as the trusted Supabase project owner in SQL Editor only, after registering
-- and confirming the teacher account. Replace the email below before running.
-- This does not create an account or change any password.
do $bootstrap$
declare
  bootstrap_email text := lower('REPLACE_WITH_THE_CONFIRMED_TEACHER_LOGIN_EMAIL');
  v_teacher_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended('learning-room-first-teacher-bootstrap', 0));

  if bootstrap_email = 'replace_with_the_confirmed_teacher_login_email'
     or bootstrap_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Replace bootstrap_email with the confirmed teacher login email before running';
  end if;

  if exists (select 1 from public.profiles where role = 'teacher') then
    raise exception 'A teacher is already bootstrapped; refusing to change existing roles';
  end if;

  select p.id into v_teacher_id
  from public.profiles p
  join auth.users u on u.id = p.id
  where lower(u.email) = bootstrap_email
    and u.email_confirmed_at is not null
    and p.role = 'student'
  for update of p;

  if v_teacher_id is null then
    raise exception 'No confirmed registered account was found for bootstrap_email';
  end if;

  update public.profiles
  set role = 'teacher', teacher_id = v_teacher_id, updated_at = now()
  where id = v_teacher_id and role = 'student';

  if not found then
    raise exception 'Teacher profile could not be promoted';
  end if;

  -- Accounts registered before the first teacher existed have no workspace yet.
  -- Associate them with this single-teacher deployment; they still need explicit
  -- enrollment before they can read any batch content.
  update public.profiles
  set teacher_id = v_teacher_id, updated_at = now()
  where role = 'student' and teacher_id is null;

  insert into public.teacher_settings (teacher_id)
  values (v_teacher_id)
  on conflict (teacher_id) do nothing;
end;
$bootstrap$;
