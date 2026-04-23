import React, { useEffect, useState } from 'react';
import { FlappyGame } from './FlappyPaging';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen bg-void flex flex-col pt-24 pb-6 px-4 lg:px-6 font-sans text-white relative overflow-hidden"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyber/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-200px] w-[600px] h-[600px] bg-gradient-radial from-[#D13814]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto flex-1 flex flex-col gap-4 relative z-10 min-h-0">

        {/* ── Main Bento Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 flex-1 min-h-0">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-4 min-h-0">

            {/* Title Card */}
            <div
              className={`bg-deep border border-white/[0.06] rounded-[28px] p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden hover-lift transition-all duration-500 ${loaded ? 'animate-fade-up' : 'opacity-0'}`}
            >
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyber/5 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                {["FIFO", "LRU", "OPTIMAL", "PAGE TABLES", "VIRTUAL MEMORY"].map((tag, i) => (
                  <span
                    key={tag}
                    className="text-[8px] font-bold tracking-[0.15em] uppercase border border-white/10 rounded-full px-3 py-1 text-white/50 flex items-center gap-1.5 hover:border-cyber/30 transition-colors"
                  >
                    {tag}
                    <span className={`w-1.5 h-1.5 rounded-full ${i < 3 ? 'bg-cyber' : 'bg-white/20'}`} />
                  </span>
                ))}
              </div>

              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tighter mb-4">
                  <span className="text-gradient-animated">PAGING</span>
                  <br />
                  <span className="text-white">SIMULATION.</span>
                </h1>
                <p className="text-white/40 text-xs font-mono leading-relaxed max-w-sm">
                  Forged in OS theory — a complete interactive visualization of virtual memory, page tables, and replacement algorithms.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 relative z-10">
                <a
                  href="#simulation"
                  className="bg-cyber text-void font-bold text-xs tracking-widest px-5 py-2.5 rounded-xl hover:bg-[#b0ff1a] transition-all hover:shadow-[0_0_24px_rgba(163,255,0,0.3)] active:translate-y-0.5"
                >
                  ▶ EXPLORE SIMULATION
                </a>
                <a
                  href="#theory"
                  className="border border-white/15 text-white/70 font-bold text-xs tracking-widest px-5 py-2.5 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  READ THEORY
                </a>
              </div>
            </div>

            {/* ── Bottom Row: Analogy Card + Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr] gap-4 flex-1 min-h-0">

              {/* Analogy Card — Page Hits as Flappy Bird */}
              <div
                className={`bg-deep border border-white/[0.06] rounded-[28px] p-5 lg:p-6 flex flex-col justify-between relative overflow-hidden hover-lift transition-all duration-500 ${loaded ? 'animate-fade-up delay-200' : 'opacity-0'}`}
              >
                <div className="text-cyber font-bold tracking-[0.25em] text-[9px] uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyber animate-pulse" />
                  ANALOGY
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="text-lg lg:text-xl font-black tracking-tight leading-tight text-white">
                    Page Hits & Misses<br />
                    <span className="text-cyber">as Flappy Bird.</span>
                  </h3>

                  {/* Hit Analogy */}
                  <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-cyber/20 border border-cyber/30 flex items-center justify-center shrink-0 text-sm">
                      ✓
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-cyber tracking-wider">PAGE HIT = PASS THROUGH GAP</div>
                      <div className="text-[9px] text-white/40 mt-0.5 leading-relaxed">
                        The page "bird" flies through the frame gap — data found in RAM. No disk access needed.
                      </div>
                    </div>
                  </div>

                  {/* Fault Analogy */}
                  <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D13814]/20 border border-[#D13814]/30 flex items-center justify-center shrink-0 text-sm">
                      ✗
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#FF6B4A] tracking-wider">PAGE FAULT = CRASH INTO PIPE</div>
                      <div className="text-[9px] text-white/40 mt-0.5 leading-relaxed">
                        The page isn't in memory — collision! The OS must fetch from disk and potentially evict another page.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] text-white/20 font-mono tracking-widest mt-3 pt-3 border-t border-white/[0.04]">
                  TRY THE GAME ON THE RIGHT →
                </div>
              </div>

              {/* Stats / Info Column */}
              <div className="flex flex-col gap-4">
                {/* Quick Stat Cards */}
                <div
                  className={`grid grid-cols-2 gap-3 transition-all duration-500 ${loaded ? 'animate-fade-up delay-300' : 'opacity-0'}`}
                >
                  <div className="bg-deep border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center justify-center hover-lift text-center">
                    <div className="text-2xl font-black text-cyber font-mono">3</div>
                    <div className="text-[8px] font-bold tracking-[0.2em] text-white/30 mt-1">ALGORITHMS</div>
                  </div>
                  <div className="bg-deep border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center justify-center hover-lift text-center">
                    <div className="text-2xl font-black text-white font-mono">16</div>
                    <div className="text-[8px] font-bold tracking-[0.2em] text-white/30 mt-1">PAGES</div>
                  </div>
                </div>

                {/* Address mapping card */}
                <div
                  className={`bg-deep border border-white/[0.06] rounded-2xl p-4 flex-1 flex flex-col justify-center hover-lift relative overflow-hidden transition-all duration-500 ${loaded ? 'animate-fade-up delay-400' : 'opacity-0'}`}
                >
                  <div className="font-mono text-[10px] tracking-widest text-white/20 mb-3">LIVE MAPPING</div>
                  <div className="font-mono text-lg font-bold tracking-widest text-cyber leading-tight">
                    PAGE 07 →<br />FRAME 02
                  </div>
                  <div className="font-mono text-[9px] tracking-widest text-[#D13814] mt-2 font-bold">[ALLOCATED]</div>
                  <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyber opacity-5 rounded-full blur-xl pointer-events-none transform -translate-y-1/2" />
                </div>

                {/* Interactive badge — scrolls to sim and auto-plays */}
                <button
                  onClick={() => {
                    document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => { if (window.__startPagingAutoPlay) window.__startPagingAutoPlay(); }, 800);
                  }}
                  className={`bg-[#D13814] rounded-2xl p-4 flex items-center gap-3 hover-lift cursor-pointer transition-all duration-500 w-full text-left ${loaded ? 'animate-fade-up delay-500' : 'opacity-0'}`}
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-white/70">INTERACTIVE</div>
                    <div className="text-xs font-black text-white tracking-tight">Auto-Play Simulation</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Flappy Bird Game ── */}
          <div
            className={`hidden lg:flex flex-col gap-4 min-h-0 transition-all duration-500 ${loaded ? 'animate-slide-right delay-200' : 'opacity-0'}`}
          >
            {/* Game Title */}
            <div className="text-center">
              <h2 className="text-2xl font-black tracking-tighter text-white">FLAPPY <span className="text-cyber">PAGING</span></h2>
              <div className="text-[9px] font-mono text-white/30 tracking-widest mt-1">NAVIGATE THE PAGE THROUGH FRAMES</div>
            </div>

            {/* Game Header */}
            <div className="bg-deep border border-white/[0.06] rounded-2xl px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyber animate-pulse" />
                <span className="text-[9px] font-bold tracking-[0.25em] text-white/50 uppercase">Live Game</span>
              </div>
              <span className="text-[9px] font-mono text-white/30">SPACE / CLICK</span>
            </div>

            {/* Game Container */}
            <div className="flex-1 bg-deep border border-white/[0.06] rounded-[28px] overflow-hidden flex items-center justify-center relative animate-pulse-glow p-2 min-h-0">
              <FlappyGame width={360} height={460} compact={true} />
            </div>
          </div>

          {/* Mobile: Flappy Bird section */}
          <div className="lg:hidden flex flex-col gap-3">
            <div className="bg-deep border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyber animate-pulse" />
                <span className="text-[9px] font-bold tracking-[0.25em] text-white/50 uppercase">Flappy Paging</span>
              </div>
              <span className="text-[9px] font-mono text-white/30">TAP TO PLAY</span>
            </div>
            <div className="flex justify-center">
              <FlappyGame width={340} height={400} compact={true} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
