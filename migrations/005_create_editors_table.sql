create table if not exists editors (
  email text primary key,
  created_at timestamptz default now()
);

-- Allow admins to manage editors
create policy "Admins can manage editors"
  on editors
  for all
  using (auth.uid() in (select id from auth.users where email = current_setting('request.jwt.claim.email', true)))
  with check (auth.uid() in (select id from auth.users where email = current_setting('request.jwt.claim.email', true)));

-- Allow everyone to read editors (needed for validation)
create policy "Everyone can read editors"
  on editors
  for select
  using (true);

alter table editors enable row level security;
