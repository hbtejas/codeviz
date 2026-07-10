# CodeViz — Architecture & Design System Overview

This document provides a comprehensive overview of the CodeViz codebase, detail tracing pipelines, styling variables, and plugin setups. Use this reference to modify, extend, or redesign the application.

---

## 🏗️ Core Architecture Overview

CodeViz is structured as a full-stack JavaScript/TypeScript monorepo:

```
d:\vico\
├── client/                 # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── patterns/       # 30 LeetCode pattern plugins & auto-detector
│   │   ├── store/          # Zustand state management
│   │   ├── components/     # Visualizers & code editors
│   │   └── pages/          # Application views & dashboards
└── server/                 # Express.js + Node.js trace runner API
    ├── runners/            # JS and Python trace execution sandboxes
    └── routes/             # API routes (/execute, /problems, /explain)
```

---

## ⚙️ Tracing Pipeline (How Visualizations Work)

```
[User Code] 
  ──► POST /api/execute 
  ──► jsRunner.js (AST Instrument via Acorn/Escodegen)
  ──► Sandboxed VM run 
  ──► Normalized JSON steps array
  ──► autoDetect.ts (Identify matching pattern)
  ──► Pattern Annotator (Layer colors/pointers/windows)
  ──► React Visualizer Components (Arrays, DPTable, HashMap, Recursion)
```

### 1. The Normalized Trace Schema
The backend executes code and returns a standardized steps array. Every step contains:
```ts
interface TraceStep {
  line: number;                     // Current executing code line
  event: 'line' | 'call' | 'return' | 'exception';
  variables: Record<string, any>;   // Deep copy of all variables in scope
  callStack: CallFrame[];          // Function invocation frame frames
  output: string;                   // Accumulated stdout/console.log
}
```

### 2. Pattern Annotation System
Instead of hardcoding visualizations per problem, the client checks the trace against **30 pattern plugins** in `client/src/patterns/`.
Each plugin scores its relevance and returns an `AnnotationMap`:
```ts
interface AnnotationMap {
  cellStates: Record<number, CellState>; // highlight, left, right, window, dp-current, etc.
  pointers: { index: number; label: string; color: string }[];
  windowRange?: { start: number; end: number };
  dpCell?: { row: number; col: number };
  stepDescription: string;
}
```

---

## 🎨 Design System & CSS Tokens (`client/src/index.css`)

The UI is built with a dark theme, utilizing glassmorphism and subtle neon glow colors:

| Token Name | HSL / Hex Code | Usage |
|---|---|---|
| `--bg-primary` | `#0a0e1a` | Main background |
| `--bg-panel` | `#111827` | Visualizer/Editor backgrounds |
| `--bg-card` | `#1a2035` | Problem cards and panel containers |
| `--accent-blue` | `#60a5fa` | Left pointer / compare colors |
| `--accent-red` | `#f87171` | Right pointer / swap colors |
| `--accent-amber` | `#fbbf24` | Sliding Window border highlight |
| `--accent-green` | `#4ade80` | DP Table populated values |
| `--accent-purple` | `#a78bfa` | Binary search pivot / AI glow |

### Key Utility Classes
- `.panel` — Card frames with subtle border shadows.
- `.card` — Active list items that raise up (`transform: translateY(-2px)`) on hover.
- `.glass` — Backdrop blur transparent header bands.
- `.array-cell` — Flex blocks highlighting sorting states.

---

## 🛠️ How to Extend or Redesign

### 1. To Add a New Visualizer Component
1. Create a component in `client/src/components/Visualizer/` (e.g. `GraphView.tsx`).
2. Add a panel ID in `VisualizerPanel.tsx` and import your component.
3. Map any custom variables inside `step.variables` (like graph adjacency lists) onto your layout nodes.

### 2. To Add or Modify Problems
Edit `server/data/seedProblems.js`. The seeding script automatically handles DB clear and re-insertion on server startup. Ensure you provide:
- `leetcodeNumber` — Used for the "Solve on LeetCode" header redirects.
- `patterns` — Tags matching the sidebar filters.
- `starterCode` — Clean JavaScript/Python snippets that execute and output to stdout.
