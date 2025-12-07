-- Drop table if exists to ensure clean slate
drop table if exists public.popup_settings cascade;

-- Create popup_settings table
create table public.popup_settings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  image_url text,
  button_text text default 'Tutup',
  button_link text,
  is_enabled boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create updated_at trigger function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add trigger for updated_at
create trigger popup_settings_updated_at
  before update on public.popup_settings
  for each row
  execute function public.handle_updated_at();

-- Enable RLS
alter table public.popup_settings enable row level security;

-- Policy: Anyone can read popup settings
create policy "Anyone can view popup settings"
  on public.popup_settings
  for select
  using (true);

-- Policy: Only admins can insert popup settings
create policy "Only admins can insert popup settings"
  on public.popup_settings
  for insert
  with check (
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Policy: Only admins can update popup settings
create policy "Only admins can update popup settings"
  on public.popup_settings
  for update
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Policy: Only admins can delete popup settings
create policy "Only admins can delete popup settings"
  on public.popup_settings
  for delete
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Insert default popup settings
insert into public.popup_settings (title, content, button_text, is_enabled)
values (
  'Selamat Datang di UKKPK!',
  'Terima kasih telah mengunjungi website Unit Kegiatan Komunikasi dan Penyiaran Kampus. Jelajahi berbagai informasi, artikel, dan berita terbaru dari kami.',
  'Mulai Jelajahi',
  false
);
