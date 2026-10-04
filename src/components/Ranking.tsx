import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  nick: string;
  points: number;
  best_score: number;
  is_vip?: boolean | null;
  gold_snake?: boolean | null;
  user_id?: string;
};

export function Ranking({ refreshKey }: { refreshKey: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    supabase
      .from("players")
      .select("nick,points,best_score,is_vip,gold_snake,user_id")
      .order("points", { ascending: false })
      .limit(20)
      .then(({ data }) => setRows((data as unknown as Row[]) ?? []));
  }, [refreshKey]);

  return (
    <section className="panel p-5">
      <h2 className="font-display text-xl mb-4">🏆 Ranking</h2>
      {!rows ? (
        <p className="text-muted-foreground">Ładowanie…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">Brak wyników — bądź pierwszy!</p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r, i) => {
            const isVip = Boolean(
              r.is_vip ||
              r.gold_snake ||
              r.nick?.toLowerCase() === "mbaloterii" ||
              (typeof window !== "undefined" &&
                ((r.user_id && localStorage.getItem(`snake_gold_skin_${r.user_id}`) === "true") ||
                  (r.nick &&
                    localStorage.getItem(`snake_gold_skin_${r.nick.toLowerCase()}`) === "true"))),
            );

            return (
              <li
                key={r.nick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  isVip
                    ? "bg-secondary/90 border border-amber-500/30 shadow-[0_0_10px_oklch(0.85_0.2_85/10%)]"
                    : "bg-secondary"
                }`}
              >
                <span
                  className={`font-display w-8 text-center ${i < 3 ? "text-gold" : "text-muted-foreground"}`}
                >
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <span className="flex-1 font-semibold truncate flex items-center gap-1.5">
                  <span>{r.nick}</span>
                  {isVip && (
                    <span
                      title="Ranga VIP: Złoty Wąż"
                      className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40"
                    >
                      <span>👑</span>
                      <span className="hidden sm:inline">Złoty Wąż</span>
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">rekord {r.best_score}</span>
                <span className="font-display text-primary">{r.points}</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
