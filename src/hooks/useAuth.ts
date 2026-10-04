import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Player = {
  user_id: string;
  nick: string;
  points: number;
  best_score: number;
  last_game_at: string | null;
  extra_games: number;
  lives: number;
  games_played: number;
  is_vip?: boolean;
  gold_snake?: boolean;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  const load = useCallback(async (u: User | null) => {
    setUser(u);
    if (!u) {
      setPlayer(null);
      setIsAdmin(false);
      setReady(true);
      return;
    }
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from("players").select("*").eq("user_id", u.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", u.id),
    ]);
    const emailLow = u.email?.toLowerCase() ?? "";
    const nickLow = (p as Player | null)?.nick?.toLowerCase() ?? "";
    const isOwnerAdmin =
      emailLow === "mbaloterii@gmail.com" ||
      emailLow.startsWith("mbaloterii@") ||
      nickLow === "mbaloterii";

    // Wykrywanie Złotego Węża / rangi VIP (z kolumn w bazie, z metadanych lub localStorage)
    const localGold =
      typeof window !== "undefined" &&
      (localStorage.getItem(`snake_gold_skin_${u.id}`) === "true" ||
        (nickLow ? localStorage.getItem(`snake_gold_skin_${nickLow}`) === "true" : false));
    const metaGold = Boolean(u.user_metadata?.is_vip || u.user_metadata?.gold_snake);
    const dbGold = Boolean(
      (p as (Player & { is_vip?: boolean; gold_snake?: boolean }) | null)?.is_vip ||
      (p as (Player & { is_vip?: boolean; gold_snake?: boolean }) | null)?.gold_snake,
    );
    const hasGoldSkin = Boolean(localGold || metaGold || dbGold || isOwnerAdmin);

    const fullPlayer: Player | null = p
      ? {
          ...(p as Player),
          is_vip: hasGoldSkin,
          gold_snake: hasGoldSkin,
        }
      : null;

    setPlayer(fullPlayer);
    setIsAdmin(isOwnerAdmin || !!roles?.some((r) => r.role === "admin"));
    setReady(true);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setTimeout(() => load(session?.user ?? null), 0);
      }
    });
    supabase.auth.getUser().then(({ data }) => load(data.user));
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const refresh = useCallback(() => load(user), [load, user]);
  return { user, player, isAdmin, ready, refresh };
}
