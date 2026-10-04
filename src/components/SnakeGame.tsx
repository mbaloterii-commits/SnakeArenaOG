import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Player } from "@/hooks/useAuth";

const N = 18;
type P = { x: number; y: number };

function msLeft(last: string | null) {
  if (!last) return 0;
  return Math.max(0, 24 * 3600_000 - (Date.now() - new Date(last).getTime()));
}

function fmt(ms: number) {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    x = s % 60;
  return [h, m, x].map((v) => String(v).padStart(2, "0")).join(":");
}

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const PRESET_LIMITS = [25, 50, 100, 200];

export function SnakeGame({
  player,
  onChange,
  isDemo = false,
}: {
  player: Player;
  onChange: () => void;
  isDemo?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef(player);
  playerRef.current = player;
  const st = useRef({
    snake: [] as P[],
    dir: { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: null as P | null,
    gold: null as P | null,
    obstacles: [] as P[],
    score: 0,
    boostUntil: 0,
    running: false,
    session: null as string | null,
    timer: 0 as unknown as ReturnType<typeof setTimeout>,
    lives: 0,
    cashOutLimit: 50,
  });

  const [score, setScore] = useState(0);
  const [demoBest, setDemoBest] = useState(0);
  const [demoBanked, setDemoBanked] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Zbieraj punkty i wypłać zanim się rozbijesz!");
  const [now, setNow] = useState(Date.now());
  const [lives, setLives] = useState(player.lives);

  // Ustawienie limitu auto-wypłaty (0 = manualnie / bez limitu)
  const [cashOutLimit, setCashOutLimit] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("snake_cashout_limit");
      if (saved !== null) {
        const val = parseInt(saved, 10);
        return isNaN(val) ? 50 : val;
      }
    }
    return 50;
  });

  useEffect(() => {
    st.current.cashOutLimit = cashOutLimit;
    if (typeof window !== "undefined") {
      localStorage.setItem("snake_cashout_limit", String(cashOutLimit));
    }
  }, [cashOutLimit]);

  useEffect(() => {
    if (!st.current.running) {
      setLives(player.lives);
      st.current.lives = player.lives;
    }
  }, [player.lives]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const cell = c.width / N;
    const s = st.current;
    ctx.fillStyle = cssVar("--card");
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = cssVar("--border");
    ctx.lineWidth = 1;
    for (let i = 1; i < N; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, c.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(c.width, i * cell);
      ctx.stroke();
    }
    ctx.fillStyle = cssVar("--heart");
    s.obstacles.forEach((o) => {
      ctx.beginPath();
      ctx.roundRect(o.x * cell + 3, o.y * cell + 3, cell - 6, cell - 6, 5);
      ctx.fill();
    });
    const dot = (p: P, r: number, col: string) => {
      ctx.shadowColor = col;
      ctx.shadowBlur = 14;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x * cell + cell / 2, p.y * cell + cell / 2, cell * r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };
    if (s.food) dot(s.food, 0.3, cssVar("--accent"));
    if (s.gold) dot(s.gold, 0.42, cssVar("--gold"));
    const prim = cssVar("--primary");
    const pCurrent = playerRef.current;
    const isGoldSnake = Boolean(
      pCurrent?.is_vip ||
      pCurrent?.gold_snake ||
      (typeof window !== "undefined" &&
        pCurrent &&
        (localStorage.getItem(`snake_gold_skin_${pCurrent.user_id}`) === "true" ||
          localStorage.getItem(`snake_gold_skin_${pCurrent.nick}`) === "true")),
    );

    s.snake.forEach((p, i) => {
      if (isGoldSnake) {
        // Złoty Wąż: lśniące złoto z głębokim złotym blaskiem
        ctx.fillStyle = i === 0 ? "#FFF275" : i % 2 === 0 ? "#FFD700" : "#E5A800";
        ctx.shadowColor = "#FFB700";
        ctx.shadowBlur = i === 0 ? 22 : 10;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.65, 1 - i * 0.02);
      } else {
        ctx.fillStyle = prim;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.45, 1 - i * 0.03);
        if (i === 0) {
          ctx.shadowColor = prim;
          ctx.shadowBlur = 16;
        }
      }

      ctx.beginPath();
      ctx.roundRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Złoty wąż: korona / błysk diamentu na głowie
      if (isGoldSnake && i === 0) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(p.x * cell + cell / 2, p.y * cell + cell / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }, []);

  const empty = (): P => {
    const s = st.current;
    for (let t = 0; t < 500; t++) {
      const p = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
      const hit = (q: P | null) => q && q.x === p.x && q.y === p.y;
      if (!s.snake.some(hit) && !s.obstacles.some(hit) && !hit(s.food) && !hit(s.gold)) return p;
    }
    return { x: 1, y: 1 };
  };

  // Bezpieczna wypłata punktów (Cash-Out) — gracz zabezpiecza punkty!
  const cashOut = useCallback(
    async (isAuto = false) => {
      const s = st.current;
      if (!s.running && s.score === 0) return;
      s.running = false;
      setRunning(false);
      clearTimeout(s.timer);
      const bankedScore = s.score;

      if (isDemo) {
        setDemoBest((prev) => Math.max(prev, bankedScore));
        setDemoBanked((prev) => prev + bankedScore);
        const msg = isAuto
          ? `🎯 AUTO-WYPŁATA! Osiągnięto limit ${bankedScore} pkt. Punkty bezpiecznie dopisane (Demo)!`
          : `💰 WYPŁACONO! Bezpiecznie zabrano ${bankedScore} pkt do bilansu (Demo)!`;
        setStatus(msg);
        toast.success(msg);
        s.session = null;
      } else {
        if (s.session) {
          const { error } = await supabase.rpc("finish_game", {
            p_session: s.session,
            p_score: bankedScore,
          });
          if (error) {
            setStatus(error.message);
            toast.error(error.message);
          } else {
            const msg = isAuto
              ? `🎯 AUTO-WYPŁATA! Osiągnięto limit ${bankedScore} pkt. Twoje punkty są bezpieczne!`
              : `💰 WYPŁACONO! Bezpiecznie zabezpieczyłeś ${bankedScore} pkt na swoim koncie!`;
            setStatus(msg);
            toast.success(msg);
          }
          s.session = null;
        }
      }
      onChange();
    },
    [isDemo, onChange],
  );

  // Zderzenie / śmierć węża — gracz traci niewypłacone punkty z tej gry!
  const onCrashLoss = useCallback(async () => {
    const s = st.current;
    s.running = false;
    setRunning(false);
    clearTimeout(s.timer);
    const lostPoints = s.score;

    if (isDemo) {
      const msg =
        lostPoints > 0
          ? `💥 KRAKSA! Rozbiłeś się i straciłeś ${lostPoints} pkt z tej gry! Wypłacaj wcześniej.`
          : `💥 KRAKSA! Rozbiłeś się! Spróbuj ponownie.`;
      setStatus(msg);
      if (lostPoints > 0) {
        toast.error(`💥 Kraksa! Straciłeś ${lostPoints} nie-wypłaconych punktów!`);
      }
      s.session = null;
    } else {
      if (s.session) {
        // Zapisujemy wynik 0 pkt, ponieważ gracz się rozbił i nie wypłacił na czas!
        const { error } = await supabase.rpc("finish_game", {
          p_session: s.session,
          p_score: 0,
        });
        if (error) {
          setStatus(error.message);
        } else {
          const msg =
            lostPoints > 0
              ? `💥 KRAKSA! Rozbiłeś się i straciłeś ${lostPoints} pkt! Punkty przepadły, bo nie wypłaciłeś na czas.`
              : `💥 KRAKSA! Rozbiłeś się! Następnym razem graj ostrożniej.`;
          setStatus(msg);
          if (lostPoints > 0) {
            toast.error(`💥 Kraksa! Straciłeś ${lostPoints} punktów z tej gry!`);
          }
        }
        s.session = null;
      }
    }
    onChange();
  }, [isDemo, onChange]);

  const tick = useCallback(async () => {
    const s = st.current;
    if (!s.running) return;
    s.dir = s.next;
    const h0 = s.snake[0]!;
    const head = { x: h0.x + s.dir.x, y: h0.y + s.dir.y };
    const crash =
      head.x < 0 ||
      head.y < 0 ||
      head.x >= N ||
      head.y >= N ||
      s.snake.some((p) => p.x === head.x && p.y === head.y) ||
      (Date.now() > s.boostUntil && s.obstacles.some((p) => p.x === head.x && p.y === head.y));

    if (crash) {
      if (s.lives > 0 && s.session) {
        s.running = false;
        const { data } = await supabase.rpc("use_life", { p_session: s.session });
        if (data) {
          s.lives -= 1;
          setLives(s.lives);
          s.snake = [
            { x: 9, y: 9 },
            { x: 8, y: 9 },
            { x: 7, y: 9 },
          ];
          s.dir = s.next = { x: 1, y: 0 };
          s.obstacles = s.obstacles.filter((o) => o.y !== 9);
          setStatus("❤️ Użyto życia — grasz dalej! Punkty nadal w grze.");
          toast.info("❤️ Użyto dodatkowego życia!");
          draw();
          setTimeout(() => {
            s.running = true;
            tick();
          }, 1200);
          return;
        }
      }
      onCrashLoss();
      return;
    }

    s.snake.unshift(head);
    if (s.food && head.x === s.food.x && head.y === s.food.y) {
      s.score += 1;
      s.food = empty();
      if (s.score % 10 === 0 && !s.gold) s.gold = empty();
      if (s.score % 25 === 0) {
        s.boostUntil = Date.now() + 8000;
        setStatus("✨ Boost! Przeszkody nie działają przez 8 s");
      }
      if (s.score % 7 === 0) s.obstacles.push(empty());
    } else if (s.gold && head.x === s.gold.x && head.y === s.gold.y) {
      s.score += 3;
      s.gold = null;
      setStatus("🪙 Złoty punkt +3! Pamiętaj o wypłacie.");
    } else {
      s.snake.pop();
    }

    setScore(s.score);
    draw();

    // Sprawdzenie automatycznej wypłaty (Auto Cash-Out)
    if (s.cashOutLimit > 0 && s.score >= s.cashOutLimit) {
      cashOut(true);
      return;
    }

    s.timer = setTimeout(tick, Date.now() < s.boostUntil ? 75 : 110);
  }, [draw, onCrashLoss, cashOut]);

  async function start() {
    const s = st.current;
    if (isDemo) {
      s.session = null;
      s.lives = 0;
      s.snake = [
        { x: 9, y: 9 },
        { x: 8, y: 9 },
        { x: 7, y: 9 },
      ];
      s.dir = s.next = { x: 1, y: 0 };
      s.score = 0;
      s.boostUntil = 0;
      s.gold = null;
      s.food = null;
      s.obstacles = [];
      for (let i = 0; i < 3; i++) s.obstacles.push(empty());
      s.food = empty();
      setScore(0);
      setStatus("Grasz w Demo 🐍 Zbieraj punkty i kliknij WYPŁAĆ!");
      s.running = true;
      setRunning(true);
      onChange();
      draw();
      tick();
      return;
    }

    const { data, error } = await supabase.rpc("start_game");
    if (error) {
      setStatus(error.message);
      toast.error(error.message);
      return;
    }
    s.session = data as string;
    s.lives = player.lives;
    s.snake = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ];
    s.dir = s.next = { x: 1, y: 0 };
    s.score = 0;
    s.boostUntil = 0;
    s.gold = null;
    s.food = null;
    s.obstacles = [];
    for (let i = 0; i < 3; i++) s.obstacles.push(empty());
    s.food = empty();
    setScore(0);
    setStatus("Powodzenia! Zbieraj punkty i wypłać zanim się rozbijesz! 🐍");
    s.running = true;
    setRunning(true);
    onChange();
    draw();
    tick();
  }

  const setDir = (x: number, y: number) => {
    const s = st.current;
    if (!s.running) return;
    if (x === -s.dir.x && y === -s.dir.y) return;
    s.next = { x, y };
  };

  useEffect(() => {
    draw();
    const onKey = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0],
        W: [0, -1],
        S: [0, 1],
        A: [-1, 0],
        D: [1, 0],
      };
      const v = m[e.key];
      if (v) {
        e.preventDefault();
        setDir(...v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(st.current.timer);
    };
  }, [draw]);

  const touch = useRef<{ x: number; y: number } | null>(null);
  const left = isDemo ? 0 : msLeft(player.last_game_at);
  void now;
  const canPlay = isDemo ? !running : !running && (left === 0 || player.extra_games > 0);

  return (
    <section className="panel p-4 sm:p-5 space-y-4">
      {isDemo && (
        <div className="rounded-xl border border-accent/40 bg-accent/15 px-4 py-2 text-center text-xs sm:text-sm font-semibold text-accent">
          Gra w trybie Demo — testuj mechanikę ryzyka i wypłaty!
        </div>
      )}

      {!isDemo && (player.is_vip || player.gold_snake) && (
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-500/40 px-3.5 py-2 text-xs text-amber-300 shadow-[0_0_15px_oklch(0.85_0.2_85/15%)]">
          <span className="flex items-center gap-2 font-bold">
            <span className="text-base">👑</span>
            <span>Ranga VIP: Złoty Wąż aktywny!</span>
          </span>
          <span className="text-[11px] font-medium text-amber-200/90 hidden sm:inline">
            Twój wąż lśni złotem na arenie ✨
          </span>
        </div>
      )}

      {/* Górny panel statystyk gry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="rounded-xl bg-secondary/80 border border-primary/30 py-2 px-2 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Do wypłacenia
          </div>
          <div
            className={`font-display text-2xl text-primary transition-transform ${score > 0 ? "scale-105 text-glow animate-pulse" : ""}`}
          >
            {score} pkt
          </div>
          {running && score > 0 && (
            <span className="text-[10px] text-amber-400 font-medium">⚠️ Ryzykujesz!</span>
          )}
        </div>

        <Stat
          label="Auto-wypłata"
          value={cashOutLimit > 0 ? `${cashOutLimit} pkt` : "Ręczna"}
          cls="text-accent"
        />

        <Stat
          label={isDemo ? "Rekord Demo" : "Rekord"}
          value={isDemo ? demoBest : player.best_score}
          cls="text-gold"
        />

        <Stat
          label={isDemo ? "Wypłacone Demo" : "Życia"}
          value={isDemo ? `${demoBanked} pkt` : `❤️ ${lives}`}
          cls={isDemo ? "text-primary" : "text-heart"}
        />
      </div>

      {/* Panel ustawień limitu wypłaty po boku / nad areną */}
      <div className="rounded-xl border border-border bg-secondary/40 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span>🎯</span>
            <span>Limit auto-wypłaty (Cash-Out):</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {cashOutLimit > 0 ? (
              <span className="text-primary font-mono font-bold">
                Wypłaci przy: {cashOutLimit} pkt
              </span>
            ) : (
              <span className="text-amber-400 font-medium">Tylko ręczny przycisk</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 flex-1 min-w-[140px]">
            <Input
              type="number"
              min={0}
              max={10000}
              step={5}
              value={cashOutLimit === 0 ? "" : cashOutLimit}
              placeholder="Wpisz limit..."
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCashOutLimit(isNaN(val) || val < 0 ? 0 : val);
              }}
              className="h-8 text-xs font-mono bg-card"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">pkt</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {PRESET_LIMITS.map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => setCashOutLimit(limit)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  cashOutLimit === limit
                    ? "bg-primary text-primary-foreground font-bold border-primary shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border-border"
                }`}
              >
                {limit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCashOutLimit(0)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                cashOutLimit === 0
                  ? "bg-amber-500/20 text-amber-300 font-bold border-amber-500/50"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border-border"
              }`}
            >
              Wyłącz
            </button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          💡 <strong>Zasada ryzyka:</strong> Jeśli wąż zginie przed wypłatą, tracisz punkty z tej
          rundy! Wypłać ręcznie lub ustaw limit.
        </p>
      </div>

      {/* Plansza gry */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={432}
          height={432}
          className="w-full aspect-square rounded-xl border border-border touch-none glow shadow-lg"
          onTouchStart={(e) => {
            const t = e.touches[0]!;
            touch.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const t = e.changedTouches[0]!;
            const dx = t.clientX - touch.current.x,
              dy = t.clientY - touch.current.y;
            if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) {
              if (Math.abs(dx) > Math.abs(dy)) {
                setDir(Math.sign(dx), 0);
              } else {
                setDir(0, Math.sign(dy));
              }
            }
            touch.current = null;
          }}
        />

        {/* Nakładka w trakcie gry z licznikiem punktów do wypłaty */}
        {running && (
          <div className="absolute top-2.5 right-2.5 pointer-events-none">
            <div className="rounded-lg bg-card/90 backdrop-blur-md border border-primary/50 px-3 py-1.5 shadow-md flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-muted-foreground">W grze:</span>
              <span className="font-display text-sm text-primary">{score} pkt</span>
            </div>
          </div>
        )}
      </div>

      {/* Komunikat o stanie gry */}
      <p className="text-center text-xs sm:text-sm text-muted-foreground min-h-5 px-2">{status}</p>

      {/* Duży przycisk akcji: WYPŁAĆ PUNKTY (gdy gra trwa) lub START (gdy gra nie trwa) */}
      {running ? (
        <div className="space-y-2">
          <Button
            variant="default"
            className="w-full h-14 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-display text-lg tracking-wide shadow-lg border-2 border-emerald-300/50 animate-pulse transition-all"
            disabled={score === 0}
            onClick={() => cashOut(false)}
          >
            💰 WYPŁAĆ TERAZ (+{score} PKT)
          </Button>
          <div className="text-center text-[11px] text-amber-400 font-semibold">
            {score === 0
              ? "Zbierz pierwsze jedzenie, aby móc wypłacić!"
              : "Kliknij, aby zabezpieczyć punkty przed rozbiciem!"}
          </div>
        </div>
      ) : (
        <Button
          variant="hero"
          className="w-full h-14 font-display text-base"
          disabled={!canPlay}
          onClick={start}
        >
          {isDemo
            ? score > 0
              ? "ZAGRAJ PONOWNIE (DEMO)"
              : "ZAGRAJ W DEMO (BEZ LIMITU)"
            : left === 0
              ? "ZAGRAJ"
              : player.extra_games > 0
                ? `ZAGRAJ (dodatkowa gra · ${player.extra_games})`
                : `KOLEJNA GRA ZA ${fmt(left)}`}
        </Button>
      )}

      {/* Strzałki do grania (D-pad) — Dostępne w trybie Demo ORAZ po zalogowaniu */}
      <div className="pt-2 pb-1 space-y-2">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Sterowanie strzałkami (D-Pad)
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1.5 max-w-[200px] mx-auto select-none">
          {/* Strzałka w górę */}
          <div className="flex justify-center w-full">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setDir(0, -1);
              }}
              className="w-14 h-12 rounded-xl bg-secondary/90 hover:bg-primary/20 active:bg-primary active:text-primary-foreground border-2 border-border active:border-primary flex flex-col items-center justify-center shadow-md transition-all touch-manipulation active:scale-95 group"
              aria-label="W górę"
            >
              <span className="text-base text-primary group-active:text-primary-foreground font-bold">
                ▲
              </span>
              <span className="text-[9px] text-muted-foreground/80 group-active:text-primary-foreground font-mono">
                W
              </span>
            </button>
          </div>

          {/* Strzałki w lewo, dół, prawo */}
          <div className="flex items-center justify-center gap-1.5 w-full">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setDir(-1, 0);
              }}
              className="w-14 h-12 rounded-xl bg-secondary/90 hover:bg-primary/20 active:bg-primary active:text-primary-foreground border-2 border-border active:border-primary flex flex-col items-center justify-center shadow-md transition-all touch-manipulation active:scale-95 group"
              aria-label="W lewo"
            >
              <span className="text-base text-primary group-active:text-primary-foreground font-bold">
                ◀
              </span>
              <span className="text-[9px] text-muted-foreground/80 group-active:text-primary-foreground font-mono">
                A
              </span>
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setDir(0, 1);
              }}
              className="w-14 h-12 rounded-xl bg-secondary/90 hover:bg-primary/20 active:bg-primary active:text-primary-foreground border-2 border-border active:border-primary flex flex-col items-center justify-center shadow-md transition-all touch-manipulation active:scale-95 group"
              aria-label="W dół"
            >
              <span className="text-base text-primary group-active:text-primary-foreground font-bold">
                ▼
              </span>
              <span className="text-[9px] text-muted-foreground/80 group-active:text-primary-foreground font-mono">
                S
              </span>
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setDir(1, 0);
              }}
              className="w-14 h-12 rounded-xl bg-secondary/90 hover:bg-primary/20 active:bg-primary active:text-primary-foreground border-2 border-border active:border-primary flex flex-col items-center justify-center shadow-md transition-all touch-manipulation active:scale-95 group"
              aria-label="W prawo"
            >
              <span className="text-base text-primary group-active:text-primary-foreground font-bold">
                ▶
              </span>
              <span className="text-[9px] text-muted-foreground/80 group-active:text-primary-foreground font-mono">
                D
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Klawiatura: strzałki / WASD · Ekran dotykowy: przyciski D-Pad lub przesuwanie palcem
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value, cls }: { label: string; value: React.ReactNode; cls: string }) {
  return (
    <div className="rounded-xl bg-secondary/70 border border-border/60 py-2 px-1">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-display text-lg sm:text-xl ${cls}`}>{value}</div>
    </div>
  );
}
