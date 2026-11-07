-- Read-only setup check. Run in the Supabase SQL Editor after applying all migrations.
with required_tables(table_name) as (
  values ('profiles'), ('teacher_settings'), ('batches'), ('enrollments'),
         ('lessons'), ('live_sessions'), ('announcements'), ('study_materials'),
         ('lesson_progress')
), required_policies(table_name, policy_name) as (
  values
    ('profiles','profiles_read_self_or_rostered'),
    ('profiles','profiles_update_self'),
    ('teacher_settings','teacher_settings_teacher_all'),
    ('teacher_settings','teacher_settings_student_read'),
    ('teacher_settings','teacher_settings_public_read'),
    ('batches','batches_teacher_all'),
    ('batches','batches_enrolled_read'),
    ('enrollments','enrollments_teacher_manage'),
    ('enrollments','enrollments_student_read_self'),
    ('lessons','lessons_teacher_manage'),
    ('lessons','lessons_enrolled_ready_read'),
    ('live_sessions','live_sessions_teacher_manage'),
    ('live_sessions','live_sessions_enrolled_read'),
    ('announcements','announcements_teacher_manage'),
    ('announcements','announcements_enrolled_read'),
    ('study_materials','materials_teacher_manage'),
    ('study_materials','materials_enrolled_read'),
    ('lesson_progress','progress_teacher_read'),
    ('lesson_progress','progress_student_read_self'),
    ('lesson_progress','progress_student_write_self'),
    ('lesson_progress','progress_student_update_self'),
    ('storage.objects','materials_teacher_storage_all'),
    ('storage.objects','materials_student_storage_read')
), table_checks(check_name, result) as (
  select 'RLS enabled: public.' || r.table_name,
         case when c.oid is null then 'MISSING TABLE'
              when c.relrowsecurity then 'OK' else 'MISSING RLS' end
  from required_tables r
  left join pg_class c on c.relname = r.table_name
  left join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
  where c.oid is null or n.nspname = 'public'
), policy_checks(check_name, result) as (
  select 'Policy: ' || p.table_name || '.' || p.policy_name,
         case when exists (
           select 1 from pg_policies actual
           where actual.schemaname = case when p.table_name = 'storage.objects' then 'storage' else 'public' end
             and actual.tablename = case when p.table_name = 'storage.objects' then 'objects' else p.table_name end
             and actual.policyname = p.policy_name
         ) then 'OK' else 'MISSING' end
  from required_policies p
), bucket_check(check_name, result) as (
  select 'Private storage bucket: study-materials',
         case when exists (select 1 from storage.buckets where id='study-materials' and public=false)
              then 'OK' else 'MISSING OR PUBLIC' end
), trigger_check(check_name, result) as (
  select 'Auth profile trigger: on_auth_user_created',
         case when exists (
           select 1 from pg_trigger t join pg_class c on c.oid=t.tgrelid
           join pg_namespace n on n.oid=c.relnamespace
           where n.nspname='auth' and c.relname='users'
             and t.tgname='on_auth_user_created' and not t.tgisinternal
         ) then 'OK' else 'MISSING' end
)
select check_name, result from table_checks
union all select check_name, result from policy_checks
union all select check_name, result from bucket_check
union all select check_name, result from trigger_check
order by check_name;
