-- Apply after 202610220001_premium_brand_palette.sql.
-- Tighten tenant checks without deleting application data.

alter table public.teacher_settings
  alter column teacher_name set default 'Your teacher';

-- Batch-wide announcements are visible only to active students of that teacher.
-- Batch-specific announcements additionally require an active enrollment in that batch.
create or replace function public.can_read_announcement(target_teacher uuid, target_batch uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.batches b on b.id = e.batch_id
    where e.teacher_id = target_teacher
      and e.student_id = (select auth.uid())
      and e.status = 'active'
      and b.archived = false
      and (target_batch is null or e.batch_id = target_batch)
  )
$$;

drop policy if exists "announcements_enrolled_read" on public.announcements;
create policy "announcements_enrolled_read" on public.announcements
  for select to authenticated
  using (public.can_read_announcement(teacher_id, batch_id));

-- Progress is tied to the lesson's actual teacher and the student's active enrollment.
-- The trigger is SECURITY DEFINER so it can perform the integrity check through RLS.
create or replace function public.validate_lesson_progress_workspace()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  lesson_teacher uuid;
  lesson_batch uuid;
  student_teacher uuid;
begin
  select l.teacher_id, l.batch_id
    into lesson_teacher, lesson_batch
  from public.lessons l
  where l.id = new.lesson_id and l.status <> 'archived';

  if lesson_teacher is null or lesson_batch is null then
    raise exception 'Lesson is unavailable';
  end if;

  select p.teacher_id into student_teacher
  from public.profiles p
  where p.id = new.student_id and p.role = 'student';

  if student_teacher is null or student_teacher <> lesson_teacher then
    raise exception 'Student and lesson are not in the same teacher workspace';
  end if;

  if new.teacher_id is distinct from lesson_teacher then
    raise exception 'Progress teacher does not own the lesson';
  end if;

  if not exists (
    select 1 from public.enrollments e
    where e.teacher_id = lesson_teacher
      and e.batch_id = lesson_batch
      and e.student_id = new.student_id
      and e.status = 'active'
  ) then
    raise exception 'Student is not actively enrolled in this lesson batch';
  end if;

  return new;
end;
$$;

drop trigger if exists lesson_progress_validate_workspace on public.lesson_progress;
create trigger lesson_progress_validate_workspace
  before insert or update on public.lesson_progress
  for each row execute procedure public.validate_lesson_progress_workspace();

-- Keep the public API narrow. Public brand settings are intentionally readable;
-- application records require an authenticated role and their RLS policy.
revoke all on table
  public.profiles,
  public.teacher_settings,
  public.batches,
  public.enrollments,
  public.lessons,
  public.live_sessions,
  public.announcements,
  public.study_materials,
  public.lesson_progress
from anon;
grant select on public.teacher_settings to anon;

revoke all on table
  public.profiles,
  public.teacher_settings,
  public.batches,
  public.enrollments,
  public.lessons,
  public.live_sessions,
  public.announcements,
  public.study_materials,
  public.lesson_progress
from authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, updated_at) on public.profiles to authenticated;
grant select, insert, update on public.teacher_settings to authenticated;
grant select, insert, update on public.batches to authenticated;
grant select, insert, update on public.enrollments to authenticated;
grant select, insert, update on public.lessons to authenticated;
grant select, insert, update on public.live_sessions to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;
grant select, insert, delete on public.study_materials to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;

-- SECURITY DEFINER helpers are callable only by authenticated policy evaluation.
revoke all on function public.is_teacher_for(uuid) from public, anon;
revoke all on function public.is_enrolled_in(uuid) from public, anon;
revoke all on function public.is_teacher_student(uuid) from public, anon;
revoke all on function public.can_read_announcement(uuid, uuid) from public, anon;
grant execute on function public.is_teacher_for(uuid) to authenticated;
grant execute on function public.is_enrolled_in(uuid) to authenticated;
grant execute on function public.is_teacher_student(uuid) to authenticated;
grant execute on function public.can_read_announcement(uuid, uuid) to authenticated;

-- Trigger-only SECURITY DEFINER routines must not be exposed as RPC functions.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.protect_profile_privileges() from public, anon, authenticated;
revoke all on function public.validate_batch_workspace() from public, anon, authenticated;
revoke all on function public.validate_enrollment_student_workspace() from public, anon, authenticated;
revoke all on function public.validate_lesson_progress_workspace() from public, anon, authenticated;
