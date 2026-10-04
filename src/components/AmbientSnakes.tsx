import { useEffect, useState } from "react";

export function AmbientSnakes() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Wąż 1: Pełzający z lewej do prawej po przekątnej na górze */}
      <div className="absolute top-[8%] -left-[160px] w-[320px] h-[70px] opacity-35 animate-snake-crawl-1">
        <svg viewBox="0 0 320 70" className="w-full h-full filter drop-shadow-[0_0_8px_#22c55e]">
          <path
            d="M 10 35 Q 50 10, 90 35 T 170 35 T 250 35 T 300 35"
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
            className="animate-slither-path"
          />
          <path
            d="M 10 35 Q 50 10, 90 35 T 170 35 T 250 35 T 300 35"
            fill="none"
            stroke="#86efac"
            strokeWidth="4"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
          {/* Głowa węża */}
          <circle cx="304" cy="35" r="9" fill="#4ade80" />
          <circle cx="308" cy="32" r="2" fill="#facc15" />
          {/* Język węża */}
          <path
            d="M 313 35 L 324 35 M 324 35 L 328 32 M 324 35 L 328 38"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wąż 2: Pełzający z prawej strony ekranu w dół */}
      <div className="absolute top-[40%] -right-[150px] w-[300px] h-[65px] opacity-30 animate-snake-crawl-2">
        <svg viewBox="0 0 300 65" className="w-full h-full filter drop-shadow-[0_0_10px_#10b981]">
          <path
            d="M 290 32 Q 250 55, 210 32 T 130 32 T 50 32 T 10 32"
            fill="none"
            stroke="#10b981"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 290 32 Q 250 55, 210 32 T 130 32 T 50 32 T 10 32"
            fill="none"
            stroke="#a7f3d0"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          {/* Głowa węża */}
          <circle cx="10" cy="32" r="8" fill="#34d399" />
          <circle cx="7" cy="30" r="1.8" fill="#facc15" />
          <path
            d="M 2 32 L -8 32 M -8 32 L -12 29 M -8 32 L -12 35"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wąż 3: Pełzający na dole ekranu w poprzek */}
      <div className="absolute bottom-[4%] -left-[200px] w-[360px] h-[80px] opacity-25 animate-snake-crawl-3">
        <svg viewBox="0 0 360 80" className="w-full h-full filter drop-shadow-[0_0_12px_#22c55e]">
          <path
            d="M 10 40 Q 55 15, 100 40 T 190 40 T 280 40 T 345 40"
            fill="none"
            stroke="#22c55e"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 10 40 Q 55 15, 100 40 T 190 40 T 280 40 T 345 40"
            fill="none"
            stroke="#bbf7d0"
            strokeWidth="4"
            strokeDasharray="10 10"
            strokeLinecap="round"
          />
          <circle cx="348" cy="40" r="10" fill="#86efac" />
          <circle cx="352" cy="37" r="2.5" fill="#facc15" />
          <path
            d="M 358 40 L 370 40 M 370 40 L 375 36 M 370 40 L 375 44"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function SnakeInsignia({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className} filter drop-shadow-[0_0_8px_#22c55e] animate-pulse`}
    >
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {/* Neonowa głowa węża z kłami */}
        <path
          d="M 8 26 C 6 18, 12 10, 20 8 C 28 6, 34 12, 32 20 C 30 28, 22 34, 14 32 C 10 31, 8 28, 8 26 Z"
          fill="#052e16"
          stroke="#22c55e"
          strokeWidth="2.5"
        />
        <path
          d="M 14 20 Q 20 14, 26 18 Q 30 22, 24 26"
          fill="none"
          stroke="#4ade80"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="23" cy="15" r="2.2" fill="#facc15" />
        <circle cx="23.5" cy="15" r="1" fill="#000" />
        {/* Kły */}
        <polygon points="26,20 28,24 25,22" fill="#ffffff" />
        {/* Język */}
        <path
          d="M 28 22 L 34 24 M 34 24 L 37 22 M 34 24 L 37 26"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
