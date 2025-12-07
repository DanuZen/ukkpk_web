-- Create registrations table
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  student_id text not null,
  department text not null,
  reason text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.registrations enable row level security;

-- Policy: Anyone can insert (register)
create policy "Anyone can submit registration"
  on public.registrations
  for insert
  with check (true);

-- Policy: Only admins can view registrations
create policy "Only admins can view registrations"
  on public.registrations
  for select
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Policy: Only admins can delete registrations
create policy "Only admins can delete registrations"
  on public.registrations
  for delete
  using (
    public.has_role(auth.uid(), 'admin'::app_role)
  );
