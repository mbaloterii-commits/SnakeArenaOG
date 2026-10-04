import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Row = { nick: string; points: number; best_score: number };

export function Ranking({ refreshKey }: { refreshKey: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    supabase
      .from("players")
      .select("nick,points,best_score")
      .order("points", { ascending: false })
      .limit(20)
      .then(({ data }) => setRows(data ?? []));
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
          {rows.map((r, i) => (
            <li key={r.nick} className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2">
              <span
                className={`font-display w-8 text-center ${i < 3 ? "text-gold" : "text-muted-foreground"}`}
              >
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </span>
              <span className="flex-1 font-semibold truncate">{r.nick}</span>
              <span className="text-xs text-muted-foreground">rekord {r.best_score}</span>
              <span className="font-display text-primary">{r.points}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
