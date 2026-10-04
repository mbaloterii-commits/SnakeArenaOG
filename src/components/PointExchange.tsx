import { useState } from "react";
import type { Player } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  cost: number;
  icon: string;
  badge?: string;
  description: string;
  popular?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: "extra-life",
    name: "Dodatkowe Życie w Grze (❤️ +1)",
    cost: 100,
    icon: "❤️",
    badge: "Natychmiastowe",
    description:
      "Jednorazowy ratunek po zderzeniu ze ścianą lub ogonem w kolejnej grze. Otrzymujesz natychmiast!",
  },
  {
    id: "extra-game",
    name: "Dodatkowa Gra w Arenie (🎮 +1)",
    cost: 160,
    icon: "🎮",
    badge: "Brak limitu 24h",
    popular: true,
    description:
      "Zagraj natychmiast jeszcze raz bez konieczności czekania pełnych 24 godzin na darmową grę!",
  },
  {
    id: "vip-skin",
    name: "Złoty Wąż & Ranga VIP",
    cost: 300,
    icon: "👑",
    badge: "Ekskluzywne",
    popular: true,
    description:
      "Lśniący złoty kolor węża na arenie, złota korona oraz prestiżowe oznaczenie VIP w rankingu graczy.",
  },
  {
    id: "psc-20",
    name: "Karta Paysafecard 20 PLN",
    cost: 400,
    icon: "💳",
    badge: "Główna nagroda",
    description: "Kod Paysafecard o wartości 20 zł do wykorzystania w grach i płatnościach online.",
  },
  {
    id: "psc-50",
    name: "Karta Paysafecard 50 PLN",
    cost: 900,
    icon: "💰",
    badge: "Super nagroda",
    description: "Kod Paysafecard o wartości 50 zł na dowolne zakupy w sieci.",
  },
  {
    id: "psc-100",
    name: "Karta Paysafecard 100 PLN",
    cost: 1800,
    icon: "💎",
    badge: "Mega nagroda",
    description:
      "Kod Paysafecard o wartości 100 zł do wykorzystania w grach i płatnościach online.",
  },
];

type LastPurchase = {
  name: string;
  cost: number;
  remainingPoints: number;
  message: string;
  telegramUrl?: string;
};

