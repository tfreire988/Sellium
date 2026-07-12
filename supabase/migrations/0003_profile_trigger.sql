-- Sellium — auto-create a profile row when a user signs up.
--
-- The registro form passes nombre_empresa / nif / tipo_cuenta as auth user
-- metadata (options.data). This trigger copies them into public.profiles so the
-- profile always exists by the time the user reaches the app — no client-side
-- insert, no race with email confirmation.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre_empresa, nif, tipo_cuenta)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre_empresa', 'Mi empresa'),
    nullif(new.raw_user_meta_data ->> 'nif', ''),
    coalesce(new.raw_user_meta_data ->> 'tipo_cuenta', 'pyme')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
