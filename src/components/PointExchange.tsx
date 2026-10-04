import { useState } from "react";
import type { Player } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  cost: number;
  icon: string;
  badge?: string;
  description: string;
  telegramMsg: string;
  popular?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: "psc-20",
    name: "Karta Paysafecard 20 PLN",
    cost: 200,
    icon: "💳",
    badge: "Główna nagroda",
    popular: true,
    description: "Kod Paysafecard o wartości 20 zł do wykorzystania w grach i płatnościach online.",
    telegramMsg: "Kupilem psc 20 zl za 200 punktow",
  },
  {
    id: "extra-life",
    name: "Dodatkowe Życie w Grze (❤️ +1)",
    cost: 50,
    icon: "❤️",
    description: "Jednorazowy ratunek po zderzeniu ze ścianą lub ogonem w kolejnej grze.",
    telegramMsg: "Kupilem dodatkowe zycie za 50 punktow",
  },
  {
    id: "extra-game",
    name: "Dodatkowa Gra w Arenie (🎮 +1)",
    cost: 80,
    icon: "🎮",
    description: "Zagraj natychmiast jeszcze raz bez konieczności czekania pełnych 24 godzin.",
    telegramMsg: "Kupilem dodatkowa gre za 80 punktow",
  },
  {
    id: "vip-skin",
    name: "Złoty Wąż & Ranga VIP",
    cost: 150,
    icon: "👑",
    description: "Złoty kolor węża oraz specjalne oznaczenie VIP w rankingu graczy.",
    telegramMsg: "Kupilem range VIP za 150 punktow",
  },
  {
    id: "steam-allegro-25",
    name: "Karta Steam / Allegro 25 PLN",
    cost: 250,
    icon: "🎁",
    description: "Karta podarunkowa 25 zł do wyboru: portfel Steam lub Allegro.",
    telegramMsg: "Kupilem karte podarunkowa 25 zl za 250 punktow",
  },
  {
    id: "psc-50",
    name: "Karta Paysafecard 50 PLN",
    cost: 450,
    icon: "💰",
    badge: "Super nagroda",
    description: "Kod Paysafecard o wartości 50 zł na dowolne zakupy w sieci.",
    telegramMsg: "Kupilem psc 50 zl za 450 punktow",
  },
];

export function PointExchange({
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const currentPoints = isDemo ? 0 : player.points;

  const handleExchange = (product: Product) => {
    if (isDemo) {
      toast.error("W trybie Demo punkty się nie liczą. Zaloguj się, aby wymieniać punkty!");
      return;
    }

    if (currentPoints < product.cost) {
      toast.error(
        `Brakuje Ci ${product.cost - currentPoints} punktów, aby wymienić na "${product.name}".`,
      );
      return;
    }

    setSelectedProduct(product);
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

      {/* Nagłówek i stan punktów */}
      <div className="panel p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-primary text-glow flex items-center gap-2">
            <span>🎁</span> Wymiana Punktów
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Graj codziennie, zbieraj punkty i wymieniaj je na nagrody u administratora!
          </p>
        </div>
        <div className="text-center sm:text-right rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 min-w-[130px]">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Twoje saldo
          </div>
          <div className="font-display text-2xl text-primary text-glow">
            {currentPoints} <span className="text-sm font-sans">pkt</span>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="rounded-xl border border-accent/40 bg-accent/15 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-accent">
          Grasz w trybie Demo. Aby zbierać punkty do wymiany na nagrody, załóż darmowe konto.
        </div>
      )}

      {/* Lista produktów */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRODUCTS.map((prod) => {
          const hasEnough = currentPoints >= prod.cost;
          const progressPercent = Math.min(100, Math.round((currentPoints / prod.cost) * 100));
          const telegramUrl = `https://t.me/SnakeArenaAdmin?text=${encodeURIComponent(
            `${prod.telegramMsg} (Mój nick w grze: ${player.nick})`,
          )}`;

          return (
            <div
              key={prod.id}
              className={`panel relative flex flex-col justify-between p-4 transition-all duration-200 ${
                prod.popular
                  ? "border-primary/60 bg-card/90 shadow-[0_0_20px_oklch(0.86_0.2_150/15%)]"
                  : "border-border bg-card/60"
              }`}
            >
              {prod.badge && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow">
                  {prod.badge}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">{prod.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-base text-foreground leading-tight">
                      {prod.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 my-2">
                  <span className="font-display text-2xl text-primary text-glow">{prod.cost}</span>
                  <span className="text-xs text-muted-foreground font-semibold">punktów</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {prod.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                {/* Pasek postępu */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Postęp</span>
                    <span>
                      {hasEnough ? "Gotowe do odbioru!" : `${currentPoints}/${prod.cost} pkt`}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>

                {hasEnough ? (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      toast.success(
                        `Przekierowanie do Telegrama z wiadomością: "${prod.telegramMsg}"`,
                      );
                    }}
                    className="flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_15px_oklch(0.86_0.2_150/30%)]"
                  >
                    <span>🎁</span> Odbierz nagrodę (Telegram)
                  </a>
                ) : (
                  <Button
                    variant="chip"
                    className="w-full h-10 text-xs text-muted-foreground opacity-80 cursor-not-allowed"
                    onClick={() => handleExchange(prod)}
                  >
                    Brakuje Ci {prod.cost - currentPoints} pkt
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Informacja o odbiorze nagród */}
      <div className="panel p-4 text-xs space-y-2 text-muted-foreground leading-relaxed">
        <h4 className="font-display text-sm text-foreground flex items-center gap-1.5">
          <span>ℹ️</span> Jak działa wymiana punktów?
        </h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Zbieraj punkty grając codziennie w Snake Arena.</li>
          <li>
            Gdy uzbierasz wymaganą liczbę (np. <b>200 punktów</b> na Paysafecard 20 PLN), kliknij{" "}
            <b>Odbierz nagrodę</b>.
          </li>
          <li>
            Automatycznie otworzy się czat Telegram z administratorem (<b>@SnakeArenaAdmin</b>) z
            gotową treścią wiadomości: <i>„Kupilem psc 20 zl za 200 punktow”</i>.
          </li>
          <li>Administrator weryfikuje Twoje punkty w rankingu i przekazuje kod nagrody.</li>
        </ol>
        <p className="pt-1 text-[11px] text-muted-foreground/80">
          Kontakt w sprawie wymiany i pytań: wyłącznie Telegram <b>@SnakeArenaAdmin</b>.
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
