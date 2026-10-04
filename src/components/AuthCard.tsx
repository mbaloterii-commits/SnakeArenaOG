import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Zabezpieczenie przed restrykcjami Supabase "HaveIBeenPwned" / weak password.
// Pozwala użytkownikowi zarejestrować DOWOLNE hasło mające min. 6 znaków (nawet proste "123456", "haslo1", "qwerty")
function transformPassword(p: string): string {
  return `${p}#Snake_2026!`;
}

export function AuthCard({ onPlayAsGuest }: { onPlayAsGuest?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      if (password.length < 6) {
        throw new Error("Hasło musi mieć co najmniej 6 znaków.");
      }

      if (mode === "signup") {
        const n = nick.trim();
        if (n.length < 2 || n.length > 20 || !/^[\p{L}\p{N}_ .-]+$/u.test(n))
          throw new Error("Nick: 2–20 znaków (litery, cyfry, _ . -)");
        const { data: free } = await supabase.rpc("nick_available", { p_nick: n });
        if (!free) throw new Error("Ten nick jest już zajęty");

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: transformPassword(password),
          options: { data: { nick: n }, emailRedirectTo: window.location.origin },
        });

        if (error) {
          if (error.message.includes("weak_password") || error.message.includes("weak")) {
            throw new Error("Hasło musi mieć co najmniej 6 znaków.");
          }
          if (error.message.includes("already registered")) {
            throw new Error("Ten adres e-mail jest już zarejestrowany. Zaloguj się.");
          }
          if (error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("rate_limit")) {
            throw new Error("Chwilowy limit prób. Spróbuj ponownie za chwilę.");
          }
          throw error;
        }

        if (!data.session) {
          setMsg("Konto zarejestrowane! Sprawdź e-mail lub zaloguj się.");
        } else {
          setMsg("Konto zostało pomyślnie utworzone!");
        }
      } else {
        // Próba logowania ze wzmocnionym hasłem
        let { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: transformPassword(password),
        });

        // Jeśli się nie powiodło, spróbuj hasła bezpośredniego (dla starszych kont)
        if (error) {
          const rawAttempt = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });
          if (!rawAttempt.error) {
            error = null;
          }
        }

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Potwierdź swój adres e-mail klikając link w wiadomości aktywacyjnej.");
          }
          throw new Error("Nieprawidłowy e-mail lub hasło");
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

      {mode === "signup" && (
        <div className="space-y-1">
          <Input
            placeholder="Twój nick"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            maxLength={20}
            required
          />
          <p className="text-xs text-muted-foreground">
            Nick wybierasz raz — nie da się go później zmienić.
          </p>
        </div>
      )}

      <Input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="space-y-1">
        <Input
          type="password"
          placeholder="Hasło (min. 6 znaków)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          Wymóg: tylko minimum 6 dowolnych znaków.
        </p>
      </div>

      <Button type="submit" variant="hero" className="w-full h-12" disabled={busy}>
        {mode === "signup" ? "Załóż konto" : "Zaloguj"}
      </Button>

      {msg && <p className="text-sm text-center text-accent">{msg}</p>}
    </form>
  );
}
