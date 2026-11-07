-- Apply after 202610210001_initial_schema.sql.
-- Move only untouched installation defaults to the updated emerald-and-gold palette.
-- Teacher-selected brand colors are preserved.
alter table public.teacher_settings
  alter column primary_color set default '#153f34',
  alter column accent_color set default '#bd9958';

update public.teacher_settings
set primary_color = '#153f34'
where primary_color = '#214b3a';

update public.teacher_settings
set accent_color = '#bd9958'
where accent_color = '#dc815b';
