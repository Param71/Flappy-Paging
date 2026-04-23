import React, { useState, useEffect, useRef, useCallback } from "react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Algorithm implementations ─────────────────────────────────────
function simulateFIFO(refString, frameCount) {
  const steps = [];
  let frames = [];
  let queue = []; // track insertion order
  let hits = 0, faults = 0;

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    const isHit = frames.includes(page);
    let evicted = null;

    if (isHit) {
      hits++;
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames = [...frames, page];
        queue = [...queue, page];
      } else {
        evicted = queue[0];
        queue = [...queue.slice(1), page];
        frames = frames.map(f => f === evicted ? page : f);
      }
    }

    steps.push({
      page,
      frames: [...frames],
      isHit,
      evicted,
      hitsSoFar: hits,
      faultsSoFar: faults,
    });
  }
  return { steps, hits, faults };
}

function simulateLRU(refString, frameCount) {
  const steps = [];
  let frames = [];
  let recent = []; // most recent at end
  let hits = 0, faults = 0;

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    const isHit = frames.includes(page);
    let evicted = null;

    if (isHit) {
      hits++;
      recent = [...recent.filter(p => p !== page), page];
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames = [...frames, page];
      } else {
        evicted = recent[0];
        frames = frames.map(f => f === evicted ? page : f);
        recent = recent.filter(p => p !== evicted);
      }
      recent = [...recent, page];
    }

    steps.push({
      page,
      frames: [...frames],
      isHit,
      evicted,
      hitsSoFar: hits,
      faultsSoFar: faults,
    });
  }
  return { steps, hits, faults };
}

function simulateOptimal(refString, frameCount) {
  const steps = [];
  let frames = [];
  let hits = 0, faults = 0;

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    const isHit = frames.includes(page);
    let evicted = null;

    if (isHit) {
      hits++;
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames = [...frames, page];
      } else {
        // Find the page used farthest in future
        let farthest = -1, victim = frames[0];
        for (const f of frames) {
          const nextUse = refString.slice(i + 1).indexOf(f);
          if (nextUse === -1) { victim = f; break; }
          if (nextUse > farthest) { farthest = nextUse; victim = f; }
        }
        evicted = victim;
        frames = frames.map(f => f === evicted ? page : f);
      }
    }

    steps.push({
      page,
      frames: [...frames],
      isHit,
      evicted,
      hitsSoFar: hits,
      faultsSoFar: faults,
    });
  }
  return { steps, hits, faults };
}

const DEFAULT_REF = "7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1";

