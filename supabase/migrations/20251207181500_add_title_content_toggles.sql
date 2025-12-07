-- Add visibility toggles for title and content
alter table public.popup_settings 
add column if not exists show_title boolean default true,
add column if not exists show_content boolean default true;
