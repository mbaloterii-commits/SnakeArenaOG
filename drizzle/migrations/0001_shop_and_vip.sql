-- Migracja: Złoty Wąż, Ranga VIP oraz bezpieczna wymiana punktów w sklepie
-- Uruchom ten skrypt w Supabase SQL Editor: https://supabase.com/dashboard/project/njipuvamnsvknjyhfpnx/sql/new

-- 1. Dodaj kolumny dla rangi VIP i skórki Złoty Wąż do tabeli graczy
alter table public.players add column if not exists is_vip boolean not null default false;
alter table public.players add column if not exists gold_snake boolean not null default false;

-- 2. Funkcja do bezpiecznej wymiany punktów w sklepie dla zalogowanego gracza
create or replace function public.buy_shop_item(p_item text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  p public.players;
  v_cost integer;
begin
  -- Pobierz gracza i zablokuj rekord do aktualizacji
  select * into p from public.players where user_id = auth.uid() for update;
  if not found then
    raise exception 'Brak konta gracza';
  end if;

  -- 1) Dodatkowe Życie (100 pkt)
  if p_item = 'extra-life' then
    v_cost := 100;
    if p.points < v_cost then
      raise exception 'Brakuje Ci % punktów na zakup życia', (v_cost - p.points);
    end if;
    update public.players
      set points = points - v_cost,
          lives = lives + 1
      where user_id = p.user_id;
    return jsonb_build_object(
      'success', true,
      'item', p_item,
      'cost', v_cost,
      'new_points', p.points - v_cost,
      'lives', p.lives + 1
    );

  -- 2) Dodatkowa Gra w Arenie (160 pkt)
  elsif p_item = 'extra-game' then
    v_cost := 160;
    if p.points < v_cost then
      raise exception 'Brakuje Ci % punktów na zakup gry', (v_cost - p.points);
    end if;
    update public.players
      set points = points - v_cost,
          extra_games = extra_games + 1
      where user_id = p.user_id;
    return jsonb_build_object(
      'success', true,
      'item', p_item,
      'cost', v_cost,
      'new_points', p.points - v_cost,
      'extra_games', p.extra_games + 1
    );

  -- 3) Złoty Wąż & Ranga VIP (300 pkt)
  elsif p_item = 'vip-skin' then
    v_cost := 300;
    if p.points < v_cost then
      raise exception 'Brakuje Ci % punktów na zakup Złotego Węża & rangi VIP', (v_cost - p.points);
    end if;
    update public.players
      set points = points - v_cost,
          is_vip = true,
          gold_snake = true
      where user_id = p.user_id;
    return jsonb_build_object(
      'success', true,
      'item', p_item,
      'cost', v_cost,
      'new_points', p.points - v_cost,
      'is_vip', true
    );

  -- 4) Paysafecard 20 PLN (400 pkt)
  elsif p_item = 'psc-20' then
    v_cost := 400;
    if p.points < v_cost then
      raise exception 'Brakuje Ci % punktów na Paysafecard 20 PLN', (v_cost - p.points);
    end if;
    update public.players
      set points = points - v_cost
      where user_id = p.user_id;
    return jsonb_build_object(
      'success', true,
      'item', p_item,
      'cost', v_cost,
      'new_points', p.points - v_cost
    );

  -- 5) Paysafecard 50 PLN (900 pkt)
  elsif p_item = 'psc-50' then
    v_cost := 900;
    if p.points < v_cost then
      raise exception 'Brakuje Ci % punktów na Paysafecard 50 PLN', (v_cost - p.points);
    end if;
    update public.players
      set points = points - v_cost
      where user_id = p.user_id;
    return jsonb_build_object(
      'success', true,
      'item', p_item,
      'cost', v_cost,
      'new_points', p.points - v_cost
    );

  -- 6) Paysafecard 100 PLN (1800 pkt)
  elsif p_item = 'psc-100' then
    v_cost := 1800;
    if p.points < v_cost then
      raise exception 'Brakuje Ci % punktów na Paysafecard 100 PLN', (v_cost - p.points);
    end if;
    update public.players
      set points = points - v_cost
      where user_id = p.user_id;
    return jsonb_build_object(
      'success', true,
      'item', p_item,
      'cost', v_cost,
      'new_points', p.points - v_cost
    );

  else
    raise exception 'Nieznany przedmiot ze sklepu: %', p_item;
  end if;
end $$;

-- 3. Nadanie uprawnień do zakupu w sklepie dla zalogowanych graczy
grant execute on function public.buy_shop_item(text) to authenticated;

-- 4. Odświeżenie schematu PostgREST
notify pgrst, 'reload schema';