export function PointExchange({
  player,
  isDemo,
  onBackToGame,
  onRefresh,
  backLabel = "Wróć do gry",
}: {
  player: Player;
  isDemo?: boolean;
  onBackToGame?: () => void;
  onRefresh?: () => void;
  backLabel?: string;
}) {
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [lastPurchase, setLastPurchase] = useState<LastPurchase | null>(null);

  const currentPoints = isDemo ? 0 : player.points;
  const isVipOwned = Boolean(player.is_vip || player.gold_snake);

  async function handleBuy(product: Product) {
    if (isDemo) {
      toast.error("W trybie Demo punkty się nie liczą. Zaloguj się, aby wymieniać punkty!");
      return;
    }

    if (product.id === "vip-skin" && isVipOwned) {
      toast.info("Posiadasz już aktywną rangę i skórkę Złoty Wąż!");
      return;
    }

    if (currentPoints < product.cost) {
      toast.error(
        `Brakuje Ci ${product.cost - currentPoints} punktów na "${product.name}". Graj codziennie i zbieraj dalej!`,
      );
      return;
    }

    setBuyingId(product.id);
    try {
      // 1. Bezpieczna funkcja RPC w bazie Supabase
      const { data, error } = await supabase.rpc("buy_shop_item", {
        p_item: product.id,
      });

      let newPoints = currentPoints - product.cost;

      if (error) {
        // Fallback: Jeśli funkcja RPC nie została jeszcze wklejona do bazy, sprawdź fallback przez admin_adjust
        if (error.code === "PGRST202" || error.message.includes("schema cache")) {
          const adjPts = await supabase.rpc("admin_adjust", {
            p_user: player.user_id,
            p_field: "points",
            p_delta: -product.cost,
          });

          if (!adjPts.error) {
            newPoints = Math.max(0, currentPoints - product.cost);
            if (product.id === "extra-life") {
              await supabase.rpc("admin_adjust", {
                p_user: player.user_id,
                p_field: "lives",
                p_delta: 1,
              });
            } else if (product.id === "extra-game") {
              await supabase.rpc("admin_adjust", {
                p_user: player.user_id,
                p_field: "extra_games",
                p_delta: 1,
              });
            }
          } else {
            toast.error(
              "W bazie Supabase brakuje funkcji 'buy_shop_item'. Uruchom plik 0001_shop_and_vip.sql w Supabase SQL Editor.",
              { duration: 8000 },
            );
            return;
          }
        } else {
          throw error;
        }
      } else if (data && typeof data.new_points === "number") {
        newPoints = data.new_points;
      }

      // Aktywacja Złotego Węża i rangi VIP
      if (product.id === "vip-skin") {
        if (typeof window !== "undefined") {
          localStorage.setItem(`snake_gold_skin_${player.user_id}`, "true");
          localStorage.setItem(`snake_gold_skin_${player.nick.toLowerCase()}`, "true");
        }
        await supabase.auth
          .updateUser({
            data: { is_vip: true, gold_snake: true },
          })
          .catch(() => {});
      }

      // Odświeżenie danych gracza
      onRefresh?.();

      let successMsg = "";
      let tgUrl: string | undefined = undefined;

      if (product.id === "extra-life") {
        successMsg = `Dodano +1 życie do Twojego konta! Masz teraz ${player.lives + 1} żyć. Ochroni Cię ono w kolejnej grze.`;
      } else if (product.id === "extra-game") {
        successMsg = `Dodano +1 dodatkową grę w Arenie! Masz teraz ${player.extra_games + 1} gier. Możesz zagrać natychmiast bez czekania 24h!`;
      } else if (product.id === "vip-skin") {
        successMsg = `👑 Gratulacje! Odblokowano rangę i skórkę Złoty Wąż! Twój wąż lśni złotem na arenie, ma koronę, a w rankingu pojawiła się odznaka VIP!`;
      } else {
        successMsg = `Pobrano ${product.cost} punktów z Twojego salda. Kliknij poniższy przycisk, aby połączyć się z administratorem na Telegramie i odebrać swój kod Paysafecard!`;
        tgUrl = `https://t.me/SnakeArenaAdmin?text=${encodeURIComponent(
          `Cześć! Wymieniłem ${product.cost} punktów na "${product.name}" (Mój nick w grze: ${player.nick}). Moje punkty zostały już odjęte z konta w grze. Proszę o kod karty!`,
        )}`;
      }

      setLastPurchase({
        name: product.name,
        cost: product.cost,
        remainingPoints: newPoints,
        message: successMsg,
        telegramUrl: tgUrl,
      });

      toast.success(`Wymieniono ${product.cost} punktów na: ${product.name}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Błąd podczas wymiany punktów.";
      toast.error(msg);
    } finally {
      setBuyingId(null);
    }
  }

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
            <span>🎁</span> Sklep i Wymiana Punktów
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Wymieniaj punkty na natychmiastowe życia, dodatkowe gry, skórkę Złotego Węża lub kody
            Paysafecard!
          </p>
        </div>
        <div className="text-center sm:text-right rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 min-w-[140px]">
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
          Grasz w trybie Demo. Aby zbierać punkty do wymiany na nagrody, załóż darmowe konto gracza.
        </div>
      )}

      {/* Komunikat o ostatnim udanym zakupie z informacją o nowym saldzie */}
      {lastPurchase && (
        <div className="rounded-2xl border-2 border-primary bg-primary/10 p-5 space-y-3 animate-in fade-in zoom-in-95 shadow-[0_0_25px_oklch(0.86_0.2_150/20%)]">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/25 border border-primary/50 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider">
                🎉 Zakup zrealizowany!
              </span>
              <h3 className="font-display text-lg sm:text-xl text-foreground">
                {lastPurchase.name}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLastPurchase(null)}
              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              aria-label="Zamknij powiadomienie"
            >
              ✕
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {lastPurchase.message}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-primary/25 text-xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-muted-foreground">Pobrano: </span>
                <span className="font-display text-sm text-rose-400 font-bold">
                  -{lastPurchase.cost} pkt
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Aktualne saldo: </span>
                <span className="font-display text-sm text-primary font-bold">
                  {lastPurchase.remainingPoints} pkt
                </span>
              </div>
            </div>
            <div className="text-accent font-semibold flex items-center gap-1">
              <span>🌾</span> Zbieraj punkty na nowo w Arenie!
            </div>
          </div>

          {lastPurchase.telegramUrl && (
            <div className="pt-2">
              <a
                href={lastPurchase.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_20px_oklch(0.86_0.2_150/30%)]"
              >
                <span>💬</span> Otwórz Telegram do @SnakeArenaAdmin po odbiór kodu
              </a>
            </div>
          )}
        </div>
      )}

      {/* Lista produktów w sklepie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PRODUCTS.map((prod) => {
          const isVipCard = prod.id === "vip-skin";
          const alreadyOwned = isVipCard && isVipOwned;
          const hasEnough = currentPoints >= prod.cost;
          const isBusy = buyingId === prod.id;
          const progressPercent = alreadyOwned
            ? 100
            : Math.min(100, Math.round((currentPoints / prod.cost) * 100));

          return (
            <div
              key={prod.id}
              className={`panel relative flex flex-col justify-between p-4 transition-all duration-200 ${
                alreadyOwned
                  ? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_20px_oklch(0.85_0.2_85/15%)]"
                  : prod.popular
                    ? "border-primary/60 bg-card/90 shadow-[0_0_20px_oklch(0.86_0.2_150/15%)]"
                    : "border-border bg-card/60"
              }`}
            >
              {alreadyOwned ? (
                <span className="absolute -top-2.5 right-4 rounded-full bg-amber-500 text-amber-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow">
                  👑 Aktywna ranga
                </span>
              ) : (
                prod.badge && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow">
                    {prod.badge}
                  </span>
                )
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
                {/* Pasek postępu zbierania punktów */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Stan</span>
                    <span>
                      {alreadyOwned
                        ? "Odblokowane na stałe"
                        : hasEnough
                          ? "Możesz wymienić!"
                          : `${currentPoints}/${prod.cost} pkt`}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>

                {alreadyOwned ? (
                  <Button
                    variant="chip"
                    disabled
                    className="w-full h-10 text-xs font-bold text-amber-300 border border-amber-500/40 bg-amber-500/20 cursor-default"
                  >
                    👑 Złoty Wąż jest aktywny
                  </Button>
                ) : hasEnough ? (
                  <Button
                    variant="default"
                    disabled={isBusy}
                    onClick={() => handleBuy(prod)}
                    className="w-full h-10 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_oklch(0.86_0.2_150/25%)]"
                  >
                    {isBusy ? "Przetwarzanie…" : `Kup / Wymień za ${prod.cost} pkt`}
                  </Button>
                ) : (
                  <Button
                    variant="chip"
                    disabled
                    className="w-full h-10 text-xs text-muted-foreground opacity-80 cursor-not-allowed"
                  >
                    Brakuje Ci {prod.cost - currentPoints} pkt
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Informacje o działaniu sklepu */}
      <div className="panel p-4 text-xs space-y-2 text-muted-foreground leading-relaxed">
        <h4 className="font-display text-sm text-foreground flex items-center gap-1.5">
          <span>ℹ️</span> Jak działa sklep i wymiana punktów?
        </h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <b>❤️ Dodatkowe Życia</b> oraz <b>🎮 Dodatkowe Gry</b> są przyznawane{" "}
            <b>automatycznie i natychmiast</b> po kliknięciu zakupu, a punkty są od razu odejmowane
            z Twojego konta.
          </li>
          <li>
            <b>👑 Złoty Wąż & Ranga VIP</b> (300 pkt) natychmiast zmienia kolor Twojego węża na
            złoty ze specjalną koroną i dodaje odznakę VIP w rankingu graczy.
          </li>
          <li>
            <b>💳 Karty Paysafecard</b> po kliknięciu pobierają punkty z Twojego konta, a system
            natychmiast przygotowuje zgłoszenie na Telegram do <b>@SnakeArenaAdmin</b> z Twoim
            nickiem, skąd otrzymujesz kod karty.
          </li>
          <li>Po każdym zakupie zbierasz punkty na nowo, grając codziennie w Arenie!</li>
        </ol>
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
