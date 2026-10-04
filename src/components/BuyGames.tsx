import type { Player } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type GamePackage = {
  id: string;
  games: number;
  price: number;
  title: string;
  badge?: string;
  popular?: boolean;
  bestValue?: boolean;
  icon: string;
  description: string;
  saving?: string;
};

const PACKAGES: GamePackage[] = [
  {
    id: "games-1",
    games: 1,
    price: 5,
    title: "1 Gra w Arenie",
    icon: "🎮",
    description: "1 natychmiastowa dodatkowa próba bez czekania pełnych 24 godzin na odnowienie.",
    saving: "5.00 zł / gra",
  },
  {
    id: "games-5",
    games: 5,
    price: 23,
    title: "Pakiet 5 Gier",
    badge: "Popularne",
    popular: true,
    icon: "🕹️",
    description: "5 dodatkowych szans na podbicie rankingu i zbieranie punktów na nagrody.",
    saving: "4.60 zł / gra · Oszczędzasz 2 zł",
  },
  {
    id: "games-10",
    games: 10,
    price: 40,
    title: "Pakiet 10 Gier",
    badge: "Najlepszy wybór",
    bestValue: true,
    icon: "⚡",
    description: "10 dodatkowych gier w super cenie. Największa szansa na zdominowanie tabeli!",
    saving: "4.00 zł / gra · Oszczędzasz aż 10 zł",
  },
];

export function BuyGames({
  player,
  isDemo,
  onBackToGame,
  backLabel = "Wróć do gry",
}: {
  player: Player;
  isDemo?: boolean;
  onBackToGame?: () => void;
  backLabel?: string;
}) {
  const playerNick = isDemo ? "Gość" : player.nick || "Gracz";

  const handleBuy = (pkg: GamePackage) => {
    const text = `Czesc, chce kupic pakiet ${pkg.games} ${pkg.games === 1 ? "gre" : "gier"} za ${pkg.price} zl w Snake Arena (moj nick: ${playerNick})`;
    const telegramUrl = `https://t.me/SnakeArenaAdmin?text=${encodeURIComponent(text)}`;

    toast.success(`Przekierowanie do Telegrama: Pakiet ${pkg.games} gier (${pkg.price} zł)`);
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="space-y-4">
      {/* Przycisk powrotu na samej górze */}
      {onBackToGame && (
        <div className="flex items-center justify-between pb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToGame}
            className="gap-1.5 text-xs border-border hover:border-primary"
          >
            <span>←</span>
            <span>{backLabel}</span>
          </Button>
        </div>
      )}

      {/* Nagłówek sekcji */}
      <div className="panel p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-primary text-glow flex items-center gap-2">
            <span>🎮</span> Kup dodatkowe gry
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Skończyła Ci się darmowa gra dzienna? Kup dodatkowe gry i walcz o punkty bez limitu!
          </p>
        </div>
        <div className="text-center sm:text-right rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 min-w-[130px]">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Twój stan gier
          </div>
          <div className="font-display text-2xl text-primary text-glow">
            {isDemo ? 0 : player.extra_games || 0}{" "}
            <span className="text-sm font-sans">dodatkowych</span>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="rounded-xl border border-accent/40 bg-accent/15 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-accent">
          Grasz w trybie Demo. Załóż konto za darmo, aby gry zostały przypisane do Twojego nicku!
        </div>
      )}

      {/* Lista pakietów gier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PACKAGES.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className={`panel relative flex flex-col justify-between p-5 transition-all duration-200 ${
                pkg.bestValue
                  ? "border-accent/80 bg-card/90 shadow-[0_0_25px_oklch(0.75_0.22_45/20%)]"
                  : pkg.popular
                    ? "border-primary/70 bg-card/90 shadow-[0_0_20px_oklch(0.86_0.2_150/15%)]"
                    : "border-border bg-card/60"
              }`}
            >
              {pkg.badge && (
                <span
                  className={`absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow ${
                    pkg.bestValue
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {pkg.badge}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{pkg.icon}</span>
                  <div>
                    <h3 className="font-display text-lg text-foreground leading-tight">
                      {pkg.title}
                    </h3>
                    <div className="text-[11px] text-primary font-semibold">
                      {pkg.games} {pkg.games === 1 ? "dodatkowa gra" : "dodatkowych gier"}
                    </div>
                  </div>
                </div>

                <div className="my-3 py-2 border-y border-border/70 flex items-baseline justify-between">
                  <div>
                    <span className="font-display text-3xl text-foreground font-black">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground ml-1">zł</span>
                  </div>
                  {pkg.saving && (
                    <span className="text-[11px] font-medium text-accent">{pkg.saving}</span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {pkg.description}
                </p>
              </div>

              <Button
                type="button"
                variant={pkg.bestValue ? "hero" : pkg.popular ? "default" : "chip"}
                onClick={() => handleBuy(pkg)}
                className="w-full h-11 text-xs uppercase tracking-wider font-bold shadow-md"
              >
                <span>🛒 Kup za {pkg.price} zł →</span>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Jak to działa */}
      <div className="panel p-4 text-xs space-y-2 text-muted-foreground leading-relaxed">
        <h4 className="font-display text-sm text-foreground flex items-center gap-1.5">
          <span>⚡</span> Jak działa zakup gier?
        </h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Wybierz interesujący Cię pakiet: <b>1 gra (5 zł)</b>, <b>5 gier (23 zł)</b> lub{" "}
            <b>10 gier (40 zł)</b>.
          </li>
          <li>
            Kliknij przycisk zakupu — natychmiast otworzy się czat Telegram z administratorem (
            <b>@SnakeArenaAdmin</b>).
          </li>
          <li>Wiadomość z wybranym pakietem i Twoim nickiem w grze wstawi się automatycznie.</li>
          <li>
            Po szybkiej płatności (BLIK / Paysafecard / przelew), administrator natychmiast zasila
            Twoje konto grami.
          </li>
        </ol>
        <p className="pt-1 text-[11px] text-muted-foreground/80">
          Gry zostają na Twoim koncie na stałe i nie przepadają — wykorzystujesz je kiedy chcesz!
        </p>
      </div>

      {onBackToGame && (
        <div className="pt-2 text-center">
          <Button variant="default" onClick={onBackToGame} className="w-full sm:w-auto">
            ← {backLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
