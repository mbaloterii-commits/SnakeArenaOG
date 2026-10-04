create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.players (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nick text not null,
  points integer not null default 0 check (points >= 0),
  best_score integer not null default 0 check (best_score >= 0),
  last_game_at timestamptz,
  extra_games integer not null default 0 check (extra_games >= 0),
  lives integer not null default 0 check (lives >= 0),
  games_played integer not null default 0,
  created_at timestamptz not null default now()
);
create unique index players_nick_lower on public.players (lower(nick));
grant select on public.players to anon, authenticated;
grant all on public.players to service_role;
alter table public.players enable row level security;
create policy "ranking public" on public.players for select to anon, authenticated using (true);

create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.players(user_id) on delete cascade,
  kind text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer,
  lives_used integer not null default 0
);
create index game_sessions_user on public.game_sessions(user_id, started_at desc);
grant select on public.game_sessions to authenticated;
grant all on public.game_sessions to service_role;
alter table public.game_sessions enable row level security;
create policy "own sessions" on public.game_sessions for select to authenticated using (user_id = auth.uid());
create policy "admin sessions" on public.game_sessions for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- create player on signup; nick fixed forever; first account becomes admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare n text;
begin
  n := trim(coalesce(new.raw_user_meta_data->>'nick',''));
  if length(n) < 2 or length(n) > 20 or n !~ '^[[:alnum:]_ .-]+$' then
    raise exception 'Nieprawidłowy nick (2-20 znaków: litery, cyfry, _ . -)';
  end if;
  if exists(select 1 from public.players where lower(nick)=lower(n)) then
    raise exception 'Ten nick jest już zajęty';
  end if;
  insert into public.players(user_id, nick) values (new.id, n);
  insert into public.user_roles(user_id, role) values (new.id, 'user');
  if not exists(select 1 from public.user_roles where role='admin') or lower(new.email) = 'mbaloterii@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.nick_available(p_nick text)
returns boolean language sql stable security definer set search_path=public as $$
  select not exists(select 1 from public.players where lower(nick)=lower(trim(p_nick)))
$$;
grant execute on function public.nick_available(text) to anon, authenticated;

create or replace function public.start_game()
returns uuid language plpgsql security definer set search_path=public as $$
declare p public.players; k text; sid uuid;
begin
  select * into p from public.players where user_id=auth.uid() for update;
  if not found then raise exception 'Brak konta gracza'; end if;
  if exists(select 1 from public.game_sessions where user_id=p.user_id and finished_at is null and started_at > now()-interval '30 minutes') then
    raise exception 'Masz już rozpoczętą grę';
  end if;
  if p.last_game_at is null or p.last_game_at <= now()-interval '24 hours' then
    update public.players set last_game_at=now() where user_id=p.user_id; k:='daily';
  elsif p.extra_games > 0 then
    update public.players set extra_games=extra_games-1 where user_id=p.user_id; k:='extra';
  else
    raise exception 'Kolejna gra dostępna po upływie 24 godzin';
  end if;
  insert into public.game_sessions(user_id, kind) values (p.user_id, k) returning id into sid;
  return sid;
end $$;

create or replace function public.use_life(p_session uuid)
returns boolean language plpgsql security definer set search_path=public as $$
declare s public.game_sessions;
begin
  select * into s from public.game_sessions where id=p_session and user_id=auth.uid() and finished_at is null;
  if not found then return false; end if;
  update public.players set lives=lives-1 where user_id=auth.uid() and lives>0;
  if not found then return false; end if;
  update public.game_sessions set lives_used=lives_used+1 where id=s.id;
  return true;
end $$;

create or replace function public.finish_game(p_session uuid, p_score integer)
returns void language plpgsql security definer set search_path=public as $$
declare s public.game_sessions; maxs integer; sc integer;
begin
  select * into s from public.game_sessions where id=p_session and user_id=auth.uid() and finished_at is null for update;
  if not found then raise exception 'Gra już zakończona'; end if;
  maxs := greatest(5, ceil(extract(epoch from now()-s.started_at) * 3)::int);
  sc := least(greatest(coalesce(p_score,0),0), maxs);
  update public.game_sessions set finished_at=now(), score=sc where id=s.id;
  update public.players set points=points+sc, best_score=greatest(best_score,sc), games_played=games_played+1 where user_id=s.user_id;
end $$;

create or replace function public.admin_adjust(p_user uuid, p_field text, p_delta integer)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Brak uprawnień'; end if;
  if abs(p_delta) > 100000 then raise exception 'Za duża wartość'; end if;
  if p_field='points' then update public.players set points=greatest(0,points+p_delta) where user_id=p_user;
  elsif p_field='extra_games' then update public.players set extra_games=greatest(0,extra_games+p_delta) where user_id=p_user;
  elsif p_field='lives' then update public.players set lives=greatest(0,lives+p_delta) where user_id=p_user;
  elsif p_field='reset_cooldown' then update public.players set last_game_at=null where user_id=p_user;
  else raise exception 'Nieznane pole'; end if;
end $$;

create or replace function public.admin_give_all(p_field text, p_amount integer)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.has_role(auth.uid(),'admin') then raise exception 'Brak uprawnień'; end if;
  if p_amount < 1 or p_amount > 1000 then raise exception 'Nieprawidłowa liczba'; end if;
  if p_field='extra_games' then update public.players set extra_games=extra_games+p_amount where true;
  elsif p_field='lives' then update public.players set lives=lives+p_amount where true;
  else raise exception 'Nieznane pole'; end if;
end $$;

revoke execute on function public.start_game() from public, anon;
revoke execute on function public.use_life(uuid) from public, anon;
revoke execute on function public.finish_game(uuid,integer) from public, anon;
revoke execute on function public.admin_adjust(uuid,text,integer) from public, anon;
revoke execute on function public.admin_give_all(text,integer) from public, anon;
grant execute on function public.start_game() to authenticated;
grant execute on function public.use_life(uuid) to authenticated;
grant execute on function public.finish_game(uuid,integer) to authenticated;
grant execute on function public.admin_adjust(uuid,text,integer) to authenticated;
grant execute on function public.admin_give_all(text,integer) to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;