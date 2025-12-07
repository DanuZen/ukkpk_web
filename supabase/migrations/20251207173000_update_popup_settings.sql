-- Add new columns for button control
alter table public.popup_settings 
add column if not exists show_button boolean default true,
add column if not exists button_type text default 'link'; -- 'link' or 'form'
