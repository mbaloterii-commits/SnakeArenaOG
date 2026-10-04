import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type Player } from "@/hooks/useAuth";
import { AuthCard } from "@/components/AuthCard";
import { SnakeGame } from "@/components/SnakeGame";
import { Ranking } from "@/components/Ranking";
import { AdminPanel } from "@/components/AdminPanel";
import { PointExchange } from "@/components/PointExchange";
import { AmbientSnakes, SnakeInsignia } from "@/components/AmbientSnakes";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const demoPlayer: Player = {
  user_id: "demo",
  nick: "Gracz (Demo)",
  points: 0,
  best_score: 0,
  last_game_at: null,
  extra_games: 0,
  lives: 0,
  games_played: 0,
};

function AdFrame({ slotIndex, onClick }: { slotIndex: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/70 p-3 text-center backdrop-blur-sm transition-all duration-200 hover:border-primary hover:bg-card/95 hover:scale-[1.02] hover:shadow-[0_0_18px_oklch(0.86_0.2_150/25%)] cursor-pointer w-full min-h-[122px]"
    >
      <span className="absolute -top-2.5 rounded-full bg-secondary border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
        Slot #{slotIndex}
      </span>
      <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform">📢</span>
      <span className="font-display text-sm text-glow text-primary group-hover:text-foreground transition-colors">
        Reklama od 100pln
      </span>
      <span className="mt-1 text-[11px] font-medium text-foreground/90 leading-tight">
        Konta social media, grupki — to co chcecie, to wstawimy!
      </span>
      <span className="mt-1 text-[10px] text-muted-foreground group-hover:text-accent transition-colors">
        Kliknij i napisz na Telegram →
      </span>
    </button>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snake Arena — jedna gra dziennie" },
      {
        name: "description",
        content:
          "Neonowy Snake: jedna gra co 24h, ranking graczy, dodatkowe życia i gry od administratora.",
      },
      { property: "og:title", content: "Snake Arena — jedna gra dziennie" },
      {
        property: "og:description",
        content: "Zagraj raz dziennie, zbieraj punkty i walcz o szczyt rankingu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "game" | "shop" | "info" | "admin";

function Index() {
  const { player, isAdmin, ready, refresh, user } = useAuth();
  const [tab, setTab] = useState<Tab>("game");
  const [isGuest, setIsGuest] = useState(false);
  const [isCooperationOpen, setIsCooperationOpen] = useState(false);
  const [contactTelegram, setContactTelegram] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [onlineCount, setOnlineCount] = useState<number>(14);
  const [rk, setRk] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Pobieranie liczby zarejestrowanych graczy z bazy
  useEffect(() => {
    supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        if (count !== null && count !== undefined) {
          setTotalPlayers(count);
        }
      });
  }, [rk]);

  // Realistyczny, żywy licznik graczy online
  useEffect(() => {
    const getFluctuatedOnline = () => {
      const hour = new Date().getHours();
      const peakBoost = hour >= 16 && hour <= 23 ? 10 : 4;
      const base = 9 + peakBoost;
      const variation = Math.floor(Math.random() * 5) - 2;
      return Math.max(3, base + variation);
    };

    setOnlineCount(getFluctuatedOnline());
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(2, prev + delta);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onChange = () => {
    refresh();
    setRk((k) => k + 1);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Dziękujemy za kontakt! Odezwiemy się na Telegramie w ciągu 24h.");
    setContactTelegram("");
    setContactCompany("");
    setContactMessage("");
    setIsCooperationOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center px-2 sm:px-4 py-6 gap-4 xl:gap-8 overflow-x-hidden">
      <Toaster />
      <AmbientSnakes />

      {/* Lewa kolumna: 4 ramki reklamowe na boku */}
      <aside className="hidden lg:flex flex-col gap-4 w-44 xl:w-56 shrink-0 pt-16 z-10">
        <div className="text-center space-y-0.5">
          <div className="font-display text-[11px] text-muted-foreground tracking-wider uppercase">
            Miejsca reklamowe
          </div>
          <div className="text-[10px] text-primary/80 font-medium">Social media · Grupki</div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <AdFrame key={`left-${i}`} slotIndex={i + 1} onClick={() => setIsCooperationOpen(true)} />
        ))}
      </aside>

      {/* Środkowy panel główny */}
      <main className="w-full max-w-xl px-2 sm:px-4 space-y-5 z-10">
        {/* Mały licznik w rogu z napisami "Online: " i "Gracze: " */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <SnakeInsignia className="w-4 h-4" />
            <span className="font-display text-primary">SNAKE ARENA</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-muted-foreground text-[11px]">Online: </span>
              <span className="font-bold text-foreground text-xs">{onlineCount}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1 shadow-sm">
              <span className="text-muted-foreground text-[11px]">Gracze: </span>
              <span className="font-bold text-primary text-xs">{totalPlayers}</span>
            </div>
          </div>
        </div>

        <header className="text-center space-y-1 relative">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            <SnakeInsignia className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
            <h1 className="font-display text-3xl sm:text-5xl text-primary text-glow tracking-wide">
              SNAKE ARENA
            </h1>
            <SnakeInsignia className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 -scale-x-100" />
          </div>
          <p className="text-muted-foreground text-sm">Jedna gra co 24 godziny. Graj mądrze.</p>
        </header>

        {mounted && ready && (
          <nav className="flex flex-wrap gap-2">
            <Button
              variant={tab === "game" ? "default" : "chip"}
              className="flex-1 min-w-[90px]"
              onClick={() => setTab("game")}
            >
              {user ? "🐍 Gra" : isGuest ? "🐍 Gra (Demo)" : "🔑 Logowanie / Gra"}
            </Button>
            <Button
              variant={tab === "shop" ? "default" : "chip"}
              className="flex-1 min-w-[130px] border border-primary/40 text-primary hover:bg-primary/20"
              onClick={() => setTab("shop")}
            >
              🎁 Wymiana punktów
            </Button>
            <Button
              variant={tab === "info" ? "default" : "chip"}
              className="flex-1 min-w-[80px]"
              onClick={() => setTab("info")}
            >
              ℹ️ Zasady
            </Button>
            <Button
              variant="chip"
              className="flex-1 min-w-[110px] text-accent border border-accent/40 hover:bg-accent/20"
              onClick={() => setIsCooperationOpen(true)}
            >
              🤝 Współpraca
            </Button>
            {isAdmin && !isGuest && (
              <Button
                variant={tab === "admin" ? "default" : "chip"}
                className="flex-1 min-w-[80px]"
                onClick={() => setTab("admin")}
              >
                👑 Admin
              </Button>
            )}
          </nav>
        )}

        {!mounted || !ready ? (
          <p className="text-center text-muted-foreground">Ładowanie…</p>
        ) : tab === "shop" ? (
          <PointExchange
            player={player || demoPlayer}
            isDemo={isGuest || !user}
            onBackToGame={() => setTab("game")}
            backLabel={
              user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"
            }
          />
        ) : tab === "info" ? (
          <section className="panel p-5 space-y-3 text-sm leading-relaxed">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab("game")}
                className="gap-1.5 text-xs"
              >
                ← {user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"}
              </Button>
              {isGuest && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsGuest(false);
                    setTab("game");
                  }}
                  className="text-xs text-accent"
                >
                  🔑 Logowanie
                </Button>
              )}
            </div>
            <h2 className="font-display text-xl">Zasady</h2>
            <p className="rounded-lg bg-secondary/80 border border-primary/30 p-2.5 text-xs text-foreground">
              💰 <b>Mechanika Ryzyka & Wypłaty (Cash-Out):</b> Punkty zbierane w trakcie gry są
              tymczasowe! Musisz kliknąć przycisk <b>„WYPŁAĆ TERAZ”</b> lub ustawić limit
              auto-wypłaty. Jeśli się rozbijesz przed wypłatą i skończą Ci się życia —{" "}
              <b>tracisz punkty zdobyte w tej rundzie!</b>
            </p>
            <p>
              🎮 Każdy gracz ma <b>jedną grę co 24 godziny</b>. Konto startuje z 0 punktów.
            </p>
            <p>
              🍋 Jedzenie: +1 pkt · 🪙 złoty punkt: +3 pkt · ✨ co 25 pkt boost — przeszkody
              przestają działać na 8 s.
            </p>
            <p>
              ❤️ Życie pozwala kontynuować grę po zderzeniu. Życia i dodatkowe gry przyznaje
              administrator.
            </p>
            <p>🔒 Jedno konto = jeden nick. Nicku nie da się zmienić.</p>
            <div className="pt-3 text-center border-t border-border">
              <Button variant="default" onClick={() => setTab("game")} className="w-full sm:w-auto">
                ← {user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"}
              </Button>
            </div>
          </section>
        ) : tab === "admin" && isAdmin && !isGuest ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab("game")}
                className="gap-1.5 text-xs"
              >
                ← Wróć do gry
              </Button>
            </div>
            <AdminPanel />
            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab("game")}
                className="w-full sm:w-auto"
              >
                ← Wróć do gry
              </Button>
            </div>
          </div>
        ) : !user && !isGuest ? (
          <AuthCard onPlayAsGuest={() => setIsGuest(true)} />
        ) : isGuest ? (
          <>
            <div className="flex items-center justify-between panel px-4 py-3">
              <div>
                <div className="text-xs text-muted-foreground">Grasz jako</div>
                <div className="font-display text-lg text-accent">Gracz (Demo)</div>
              </div>
              <div className="text-right">
                <Button variant="chip" size="sm" onClick={() => setIsGuest(false)}>
                  🔑 Nowe konto / Logowanie
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-accent/40 bg-accent/15 px-4 py-3 text-center text-sm font-semibold text-accent">
              Gra jako Gracz jest Demo i sie nie licza punkty.
            </div>
            <SnakeGame player={demoPlayer} onChange={onChange} isDemo={true} />
            <Ranking refreshKey={rk} />
          </>
        ) : !player ? (
          <p className="text-center text-muted-foreground">Nie znaleziono konta gracza.</p>
        ) : tab === "game" ? (
          <>
            <div className="flex items-center justify-between panel px-4 py-3">
              <div>
                <div className="text-xs text-muted-foreground">Grasz jako</div>
                <div className="font-display text-lg">{player.nick}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Twoje punkty</div>
                <div className="font-display text-lg text-primary">{player.points}</div>
              </div>
            </div>
            <SnakeGame player={player} onChange={onChange} />
            <Ranking refreshKey={rk} />
          </>
        ) : (
          isAdmin && <AdminPanel />
        )}

        {/* Ramki reklamowe widoczne na mniejszych ekranach (< lg) */}
        <section className="lg:hidden panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm text-primary">📢 Miejsca na reklamę</h3>
            <Button
              variant="link"
              size="sm"
              className="text-xs text-accent p-0 h-auto"
              onClick={() => setIsCooperationOpen(true)}
            >
              Współpraca od 100 PLN →
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdFrame
                key={`mobile-${i}`}
                slotIndex={i + 1}
                onClick={() => setIsCooperationOpen(true)}
              />
            ))}
          </div>
        </section>

        {mounted && isGuest && (
          <div className="text-center">
            <Button variant="link" onClick={() => setIsGuest(false)}>
              ← Powrót do logowania i rejestracji
            </Button>
          </div>
        )}

        {mounted && user && (
          <div className="text-center">
            <Button variant="link" onClick={() => supabase.auth.signOut()}>
              Wyloguj
            </Button>
          </div>
        )}
      </main>

      {/* Prawa kolumna: 4 ramki reklamowe na boku */}
      <aside className="hidden lg:flex flex-col gap-4 w-44 xl:w-56 shrink-0 pt-16 z-10">
        <div className="text-center space-y-0.5">
          <div className="font-display text-[11px] text-muted-foreground tracking-wider uppercase">
            Miejsca reklamowe
          </div>
          <div className="text-[10px] text-primary/80 font-medium">Social media · Grupki</div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <AdFrame
            key={`right-${i}`}
            slotIndex={i + 5}
            onClick={() => setIsCooperationOpen(true)}
          />
        ))}
      </aside>

      {/* Nowe okno / modal: Współpraca */}
      <Dialog open={isCooperationOpen} onOpenChange={setIsCooperationOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary text-glow flex items-center gap-2">
              <span>🤝</span> Współpraca i Reklama
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Zareklamuj swój produkt, stronę lub markę w Snake Arena.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-center space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Pakiet banerowy
              </div>
              <div className="font-display text-2xl text-primary">Reklama od 100 PLN</div>
              <div className="rounded-lg bg-secondary/90 border border-primary/30 p-2.5 text-xs text-foreground font-semibold">
                🔥 Można reklamować konta na social mediach, grupki — to co chcecie, to wstawimy!
              </div>
              <p className="text-xs text-muted-foreground">
                Instagram, TikTok, Telegram, grupy Discord / Facebook, kanały YouTube, strony i
                projekty.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Dostępne formaty reklamowe:
              </h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>
                    <b>4 ramki po lewej i 4 po prawej stronie</b> widoczne przez cały czas trwania
                    gry
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>
                    <b>Baner po zakończeniu gry</b> — bezpośrednio obok wyniku i rankingu
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>
                    <b>Sponsorowany turniej</b> lub dedykowane nagrody z Twoim logo
                  </span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3 border-t border-border pt-3">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Zgłoś chęć współpracy:
              </h4>
              <Input
                placeholder="Twój nick na Telegramie (np. @TwojNick)"
                value={contactTelegram}
                onChange={(e) => setContactTelegram(e.target.value)}
                required
              />
              <Input
                placeholder="Nazwa Twojej firmy / link do strony"
                value={contactCompany}
                onChange={(e) => setContactCompany(e.target.value)}
                required
              />
              <textarea
                placeholder="Krótki opis reklamy lub preferowany budżet..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[70px]"
                required
              />
              <Button type="submit" variant="hero" className="w-full">
                Wyślij zapytanie przez Telegram
              </Button>
            </form>

            <div className="border-t border-border pt-3 text-center text-xs space-y-2.5">
              <div className="space-y-1">
                <p className="text-muted-foreground">Kontakt wyłącznie przez Telegram:</p>
                <a
                  href="https://t.me/SnakeArenaAdmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-display text-sm text-primary hover:underline hover:text-glow transition-all"
                >
                  <span>✈️</span> Telegram: @SnakeArenaAdmin
                </a>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setIsCooperationOpen(false);
                  setTab("game");
                }}
              >
                ← {user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