export default function PagingSimulation() {
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [refInput, setRefInput] = useState(DEFAULT_REF);
  const [refString, setRefString] = useState([]);
  const [simResult, setSimResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [isComplete, setIsComplete] = useState(false);

  const playingRef = useRef(false);
  const stepRef = useRef(-1);
  const scrollContainerRef = useRef(null);

  // Parse and run simulation
  const runSimulation = useCallback(() => {
    const parsed = refInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length === 0) return;
    setRefString(parsed);

    let result;
    if (algorithm === "FIFO") result = simulateFIFO(parsed, frameCount);
    else if (algorithm === "LRU") result = simulateLRU(parsed, frameCount);
    else result = simulateOptimal(parsed, frameCount);

    setSimResult(result);
    setCurrentStep(-1);
    stepRef.current = -1;
    setIsComplete(false);
    setIsPlaying(false);
    playingRef.current = false;
  }, [refInput, algorithm, frameCount]);

  // Generate random ref string
  const generateRandom = () => {
    const len = 12 + Math.floor(Math.random() * 8);
    const maxPage = 5 + Math.floor(Math.random() * 4);
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * maxPage));
    setRefInput(arr.join(","));
  };

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying || !simResult) return;
    playingRef.current = true;

    const interval = setInterval(() => {
      if (!playingRef.current) { clearInterval(interval); return; }
      const next = stepRef.current + 1;
      if (next >= simResult.steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
        playingRef.current = false;
        setIsComplete(true);
        return;
      }
      stepRef.current = next;
      setCurrentStep(next);
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, simResult, speed]);

  // Auto-scroll the steps container
  useEffect(() => {
    if (currentStep >= 0 && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const child = el.children[currentStep];
      if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentStep]);

  const handlePlay = () => {
    if (!simResult) { runSimulation(); return; }
    if (isComplete) {
      // Restart
      setCurrentStep(-1);
      stepRef.current = -1;
      setIsComplete(false);
      setTimeout(() => { setIsPlaying(true); }, 50);
    } else {
      setIsPlaying(true);
    }
  };

  const handlePause = () => { setIsPlaying(false); playingRef.current = false; };

  const handleStep = () => {
    if (!simResult) { runSimulation(); return; }
    if (currentStep < simResult.steps.length - 1) {
      const next = currentStep + 1;
      stepRef.current = next;
      setCurrentStep(next);
      if (next >= simResult.steps.length - 1) setIsComplete(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    playingRef.current = false;
    setCurrentStep(-1);
    stepRef.current = -1;
    setSimResult(null);
    setIsComplete(false);
  };

  // Called from Hero auto-play button
  useEffect(() => {
    const handler = () => {
      generateRandom();
      setTimeout(() => {
        const parsed = refInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length > 0) { runSimulation(); setTimeout(() => handlePlay(), 200); }
      }, 100);
    };
    window.__startPagingAutoPlay = handler;
  }, [refInput, runSimulation]);

  const step = currentStep >= 0 && simResult ? simResult.steps[currentStep] : null;

  return (
    <div className="bg-transparent p-4 font-sans text-white flex justify-center">
      <div className="w-full max-w-[1100px] flex flex-col gap-4">

        {/* ── Controls Bar ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4">
          {/* Algorithm & Frame selector */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="border border-white/10 rounded-lg px-2.5 py-1 font-black text-xs tracking-widest text-cyber">OS::PAGER</div>
              <div className="hidden sm:block text-[10px] tracking-widest text-white/30 font-bold">SIMULATION</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["FIFO", "LRU", "OPT"].map(a => (
                <button key={a} onClick={() => { setAlgorithm(a); handleReset(); }}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-full border transition-all tracking-wider ${algorithm === a ? 'bg-cyber text-void border-cyber' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
                >{a}</button>
              ))}
              <div className="w-px h-6 bg-white/10 mx-1 self-center hidden sm:block" />
              {[3, 4, 5].map(n => (
                <button key={n} onClick={() => { setFrameCount(n); handleReset(); }}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all ${frameCount === n ? 'bg-white text-void border-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
                >{n} Frames</button>
              ))}
            </div>
          </div>

          {/* Reference String Input */}
          <div className="flex gap-2 items-center flex-wrap">
            <div className="text-[9px] tracking-widest text-white/30 font-bold shrink-0">REF STRING</div>
            <input
              type="text"
              value={refInput}
              onChange={e => setRefInput(e.target.value)}
              className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-cyber transition-colors"
              placeholder="e.g. 7,0,1,2,0,3,0,4"
            />
            <button onClick={generateRandom}
              className="px-4 py-2.5 text-[10px] font-bold tracking-wider border border-white/10 rounded-xl text-white/60 hover:bg-white/5 transition-all"
            >🎲 RANDOM</button>
            <button onClick={runSimulation}
              className="px-5 py-2.5 text-[10px] font-bold tracking-wider bg-cyber text-void rounded-xl hover:bg-[#b0ff1a] transition-all"
            >LOAD</button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {!isPlaying ? (
              <button onClick={handlePlay} disabled={!simResult && refInput.length === 0}
                className="px-6 py-2.5 text-xs font-bold tracking-wider bg-cyber text-void rounded-xl hover:bg-[#b0ff1a] transition-all flex items-center gap-2 disabled:opacity-30"
              >▶ {isComplete ? 'REPLAY' : 'PLAY'}</button>
            ) : (
              <button onClick={handlePause}
                className="px-6 py-2.5 text-xs font-bold tracking-wider bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
              >⏸ PAUSE</button>
            )}
            <button onClick={handleStep} disabled={isPlaying || (isComplete)}
              className="px-4 py-2.5 text-xs font-bold tracking-wider border border-white/10 text-white/60 rounded-xl hover:bg-white/5 transition-all disabled:opacity-30"
            >⏭ STEP</button>
            <button onClick={handleReset}
              className="px-4 py-2.5 text-xs font-bold tracking-wider border border-white/10 text-white/60 rounded-xl hover:bg-white/5 transition-all"
            >↺ RESET</button>

            {/* Speed */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[9px] tracking-widest text-white/30 font-bold">SPEED</span>
              {[{ label: "SLOW", val: 1000 }, { label: "MED", val: 600 }, { label: "FAST", val: 250 }].map(s => (
                <button key={s.label} onClick={() => setSpeed(s.val)}
                  className={`px-3 py-1 text-[9px] font-bold rounded-full border transition-all ${speed === s.val ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-white/30 hover:text-white/50'}`}
                >{s.label}</button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {simResult && (
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-cyber rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / simResult.steps.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* ── Visualization — Like the textbook images ── */}
        {simResult && (
          <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] tracking-widest text-white/30 font-bold">
                {algorithm} — {frameCount} FRAMES — REFERENCE STRING VISUALIZATION
              </div>
              {step && (
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${step.isHit ? 'bg-cyber/20 text-cyber' : 'bg-[#D13814]/20 text-[#FF6B4A]'}`}>
                  Step {currentStep + 1}/{simResult.steps.length}: {step.isHit ? '✓ HIT' : '✗ FAULT'}
                </div>
              )}
            </div>

            {/* Reference string + frame columns (scroll horizontal) */}
            <div className="overflow-x-auto custom-scrollbar pb-4" ref={scrollContainerRef}>
              <div className="flex gap-0 min-w-max">
                {simResult.steps.map((s, i) => {
                  const isActive = i === currentStep;
                  const isDone = i < currentStep;
                  const isFuture = i > currentStep;

                  return (
                    <div key={i}
                      className={`flex flex-col items-center transition-all duration-300 ${isFuture ? 'opacity-20' : isDone ? 'opacity-70' : 'opacity-100'}`}
                      style={{ minWidth: 56 }}
                    >
                      {/* Reference string number */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg mb-2 border-2 transition-all duration-300 ${
                        isActive
                          ? (s.isHit ? 'bg-cyber text-void border-cyber scale-110 shadow-[0_0_16px_rgba(163,255,0,0.3)]' : 'bg-[#D13814] text-white border-[#D13814] scale-110 shadow-[0_0_16px_rgba(209,56,20,0.3)]')
                          : isDone
                            ? (s.isHit ? 'bg-cyber/10 text-cyber/60 border-cyber/20' : 'bg-[#D13814]/10 text-[#FF6B4A]/60 border-[#D13814]/20')
                            : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {s.page}
                      </div>

                      {/* Frame column (vertical stack of frames) */}
                      <div className={`flex flex-col gap-0.5 transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
                        {s.frames.map((f, fi) => {
                          const isNew = !s.isHit && f === s.page;
                          return (
                            <div key={fi}
                              className={`w-10 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold border transition-all duration-300 ${
                                isActive && isNew
                                  ? 'bg-cyber/30 border-cyber text-cyber'
                                  : isActive && f === s.page && s.isHit
                                    ? 'bg-cyber/20 border-cyber/50 text-cyber'
                                    : (isDone || isActive)
                                      ? 'bg-white/5 border-white/10 text-white/70'
                                      : 'bg-white/[0.02] border-white/5 text-white/20'
                              }`}
                            >
                              {(isDone || isActive) ? f : ''}
                            </div>
                          );
                        })}
                        {/* Empty frame slots */}
                        {Array.from({ length: Math.max(0, frameCount - s.frames.length) }).map((_, ei) => (
                          <div key={`e${ei}`} className="w-10 h-9 rounded-lg border border-dashed border-white/5 flex items-center justify-center text-white/10 text-xs">—</div>
                        ))}
                      </div>

                      {/* Hit/Fault label below */}
                      <div className={`mt-2 text-[9px] font-bold tracking-wider h-4 transition-all duration-300 ${
                        (isDone || isActive)
                          ? (s.isHit ? 'text-cyber' : 'text-[#FF6B4A]')
                          : 'text-transparent'
                      }`}>
                        {(isDone || isActive) ? (s.isHit ? 'Hit' : 'Fault') : '.'}
                      </div>

                      {/* Eviction indicator */}
                      {(isDone || isActive) && s.evicted !== null && (
                        <div className="text-[8px] text-[#FF6B4A]/60 font-mono mt-0.5">
                          ×{s.evicted}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-cyber/30 border border-cyber" />
                <span className="text-[9px] text-white/40 font-bold tracking-wider">PAGE HIT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#D13814]/30 border border-[#D13814]" />
                <span className="text-[9px] text-white/40 font-bold tracking-wider">PAGE FAULT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/20 font-mono">×n</span>
                <span className="text-[9px] text-white/40 font-bold tracking-wider">EVICTED PAGE</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Summary Card ── */}
        {isComplete && simResult && (
          <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 animate-fade-up">
            <div className="text-[10px] tracking-widest text-white/30 font-bold mb-4">SIMULATION COMPLETE</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                <div className="text-3xl font-black font-mono text-cyber">{simResult.hits}</div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mt-1">HITS</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                <div className="text-3xl font-black font-mono text-[#FF6B4A]">{simResult.faults}</div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mt-1">FAULTS</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                <div className="text-3xl font-black font-mono text-white">{((simResult.hits / (simResult.hits + simResult.faults)) * 100).toFixed(1)}%</div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mt-1">HIT RATE</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                <div className="text-3xl font-black font-mono text-white">{refString.length}</div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mt-1">TOTAL REFS</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!simResult && (
          <div className="bg-deep border border-white/[0.06] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 opacity-20">📄</div>
            <div className="text-white/30 text-sm font-bold tracking-wider mb-2">NO SIMULATION LOADED</div>
            <div className="text-white/15 text-xs font-mono max-w-sm">
              Enter a reference string above (comma-separated page numbers) or click RANDOM, then click LOAD and PLAY to watch the algorithm animate step by step.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
