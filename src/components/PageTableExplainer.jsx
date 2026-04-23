import React from 'react';

export default function PageTableExplainer() {
  return (
    <div className="font-sans text-white w-full max-w-[1200px] mx-auto mt-20">

      {/* Section Header */}
      <div className="flex flex-col gap-3 mb-12">
        <div className="text-cyber font-bold tracking-[0.3em] text-[10px] uppercase">DEEP DIVE</div>
        <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter">
          HOW PAGE TABLES<br/>
          <span className="text-cyber">ACTUALLY WORK.</span>
        </h2>
        <p className="text-white/40 text-sm font-mono max-w-xl leading-relaxed mt-2">
          A complete step-by-step breakdown of the mechanism behind virtual-to-physical address translation — the core of modern memory management.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-6">

        {/* ── STEP 1 ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">01</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyber/20 border border-cyber/30 flex items-center justify-center text-cyber font-bold text-sm">1</div>
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">The CPU Generates a Logical Address</h3>
          </div>
          <div className="flex flex-col gap-3 text-white/60 text-sm leading-relaxed font-mono pl-11">
            <p>
              When a process runs, the CPU doesn't know or care about physical RAM. It works entirely in a <strong className="text-white">virtual (logical) address space</strong>. Every memory instruction — reading a variable, calling a function, accessing an array — produces a <strong className="text-white">logical address</strong>.
            </p>
            <p>
              This logical address is a single number, but it encodes <strong className="text-cyber">two pieces of information</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="text-[10px] tracking-widest text-white/30 font-bold mb-2">PAGE NUMBER (p)</div>
                <div className="text-white font-bold text-base mb-1">p = ⌊address / page_size⌋</div>
                <div className="text-white/40 text-xs">Identifies <em>which</em> page of logical memory is being accessed. This is used as an <strong className="text-white/70">index</strong> into the page table.</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <div className="text-[10px] tracking-widest text-white/30 font-bold mb-2">OFFSET (d)</div>
                <div className="text-white font-bold text-base mb-1">d = address mod page_size</div>
                <div className="text-white/40 text-xs">Identifies the <em>exact byte</em> within that page. The offset is passed through unchanged — it's the same in both logical and physical addresses.</div>
              </div>
            </div>
            <div className="bg-cyber/5 border border-cyber/10 rounded-xl p-4 mt-2">
              <div className="text-cyber font-bold text-xs mb-1">EXAMPLE</div>
              <div className="text-white/50 text-xs">
                Logical Address = <strong className="text-white">13500</strong>, Page Size = <strong className="text-white">4096 bytes</strong><br/>
                Page Number = ⌊13500 / 4096⌋ = <strong className="text-cyber">3</strong><br/>
                Offset = 13500 mod 4096 = <strong className="text-cyber">1212</strong><br/>
                So we need to look up <strong className="text-white">Page 3</strong> in the page table, with an offset of <strong className="text-white">1212 bytes</strong> within that page.
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 2 ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">02</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyber/20 border border-cyber/30 flex items-center justify-center text-cyber font-bold text-sm">2</div>
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">The MMU Consults the Page Table</h3>
          </div>
          <div className="flex flex-col gap-3 text-white/60 text-sm leading-relaxed font-mono pl-11">
            <p>
              The <strong className="text-white">Memory Management Unit (MMU)</strong> is a hardware component that sits between the CPU and physical memory. It intercepts every memory access and performs the translation.
            </p>
            <p>
              The MMU uses the <strong className="text-cyber">Page Number</strong> as an index to look up the corresponding entry in the <strong className="text-white">Page Table</strong>. Each process has its own page table, stored in main memory, and the <strong className="text-white">Page Table Base Register (PTBR)</strong> points to the current process's table.
            </p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mt-2">
              <div className="text-[10px] tracking-widest text-white/30 font-bold mb-3">PAGE TABLE ENTRY STRUCTURE</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-cyber/10 border border-cyber/20 rounded-lg p-2 text-center">
                  <div className="text-cyber font-bold text-xs">Frame Number</div>
                  <div className="text-white/30 text-[9px] mt-1">Which physical frame</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                  <div className="text-white font-bold text-xs">Valid Bit</div>
                  <div className="text-white/30 text-[9px] mt-1">1 = in RAM, 0 = on disk</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                  <div className="text-white font-bold text-xs">Dirty Bit</div>
                  <div className="text-white/30 text-[9px] mt-1">Has page been modified?</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
                  <div className="text-white font-bold text-xs">Protection</div>
                  <div className="text-white/30 text-[9px] mt-1">Read / Write / Execute</div>
                </div>
              </div>
            </div>
            <p className="mt-2">
              The MMU checks the <strong className="text-white">Valid/Invalid bit</strong> first. If valid = 1, the page is in RAM and the frame number is used. If valid = 0, a <strong className="text-[#FF6B4A]">Page Fault</strong> is triggered.
            </p>
          </div>
        </div>

        {/* ── STEP 3 ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">03</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyber/20 border border-cyber/30 flex items-center justify-center text-cyber font-bold text-sm">3</div>
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">TLB — The Speed Optimization</h3>
          </div>
          <div className="flex flex-col gap-3 text-white/60 text-sm leading-relaxed font-mono pl-11">
            <p>
              Every memory access requiring a page table lookup means <strong className="text-white">two memory accesses</strong> — one to read the page table, one to access the actual data. This doubles memory access time.
            </p>
            <p>
              The <strong className="text-cyber">Translation Look-aside Buffer (TLB)</strong> solves this. It's a small, extremely fast <strong className="text-white">hardware cache</strong> inside the MMU that stores recent page-to-frame mappings.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="bg-cyber/5 border border-cyber/10 rounded-xl p-4">
                <div className="text-cyber font-bold text-xs mb-2">TLB HIT ✓</div>
                <div className="text-white/40 text-xs leading-relaxed">
                  The page-to-frame mapping is found in the TLB. The frame number is retrieved <strong className="text-white/70">instantly</strong> without accessing the page table in main memory. Access time ≈ 1 memory cycle.
                </div>
              </div>
              <div className="bg-[#D13814]/5 border border-[#D13814]/10 rounded-xl p-4">
                <div className="text-[#FF6B4A] font-bold text-xs mb-2">TLB MISS ✗</div>
                <div className="text-white/40 text-xs leading-relaxed">
                  The mapping is not in the TLB. The MMU must access the page table in main memory, retrieve the frame number, and <strong className="text-white/70">update the TLB</strong> with this new entry. Access time ≈ 2 memory cycles.
                </div>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mt-2">
              <div className="text-white font-bold text-xs mb-1">EFFECTIVE ACCESS TIME FORMULA</div>
              <div className="text-cyber font-mono text-sm mt-1">EAT = (hit_ratio × memory_time) + ((1 - hit_ratio) × 2 × memory_time)</div>
              <div className="text-white/30 text-[10px] mt-2">Typical TLB hit ratios exceed 98%, making the performance impact of paging nearly invisible.</div>
            </div>
          </div>
        </div>

        {/* ── STEP 4 ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">04</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyber/20 border border-cyber/30 flex items-center justify-center text-cyber font-bold text-sm">4</div>
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">Construct the Physical Address</h3>
          </div>
          <div className="flex flex-col gap-3 text-white/60 text-sm leading-relaxed font-mono pl-11">
            <p>
              Once the MMU has the <strong className="text-cyber">Frame Number</strong> (from either the TLB or the page table), it constructs the final physical address by combining the frame number with the original offset.
            </p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mt-2">
              <div className="text-[10px] tracking-widest text-white/30 font-bold mb-4">ADDRESS TRANSLATION FORMULA</div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                  <div className="text-white/30 text-[9px] tracking-widest mb-1">PHYSICAL ADDRESS</div>
                  <div className="text-cyber font-bold text-lg">PA</div>
                </div>
                <div className="text-white/30 text-xl">=</div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                  <div className="text-white/30 text-[9px] tracking-widest mb-1">FRAME NUMBER</div>
                  <div className="text-white font-bold text-lg">f</div>
                </div>
                <div className="text-white/30 text-xl">×</div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                  <div className="text-white/30 text-[9px] tracking-widest mb-1">PAGE SIZE</div>
                  <div className="text-white font-bold text-lg">S</div>
                </div>
                <div className="text-white/30 text-xl">+</div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                  <div className="text-white/30 text-[9px] tracking-widest mb-1">OFFSET</div>
                  <div className="text-white font-bold text-lg">d</div>
                </div>
              </div>
            </div>
            <div className="bg-cyber/5 border border-cyber/10 rounded-xl p-4 mt-2">
              <div className="text-cyber font-bold text-xs mb-1">CONTINUING THE EXAMPLE</div>
              <div className="text-white/50 text-xs">
                Page 3 maps to Frame 5 (from the page table), page size = 4096.<br/>
                Physical Address = (5 × 4096) + 1212 = <strong className="text-cyber">20480 + 1212 = 21692</strong><br/>
                The CPU can now read/write at physical address 21692 in RAM.
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 5 ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">05</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#D13814]/20 border border-[#D13814]/30 flex items-center justify-center text-[#FF6B4A] font-bold text-sm">5</div>
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">Handling a Page Fault</h3>
          </div>
          <div className="flex flex-col gap-3 text-white/60 text-sm leading-relaxed font-mono pl-11">
            <p>
              When the Valid bit is <strong className="text-[#FF6B4A]">0 (invalid)</strong>, it means the requested page is <strong className="text-white">not currently in physical RAM</strong>. The MMU raises a <strong className="text-[#FF6B4A]">Page Fault interrupt</strong>, and the OS kernel takes over:
            </p>
            <div className="flex flex-col gap-2 mt-2">
              {[
                { num: "5.1", title: "Trap to OS", desc: "The CPU stops the current instruction and transfers control to the page fault handler in the kernel." },
                { num: "5.2", title: "Validate the reference", desc: "The OS checks if the address is legal. If the process is accessing memory it doesn't own, a segmentation fault is raised and the process is terminated." },
                { num: "5.3", title: "Find a free frame", desc: "The OS searches the free frame list for an available physical frame. If one exists, it's allocated." },
                { num: "5.4", title: "Evict if necessary", desc: "If NO free frames exist, the OS must choose a victim frame to evict using a page replacement algorithm (FIFO, LRU, or Optimal). If the victim's dirty bit is set, its contents are written back to disk first." },
                { num: "5.5", title: "Load the page from disk", desc: "The OS issues a disk I/O to read the faulted page from secondary storage (swap space) into the selected frame. This is the SLOWEST step — disk access is ~100,000× slower than RAM." },
                { num: "5.6", title: "Update the page table", desc: "The page table entry for the faulted page is updated: frame number = new frame, valid bit = 1. If a victim was evicted, its entry is set to invalid." },
                { num: "5.7", title: "Restart the instruction", desc: "Control returns to the process, and the faulted instruction is re-executed. This time, the page is in RAM, so translation succeeds normally." },
              ].map(step => (
                <div key={step.num} className="flex gap-3 bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                  <div className="text-[#FF6B4A] font-bold text-xs shrink-0 w-8 pt-0.5">{step.num}</div>
                  <div>
                    <div className="text-white font-bold text-xs mb-0.5">{step.title}</div>
                    <div className="text-white/40 text-[11px] leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STEP 6 ── */}
        <div className="bg-deep border border-white/[0.06] rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">06</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyber/20 border border-cyber/30 flex items-center justify-center text-cyber font-bold text-sm">6</div>
            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase">Multi-Level Page Tables</h3>
          </div>
          <div className="flex flex-col gap-3 text-white/60 text-sm leading-relaxed font-mono pl-11">
            <p>
              In a real 64-bit system, a single flat page table would need <strong className="text-white">millions of entries</strong> — most of them unused. Modern OS's solve this with <strong className="text-cyber">multi-level (hierarchical) page tables</strong>.
            </p>
            <p>
              Instead of one giant table, the logical address is split into multiple indices, each pointing to a <strong className="text-white">smaller table at the next level</strong>. Only the tables that are actually needed are allocated in memory.
            </p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mt-2">
              <div className="text-[10px] tracking-widest text-white/30 font-bold mb-3">TWO-LEVEL PAGE TABLE (x86 example)</div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center font-mono text-xs">
                <div className="bg-cyber/10 border border-cyber/20 rounded-lg px-3 py-2 text-center">
                  <div className="text-white/30 text-[8px] tracking-widest mb-1">BITS 22-31</div>
                  <div className="text-cyber font-bold">Page Directory</div>
                  <div className="text-white/20 text-[9px]">10 bits → 1024 entries</div>
                </div>
                <div className="text-white/20">→</div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                  <div className="text-white/30 text-[8px] tracking-widest mb-1">BITS 12-21</div>
                  <div className="text-white font-bold">Page Table</div>
                  <div className="text-white/20 text-[9px]">10 bits → 1024 entries</div>
                </div>
                <div className="text-white/20">→</div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                  <div className="text-white/30 text-[8px] tracking-widest mb-1">BITS 0-11</div>
                  <div className="text-white font-bold">Offset</div>
                  <div className="text-white/20 text-[9px]">12 bits → 4096 bytes</div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-white/40 text-xs">
              <strong className="text-white/60">Modern x86-64 systems use 4-level page tables</strong> (PML4 → PDPT → PD → PT → Offset), and newer CPUs support 5-level paging for even larger address spaces (up to 128 PB of virtual memory).
            </p>
          </div>
        </div>

        {/* ── COMPLETE FLOW SUMMARY ── */}
        <div className="bg-cyber/5 border border-cyber/10 rounded-2xl p-6 md:p-8">
          <div className="text-cyber font-bold tracking-[0.25em] text-[10px] uppercase mb-4">COMPLETE TRANSLATION FLOW</div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center font-mono text-[10px] sm:text-xs font-bold">
            {[
              { label: "CPU generates\nLogical Address", bg: "bg-white/10", text: "text-white" },
              { label: "→", bg: "", text: "text-white/20" },
              { label: "Split into\nPage# + Offset", bg: "bg-white/10", text: "text-white" },
              { label: "→", bg: "", text: "text-white/20" },
              { label: "Check\nTLB", bg: "bg-cyber/20", text: "text-cyber" },
              { label: "→", bg: "", text: "text-white/20" },
              { label: "TLB Miss?\nAccess Page Table", bg: "bg-white/10", text: "text-white" },
              { label: "→", bg: "", text: "text-white/20" },
              { label: "Valid?\nGet Frame#", bg: "bg-cyber/20", text: "text-cyber" },
              { label: "→", bg: "", text: "text-white/20" },
              { label: "Invalid?\nPage Fault!", bg: "bg-[#D13814]/20", text: "text-[#FF6B4A]" },
              { label: "→", bg: "", text: "text-white/20" },
              { label: "Physical Address\n= f × S + d", bg: "bg-cyber/20", text: "text-cyber" },
            ].map((item, i) => (
              item.label === "→"
                ? <span key={i} className="text-white/20 text-lg hidden sm:inline">→</span>
                : <div key={i} className={`${item.bg} ${item.text} border border-white/[0.06] rounded-xl px-3 py-2 text-center whitespace-pre-line leading-tight`}>{item.label}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
