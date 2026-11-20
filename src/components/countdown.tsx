"use client";

import { useEffect, useState } from "react";

/** Time left until 1 January in Ulaanbaatar (UTC+8). Renders nothing on the server, then ticks every second. */
function left(now: number) {
  const ub = new Date(now + 8 * 3600_000);
  const year = ub.getUTCFullYear() + 1;
  const target = Date.UTC(year, 0, 1) - 8 * 3600_000;
  const s = Math.max(0, Math.floor((target - now) / 1000));
  return { year, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function Countdown({ className = "" }: { className?: string }) {
  const [t, setT] = useState<ReturnType<typeof left> | null>(null);
  useEffect(() => {
    const tick = () => setT(left(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const cells: [string, string][] = t
    ? [
        [String(t.d), "өдөр"],
        [String(t.h).padStart(2, "0"), "цаг"],
        [String(t.m).padStart(2, "0"), "минут"],
        [String(t.s).padStart(2, "0"), "секунд"],
      ]
    : [
        ["–", "өдөр"],
        ["–", "цаг"],
        ["–", "минут"],
        ["–", "секунд"],
      ];
  return (
    <div className={className} role="timer" aria-label={t ? `${t.year} оны шинэ жил хүртэл ${t.d} өдөр` : "Шинэ жил хүртэл"}>
      <p className="text-[12.5px] font-bold tracking-[0.08em] text-gold">{t ? `${t.year} он хүртэл` : "Шинэ жил хүртэл"}</p>
      <div className="mt-2 flex gap-2">
        {cells.map(([v, l]) => (
          <span key={l} className="grid min-w-[58px] place-items-center rounded-2xl bg-snow/10 px-2 py-2 ring-1 ring-snow/20 backdrop-blur-sm">
            <b className="display text-[26px] leading-none tabular-nums text-snow">{v}</b>
            <span className="mt-1 text-[11px] font-semibold text-snow/70">{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
