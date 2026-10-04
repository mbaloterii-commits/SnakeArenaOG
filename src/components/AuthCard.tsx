import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      if (mode === "signup") {
        const n = nick.trim();
        if (n.length < 2 || n.length > 20 || !/^[\p{L}\p{N}_ .-]+$/u.test(n))
          throw new Error("Nick: 2–20 znaków (litery, cyfry, _ . -)");
        const { data: free } = await supabase.rpc("nick_available", { p_nick: n });
        if (!free) throw new Error("Ten nick jest już zajęty");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nick: n }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) setMsg("Sprawdź skrzynkę e-mail i kliknij link, aby aktywować konto.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Nieprawidłowy e-mail lub hasło");
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
          onClick={() => setMode("signup")}
        >
          Nowe konto
        </Button>
        <Button
          type="button"
          variant={mode === "login" ? "default" : "chip"}
          className="flex-1 text-xs sm:text-sm px-2"
          onClick={() => setMode("login")}
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
      <Input
        type="password"
        placeholder="Hasło (min. 6 znaków)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      <Button type="submit" variant="hero" className="w-full h-12" disabled={busy}>
        {mode === "signup" ? "Załóż konto" : "Zaloguj"}
      </Button>
      {msg && <p className="text-sm text-center text-accent">{msg}</p>}
    </form>
  );
}
