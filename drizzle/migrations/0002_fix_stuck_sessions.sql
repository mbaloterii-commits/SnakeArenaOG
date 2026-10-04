-- Naprawa błędu "Masz już rozpoczętą grę" po odświeżeniu strony
-- Uruchom ten skrypt w Supabase SQL Editor: https://supabase.com/dashboard/project/njipuvamnsvknjyhfpnx/sql/new

create or replace function public.start_game()
returns uuid language plpgsql security definer set search_path=public as $$
declare
  p public.players;
  k text;
  sid uuid;
  existing_sid uuid;
begin
  select * into p from public.players where user_id=auth.uid() for update;
  if not found then raise exception 'Brak konta gracza'; end if;

  -- 1. Sprawdź, czy gracz ma już aktywną sesję (np. po odświeżeniu strony)
  select id into existing_sid
  from public.game_sessions
  where user_id = p.user_id and finished_at is null and started_at > now() - interval '30 minutes'
  order by started_at desc limit 1;

  if existing_sid is not null then
    -- Zamiast rzucać błąd i blokować gracza, zwracamy tę sesję, aby mógł grać!
    return existing_sid;
  end if;

  -- 2. Sprawdź limit 24h (darmowa gra codzienna) lub dodatkowe gry (extra_games)
  if p.last_game_at is null or p.last_game_at <= now() - interval '24 hours' then
    update public.players set last_game_at = now() where user_id = p.user_id;
    k := 'daily';
  elsif p.extra_games > 0 then
    update public.players set extra_games = extra_games - 1 where user_id = p.user_id;
    k := 'extra';
  else
    raise exception 'Kolejna gra dostępna po upływie 24 godzin';
  end if;

  insert into public.game_sessions(user_id, kind) values (p.user_id, k) returning id into sid;
  return sid;
end $$;

-- Funkcja do odblokowania zawieszonej sesji gracza
create or replace function public.reset_stuck_session()
returns void language plpgsql security definer set search_path=public as $$
begin
  update public.game_sessions
    set finished_at = now(), score = coalesce(score, 0)
    where user_id = auth.uid() and finished_at is null;
end $$;

grant execute on function public.reset_stuck_session() to authenticated;
grant execute on function public.start_game() to authenticated;
notify pgrst, 'reload schema';
