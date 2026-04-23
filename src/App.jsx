import React from 'react'
import Hero from './components/Hero'
import Theory from './components/Theory'
import PagingSimulation from './components/PagingSimulation'
import PageTableViz from './components/PageTableViz'
import PageTableExplainer from './components/PageTableExplainer'

function App() {
  return (
    <div className="w-full relative">
      {/* Sticky Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-void/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex gap-8 shadow-2xl">
        <a href="#home" className="text-white/70 hover:text-cyber text-xs font-bold tracking-widest uppercase transition-colors">Home</a>
        <a href="#theory" className="text-white/70 hover:text-cyber text-xs font-bold tracking-widest uppercase transition-colors">Theory</a>
        <a href="#page-tables" className="text-white/70 hover:text-cyber text-xs font-bold tracking-widest uppercase transition-colors">Page Tables</a>
        <a href="#simulation" className="text-white/70 hover:text-cyber text-xs font-bold tracking-widest uppercase transition-colors">Simulation</a>
      </nav>

      {/* Sections */}
      <Hero />
      <Theory />

      {/* Page Tables Visualization + Explainer */}
      <section id="page-tables" className="bg-void py-24">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-4 mb-8">
          <div className="text-cyber font-bold tracking-[0.3em] text-[10px] uppercase">02 / Page Tables</div>
          <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-2">
            PAGE TABLE VISUALIZER.
          </h2>
          <p className="text-white/40 text-sm font-mono max-w-2xl leading-relaxed">
            See how the MMU translates logical addresses to physical addresses using a page table.
            Configure memory sizes, enter an address, and watch the step-by-step translation animate across
            Logical Memory → Page Table → Physical RAM.
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto px-4">
          <PageTableViz />
        </div>
        {/* Detailed Step-by-Step Explainer */}
        <div className="max-w-[1200px] mx-auto px-4">
          <PageTableExplainer />
        </div>
      </section>

      {/* Paging Simulation */}
      <section id="simulation" className="bg-void py-24 border-t border-white/[0.04]">
         <div className="max-w-[1100px] mx-auto px-4 flex flex-col gap-4">
           <div className="text-cyber font-bold tracking-[0.3em] text-[10px] uppercase">03 / Visualization</div>
           <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-8">
             PRACTICAL SANDBOX.
           </h2>
         </div>
         <PagingSimulation />
      </section>

      {/* Footer */}
      <footer className="bg-void text-white py-12 text-center flex flex-col items-center border-t border-white/10">
         <div className="font-black text-2xl tracking-tighter mb-4">PAGING SIMULATION</div>
         <div className="text-[10px] tracking-widest text-white/40 font-mono">
           BUILT FOR OS PRACTICAL EDUCATION<br/>
           &copy; 2026 BUILT BY GROUP 4
         </div>
      </footer>
    </div>
  )
}

export default App
