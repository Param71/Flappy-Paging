<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-A3FF00?style=flat-square" />
</p>

<h1 align="center">🐦 Flappy Paging</h1>

<p align="center">
  <strong>An interactive, visual OS paging simulation platform</strong><br/>
  <em>Built for Operating Systems practical education</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-team">Team</a>
</p>

---

## 📖 About

**Flappy Paging** is a premium, interactive web application that transforms OS paging theory into hands-on, visual learning. Instead of reading static textbook diagrams, students can:

- **Play a game** that uses Flappy Bird as a metaphor for page hits and faults
- **Watch page replacement algorithms execute** step-by-step with animated visualizations
- **Translate logical addresses** through an interactive page table with real-time highlighting
- **Read comprehensive theory** on paging mechanisms, TLB, and multi-level page tables

---

## ✨ Features

### 🏠 Hero — Bento Grid Dashboard
A premium dark-mode landing page with a modular bento grid layout featuring:
- Embedded **Flappy Paging** game (playable with SPACE or click)
- Educational analogy card — *Page Hit = pass through gap, Page Fault = crash into pipe*
- One-click **Auto-Play Simulation** button that scrolls down and starts the simulation automatically
- Algorithm and page count stats at a glance

### 📚 Theory Section
Comprehensive, well-structured paging theory covering:
- **Core Mechanism** — MMU, Page Tables, TLB
- **Address Translation** — Logical address (p + d) → Physical address (f + d)
- **Paging Techniques** — Demand, Anticipatory, Segmented, Inverted Paging
- **Page Faults & Eviction** — FIFO, LRU, Optimal algorithms explained

### 🔍 Page Table Visualizer
A full interactive simulation of how page tables work:
- **3-column layout**: Logical Memory → Page Table (MMU) → Physical RAM
- **Configurable parameters**: Logical/Physical memory size, Page/Frame size
- **Animated address translation**: Step-by-step highlighting across all three columns
- **Page fault handling**: Automatic frame allocation or eviction when RAM is full
- **Color-coded mappings**: Each loaded page gets a unique color across all views
- **Translation log**: Detailed event log tracking every operation

### 📘 Step-by-Step Explainer
A detailed 6-step deep dive placed directly below the visualizer:
1. CPU generates a logical address (with worked example)
2. MMU consults the page table (entry structure breakdown)
3. TLB — the speed optimization (hit/miss + EAT formula)
4. Constructing the physical address (PA = f × S + d)
5. Handling a page fault (7 sub-steps from trap to restart)
6. Multi-level page tables (x86 two-level + modern 4/5-level)

### 🎮 Paging Simulation Sandbox
An automated, textbook-style page replacement algorithm visualizer:
- **Algorithms**: FIFO, LRU, Optimal
- **Frames**: 3, 4, or 5 frame configurations
- **Controls**: Play / Pause / Step / Reset with speed selector (Slow / Med / Fast)
- **Reference string**: Enter custom sequences or generate random ones
- **Visualization**: Horizontal timeline with frame columns, hit/fault indicators, eviction markers
- **Statistics**: Hit rate, total hits, total faults upon completion

### 🐦 Flappy Paging Game
A custom Flappy Bird game engine built as a paging metaphor:
- Navigate the "page" bird through frame gaps (hits) while avoiding pipe collisions (faults)
- Real-time score tracking
- Fully embedded in the hero section — no separate page needed

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Language** | JavaScript (ES6+) |
| **Animations** | CSS Keyframes + RequestAnimationFrame |
| **Design** | Custom dark theme with glassmorphism |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Param71/Flappy-Paging.git
cd Flappy-Paging

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
paging-app/
├── public/
│   └── favicon.svg              # App favicon
├── src/
│   ├── components/
│   │   ├── Hero.jsx             # Bento grid landing page with embedded game
│   │   ├── Theory.jsx           # Paging theory content section
│   │   ├── PageTableViz.jsx     # Interactive page table visualizer
│   │   ├── PageTableExplainer.jsx # Step-by-step explainer
│   │   ├── PagingSimulation.jsx # Automated algorithm simulation
│   │   └── FlappyPaging.jsx     # Flappy Bird game engine
│   ├── App.jsx                  # Main app layout, routing, navigation
│   ├── index.css                # Global styles, animations, utilities
│   └── main.jsx                 # React entry point
├── index.html                   # HTML template
├── tailwind.config.js           # Tailwind configuration with custom theme
├── vite.config.js               # Vite build configuration
└── package.json                 # Dependencies and scripts
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `void` | `#0A0A0A` | Primary background |
| `deep` | `#111111` | Card backgrounds |
| `cyber` | `#A3FF00` | Accent / success / highlights |
| `red` | `#D13814` | Faults / errors / warnings |

Custom animations include: `fadeUp`, `slideIn`, `pulseGlow`, `shimmer`, `float`, `hitFlash`, `faultFlash`, and `cursorBlink`.

---

## 👥 Team

**Built by Group 4** — for OS Practical Education.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
