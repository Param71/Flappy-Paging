import React, { useState, useCallback, useRef, useEffect } from "react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Distinct colors for pages loaded into frames
const PAGE_COLORS = [
  { bg: "rgba(163,255,0,0.15)", border: "rgba(163,255,0,0.5)", text: "#A3FF00" },
  { bg: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.5)", text: "#60A5FA" },
  { bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.5)", text: "#FB923C" },
  { bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.5)", text: "#A78BFA" },
  { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.5)", text: "#34D399" },
  { bg: "rgba(251,113,133,0.15)", border: "rgba(251,113,133,0.5)", text: "#FB7185" },
  { bg: "rgba(250,204,21,0.15)", border: "rgba(250,204,21,0.5)", text: "#FACC15" },
  { bg: "rgba(45,212,191,0.15)", border: "rgba(45,212,191,0.5)", text: "#2DD4BF" },
];

function getColor(pageNum) {
  return PAGE_COLORS[pageNum % PAGE_COLORS.length];
}

export default function PageTableViz() {
  // ── Configuration ──
  const [logicalSize, setLogicalSize] = useState(64);  // KB
  const [physicalSize, setPhysicalSize] = useState(32); // KB
  const [pageSize, setPageSize] = useState(8);          // KB

  const totalPages = Math.floor(logicalSize / pageSize);
  const totalFrames = Math.floor(physicalSize / pageSize);

  // ── State ──
  const [pageTable, setPageTable] = useState([]);
  const [frames, setFrames] = useState([]);
  const [addrInput, setAddrInput] = useState("");
  const [running, setRunning] = useState(false);

  // Animation state
  const [highlightPage, setHighlightPage] = useState(null);
  const [highlightPTRow, setHighlightPTRow] = useState(null);
  const [highlightFrame, setHighlightFrame] = useState(null);
  const [animPhase, setAnimPhase] = useState(null); // 'page' | 'pt' | 'frame' | 'fault' | 'done'
  const [translationResult, setTranslationResult] = useState(null);
  const [log, setLog] = useState([]);

  const logEndRef = useRef(null);
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [log]);

  // Initialize / reset
  const initialize = useCallback(() => {
    const pt = Array.from({ length: totalPages }, () => ({
      frameNumber: null,
      isValid: false,
    }));
    const fr = Array.from({ length: totalFrames }, () => ({
      page: null,
      free: true,
    }));

    // Pre-load a few random pages to make it interesting
    const preload = Math.min(Math.floor(totalFrames * 0.5), totalPages);
    const shuffled = Array.from({ length: totalPages }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, preload);

    shuffled.forEach((pageNum, i) => {
      if (i < totalFrames) {
        pt[pageNum] = { frameNumber: i, isValid: true };
        fr[i] = { page: pageNum, free: false };
      }
    });

    setPageTable(pt);
    setFrames(fr);
    setHighlightPage(null);
    setHighlightPTRow(null);
    setHighlightFrame(null);
    setAnimPhase(null);
    setTranslationResult(null);
    setLog([]);
    setAddrInput("");
  }, [totalPages, totalFrames]);

  useEffect(() => { initialize(); }, [initialize]);

  const addLog = (msg, type = "info") => {
    setLog(prev => [...prev.slice(-40), { msg, type, id: Date.now() + Math.random() }]);
  };

  // ── Address Translation with Animation ──
  const handleTranslate = useCallback(async () => {
    if (running) return;
    const addr = parseInt(addrInput);
    const maxAddr = logicalSize * 1024;
    if (isNaN(addr) || addr < 0 || addr >= maxAddr) {
      addLog(`⚠ Invalid address. Enter 0 to ${maxAddr - 1}`, "error");
      return;
    }

    setRunning(true);
    setTranslationResult(null);
    setHighlightPage(null);
    setHighlightPTRow(null);
    setHighlightFrame(null);

    const pageSizeBytes = pageSize * 1024;
    const pageNum = Math.floor(addr / pageSizeBytes);
    const offset = addr % pageSizeBytes;

    addLog(`─── Translating Logical Address: ${addr} ───`, "sep");
    addLog(`Page Number = ⌊${addr} / ${pageSizeBytes}⌋ = ${pageNum}`, "info");
    addLog(`Offset = ${addr} mod ${pageSizeBytes} = ${offset}`, "info");

    // STEP 1: Highlight Logical Page
    setAnimPhase("page");
    setHighlightPage(pageNum);
    addLog(`→ Step 1: Locate Page ${pageNum} in Logical Memory`, "info");
    await sleep(800);

    // STEP 2: Look up Page Table
    setAnimPhase("pt");
    setHighlightPTRow(pageNum);
    addLog(`→ Step 2: Look up Page Table entry for Page ${pageNum}`, "info");
    await sleep(800);

    const entry = pageTable[pageNum];

    if (entry.isValid) {
      // ── HIT ──
      const frameNum = entry.frameNumber;
      const physAddr = frameNum * pageSizeBytes + offset;

      setAnimPhase("frame");
      setHighlightFrame(frameNum);
      addLog(`✓ Valid! Page ${pageNum} → Frame ${frameNum}`, "hit");
      addLog(`Physical Address = (${frameNum} × ${pageSizeBytes}) + ${offset} = ${physAddr}`, "hit");
      await sleep(600);

      setAnimPhase("done");
      setTranslationResult({
        type: "hit",
        pageNum,
        offset,
        frameNum,
        physAddr,
        logicalAddr: addr,
      });
    } else {
      // ── PAGE FAULT ──
      setAnimPhase("fault");
      addLog(`✗ PAGE FAULT! Page ${pageNum} is not in RAM`, "fault");
      await sleep(600);

      // Find a free frame
      let freeIdx = frames.findIndex(f => f.free);
      let evictedPage = null;

      if (freeIdx === -1) {
        // FIFO-style eviction: evict the first occupied frame
        freeIdx = Math.floor(Math.random() * totalFrames);
        evictedPage = frames[freeIdx].page;
        addLog(`⚠ No free frames! Evicting Page ${evictedPage} from Frame ${freeIdx}`, "fault");

        // Invalidate old page
        setPageTable(prev => {
          const next = [...prev];
          if (evictedPage !== null) next[evictedPage] = { frameNumber: null, isValid: false };
          return next;
        });
        await sleep(400);
      } else {
        addLog(`Found free Frame ${freeIdx}`, "info");
      }

      // Load the page into the frame
      setFrames(prev => {
        const next = [...prev];
        next[freeIdx] = { page: pageNum, free: false };
        return next;
      });
      setPageTable(prev => {
        const next = [...prev];
        next[pageNum] = { frameNumber: freeIdx, isValid: true };
        return next;
      });

      addLog(`✓ Loaded Page ${pageNum} → Frame ${freeIdx}`, "info");
      await sleep(400);

      const physAddr = freeIdx * pageSizeBytes + offset;
      setHighlightFrame(freeIdx);
      setAnimPhase("frame");
      addLog(`Physical Address = (${freeIdx} × ${pageSizeBytes}) + ${offset} = ${physAddr}`, "hit");
      await sleep(600);

      setAnimPhase("done");
      setTranslationResult({
        type: "fault",
        pageNum,
        offset,
        frameNum: freeIdx,
        physAddr,
        logicalAddr: addr,
        evictedPage,
      });
    }

    await sleep(300);
    setRunning(false);
  }, [running, addrInput, pageTable, frames, logicalSize, pageSize, totalFrames]);

  const generateRandomAddr = () => {
    const max = logicalSize * 1024;
    setAddrInput(String(Math.floor(Math.random() * max)));
  };

  return (
    <div className="font-sans text-white">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-5">

        {/* ── Configuration Panel ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-5">
          <div className="text-[10px] tracking-widest text-white/30 font-bold mb-4">SIMULATION PARAMETERS</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[10px] tracking-widest text-white/40 font-bold mb-1 block">LOGICAL MEMORY (KB)</label>
              <select value={logicalSize} onChange={e => setLogicalSize(+e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-cyber transition-colors"
              >
                {[32, 64, 128, 256].map(v => <option key={v} value={v} className="bg-[#111]">{v} KB</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/40 font-bold mb-1 block">PHYSICAL MEMORY (KB)</label>
              <select value={physicalSize} onChange={e => setPhysicalSize(+e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-cyber transition-colors"
              >
                {[16, 32, 64].map(v => <option key={v} value={v} className="bg-[#111]">{v} KB</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-widest text-white/40 font-bold mb-1 block">PAGE / FRAME SIZE (KB)</label>
              <select value={pageSize} onChange={e => setPageSize(+e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-cyber transition-colors"
              >
                {[4, 8, 16].map(v => <option key={v} value={v} className="bg-[#111]">{v} KB</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-widest text-white/30 font-bold">
            <span>PAGES: <span className="text-cyber">{totalPages}</span></span>
            <span>FRAMES: <span className="text-cyber">{totalFrames}</span></span>
            <span>MAX ADDR: <span className="text-cyber">{(logicalSize * 1024) - 1}</span></span>
            <button onClick={initialize} className="ml-auto px-4 py-1.5 text-[10px] font-bold tracking-wider border border-white/10 rounded-xl text-white/50 hover:bg-white/5 transition-all">↺ RESET</button>
          </div>
        </div>

        {/* ── Address Input ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="text-[10px] tracking-widest text-white/30 font-bold shrink-0">LOGICAL ADDRESS</div>
          <input type="number" value={addrInput} onChange={e => setAddrInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTranslate()}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-white/20 outline-none focus:border-cyber transition-colors"
            placeholder={`Enter 0 to ${logicalSize * 1024 - 1}`}
          />
          <button onClick={generateRandomAddr} className="px-4 py-2.5 text-[10px] font-bold tracking-wider border border-white/10 rounded-xl text-white/60 hover:bg-white/5 transition-all">🎲 RANDOM</button>
          <button onClick={handleTranslate} disabled={running}
            className="px-6 py-2.5 text-xs font-bold tracking-wider bg-cyber text-void rounded-xl hover:bg-[#b0ff1a] transition-all disabled:opacity-40"
          >▶ TRANSLATE</button>
        </div>

        {/* ── Translation Math Display ── */}
        {animPhase && (
          <div className={`rounded-2xl p-4 border transition-all duration-500 ${
            animPhase === 'fault' ? 'bg-[#D13814]/10 border-[#D13814]/30' :
            animPhase === 'done' && translationResult?.type === 'hit' ? 'bg-cyber/10 border-cyber/30' :
            animPhase === 'done' && translationResult?.type === 'fault' ? 'bg-[#D13814]/10 border-[#D13814]/30' :
            'bg-white/[0.03] border-white/[0.06]'
          }`}>
            <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
              {/* Phase indicators */}
              <div className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                animPhase === 'page' ? 'bg-cyber/20 text-cyber border border-cyber/30 scale-105' : 'bg-white/5 text-white/30 border border-white/5'
              }`}>① FIND PAGE</div>
              <div className="text-white/20">→</div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                animPhase === 'pt' ? 'bg-cyber/20 text-cyber border border-cyber/30 scale-105' : 'bg-white/5 text-white/30 border border-white/5'
              }`}>② PAGE TABLE</div>
              <div className="text-white/20">→</div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                animPhase === 'fault' ? 'bg-[#D13814]/20 text-[#FF6B4A] border border-[#D13814]/30 scale-105' :
                animPhase === 'frame' || animPhase === 'done' ? 'bg-cyber/20 text-cyber border border-cyber/30 scale-105' : 'bg-white/5 text-white/30 border border-white/5'
              }`}>{animPhase === 'fault' ? '⚠ FAULT' : '③ FRAME'}</div>

              {translationResult && (
                <div className="ml-auto font-mono text-xs">
                  <span className="text-white/40">Physical: </span>
                  <span className="text-cyber font-bold">{translationResult.physAddr}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 3-Column Visualization ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-4">

          {/* LEFT: Logical Memory */}
          <div className="bg-deep border border-white/[0.06] rounded-2xl p-4 flex flex-col">
            <div className="text-[10px] tracking-widest text-white/30 font-bold mb-3 flex justify-between">
              <span>LOGICAL MEMORY</span>
              <span className="text-cyber">{totalPages} PAGES</span>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
              {pageTable.map((entry, i) => {
                const color = entry.isValid ? getColor(i) : null;
                const isHL = highlightPage === i;
                return (
                  <div key={i}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs transition-all duration-300 border ${
                      isHL ? 'scale-[1.03] shadow-lg shadow-cyber/20 border-cyber bg-cyber/10' :
                      entry.isValid ? 'border-transparent' : 'border-transparent'
                    }`}
                    style={!isHL && color ? { background: color.bg, borderColor: color.border } : !isHL ? { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.04)' } : {}}
                  >
                    <span className="font-bold" style={color && !isHL ? { color: color.text } : { color: isHL ? '#A3FF00' : 'rgba(255,255,255,0.3)' }}>
                      Page {i}
                    </span>
                    <span className="text-white/20 text-[9px]">
                      {i * pageSize}KB – {(i + 1) * pageSize - 1}KB
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MIDDLE: Page Table */}
          <div className="bg-deep border border-white/[0.06] rounded-2xl p-4 flex flex-col">
            <div className="text-[10px] tracking-widest text-white/30 font-bold mb-3 flex justify-between">
              <span>PAGE TABLE (MMU)</span>
              <span className="text-white/20">PAGE# → FRAME# | VALID</span>
            </div>
            <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
              {/* Header */}
              <div className="grid grid-cols-[50px_1fr_1fr_70px] gap-1 px-2 py-1.5 text-[9px] tracking-widest text-white/20 font-bold border-b border-white/5 mb-1">
                <span>IDX</span><span>PAGE</span><span>FRAME</span><span className="text-right">STATUS</span>
              </div>
              {pageTable.map((entry, i) => {
                const color = entry.isValid ? getColor(i) : null;
                const isHL = highlightPTRow === i;
                return (
                  <div key={i}
                    className={`grid grid-cols-[50px_1fr_1fr_70px] gap-1 items-center px-2 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                      isHL
                        ? (entry.isValid ? 'bg-cyber/15 scale-[1.02] shadow-md' : 'bg-[#D13814]/15 scale-[1.02] shadow-md')
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-white/20 font-bold">{i}</span>
                    <span className="font-bold" style={color ? { color: color.text } : { color: 'rgba(255,255,255,0.2)' }}>
                      P{i}
                    </span>
                    <span className={`font-bold ${entry.isValid ? 'text-white' : 'text-white/15'}`}>
                      {entry.isValid ? `F${entry.frameNumber}` : '—'}
                    </span>
                    <span className={`text-right text-[10px] font-bold tracking-wider ${
                      isHL && entry.isValid ? 'text-cyber' :
                      isHL && !entry.isValid ? 'text-[#FF6B4A]' :
                      entry.isValid ? 'text-cyber/60' : 'text-white/15'
                    }`}>
                      {entry.isValid ? 'VALID' : 'INVALID'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Physical Memory */}
          <div className="bg-deep border border-white/[0.06] rounded-2xl p-4 flex flex-col">
            <div className="text-[10px] tracking-widest text-white/30 font-bold mb-3 flex justify-between">
              <span>PHYSICAL RAM</span>
              <span className="text-cyber">{totalFrames} FRAMES</span>
            </div>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
              {frames.map((f, i) => {
                const color = !f.free && f.page !== null ? getColor(f.page) : null;
                const isHL = highlightFrame === i;
                return (
                  <div key={i}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl font-mono text-xs transition-all duration-300 border ${
                      isHL ? 'scale-[1.04] shadow-lg shadow-cyber/20 border-cyber bg-cyber/10' :
                      !f.free ? 'border-transparent' : 'border-dashed border-white/10'
                    }`}
                    style={!isHL && color ? { background: color.bg, borderColor: color.border } : !isHL && f.free ? {} : {}}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 font-bold text-[10px] w-8">F{i}</span>
                      <span className="font-bold" style={color && !isHL ? { color: color.text } : { color: isHL ? '#A3FF00' : 'rgba(255,255,255,0.15)' }}>
                        {f.free ? 'FREE' : `Page ${f.page}`}
                      </span>
                    </div>
                    <span className="text-white/15 text-[9px]">
                      {i * pageSize}KB – {(i + 1) * pageSize - 1}KB
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Translation Result Card ── */}
        {translationResult && (
          <div className={`rounded-2xl p-5 border animate-fade-up ${
            translationResult.type === 'hit'
              ? 'bg-cyber/5 border-cyber/20'
              : 'bg-[#D13814]/5 border-[#D13814]/20'
          }`}>
            <div className="flex flex-wrap items-center gap-6 font-mono text-sm">
              <div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mb-1">LOGICAL</div>
                <div className="text-white font-bold">{translationResult.logicalAddr}</div>
              </div>
              <div className="text-white/20 text-lg">→</div>
              <div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mb-1">PAGE</div>
                <div className="text-white font-bold">P{translationResult.pageNum}</div>
              </div>
              <div className="text-white/20 text-lg">+</div>
              <div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mb-1">OFFSET</div>
                <div className="text-white font-bold">{translationResult.offset}</div>
              </div>
              <div className="text-white/20 text-lg">=</div>
              <div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mb-1">FRAME</div>
                <div className="text-cyber font-bold">F{translationResult.frameNum}</div>
              </div>
              <div className="text-white/20 text-lg">→</div>
              <div>
                <div className="text-[9px] tracking-widest text-white/30 font-bold mb-1">PHYSICAL</div>
                <div className="text-cyber font-bold text-lg">{translationResult.physAddr}</div>
              </div>
              <div className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold tracking-wider ${
                translationResult.type === 'hit' ? 'bg-cyber/20 text-cyber' : 'bg-[#D13814]/20 text-[#FF6B4A]'
              }`}>
                {translationResult.type === 'hit' ? '✓ PAGE HIT' : '✗ PAGE FAULT → RESOLVED'}
              </div>
            </div>
          </div>
        )}

        {/* ── Event Log ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-4">
          <div className="text-[10px] tracking-widest text-white/30 font-bold mb-3">TRANSLATION LOG</div>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar font-mono text-[11px] flex flex-col gap-0.5">
            {log.length === 0 && <div className="text-white/15">Enter an address and click Translate to begin...</div>}
            {log.map(l => (
              <div key={l.id} className={`px-2 py-1 rounded ${
                l.type === 'hit' ? 'text-cyber' :
                l.type === 'fault' ? 'text-[#FF6B4A]' :
                l.type === 'error' ? 'text-red-400' :
                l.type === 'sep' ? 'text-white/15' :
                'text-white/50'
              }`}>{l.msg}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
