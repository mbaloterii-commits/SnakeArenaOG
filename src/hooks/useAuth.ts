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
    const isOwnerAdmin =
      emailLow === "mbaloterii@gmail.com" ||
      emailLow.startsWith("mbaloterii@") ||
      (p as Player | null)?.nick?.toLowerCase() === "mbaloterii";
    setPlayer(p as Player | null);
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
