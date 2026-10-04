import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Player } from "@/hooks/useAuth";
import { toast } from "sonner";

type Session = {
  id: string;
  kind: string;
  started_at: string;
  finished_at: string | null;
  score: number | null;
  lives_used: number;
  players: { nick: string } | null;
};
type Field = "points" | "extra_games" | "lives" | "reset_cooldown";

export function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [q, setQ] = useState("");
  const [pointsStep, setPointsStep] = useState(10);

  const load = useCallback(async () => {
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("players").select("*").order("points", { ascending: false }),
      supabase
        .from("game_sessions")
        .select("id,kind,started_at,finished_at,score,lives_used,players(nick)")
        .order("started_at", { ascending: false })
        .limit(60),
    ]);
    setPlayers((p as Player[]) ?? []);
    setSessions((s as unknown as Session[]) ?? []);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function adjust(id: string, field: Field, delta: number) {
    const { error } = await supabase.rpc("admin_adjust", {
      p_user: id,
      p_field: field,
      p_delta: delta,
    });
    if (error) toast.error(error.message);
    else load();
  }
  async function giveAll(field: "extra_games" | "lives") {
    const { error } = await supabase.rpc("admin_give_all", { p_field: field, p_amount: 1 });
    if (error) toast.error(error.message);
    else {
      toast.success("Dodano wszystkim graczom");
      load();
    }
  }

  async function resetAllPoints() {
    if (!window.confirm("Czy na pewno chcesz wyzerować punkty WSZYSTKIM graczom?")) return;
    const playersWithPoints = players.filter((p) => p.points > 0);
    if (playersWithPoints.length === 0) {
      toast.info("Wszyscy gracze mają już 0 punktów.");
      return;
    }
    for (const p of playersWithPoints) {
      await supabase.rpc("admin_adjust", {
        p_user: p.user_id,
        p_field: "points",
        p_delta: -p.points,
      });
    }
    toast.success("Punkty wszystkich graczy zostały wyzerowane do 0!");
    load();
  }

  const filtered = useMemo(
    () => players.filter((p) => p.nick.toLowerCase().includes(q.trim().toLowerCase())),
    [players, q],
  );
  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" }) : "—";

  return (
    <div className="space-y-5">
      <section className="panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl">👑 Gracze ({players.length})</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="chipDanger" size="sm" onClick={resetAllPoints}>
              🔄 Zeruj punkty wszystkim
            </Button>
            <Button variant="chip" size="sm" onClick={() => giveAll("extra_games")}>
              +1 gra dla wszystkich
            </Button>
            <Button variant="chip" size="sm" onClick={() => giveAll("lives")}>
              +1 życie dla wszystkich
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Input placeholder="🔍 Szukaj nicku…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select
            className="rounded-md border border-input bg-secondary px-2 text-sm"
            value={pointsStep}
            onChange={(e) => setPointsStep(Number(e.target.value))}
            aria-label="Krok punktów"
          >
            {[1, 5, 10, 50, 100].map((v) => (
              <option key={v} value={v}>
                ±{v} pkt
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.user_id} className="rounded-xl bg-secondary p-3 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg">{p.nick}</span>
                <span className="text-xs text-muted-foreground">
                  rozegrane: {p.games_played} · rekord: {p.best_score} · ostatnia:{" "}
                  {fmtDate(p.last_game_at)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Ctl
                  label="Punkty"
                  value={p.points}
                  cls="text-primary"
                  onMinus={() => adjust(p.user_id, "points", -pointsStep)}
                  onPlus={() => adjust(p.user_id, "points", pointsStep)}
                />
                <Ctl
                  label="Dodatkowe gry"
                  value={p.extra_games}
                  cls="text-accent"
                  onMinus={() => adjust(p.user_id, "extra_games", -1)}
                  onPlus={() => adjust(p.user_id, "extra_games", 1)}
                />
                <Ctl
                  label="Życia"
                  value={p.lives}
                  cls="text-heart"
                  onMinus={() => adjust(p.user_id, "lives", -1)}
                  onPlus={() => adjust(p.user_id, "lives", 1)}
                />
                <Button
                  variant="chip"
                  className="h-full"
                  onClick={() => adjust(p.user_id, "reset_cooldown", 0)}
                >
                  ⏱ Zeruj 24h
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground text-sm">Brak graczy.</p>}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-xl mb-3">📜 Historia gier</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground text-xs uppercase">
              <tr>
                <th className="py-2">Gracz</th>
                <th>Start</th>
                <th>Rodzaj</th>
                <th>Życia</th>
                <th className="text-right">Wynik</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="py-2 font-semibold">{s.players?.nick ?? "?"}</td>
                  <td>{fmtDate(s.started_at)}</td>
                  <td>{s.kind === "daily" ? "dzienna" : "dodatkowa"}</td>
                  <td>{s.lives_used}</td>
                  <td className="text-right font-display text-primary">
                    {s.finished_at ? s.score : "w trakcie"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Ctl({
  label,
  value,
  cls,
  onMinus,
  onPlus,
}: {
  label: string;
  value: number;
  cls: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="rounded-lg bg-card p-2 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex items-center justify-between gap-1">
        <Button variant="chipDanger" size="sm" onClick={onMinus} aria-label={`Zabierz ${label}`}>
          −
        </Button>
        <span className={`font-display ${cls}`}>{value}</span>
        <Button variant="chip" size="sm" onClick={onPlus} aria-label={`Dodaj ${label}`}>
          +
        </Button>
      </div>
    </div>
  );
}
