"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";
import { InvoiceThumb } from "./InvoiceThumb";
import { MiniStamp } from "./MiniStamp";

const TOTAL_TICKS = 44;
const TICK_MS = 250;

function fadeClass(active: boolean) {
  return `absolute inset-0 transition-opacity duration-[450ms] ${
    active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`;
}

export function DemoVideo() {
  const { lang } = useLanguage();
  const t = copy[lang].demo;

  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);

  // Don't autoplay for users who asked the OS for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaying(false);
    }
  }, []);

  // Only animate while the demo is actually on screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = setInterval(() => {
      setTick((v) => (v + 1) % TOTAL_TICKS);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, inView]);

  const scene = Math.floor(tick / 11);
  const st = tick % 11;

  const inv = (threshold: number) => ({
    opacity: scene === 0 && st >= threshold ? 1 : 0,
    transform: scene === 0 && st >= threshold ? "translateY(0)" : "translateY(-16px)",
    transition: "opacity 0.4s, transform 0.4s",
  });

  const destValOpacity = scene === 1 && st >= 3 ? 1 : 0;
  const destCheckOpacity = scene === 1 && st >= 6 ? 1 : 0;
  const proc1Done = scene > 2 || (scene === 2 && st >= 4);
  const proc2Done = scene > 2 || (scene === 2 && st >= 9);
  const stampActive = scene === 3 && st >= 3;

  return (
    <section
      id="demo"
      className="mx-auto max-w-[1280px] px-5 pb-[60px] dt:grid dt:grid-cols-[34fr_66fr] dt:items-center dt:gap-[60px] dt:px-14 dt:pb-[130px]"
    >
      <div className="mb-6 dt:mb-0">
        <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:mb-5 dt:text-[13px] dt:tracking-[2.5px]">
          {t.eyebrow}
        </p>
        <h2 className="text-pretty m-0 mb-2.5 font-serif text-[26px] leading-[1.1] font-semibold dt:mb-[18px] dt:text-[44px]">
          {t.title}
        </h2>
        <p className="m-0 text-[15px] leading-[1.55] text-[#C7CCC2] dt:text-[16.5px]">{t.body}</p>
      </div>

      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-tl-[12px] rounded-tr-[6px] rounded-br-[10px] rounded-bl-[7px] border border-ink-muted/28 bg-[#121813] shadow-[0_20px_46px_rgba(10,7,3,0.5)]"
        style={{ aspectRatio: "16 / 10" }}
      >
        {/* App-window chrome */}
        <div className="absolute inset-x-0 top-0 flex h-[36px] items-center gap-3 border-b border-ink-muted/20 bg-[#0d120e] px-4">
          <div className="flex gap-[7px]">
            <span className="h-[10px] w-[10px] rounded-full bg-[#3a4038]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#3a4038]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#3a4038]" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <span className="rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] bg-ink-text/8 px-3 py-[3px] font-mono text-[10px] tracking-[0.5px] text-ink-muted dt:text-[11px]">
              app.sellium.eu
            </span>
          </div>
          <div className="w-[54px]" />
        </div>

        {/* Soft vignette for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        <div className="absolute inset-0 top-[36px] bottom-[46px]">
          {/* Scene 0 — drop bills */}
          <div className={fadeClass(scene === 0)}>
            <div className="flex h-full w-full flex-col items-center justify-center gap-7">
              <div className="rounded-tl-[10px] rounded-tr-[6px] rounded-br-[9px] rounded-bl-[6px] border-[1.5px] border-dashed border-ink-text/35 px-9 py-[30px] font-mono text-[12px] tracking-[1.5px] text-ink-muted dt:text-[13px]">
                {t.dropHint}
              </div>
              <div className="flex gap-[18px]">
                <div style={inv(2)}>
                  <InvoiceThumb accent="#B8763A" accentWidth="60%" lineWidths={["100%", "100%", "70%"]} />
                </div>
                <div style={inv(4)}>
                  <InvoiceThumb accent="#7C7368" accentWidth="45%" lineWidths={["100%", "80%", "55%"]} />
                </div>
                <div style={inv(6)}>
                  <InvoiceThumb accent="#4F6B4A" accentWidth="55%" lineWidths={["75%", "100%", "60%"]} />
                </div>
              </div>
            </div>
          </div>

          {/* Scene 1 — pick recipient */}
          <div className={fadeClass(scene === 1)}>
            <div className="flex h-full w-full items-center justify-center px-4">
              <div className="min-w-[260px] max-w-[340px] -rotate-[0.6deg] rounded-tl-[9px] rounded-tr-[5px] rounded-br-[8px] rounded-bl-[6px] bg-paper px-6 py-7 text-paper-text shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
                <p className="m-0 mb-4 font-serif text-[17px] font-semibold dt:text-[20px]">
                  {t.destQuestion}
                </p>
                <div className="flex items-center justify-between rounded-tl-[6px] rounded-tr-[4px] rounded-br-[7px] rounded-bl-[4px] border-[1.5px] border-paper-text px-4 py-3 text-[14px] dt:text-[15.5px]">
                  <span style={{ opacity: destValOpacity, fontWeight: 500, transition: "opacity 0.35s" }}>
                    {t.destValue}
                  </span>
                  <span className="text-[12px] text-paper-muted">▾</span>
                </div>
                <p
                  className="m-0 mt-3.5 text-[13.5px] text-[#4A443A]"
                  style={{ opacity: destCheckOpacity, transition: "opacity 0.35s" }}
                >
                  <span className="font-semibold text-verificado">✓</span> {t.destCheck}
                </p>
              </div>
            </div>
          </div>

          {/* Scene 2 — processing */}
          <div className={fadeClass(scene === 2)}>
            <div className="flex h-full w-full flex-col items-start justify-center gap-[18px] px-6 font-mono text-[13px] dt:px-[70px] dt:text-[14.5px]">
              <p
                className="m-0"
                style={{ color: proc1Done ? "#F2EEE0" : "#8C9689", transition: "color 0.3s" }}
              >
                {t.procLine1} <span className="text-verificado">{proc1Done ? "✓" : ""}</span>
              </p>
              <p
                className="m-0"
                style={{ color: proc2Done ? "#F2EEE0" : "#8C9689", transition: "color 0.3s" }}
              >
                {t.procLine2} <span className="text-verificado">{proc2Done ? "✓" : ""}</span>
              </p>
            </div>
          </div>

          {/* Scene 3 — stamped report */}
          <div className={fadeClass(scene === 3)}>
            <div className="flex h-full w-full items-center justify-center">
              <div className="relative min-w-[280px] rotate-[0.7deg] rounded-tl-[7px] rounded-tr-[10px] rounded-br-[5px] rounded-bl-[9px] bg-paper px-[26px] pt-6 pb-5 text-paper-text shadow-[0_12px_28px_rgba(0,0,0,0.45)]">
                <p className="m-0 mb-2.5 font-mono text-[9.5px] tracking-[1.5px] text-paper-muted uppercase dt:text-[10.5px]">
                  {t.reportFilename}
                </p>
                <div className="flex items-baseline justify-between gap-10 border-t-[1.5px] border-paper-text pt-2.5">
                  <span className="text-[13px] font-semibold dt:text-[14px]">{t.totalLabel}</span>
                  <span className="font-mono text-[18px] font-medium dt:text-[20px]">
                    {t.totalValue}
                  </span>
                </div>
                <div
                  className="absolute -top-[26px] -right-5"
                  style={{
                    opacity: stampActive ? 0.95 : 0,
                    transform: stampActive ? "scale(1) rotate(-10deg)" : "scale(1.7) rotate(-10deg)",
                    transition: "opacity 0.3s, transform 0.35s cubic-bezier(0.2, 1.6, 0.4, 1)",
                  }}
                >
                  <MiniStamp size={88} word={t.stampWord} variant="video" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-[46px] items-center gap-4 border-t border-ink-muted/20 bg-black/40 px-[18px]">
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar demo" : "Reproducir demo"}
            className="h-[26px] w-8 cursor-pointer rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] border border-ink-text/40 bg-transparent font-mono text-[11px] text-ink-text"
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <div className="h-[3px] flex-1 overflow-hidden rounded bg-ink-text/15">
            <div
              className="h-full bg-cta"
              style={{ width: `${((tick + 1) / TOTAL_TICKS) * 100}%`, transition: "width 0.25s linear" }}
            />
          </div>
          <span className="min-w-[150px] text-right font-mono text-[10.5px] tracking-[1px] text-ink-muted dt:min-w-[190px] dt:text-[11px]">
            {t.labels[scene]}
          </span>
        </div>
      </div>
    </section>
  );
}
