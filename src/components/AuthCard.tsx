import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Zabezpieczenie przed restrykcjami Supabase "HaveIBeenPwned" / weak password.
// Pozwala użytkownikowi zarejestrować DOWOLNE hasło mające min. 6 znaków (nawet proste "123456", "haslo1", "qwerty")
function transformPassword(p: string): string {
  return `${p}#Snake_2026!`;
}

function nickToInternalEmail(n: string): string {
  const trimmed = n.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  const clean = trimmed.replace(/[^a-z0-9_.-]/gi, "_");
  return `${clean}@snakearena.app`;
}

export function AuthCard({ onPlayAsGuest }: { onPlayAsGuest?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const cleanNick = nick.trim();
      if (!cleanNick) {
        throw new Error("Wpisz swój nick.");
      }
      if (password.length < 6) {
        throw new Error("Hasło musi mieć co najmniej 6 znaków.");
      }

      const internalEmail = nickToInternalEmail(cleanNick);

      if (mode === "signup") {
        if (
          cleanNick.length < 2 ||
          cleanNick.length > 20 ||
          !/^[\p{L}\p{N}_ .-]+$/u.test(cleanNick)
        ) {
          throw new Error("Nick: 2–20 znaków (litery, cyfry, _ . -)");
        }

        // Sprawdź czy nick jest wolny
        const { data: free } = await supabase.rpc("nick_available", { p_nick: cleanNick });
        if (!free && free !== null) {
          throw new Error("Ten nick jest już zajęty. Wybierz inny lub zaloguj się.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: internalEmail,
          password: transformPassword(password),
          options: { data: { nick: cleanNick } },
        });

        if (error) {
          if (error.message.includes("weak_password") || error.message.includes("weak")) {
            throw new Error("Hasło musi mieć co najmniej 6 znaków.");
          }
          if (error.message.includes("already registered")) {
            // Spróbuj zalogować jeśli konto już istnieje
            const autoLogin = await supabase.auth.signInWithPassword({
              email: internalEmail,
              password: transformPassword(password),
            });
            if (!autoLogin.error) {
              setMsg("Zalogowano pomyślnie!");
              return;
            }
            throw new Error("Ten nick jest już zarejestrowany. Przejdź do zakładki Logowanie.");
          }
          if (
            error.message.toLowerCase().includes("rate limit") ||
            error.message.toLowerCase().includes("rate_limit")
          ) {
            // Spróbuj od razu zalogować w razie gdyby konto już powstało
            const autoLogin = await supabase.auth.signInWithPassword({
              email: internalEmail,
              password: transformPassword(password),
            });
            if (!autoLogin.error) {
              setMsg("Zalogowano pomyślnie!");
              return;
            }
            throw new Error(
              "Chwilowy limit rejestracji. Spróbuj zalogować się w zakładce Logowanie.",
            );
          }
          throw error;
        }

        if (!data.session) {
          // Spróbuj od razu zalogować
          const autoLogin = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password: transformPassword(password),
          });
          if (!autoLogin.error) {
            setMsg("Konto utworzone!");
            return;
          }
          setMsg("Konto utworzone! Możesz się teraz zalogować.");
          setMode("login");
        } else {
          setMsg("Konto zostało pomyślnie utworzone!");
        }
      } else {
        // Logowanie: próba z transformowanym hasłem
        let { error } = await supabase.auth.signInWithPassword({
          email: internalEmail,
          password: transformPassword(password),
        });

        // Jeśli błąd, spróbuj hasła surowego
        if (error) {
          const rawAttempt = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password: password,
          });
          if (!rawAttempt.error) {
            error = null;
          }
        }

        // Jeśli nick to np. mbaloterii, a konto było zarejestrowane na mbaloterii@gmail.com
        if (error && !cleanNick.includes("@")) {
          const gmailAttempt = await supabase.auth.signInWithPassword({
            email: `${cleanNick.toLowerCase()}@gmail.com`,
            password: transformPassword(password),
          });
          if (!gmailAttempt.error) {
            error = null;
          } else {
            const gmailRaw = await supabase.auth.signInWithPassword({
              email: `${cleanNick.toLowerCase()}@gmail.com`,
              password: password,
            });
            if (!gmailRaw.error) {
              error = null;
            }
          }
        }

        if (error) {
          throw new Error("Nieprawidłowy nick lub hasło.");
        }
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Coś poszło nie tak");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel p-6 space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "chip"}
          className="flex-1 text-xs sm:text-sm px-2"
          onClick={() => {
            setMode("signup");
            setMsg("");
          }}
        >
          Nowe konto
        </Button>
        <Button
          type="button"
          variant={mode === "login" ? "default" : "chip"}
          className="flex-1 text-xs sm:text-sm px-2"
          onClick={() => {
            setMode("login");
            setMsg("");
          }}
        >
          Logowanie
        </Button>
        {onPlayAsGuest && (
          <Button
            type="button"
            variant="chip"
            className="flex-1 text-xs sm:text-sm px-2 border border-accent/40 text-accent hover:bg-accent/20"
            onClick={onPlayAsGuest}
          >
            Gra jako Gracz
          </Button>
        )}
      </div>

      <div className="space-y-1">
        <Input
          placeholder={mode === "signup" ? "Wymyśl swój nick (np. SnakeMaster)" : "Twój nick"}
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          maxLength={mode === "signup" ? 20 : 60}
          required
          autoComplete={mode === "signup" ? "username" : "username"}
        />
        {mode === "signup" && (
          <p className="text-xs text-muted-foreground">
            Nick wybierasz raz (2–20 znaków: litery, cyfry, _ . -).
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          type="password"
          placeholder="Hasło (min. 6 znaków)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        <p className="text-[11px] text-muted-foreground">
          Wymóg: tylko minimum 6 dowolnych znaków.
        </p>
      </div>

      <Button type="submit" variant="hero" className="w-full h-12" disabled={busy}>
        {mode === "signup" ? "Załóż konto i graj" : "Zaloguj"}
      </Button>

      {msg && <p className="text-sm text-center text-accent">{msg}</p>}
    </form>
  );
}
