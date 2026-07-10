# CodeViz — Animated Code & DSA Visualizer

A full-stack web app for visualizing code execution step-by-step with animated data structure views.

## Quick Start

### 1. Start the backend
```powershell
cd d:\vico\server
npm run dev
# Runs on http://localhost:3001
```

### 2. Start the frontend (new terminal)
```powershell
cd d:\vico\client
npm run dev
# Opens at http://localhost:5173
```

## Features

- **Monaco Editor** — VS Code's editor with syntax highlighting for JS, Python, Java, C++, C
- **JavaScript Execution** — Acorn AST instrumentation → Node `vm` sandbox (fully sandboxed)
- **Python Execution** — `sys.settrace` hook → child_process (requires Python 3 in PATH)
- **Step-by-step visualization** — Play, Pause, Step Forward/Back, Speed control, Timeline scrubber
- **Array visualizer** — Animated boxes + bar chart with color-coded compare/swap/sorted states
- **Variable panel** — Animated change detection with type-based color coding
- **Call stack viewer** — Animated push/pop frames
- **Recursion tree** — D3 tree built from call/return events
- **DSA Library** — 7 standalone algorithm visualizers (no code required): Bubble/Selection/Insertion/Quick/Merge Sort, Binary/Linear Search
- **Save & Share** — Anonymous slug URLs, in-memory store (or MongoDB if available)

## API Endpoints

```
POST /api/execute          { code, language } → { steps, totalSteps, finalOutput, error }
POST /api/snippets         { code, language, title, sessionId } → { slug }
GET  /api/snippets/:slug   → snippet data
GET  /api/dsa-examples     → list of pre-built DSA examples
```

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Animation:** Framer Motion + GSAP + D3
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **State:** Zustand
- **Backend:** Node.js + Express + Socket.io
- **JS Trace:** Acorn AST instrumentation + Node `vm`
- **Python Trace:** `sys.settrace` + child_process
- **DB:** MongoDB (Mongoose) with in-memory fallback

## Environment Variables

Create `server/.env` to override defaults:
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/codeviz
```

## Notes

- Java and C/C++ runners are stubs — enable by wiring up Docker + JDI/GDB (see `server/docker/`)
- Python must be installed and accessible as `python` (Windows) or `python3` (Linux/macOS)
- MongoDB is optional — snippets persist in-memory if MongoDB is unavailable

## Vercel Deployment

Deploying the client-side of the application to Vercel is fully supported:

1. **Import the repository** into Vercel.
2. In the project settings, configure:
   - **Framework Preset**: `Vite` (or `Other` / auto-detected)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. All requests to `/api/*` are configured to automatically proxy to our Render server (`https://codeviz-server.onrender.com/api/*`) via the rewrite settings in `client/vercel.json`.

