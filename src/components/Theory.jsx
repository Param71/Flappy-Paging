import React from 'react';

const techniques = [
  {
    name: "Demand Paging",
    desc: "Pages are loaded into memory only when explicitly requested by a process, optimizing memory usage by keeping only currently needed pages in RAM.",
    color: "cyber"
  },
  {
    name: "Anticipatory Paging",
    desc: "A proactive approach that preloads pages adjacent to the currently requested page, assuming they will be needed soon to reduce future page faults.",
    color: "white"
  },
  {
    name: "Segmented Paging",
    desc: "Combines paging with segmentation by dividing memory into variable-sized segments, each further split into fixed-size pages, allowing logical organization alongside efficient physical allocation.",
    color: "cyber"
  },
  {
    name: "Inverted Paging",
    desc: "The page table is indexed by physical frames rather than logical pages, reducing the size of the page table for systems with large virtual address spaces.",
    color: "white"
  },
  {
    name: "Page Replacement Algorithms",
    desc: "Techniques like LRU (Least Recently Used), FIFO (First In First Out), or Optimal are used when all frames are occupied, determining which page to evict to make room for new data.",
    color: "cyber"
  },
];

export default function Theory() {
  return (
    <section id="theory" className="min-h-screen bg-void flex flex-col items-center justify-center py-24 px-4 font-sans text-white relative">
      {/* Background */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Title column */}
        <div className="md:col-span-4 flex flex-col justify-start">
          <div className="sticky top-24 flex flex-col gap-4">
             <div className="text-cyber font-bold tracking-[0.3em] text-[10px] uppercase">01 / Educational Core</div>
             <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
               PAGING<br/>THEORY.
             </h2>
             <p className="text-white/50 text-sm mt-4 font-mono leading-relaxed max-w-xs">
               Paging is a memory management scheme that divides logical and physical memory into fixed-size blocks called pages and frames, respectively, allowing non-contiguous storage to eliminate external fragmentation.
             </p>
          </div>
        </div>

        {/* Content column */}
        <div className="md:col-span-8 flex flex-col gap-16 font-mono">
           
           {/* Section 1 — Core Mechanism */}
           <div className="flex flex-col gap-4 border-l border-white/10 pl-6 md:pl-12">
             <h3 className="text-2xl font-bold text-white tracking-tight font-sans uppercase">The Core Mechanism</h3>
             <p className="text-white/70 text-sm leading-relaxed">
               The core mechanism involves a <strong>Memory Management Unit (MMU)</strong> using page tables to translate logical addresses into physical addresses, often accelerated by a <strong>Translation Look-aside Buffer (TLB)</strong> to reduce access latency.
             </p>
             <p className="text-white/70 text-sm leading-relaxed">
               In modern Operating Systems, a process is given a <strong>logical address space</strong>. It assumes it owns a massive, continuous chunk of memory. However, physical memory (RAM) is often fragmented and shared among hundreds of processes.
             </p>
             <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2 font-mono text-[10px] text-cyber">
               Page Size = Frame Size (typically 4KB) · Non-contiguous allocation · Zero external fragmentation
             </div>
           </div>

           {/* Section 2 — Address Translation */}
           <div className="flex flex-col gap-4 border-l border-white/10 pl-6 md:pl-12">
             <h3 className="text-2xl font-bold text-white tracking-tight font-sans uppercase">Address Translation</h3>
             <p className="text-white/70 text-sm leading-relaxed">
               When the CPU requests an address, it provides a Logical Address. The MMU uses a <strong>Page Table</strong> to translate this into a Physical Address. The TLB caches recent translations for speed.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
               <div className="bg-deep border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                 <div className="text-[10px] tracking-widest text-white/40 mb-2 font-sans font-bold">LOGICAL ADDRESS</div>
                 <div className="text-xl font-bold text-white">p + d</div>
                 <div className="text-xs text-white/50 mt-2">p = Page Number<br/>d = Page Offset</div>
               </div>
               <div className="bg-deep border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                 <div className="text-[10px] tracking-widest text-white/40 mb-2 font-sans font-bold">PHYSICAL ADDRESS</div>
                 <div className="text-xl font-bold text-cyber">f + d</div>
                 <div className="text-xs text-white/50 mt-2">f = Frame Number<br/>d = Frame Offset</div>
               </div>
             </div>
           </div>

           {/* Section 3 — Paging Techniques */}
           <div className="flex flex-col gap-4 border-l border-white/10 pl-6 md:pl-12">
             <h3 className="text-2xl font-bold text-white tracking-tight font-sans uppercase">Paging Techniques & Variations</h3>
             <div className="flex flex-col gap-3 mt-2">
               {techniques.map((t, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1 hover:bg-white/[0.07] transition-colors">
                   <span className={`font-bold text-sm ${t.color === 'cyber' ? 'text-cyber' : 'text-white'}`}>{t.name}</span>
                   <span className="text-white/50 text-xs leading-relaxed">{t.desc}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Section 4 — Page Faults */}
           <div className="flex flex-col gap-4 border-l border-white/10 pl-6 md:pl-12">
             <h3 className="text-2xl font-bold text-white tracking-tight font-sans uppercase">Page Faults & Eviction</h3>
             <p className="text-white/70 text-sm leading-relaxed">
               A <strong>Page Fault</strong> occurs when a program tries to access a page that is mapped in the address space but not currently loaded into physical RAM. The OS must fetch the page from disk.
             </p>
             <p className="text-white/70 text-sm leading-relaxed">
               If RAM is full, the OS must evict an existing page to make room. The algorithm chosen dictates system performance:
             </p>
             <div className="flex flex-col gap-3 mt-4">
               <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                 <span className="text-cyber font-bold text-sm">FIFO (First In, First Out)</span>
                 <span className="text-white/50 text-xs">Evicts the oldest page in memory, regardless of how often it's used.</span>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                 <span className="text-cyber font-bold text-sm">LRU (Least Recently Used)</span>
                 <span className="text-white/50 text-xs">Evicts the page that hasn't been accessed for the longest time. Highly practical.</span>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                 <span className="text-cyber font-bold text-sm">Optimal (Belady's Algorithm)</span>
                 <span className="text-white/50 text-xs">Evicts the page that will not be used for the longest time in the future. Impossible to implement perfectly — used as a benchmark.</span>
               </div>
             </div>
           </div>

        </div>
      </div>
    </section>
  );
}
