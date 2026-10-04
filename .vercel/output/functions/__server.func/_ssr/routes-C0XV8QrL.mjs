import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as supabase } from "./client-r3nVwbIe.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1, u as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C0XV8QrL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
function useAuth() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [player, setPlayer] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async (u) => {
		setUser(u);
		if (!u) {
			setPlayer(null);
			setIsAdmin(false);
			setReady(true);
			return;
		}
		const [{ data: p }, { data: roles }] = await Promise.all([supabase.from("players").select("*").eq("user_id", u.id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", u.id)]);
		setPlayer(p);
		setIsAdmin(!!roles?.some((r) => r.role === "admin"));
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setTimeout(() => load(session?.user ?? null), 0);
		});
		supabase.auth.getUser().then(({ data }) => load(data.user));
		return () => sub.subscription.unsubscribe();
	}, [load]);
	return {
		user,
		player,
		isAdmin,
		ready,
		refresh: (0, import_react.useCallback)(() => load(user), [load, user])
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var _jsxFileName$10 = "/app/applet/src/components/ui/button.tsx";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			hero: "bg-primary text-primary-foreground font-display text-lg tracking-wide glow hover:brightness-110 active:scale-[0.98] transition-all rounded-xl",
			chip: "bg-secondary text-secondary-foreground border border-border hover:border-primary hover:text-primary rounded-lg font-semibold",
			chipDanger: "bg-secondary text-destructive border border-border hover:border-destructive rounded-lg font-semibold"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$10,
		lineNumber: 47,
		columnNumber: 7
	}, void 0);
});
Button.displayName = "Button";
var _jsxFileName$9 = "/app/applet/src/components/ui/input.tsx";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$9,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Input.displayName = "Input";
var _jsxFileName$8 = "/app/applet/src/components/AuthCard.tsx";
function AuthCard({ onPlayAsGuest }) {
	const [mode, setMode] = (0, import_react.useState)("signup");
	const [nick, setNick] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(e) {
		e.preventDefault();
		setMsg("");
		setBusy(true);
		try {
			if (mode === "signup") {
				const n = nick.trim();
				if (n.length < 2 || n.length > 20 || !/^[\p{L}\p{N}_ .-]+$/u.test(n)) throw new Error("Nick: 2–20 znaków (litery, cyfry, _ . -)");
				const { data: free } = await supabase.rpc("nick_available", { p_nick: n });
				if (!free) throw new Error("Ten nick jest już zajęty");
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { nick: n },
						emailRedirectTo: window.location.origin
					}
				});
				if (error) throw error;
				if (!data.session) setMsg("Sprawdź skrzynkę e-mail i kliknij link, aby aktywować konto.");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw new Error("Nieprawidłowy e-mail lub hasło");
			}
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "Coś poszło nie tak");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
		onSubmit: submit,
		className: "panel p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "button",
						variant: mode === "signup" ? "default" : "chip",
						className: "flex-1 text-xs sm:text-sm px-2",
						onClick: () => setMode("signup"),
						children: "Nowe konto"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 46,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "button",
						variant: mode === "login" ? "default" : "chip",
						className: "flex-1 text-xs sm:text-sm px-2",
						onClick: () => setMode("login"),
						children: "Logowanie"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 54,
						columnNumber: 9
					}, this),
					onPlayAsGuest && /* @__PURE__ */ (void 0)(Button, {
						type: "button",
						variant: "chip",
						className: "flex-1 text-xs sm:text-sm px-2 border border-accent/40 text-accent hover:bg-accent/20",
						onClick: onPlayAsGuest,
						children: "Gra jako Gracz"
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 63,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$8,
				lineNumber: 45,
				columnNumber: 7
			}, this),
			mode === "signup" && /* @__PURE__ */ (void 0)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (void 0)(Input, {
					placeholder: "Twój nick",
					value: nick,
					onChange: (e) => setNick(e.target.value),
					maxLength: 20,
					required: true
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 75,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("p", {
					className: "text-xs text-muted-foreground",
					children: "Nick wybierasz raz — nie da się go później zmienić."
				}, void 0, false, {
					fileName: _jsxFileName$8,
					lineNumber: 82,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$8,
				lineNumber: 74,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				type: "email",
				placeholder: "E-mail",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				required: true
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 87,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				type: "password",
				placeholder: "Hasło (min. 6 znaków)",
				value: password,
				onChange: (e) => setPassword(e.target.value),
				minLength: 6,
				required: true
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 94,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				type: "submit",
				variant: "hero",
				className: "w-full h-12",
				disabled: busy,
				children: mode === "signup" ? "Załóż konto" : "Zaloguj"
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 102,
				columnNumber: 7
			}, this),
			msg && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm text-center text-accent",
				children: msg
			}, void 0, false, {
				fileName: _jsxFileName$8,
				lineNumber: 105,
				columnNumber: 15
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 44,
		columnNumber: 5
	}, this);
}
var _jsxFileName$7 = "/app/applet/src/components/SnakeGame.tsx";
var N = 18;
function msLeft(last) {
	if (!last) return 0;
	return Math.max(0, 864e5 - (Date.now() - new Date(last).getTime()));
}
function fmt(ms) {
	const s = Math.ceil(ms / 1e3);
	return [
		Math.floor(s / 3600),
		Math.floor(s % 3600 / 60),
		s % 60
	].map((v) => String(v).padStart(2, "0")).join(":");
}
function cssVar(name) {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function SnakeGame({ player, onChange, isDemo = false }) {
	const canvasRef = (0, import_react.useRef)(null);
	const st = (0, import_react.useRef)({
		snake: [],
		dir: {
			x: 1,
			y: 0
		},
		next: {
			x: 1,
			y: 0
		},
		food: null,
		gold: null,
		obstacles: [],
		score: 0,
		boostUntil: 0,
		running: false,
		session: null,
		timer: 0,
		lives: 0
	});
	const [score, setScore] = (0, import_react.useState)(0);
	const [demoBest, setDemoBest] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("Gotowy? Zbieraj jedzenie i unikaj przeszkód.");
	const [now, setNow] = (0, import_react.useState)(Date.now());
	const [lives, setLives] = (0, import_react.useState)(player.lives);
	(0, import_react.useEffect)(() => {
		if (!st.current.running) {
			setLives(player.lives);
			st.current.lives = player.lives;
		}
	}, [player.lives]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, []);
	const draw = (0, import_react.useCallback)(() => {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
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
		const dot = (p, r, col) => {
			ctx.shadowColor = col;
			ctx.shadowBlur = 14;
			ctx.fillStyle = col;
			ctx.beginPath();
			ctx.arc(p.x * cell + cell / 2, p.y * cell + cell / 2, cell * r, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;
		};
		if (s.food) dot(s.food, .3, cssVar("--accent"));
		if (s.gold) dot(s.gold, .42, cssVar("--gold"));
		const prim = cssVar("--primary");
		s.snake.forEach((p, i) => {
			ctx.fillStyle = prim;
			ctx.globalAlpha = i === 0 ? 1 : Math.max(.45, 1 - i * .03);
			if (i === 0) {
				ctx.shadowColor = prim;
				ctx.shadowBlur = 16;
			}
			ctx.beginPath();
			ctx.roundRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4, 6);
			ctx.fill();
			ctx.shadowBlur = 0;
		});
		ctx.globalAlpha = 1;
	}, []);
	const empty = () => {
		const s = st.current;
		for (let t = 0; t < 500; t++) {
			const p = {
				x: Math.floor(Math.random() * N),
				y: Math.floor(Math.random() * N)
			};
			const hit = (q) => q && q.x === p.x && q.y === p.y;
			if (!s.snake.some(hit) && !s.obstacles.some(hit) && !hit(s.food) && !hit(s.gold)) return p;
		}
		return {
			x: 1,
			y: 1
		};
	};
	const finish = (0, import_react.useCallback)(async () => {
		const s = st.current;
		s.running = false;
		setRunning(false);
		clearTimeout(s.timer);
		if (isDemo) {
			setDemoBest((prev) => Math.max(prev, s.score));
			setStatus(`Koniec gry! Wynik w demo: ${s.score} pkt`);
			s.session = null;
		} else {
			setStatus(`Koniec gry! Wynik: ${s.score} pkt`);
			if (s.session) {
				const { error } = await supabase.rpc("finish_game", {
					p_session: s.session,
					p_score: s.score
				});
				if (error) setStatus(error.message);
				s.session = null;
			}
		}
		onChange();
	}, [onChange, isDemo]);
	const tick = (0, import_react.useCallback)(async () => {
		const s = st.current;
		if (!s.running) return;
		s.dir = s.next;
		const h0 = s.snake[0];
		const head = {
			x: h0.x + s.dir.x,
			y: h0.y + s.dir.y
		};
		if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || s.snake.some((p) => p.x === head.x && p.y === head.y) || Date.now() > s.boostUntil && s.obstacles.some((p) => p.x === head.x && p.y === head.y)) {
			if (s.lives > 0 && s.session) {
				s.running = false;
				const { data } = await supabase.rpc("use_life", { p_session: s.session });
				if (data) {
					s.lives -= 1;
					setLives(s.lives);
					s.snake = [
						{
							x: 9,
							y: 9
						},
						{
							x: 8,
							y: 9
						},
						{
							x: 7,
							y: 9
						}
					];
					s.dir = s.next = {
						x: 1,
						y: 0
					};
					s.obstacles = s.obstacles.filter((o) => o.y !== 9);
					setStatus("❤️ Użyto życia — grasz dalej!");
					draw();
					setTimeout(() => {
						s.running = true;
						tick();
					}, 1200);
					return;
				}
			}
			finish();
			return;
		}
		s.snake.unshift(head);
		if (s.food && head.x === s.food.x && head.y === s.food.y) {
			s.score += 1;
			s.food = empty();
			if (s.score % 10 === 0 && !s.gold) s.gold = empty();
			if (s.score % 25 === 0) {
				s.boostUntil = Date.now() + 8e3;
				setStatus("✨ Boost! Przeszkody nie działają przez 8 s");
			}
			if (s.score % 7 === 0) s.obstacles.push(empty());
		} else if (s.gold && head.x === s.gold.x && head.y === s.gold.y) {
			s.score += 3;
			s.gold = null;
			setStatus("🪙 Złoty punkt +3!");
		} else s.snake.pop();
		setScore(s.score);
		draw();
		s.timer = setTimeout(tick, Date.now() < s.boostUntil ? 75 : 110);
	}, [draw, finish]);
	async function start() {
		const s = st.current;
		if (isDemo) {
			s.session = null;
			s.lives = 0;
			s.snake = [
				{
					x: 9,
					y: 9
				},
				{
					x: 8,
					y: 9
				},
				{
					x: 7,
					y: 9
				}
			];
			s.dir = s.next = {
				x: 1,
				y: 0
			};
			s.score = 0;
			s.boostUntil = 0;
			s.gold = null;
			s.food = null;
			s.obstacles = [];
			for (let i = 0; i < 3; i++) s.obstacles.push(empty());
			s.food = empty();
			setScore(0);
			setStatus("Powodzenia! Gra Demo 🐍");
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
			return;
		}
		s.session = data;
		s.lives = player.lives;
		s.snake = [
			{
				x: 9,
				y: 9
			},
			{
				x: 8,
				y: 9
			},
			{
				x: 7,
				y: 9
			}
		];
		s.dir = s.next = {
			x: 1,
			y: 0
		};
		s.score = 0;
		s.boostUntil = 0;
		s.gold = null;
		s.food = null;
		s.obstacles = [];
		for (let i = 0; i < 3; i++) s.obstacles.push(empty());
		s.food = empty();
		setScore(0);
		setStatus("Powodzenia! 🐍");
		s.running = true;
		setRunning(true);
		onChange();
		draw();
		tick();
	}
	const setDir = (x, y) => {
		const s = st.current;
		if (!s.running) return;
		if (x === -s.dir.x && y === -s.dir.y) return;
		s.next = {
			x,
			y
		};
	};
	(0, import_react.useEffect)(() => {
		draw();
		const onKey = (e) => {
			const v = {
				ArrowUp: [0, -1],
				ArrowDown: [0, 1],
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
				w: [0, -1],
				s: [0, 1],
				a: [-1, 0],
				d: [1, 0]
			}[e.key];
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
	const touch = (0, import_react.useRef)(null);
	const left = isDemo ? 0 : msLeft(player.last_game_at);
	const canPlay = isDemo ? !running : !running && (left === 0 || player.extra_games > 0);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "panel p-4 sm:p-5 space-y-4",
		children: [
			isDemo && /* @__PURE__ */ (void 0)("div", {
				className: "rounded-xl border border-accent/40 bg-accent/15 px-4 py-2 text-center text-xs sm:text-sm font-semibold text-accent",
				children: "Gra jako Gracz jest Demo i sie nie licza punkty."
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 309,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-3 gap-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
						label: "Wynik",
						value: score,
						cls: "text-primary"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 314,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
						label: isDemo ? "Rekord Demo" : "Rekord",
						value: isDemo ? demoBest : player.best_score,
						cls: "text-gold"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 315,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
						label: "Życia",
						value: `❤️ ${isDemo ? "—" : lives}`,
						cls: "text-heart"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 320,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 313,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("canvas", {
				ref: canvasRef,
				width: 432,
				height: 432,
				className: "w-full aspect-square rounded-xl border border-border touch-none glow",
				onTouchStart: (e) => {
					const t = e.touches[0];
					touch.current = {
						x: t.clientX,
						y: t.clientY
					};
				},
				onTouchEnd: (e) => {
					if (!touch.current) return;
					const t = e.changedTouches[0];
					const dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
					if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) if (Math.abs(dx) > Math.abs(dy)) setDir(Math.sign(dx), 0);
					else setDir(0, Math.sign(dy));
					touch.current = null;
				}
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 322,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-center text-sm text-muted-foreground min-h-5",
				children: status
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 346,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "hero",
				className: "w-full h-14",
				disabled: !canPlay,
				onClick: start,
				children: running ? "GRASZ…" : isDemo ? score > 0 ? "ZAGRAJ PONOWNIE (DEMO)" : "ZAGRAJ W DEMO (BEZ LIMITU)" : left === 0 ? "ZAGRAJ" : player.extra_games > 0 ? `ZAGRAJ (dodatkowa gra · ${player.extra_games})` : `KOLEJNA GRA ZA ${fmt(left)}`
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 347,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-3 gap-2 max-w-48 mx-auto sm:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 361,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "chip",
						onClick: () => setDir(0, -1),
						children: "▲"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 362,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 365,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "chip",
						onClick: () => setDir(-1, 0),
						children: "◀"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 366,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "chip",
						onClick: () => setDir(0, 1),
						children: "▼"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 369,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "chip",
						onClick: () => setDir(1, 0),
						children: "▶"
					}, void 0, false, {
						fileName: _jsxFileName$7,
						lineNumber: 372,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 360,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: "Strzałki / WASD lub przesuwaj palcem po planszy."
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 376,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 307,
		columnNumber: 5
	}, this);
}
function Stat({ label, value, cls }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-xl bg-secondary py-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 386,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: `font-display text-xl ${cls}`,
			children: value
		}, void 0, false, {
			fileName: _jsxFileName$7,
			lineNumber: 387,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 385,
		columnNumber: 5
	}, this);
}
var _jsxFileName$6 = "/app/applet/src/components/Ranking.tsx";
function Ranking({ refreshKey }) {
	const [rows, setRows] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("players").select("nick,points,best_score").order("points", { ascending: false }).limit(20).then(({ data }) => setRows(data ?? []));
	}, [refreshKey]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "panel p-5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "font-display text-xl mb-4",
			children: "🏆 Ranking"
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 19,
			columnNumber: 7
		}, this), !rows ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-muted-foreground",
			children: "Ładowanie…"
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 21,
			columnNumber: 9
		}, this) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-muted-foreground",
			children: "Brak wyników — bądź pierwszy!"
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 23,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
			className: "space-y-2",
			children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
				className: "flex items-center gap-3 rounded-lg bg-secondary px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: `font-display w-8 text-center ${i < 3 ? "text-gold" : "text-muted-foreground"}`,
						children: i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 28,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex-1 font-semibold truncate",
						children: r.nick
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 33,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-muted-foreground",
						children: ["rekord ", r.best_score]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 34,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-display text-primary",
						children: r.points
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 35,
						columnNumber: 15
					}, this)
				]
			}, r.nick, true, {
				fileName: _jsxFileName$6,
				lineNumber: 27,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 25,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 18,
		columnNumber: 5
	}, this);
}
var _jsxFileName$5 = "/app/applet/src/components/AdminPanel.tsx";
function AdminPanel() {
	const [players, setPlayers] = (0, import_react.useState)([]);
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [pointsStep, setPointsStep] = (0, import_react.useState)(10);
	const load = (0, import_react.useCallback)(async () => {
		const [{ data: p }, { data: s }] = await Promise.all([supabase.from("players").select("*").order("points", { ascending: false }), supabase.from("game_sessions").select("id,kind,started_at,finished_at,score,lives_used,players(nick)").order("started_at", { ascending: false }).limit(60)]);
		setPlayers(p ?? []);
		setSessions(s ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function adjust(id, field, delta) {
		const { error } = await supabase.rpc("admin_adjust", {
			p_user: id,
			p_field: field,
			p_delta: delta
		});
		if (error) toast.error(error.message);
		else load();
	}
	async function giveAll(field) {
		const { error } = await supabase.rpc("admin_give_all", {
			p_field: field,
			p_amount: 1
		});
		if (error) toast.error(error.message);
		else {
			toast.success("Dodano wszystkim graczom");
			load();
		}
	}
	const filtered = (0, import_react.useMemo)(() => players.filter((p) => p.nick.toLowerCase().includes(q.trim().toLowerCase())), [players, q]);
	const fmtDate = (d) => d ? new Date(d).toLocaleString("pl-PL", {
		dateStyle: "short",
		timeStyle: "short"
	}) : "—";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "panel p-5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-xl",
						children: [
							"👑 Gracze (",
							players.length,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 70,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "chip",
							size: "sm",
							onClick: () => giveAll("extra_games"),
							children: "+1 gra dla wszystkich"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 72,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "chip",
							size: "sm",
							onClick: () => giveAll("lives"),
							children: "+1 życie dla wszystkich"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 75,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 71,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 69,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						placeholder: "🔍 Szukaj nicku…",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 81,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						className: "rounded-md border border-input bg-secondary px-2 text-sm",
						value: pointsStep,
						onChange: (e) => setPointsStep(Number(e.target.value)),
						"aria-label": "Krok punktów",
						children: [
							1,
							5,
							10,
							50,
							100
						].map((v) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: v,
							children: [
								"±",
								v,
								" pkt"
							]
						}, v, true, {
							fileName: _jsxFileName$5,
							lineNumber: 89,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 82,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 80,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [filtered.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-xl bg-secondary p-3 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display text-lg",
								children: p.nick
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 99,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"rozegrane: ",
									p.games_played,
									" · rekord: ",
									p.best_score,
									" · ostatnia:",
									" ",
									fmtDate(p.last_game_at)
								]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 100,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 98,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ctl, {
									label: "Punkty",
									value: p.points,
									cls: "text-primary",
									onMinus: () => adjust(p.user_id, "points", -pointsStep),
									onPlus: () => adjust(p.user_id, "points", pointsStep)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 106,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ctl, {
									label: "Dodatkowe gry",
									value: p.extra_games,
									cls: "text-accent",
									onMinus: () => adjust(p.user_id, "extra_games", -1),
									onPlus: () => adjust(p.user_id, "extra_games", 1)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 113,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ctl, {
									label: "Życia",
									value: p.lives,
									cls: "text-heart",
									onMinus: () => adjust(p.user_id, "lives", -1),
									onPlus: () => adjust(p.user_id, "lives", 1)
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 120,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "chip",
									className: "h-full",
									onClick: () => adjust(p.user_id, "reset_cooldown", 0),
									children: "⏱ Zeruj 24h"
								}, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 127,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 105,
							columnNumber: 15
						}, this)]
					}, p.user_id, true, {
						fileName: _jsxFileName$5,
						lineNumber: 97,
						columnNumber: 13
					}, this)), filtered.length === 0 && /* @__PURE__ */ (void 0)("p", {
						className: "text-muted-foreground text-sm",
						children: "Brak graczy."
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 137,
						columnNumber: 37
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 95,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 68,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
			className: "panel p-5",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "font-display text-xl mb-3",
				children: "📜 Historia gier"
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 142,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
						className: "text-left text-muted-foreground text-xs uppercase",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "py-2",
								children: "Gracz"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 147,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { children: "Start" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 148,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { children: "Rodzaj" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 149,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { children: "Życia" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 150,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
								className: "text-right",
								children: "Wynik"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 151,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 146,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 145,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-2 font-semibold",
								children: s.players?.nick ?? "?"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 157,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { children: fmtDate(s.started_at) }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 158,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { children: s.kind === "daily" ? "dzienna" : "dodatkowa" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 159,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { children: s.lives_used }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 160,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "text-right font-display text-primary",
								children: s.finished_at ? s.score : "w trakcie"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 161,
								columnNumber: 19
							}, this)
						]
					}, s.id, true, {
						fileName: _jsxFileName$5,
						lineNumber: 156,
						columnNumber: 17
					}, this)) }, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 154,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 144,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$5,
				lineNumber: 143,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 141,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 67,
		columnNumber: 5
	}, this);
}
function Ctl({ label, value, cls, onMinus, onPlus }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-lg bg-card p-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}, void 0, false, {
			fileName: _jsxFileName$5,
			lineNumber: 189,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center justify-between gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "chipDanger",
					size: "sm",
					onClick: onMinus,
					"aria-label": `Zabierz ${label}`,
					children: "−"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 191,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: `font-display ${cls}`,
					children: value
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 194,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "chip",
					size: "sm",
					onClick: onPlus,
					"aria-label": `Dodaj ${label}`,
					children: "+"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 195,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$5,
			lineNumber: 190,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 188,
		columnNumber: 5
	}, this);
}
var _jsxFileName$4 = "/app/applet/src/components/ui/progress.tsx";
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	}, void 0, false, {
		fileName: _jsxFileName$4,
		lineNumber: 17,
		columnNumber: 5
	}, void 0)
}, void 0, false, {
	fileName: _jsxFileName$4,
	lineNumber: 12,
	columnNumber: 3
}, void 0));
Progress.displayName = Root.displayName;
var _jsxFileName$3 = "/app/applet/src/components/PointExchange.tsx";
var PRODUCTS = [
	{
		id: "psc-20",
		name: "Karta Paysafecard 20 PLN",
		cost: 200,
		icon: "💳",
		badge: "Główna nagroda",
		popular: true,
		description: "Kod Paysafecard o wartości 20 zł do wykorzystania w grach i płatnościach online.",
		telegramMsg: "Kupilem psc 20 zl za 200 punktow"
	},
	{
		id: "extra-life",
		name: "Dodatkowe Życie w Grze (❤️ +1)",
		cost: 50,
		icon: "❤️",
		description: "Jednorazowy ratunek po zderzeniu ze ścianą lub ogonem w kolejnej grze.",
		telegramMsg: "Kupilem dodatkowe zycie za 50 punktow"
	},
	{
		id: "extra-game",
		name: "Dodatkowa Gra w Arenie (🎮 +1)",
		cost: 80,
		icon: "🎮",
		description: "Zagraj natychmiast jeszcze raz bez konieczności czekania pełnych 24 godzin.",
		telegramMsg: "Kupilem dodatkowa gre za 80 punktow"
	},
	{
		id: "vip-skin",
		name: "Złoty Wąż & Ranga VIP",
		cost: 150,
		icon: "👑",
		description: "Złoty kolor węża oraz specjalne oznaczenie VIP w rankingu graczy.",
		telegramMsg: "Kupilem range VIP za 150 punktow"
	},
	{
		id: "steam-allegro-25",
		name: "Karta Steam / Allegro 25 PLN",
		cost: 250,
		icon: "🎁",
		description: "Karta podarunkowa 25 zł do wyboru: portfel Steam lub Allegro.",
		telegramMsg: "Kupilem karte podarunkowa 25 zl za 250 punktow"
	},
	{
		id: "psc-50",
		name: "Karta Paysafecard 50 PLN",
		cost: 450,
		icon: "💰",
		badge: "Super nagroda",
		description: "Kod Paysafecard o wartości 50 zł na dowolne zakupy w sieci.",
		telegramMsg: "Kupilem psc 50 zl za 450 punktow"
	}
];
function PointExchange({ player, isDemo, onBackToGame, backLabel = "Wróć do gry" }) {
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	const currentPoints = isDemo ? 0 : player.points;
	const handleExchange = (product) => {
		if (isDemo) {
			toast.error("W trybie Demo punkty się nie liczą. Zaloguj się, aby wymieniać punkty!");
			return;
		}
		if (currentPoints < product.cost) {
			toast.error(`Brakuje Ci ${product.cost - currentPoints} punktów, aby wymienić na "${product.name}".`);
			return;
		}
		setSelectedProduct(product);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "space-y-4",
		children: [
			onBackToGame && /* @__PURE__ */ (void 0)("div", {
				className: "flex items-center justify-between pb-1",
				children: /* @__PURE__ */ (void 0)(Button, {
					variant: "outline",
					size: "sm",
					onClick: onBackToGame,
					className: "gap-1.5 text-xs border-border hover:border-primary",
					children: [/* @__PURE__ */ (void 0)("span", { children: "←" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 113,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)("span", { children: backLabel }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 114,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 107,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 106,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "panel p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "font-display text-xl text-primary text-glow flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "🎁" }, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 123,
						columnNumber: 13
					}, this), " Wymiana Punktów"]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 122,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Graj codziennie, zbieraj punkty i wymieniaj je na nagrody u administratora!"
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 125,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 121,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center sm:text-right rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 min-w-[130px]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-[11px] text-muted-foreground uppercase tracking-wider",
						children: "Twoje saldo"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 130,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-display text-2xl text-primary text-glow",
						children: [
							currentPoints,
							" ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-sm font-sans",
								children: "pkt"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 134,
								columnNumber: 29
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 133,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 129,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 120,
				columnNumber: 7
			}, this),
			isDemo && /* @__PURE__ */ (void 0)("div", {
				className: "rounded-xl border border-accent/40 bg-accent/15 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-accent",
				children: "Grasz w trybie Demo. Aby zbierać punkty do wymiany na nagrody, załóż darmowe konto."
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 140,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
				children: PRODUCTS.map((prod) => {
					const hasEnough = currentPoints >= prod.cost;
					const progressPercent = Math.min(100, Math.round(currentPoints / prod.cost * 100));
					const telegramUrl = `https://t.me/SnakeArenaAdmin?text=${encodeURIComponent(`${prod.telegramMsg} (Mój nick w grze: ${player.nick})`)}`;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `panel relative flex flex-col justify-between p-4 transition-all duration-200 ${prod.popular ? "border-primary/60 bg-card/90 shadow-[0_0_20px_oklch(0.86_0.2_150/15%)]" : "border-border bg-card/60"}`,
						children: [
							prod.badge && /* @__PURE__ */ (void 0)("span", {
								className: "absolute -top-2.5 right-4 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow",
								children: prod.badge
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 164,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-2xl",
										children: prod.icon
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 171,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex-1",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "font-display text-base text-foreground leading-tight",
											children: prod.name
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 173,
											columnNumber: 21
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 172,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 170,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-baseline gap-1 my-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-display text-2xl text-primary text-glow",
										children: prod.cost
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 180,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs text-muted-foreground font-semibold",
										children: "punktów"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 181,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 179,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground leading-relaxed mb-3",
									children: prod.description
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 184,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 169,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2 pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex justify-between text-[10px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Postęp" }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 193,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: hasEnough ? "Gotowe do odbioru!" : `${currentPoints}/${prod.cost} pkt` }, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 194,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 192,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Progress, {
										value: progressPercent,
										className: "h-1.5"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 198,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 191,
									columnNumber: 17
								}, this), hasEnough ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
									href: telegramUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									onClick: () => {
										toast.success(`Przekierowanie do Telegrama z wiadomością: "${prod.telegramMsg}"`);
									},
									className: "flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_15px_oklch(0.86_0.2_150/30%)]",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "🎁" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 213,
										columnNumber: 21
									}, this), " Odbierz nagrodę (Telegram)"]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 202,
									columnNumber: 19
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "chip",
									className: "w-full h-10 text-xs text-muted-foreground opacity-80 cursor-not-allowed",
									onClick: () => handleExchange(prod),
									children: [
										"Brakuje Ci ",
										prod.cost - currentPoints,
										" pkt"
									]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 216,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 189,
								columnNumber: 15
							}, this)
						]
					}, prod.id, true, {
						fileName: _jsxFileName$3,
						lineNumber: 155,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 146,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "panel p-4 text-xs space-y-2 text-muted-foreground leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
						className: "font-display text-sm text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "ℹ️" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 233,
							columnNumber: 11
						}, this), " Jak działa wymiana punktów?"]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 232,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
						className: "list-decimal list-inside space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Zbieraj punkty grając codziennie w Snake Arena." }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 236,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
								"Gdy uzbierasz wymaganą liczbę (np. ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "200 punktów" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 238,
									columnNumber: 48
								}, this),
								" na Paysafecard 20 PLN), kliknij",
								" ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "Odbierz nagrodę" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 239,
									columnNumber: 13
								}, this),
								"."
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 237,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [
								"Automatycznie otworzy się czat Telegram z administratorem (",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "@SnakeArenaAdmin" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 242,
									columnNumber: 72
								}, this),
								") z gotową treścią wiadomości: ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("i", { children: "„Kupilem psc 20 zl za 200 punktow”" }, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 243,
									columnNumber: 40
								}, this),
								"."
							] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 241,
								columnNumber: 11
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: "Administrator weryfikuje Twoje punkty w rankingu i przekazuje kod nagrody." }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 245,
								columnNumber: 11
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 235,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "pt-1 text-[11px] text-muted-foreground/80",
						children: [
							"Kontakt w sprawie wymiany i pytań: wyłącznie Telegram ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "@SnakeArenaAdmin" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 248,
								columnNumber: 65
							}, this),
							"."
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 247,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 231,
				columnNumber: 7
			}, this),
			onBackToGame && /* @__PURE__ */ (void 0)("div", {
				className: "pt-2 text-center",
				children: /* @__PURE__ */ (void 0)(Button, {
					variant: "default",
					onClick: onBackToGame,
					className: "w-full sm:w-auto",
					children: ["← ", backLabel]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 254,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$3,
				lineNumber: 253,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 103,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/AmbientSnakes.tsx";
function AmbientSnakes() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "fixed inset-0 pointer-events-none overflow-hidden z-0 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute top-[8%] -left-[160px] w-[320px] h-[70px] opacity-35 animate-snake-crawl-1",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					viewBox: "0 0 320 70",
					className: "w-full h-full filter drop-shadow-[0_0_8px_#22c55e]",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 10 35 Q 50 10, 90 35 T 170 35 T 250 35 T 300 35",
							fill: "none",
							stroke: "#22c55e",
							strokeWidth: "12",
							strokeLinecap: "round",
							className: "animate-slither-path"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 14,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 10 35 Q 50 10, 90 35 T 170 35 T 250 35 T 300 35",
							fill: "none",
							stroke: "#86efac",
							strokeWidth: "4",
							strokeDasharray: "8 8",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 22,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "304",
							cy: "35",
							r: "9",
							fill: "#4ade80"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 31,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "308",
							cy: "32",
							r: "2",
							fill: "#facc15"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 32,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 313 35 L 324 35 M 324 35 L 328 32 M 324 35 L 328 38",
							stroke: "#ef4444",
							strokeWidth: "2",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 34,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 13,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 12,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute top-[40%] -right-[150px] w-[300px] h-[65px] opacity-30 animate-snake-crawl-2",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					viewBox: "0 0 300 65",
					className: "w-full h-full filter drop-shadow-[0_0_10px_#10b981]",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 290 32 Q 250 55, 210 32 T 130 32 T 50 32 T 10 32",
							fill: "none",
							stroke: "#10b981",
							strokeWidth: "10",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 46,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 290 32 Q 250 55, 210 32 T 130 32 T 50 32 T 10 32",
							fill: "none",
							stroke: "#a7f3d0",
							strokeWidth: "3",
							strokeDasharray: "6 6",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 53,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "10",
							cy: "32",
							r: "8",
							fill: "#34d399"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 62,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "7",
							cy: "30",
							r: "1.8",
							fill: "#facc15"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 63,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 2 32 L -8 32 M -8 32 L -12 29 M -8 32 L -12 35",
							stroke: "#ef4444",
							strokeWidth: "2",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 64,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 45,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 44,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "absolute bottom-[4%] -left-[200px] w-[360px] h-[80px] opacity-25 animate-snake-crawl-3",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					viewBox: "0 0 360 80",
					className: "w-full h-full filter drop-shadow-[0_0_12px_#22c55e]",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 10 40 Q 55 15, 100 40 T 190 40 T 280 40 T 345 40",
							fill: "none",
							stroke: "#22c55e",
							strokeWidth: "14",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 76,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 10 40 Q 55 15, 100 40 T 190 40 T 280 40 T 345 40",
							fill: "none",
							stroke: "#bbf7d0",
							strokeWidth: "4",
							strokeDasharray: "10 10",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 83,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "348",
							cy: "40",
							r: "10",
							fill: "#86efac"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 91,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
							cx: "352",
							cy: "37",
							r: "2.5",
							fill: "#facc15"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 92,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
							d: "M 358 40 L 370 40 M 370 40 L 375 36 M 370 40 L 375 44",
							stroke: "#ef4444",
							strokeWidth: "2.5",
							strokeLinecap: "round"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 93,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 75,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 74,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 10,
		columnNumber: 5
	}, this);
}
function SnakeInsignia({ className = "w-8 h-8" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: `inline-flex items-center justify-center ${className} filter drop-shadow-[0_0_8px_#22c55e] animate-pulse`,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
			viewBox: "0 0 40 40",
			className: "w-full h-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
					d: "M 8 26 C 6 18, 12 10, 20 8 C 28 6, 34 12, 32 20 C 30 28, 22 34, 14 32 C 10 31, 8 28, 8 26 Z",
					fill: "#052e16",
					stroke: "#22c55e",
					strokeWidth: "2.5"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 112,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
					d: "M 14 20 Q 20 14, 26 18 Q 30 22, 24 26",
					fill: "none",
					stroke: "#4ade80",
					strokeWidth: "3.5",
					strokeLinecap: "round"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 118,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
					cx: "23",
					cy: "15",
					r: "2.2",
					fill: "#facc15"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 125,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
					cx: "23.5",
					cy: "15",
					r: "1",
					fill: "#000"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 126,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("polygon", {
					points: "26,20 28,24 25,22",
					fill: "#ffffff"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 128,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
					d: "M 28 22 L 34 24 M 34 24 L 37 22 M 34 24 L 37 26",
					stroke: "#ef4444",
					strokeWidth: "1.5",
					strokeLinecap: "round"
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 130,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 110,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 107,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/ui/dialog.tsx";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 21,
	columnNumber: 3
}, void 0));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay, {}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 37,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 48,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 49,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 47,
		columnNumber: 7
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 38,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$1,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 57,
	columnNumber: 3
}, void 0);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 62,
	columnNumber: 3
}, void 0);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 73,
	columnNumber: 3
}, void 0));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$1,
	lineNumber: 85,
	columnNumber: 3
}, void 0));
DialogDescription.displayName = DialogDescription$1.displayName;
var _jsxFileName = "/app/applet/src/routes/index.tsx?tsr-split=component";
var demoPlayer = {
	user_id: "demo",
	nick: "Gracz (Demo)",
	points: 0,
	best_score: 0,
	last_game_at: null,
	extra_games: 0,
	lives: 0,
	games_played: 0
};
function AdFrame({ slotIndex, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
		type: "button",
		onClick,
		className: "group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/70 p-3 text-center backdrop-blur-sm transition-all duration-200 hover:border-primary hover:bg-card/95 hover:scale-[1.02] hover:shadow-[0_0_18px_oklch(0.86_0.2_150/25%)] cursor-pointer w-full min-h-[122px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "absolute -top-2.5 rounded-full bg-secondary border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors",
				children: ["Slot #", slotIndex]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-xl mb-0.5 group-hover:scale-110 transition-transform",
				children: "📢"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 35,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "font-display text-sm text-glow text-primary group-hover:text-foreground transition-colors",
				children: "Reklama od 100pln"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 36,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mt-1 text-[11px] font-medium text-foreground/90 leading-tight",
				children: "Konta social media, grupki — to co chcecie, to wstawimy!"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 39,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mt-1 text-[10px] text-muted-foreground group-hover:text-accent transition-colors",
				children: "Kliknij i napisz na Telegram →"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 42,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 31,
		columnNumber: 10
	}, this);
}
function Index() {
	const { player, isAdmin, ready, refresh, user } = useAuth();
	const [tab, setTab] = (0, import_react.useState)("game");
	const [isGuest, setIsGuest] = (0, import_react.useState)(false);
	const [isCooperationOpen, setIsCooperationOpen] = (0, import_react.useState)(false);
	const [contactTelegram, setContactTelegram] = (0, import_react.useState)("");
	const [contactCompany, setContactCompany] = (0, import_react.useState)("");
	const [contactMessage, setContactMessage] = (0, import_react.useState)("");
	const [totalPlayers, setTotalPlayers] = (0, import_react.useState)(0);
	const [onlineCount, setOnlineCount] = (0, import_react.useState)(14);
	const [rk, setRk] = (0, import_react.useState)(0);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	(0, import_react.useEffect)(() => {
		supabase.from("players").select("*", {
			count: "exact",
			head: true
		}).then(({ count }) => {
			if (count !== null && count !== void 0) setTotalPlayers(count);
		});
	}, [rk]);
	(0, import_react.useEffect)(() => {
		const getFluctuatedOnline = () => {
			const hour = (/* @__PURE__ */ new Date()).getHours();
			const base = 9 + (hour >= 16 && hour <= 23 ? 10 : 4);
			const variation = Math.floor(Math.random() * 5) - 2;
			return Math.max(3, base + variation);
		};
		setOnlineCount(getFluctuatedOnline());
		const interval = setInterval(() => {
			setOnlineCount((prev) => {
				const delta = Math.floor(Math.random() * 3) - 1;
				return Math.max(2, prev + delta);
			});
		}, 1e4);
		return () => clearInterval(interval);
	}, []);
	const onChange = () => {
		refresh();
		setRk((k) => k + 1);
	};
	const handleContactSubmit = (e) => {
		e.preventDefault();
		toast.success("Dziękujemy za kontakt! Odezwiemy się na Telegramie w ciągu 24h.");
		setContactTelegram("");
		setContactCompany("");
		setContactMessage("");
		setIsCooperationOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "relative min-h-screen w-full flex justify-center px-2 sm:px-4 py-6 gap-4 xl:gap-8 overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AmbientSnakes, {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 114,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: "hidden lg:flex flex-col gap-4 w-44 xl:w-56 shrink-0 pt-16 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center space-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-display text-[11px] text-muted-foreground tracking-wider uppercase",
						children: "Miejsca reklamowe"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 119,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-[10px] text-primary/80 font-medium",
						children: "Social media · Grupki"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 122,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 118,
					columnNumber: 9
				}, this), Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdFrame, {
					slotIndex: i + 1,
					onClick: () => setIsCooperationOpen(true)
				}, `left-${i}`, false, {
					fileName: _jsxFileName,
					lineNumber: 126,
					columnNumber: 24
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 117,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "w-full max-w-xl px-2 sm:px-4 space-y-5 z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex justify-between items-center text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SnakeInsignia, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 134,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-display text-primary",
								children: "SNAKE ARENA"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 133,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2 font-mono text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "relative flex h-2 w-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 140,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 141,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 139,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground text-[11px]",
										children: "Online: "
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 143,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-bold text-foreground text-xs",
										children: onlineCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 144,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border px-3 py-1 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground text-[11px]",
									children: "Gracze: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-bold text-primary text-xs",
									children: totalPlayers
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 148,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 146,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
						className: "text-center space-y-1 relative",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-center gap-2.5 sm:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SnakeInsignia, { className: "w-8 h-8 sm:w-10 sm:h-10 shrink-0" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
									className: "font-display text-3xl sm:text-5xl text-primary text-glow tracking-wide",
									children: "SNAKE ARENA"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 156,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SnakeInsignia, { className: "w-8 h-8 sm:w-10 sm:h-10 shrink-0 -scale-x-100" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 159,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 154,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-muted-foreground text-sm",
							children: "Jedna gra co 24 godziny. Graj mądrze."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 161,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 153,
						columnNumber: 9
					}, this),
					mounted && ready && /* @__PURE__ */ (void 0)("nav", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (void 0)(Button, {
								variant: tab === "game" ? "default" : "chip",
								className: "flex-1 min-w-[90px]",
								onClick: () => setTab("game"),
								children: user ? "🐍 Gra" : isGuest ? "🐍 Gra (Demo)" : "🔑 Logowanie / Gra"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 165,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: tab === "shop" ? "default" : "chip",
								className: "flex-1 min-w-[130px] border border-primary/40 text-primary hover:bg-primary/20",
								onClick: () => setTab("shop"),
								children: "🎁 Wymiana punktów"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 168,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: tab === "info" ? "default" : "chip",
								className: "flex-1 min-w-[80px]",
								onClick: () => setTab("info"),
								children: "ℹ️ Zasady"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 171,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (void 0)(Button, {
								variant: "chip",
								className: "flex-1 min-w-[110px] text-accent border border-accent/40 hover:bg-accent/20",
								onClick: () => setIsCooperationOpen(true),
								children: "🤝 Współpraca"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 13
							}, this),
							isAdmin && !isGuest && /* @__PURE__ */ (void 0)(Button, {
								variant: tab === "admin" ? "default" : "chip",
								className: "flex-1 min-w-[80px]",
								onClick: () => setTab("admin"),
								children: "👑 Admin"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 177,
								columnNumber: 37
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 164,
						columnNumber: 30
					}, this),
					!mounted || !ready ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-center text-muted-foreground",
						children: "Ładowanie…"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 182,
						columnNumber: 31
					}, this) : tab === "shop" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PointExchange, {
						player: player || demoPlayer,
						isDemo: isGuest || !user,
						onBackToGame: () => setTab("game"),
						backLabel: user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 182,
						columnNumber: 114
					}, this) : tab === "info" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "panel p-5 space-y-3 text-sm leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between pb-2 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setTab("game"),
									className: "gap-1.5 text-xs",
									children: ["← ", user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 184,
									columnNumber: 15
								}, this), isGuest && /* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => {
										setIsGuest(false);
										setTab("game");
									},
									className: "text-xs text-accent",
									children: "🔑 Logowanie"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 187,
									columnNumber: 27
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 183,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-xl",
								children: "Zasady"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 194,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
								"🎮 Każdy gracz ma ",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "jedną grę co 24 godziny" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 196,
									columnNumber: 33
								}, this),
								". Konto startuje z 0 punktów."
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "🍋 Jedzenie: +1 pkt · 🪙 złoty punkt: +3 pkt · ✨ co 25 pkt boost — przeszkody przestają działać na 8 s." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 198,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "❤️ Życie pozwala kontynuować grę po zderzeniu. Życia i dodatkowe gry przyznaje administrator." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 202,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "🔒 Jedno konto = jeden nick. Nicku nie da się zmienić." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 206,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-3 text-center border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "default",
									onClick: () => setTab("game"),
									className: "w-full sm:w-auto",
									children: ["← ", user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 208,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 207,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 182,
						columnNumber: 336
					}, this) : tab === "admin" && isAdmin && !isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between pb-1",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setTab("game"),
									className: "gap-1.5 text-xs",
									children: "← Wróć do gry"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 214,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 213,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdminPanel, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 218,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-2 text-center",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setTab("game"),
									className: "w-full sm:w-auto",
									children: "← Wróć do gry"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 220,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 219,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 212,
						columnNumber: 65
					}, this) : !user && !isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthCard, { onPlayAsGuest: () => setIsGuest(true) }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 224,
						columnNumber: 40
					}, this) : isGuest ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between panel px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground",
								children: "Grasz jako"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-display text-lg text-accent",
								children: "Gracz (Demo)"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 228,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 226,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "chip",
									size: "sm",
									onClick: () => setIsGuest(false),
									children: "🔑 Nowe konto / Logowanie"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 231,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 230,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 225,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-xl border border-accent/40 bg-accent/15 px-4 py-3 text-center text-sm font-semibold text-accent",
							children: "Gra jako Gracz jest Demo i sie nie licza punkty."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 236,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SnakeGame, {
							player: demoPlayer,
							onChange,
							isDemo: true
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 239,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ranking, { refreshKey: rk }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 240,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 224,
						columnNumber: 104
					}, this) : !player ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-center text-muted-foreground",
						children: "Nie znaleziono konta gracza."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 241,
						columnNumber: 27
					}, this) : tab === "game" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between panel px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-xs text-muted-foreground",
								children: "Grasz jako"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 244,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-display text-lg",
								children: player.nick
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 243,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground",
									children: "Twoje punkty"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 248,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-display text-lg text-primary",
									children: player.points
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 249,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 247,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 242,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SnakeGame, {
							player,
							onChange
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 252,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ranking, { refreshKey: rk }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 253,
							columnNumber: 13
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 241,
						columnNumber: 128
					}, this) : isAdmin && /* @__PURE__ */ (void 0)(AdminPanel, {}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 254,
						columnNumber: 28
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "lg:hidden panel p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-display text-sm text-primary",
								children: "📢 Miejsca na reklamę"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 259,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "link",
								size: "sm",
								className: "text-xs text-accent p-0 h-auto",
								onClick: () => setIsCooperationOpen(true),
								children: "Współpraca od 100 PLN →"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 260,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 258,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-2",
							children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdFrame, {
								slotIndex: i + 1,
								onClick: () => setIsCooperationOpen(true)
							}, `mobile-${i}`, false, {
								fileName: _jsxFileName,
								lineNumber: 267,
								columnNumber: 28
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 264,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 257,
						columnNumber: 9
					}, this),
					mounted && isGuest && /* @__PURE__ */ (void 0)("div", {
						className: "text-center",
						children: /* @__PURE__ */ (void 0)(Button, {
							variant: "link",
							onClick: () => setIsGuest(false),
							children: "← Powrót do logowania i rejestracji"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 272,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 271,
						columnNumber: 32
					}, this),
					mounted && user && /* @__PURE__ */ (void 0)("div", {
						className: "text-center",
						children: /* @__PURE__ */ (void 0)(Button, {
							variant: "link",
							onClick: () => supabase.auth.signOut(),
							children: "Wyloguj"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 278,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 277,
						columnNumber: 29
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 130,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
				className: "hidden lg:flex flex-col gap-4 w-44 xl:w-56 shrink-0 pt-16 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center space-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-display text-[11px] text-muted-foreground tracking-wider uppercase",
						children: "Miejsca reklamowe"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 287,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-[10px] text-primary/80 font-medium",
						children: "Social media · Grupki"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 290,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 286,
					columnNumber: 9
				}, this), Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdFrame, {
					slotIndex: i + 5,
					onClick: () => setIsCooperationOpen(true)
				}, `right-${i}`, false, {
					fileName: _jsxFileName,
					lineNumber: 294,
					columnNumber: 24
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 285,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: isCooperationOpen,
				onOpenChange: setIsCooperationOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
						className: "font-display text-xl text-primary text-glow flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "🤝" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 302,
							columnNumber: 15
						}, this), " Współpraca i Reklama"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 301,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
						className: "text-muted-foreground text-sm",
						children: "Zareklamuj swój produkt, stronę lub markę w Snake Arena."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 304,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 300,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-center space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs uppercase tracking-wider text-muted-foreground",
										children: "Pakiet banerowy"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 311,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "font-display text-2xl text-primary",
										children: "Reklama od 100 PLN"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 314,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "rounded-lg bg-secondary/90 border border-primary/30 p-2.5 text-xs text-foreground font-semibold",
										children: "🔥 Można reklamować konta na social mediach, grupki — to co chcecie, to wstawimy!"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 315,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground",
										children: "Instagram, TikTok, Telegram, grupy Discord / Facebook, kanały YouTube, strony i projekty."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 318,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 310,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
									className: "font-semibold text-foreground text-xs uppercase tracking-wider",
									children: "Dostępne formaty reklamowe:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 325,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
									className: "space-y-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-primary font-bold",
												children: "✓"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 330,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "4 ramki po lewej i 4 po prawej stronie" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 332,
												columnNumber: 21
											}, this), " widoczne przez cały czas trwania gry"] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 331,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 329,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-primary font-bold",
												children: "✓"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 337,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "Baner po zakończeniu gry" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 339,
												columnNumber: 21
											}, this), " — bezpośrednio obok wyniku i rankingu"] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 338,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 336,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-primary font-bold",
												children: "✓"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 343,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", { children: "Sponsorowany turniej" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 345,
												columnNumber: 21
											}, this), " lub dedykowane nagrody z Twoim logo"] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 344,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 342,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 328,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 324,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								onSubmit: handleContactSubmit,
								className: "space-y-3 border-t border-border pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", {
										className: "font-semibold text-foreground text-xs uppercase tracking-wider",
										children: "Zgłoś chęć współpracy:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 352,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "Twój nick na Telegramie (np. @TwojNick)",
										value: contactTelegram,
										onChange: (e) => setContactTelegram(e.target.value),
										required: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 355,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "Nazwa Twojej firmy / link do strony",
										value: contactCompany,
										onChange: (e) => setContactCompany(e.target.value),
										required: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 356,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
										placeholder: "Krótki opis reklamy lub preferowany budżet...",
										value: contactMessage,
										onChange: (e) => setContactMessage(e.target.value),
										className: "w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[70px]",
										required: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 357,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "submit",
										variant: "hero",
										className: "w-full",
										children: "Wyślij zapytanie przez Telegram"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 358,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 351,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "border-t border-border pt-3 text-center text-xs space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-muted-foreground",
										children: "Kontakt wyłącznie przez Telegram:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 365,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
										href: "https://t.me/SnakeArenaAdmin",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1.5 font-display text-sm text-primary hover:underline hover:text-glow transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "✈️" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 367,
											columnNumber: 19
										}, this), " Telegram: @SnakeArenaAdmin"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 366,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 364,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									className: "w-full text-xs",
									onClick: () => {
										setIsCooperationOpen(false);
										setTab("game");
									},
									children: ["← ", user ? "Wróć do gry" : isGuest ? "Wróć do gry (Demo)" : "Wróć do menu logowania"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 370,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 363,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 309,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 299,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 298,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 112,
		columnNumber: 10
	}, this);
}
//#endregion
export { Index as component };
