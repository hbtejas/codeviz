# CodeViz — UI/UX Redesign & Visual Guideline

This document provides a visual and interaction guideline for redesigning the user interface (UI) and user experience (UX) of CodeViz. 

---

## 🎨 Visual Identity & Color System

The current palette uses a premium **Sleek Cyberpunk/Dark Mode** setup. If redesigning the theme, align colors to specific algorithmic meanings:

```
[Backgrounds]  Deep Dark Slate (#0a0e1a) ──► Glass Cards (#111827 / rgba(255,255,255,0.04))
[Actions]      Vibrant Blues (#60a5fa) & Purples (#a78bfa) for run and playback
[Indicators]   Compare = Yellow (#fbbf24)  |  Swap = Rose (#f87171)  |  Sorted = Green (#4ade80)
```

### Aesthetic Goals for a V2 Redesign:
1. **Glassmorphism**: Maximize transparent, blurred overlays (`backdrop-filter: blur(12px)`) on top of deep background radial gradients.
2. **Glowing Borders**: Use border glow animations (`box-shadow: 0 0 15px var(--accent-color)`) selectively for the active compiler executing lines or active DP grid updates.
3. **Micro-Animations**: Add spring-based transitions (`framer-motion` spring config) to array box swaps, sliding window size shrinks, and call stack additions rather than strict linear animations.

---

## 📐 Layout & Wireframe Redesign Recommendations

### 1. Main visualizer layout (`/sandbox` and `/problem/:id`)
Currently, a two-column layout is used:
- **Left Column (45% width)**: Problem description, progressive hint ladders, Monaco editor, and playback controls.
- **Right Column (55% width)**: Tabbed visualizer panel.

*Redesign Suggestion:*
- Implement **Draggable Split Panels** (e.g. using `react-resizable-panels`) so users can slide the editor width depending on monitor sizes.
- **Floating Controls Overlay**: Move the playback progress slider and play buttons into a floating glassmorphic bar at the bottom center of the visualizer canvas (like video editing software), saving precious vertical editor space.

### 2. Standalone DSA Algorithm Library (`/dsa`) & Practice Catalog (`/problems`)
Currently, these present list cards representing algorithms.

*Redesign Suggestion:*
- **Mastery Progress Grid**: Display category cards in a grid grouping with a circular progress indicator (radial percentage circle) showing how many problems have been solved in that specific category (e.g. "Sliding Window: 3/6 solved").
- **Dark Neon Badges**: Replace flat difficulty labels with glowing neon outline badges:
  - **Easy**: `border: 1px solid #4ade80`, `color: #4ade80`, `shadow: 0 0 8px rgba(74,222,128,0.2)`
  - **Medium**: `border: 1px solid #fbbf24`, `color: #fbbf24`
  - **Hard**: `border: 1px solid #f87171`, `color: #f87171`

---

## ⚡ UX Micro-Interactions & Controls Redesign

1. **Scrubber Scrubbing UX**:
   - Ensure the timeline input slider generates a tiny thumbnail popup showing the line number above the handle when hovering/scrubbing (like scrubbing an MP4 timeline).
2. **Speed Dial**:
   - Instead of a flat row of speed buttons (`0.5x`, `1x`, `2x`), use a dial control or a sliding scroll wheel to allow fluid playback speed increments.
3. **Trace Step Log drawer**:
   - Implement a collapsible side-drawer that displays a running history log of steps (e.g. `Step 12: left incremented to 2`, `Step 13: comparing index 2 & 3`), enabling users to audit steps list in bulk rather than clicking step-by-step.
4. **Visualizer Variable watch**:
   - Allow users to click on any variable name in the variable watch panel to highlight/flash the corresponding data structure visualization card (e.g. clicking `let arr` in the variables tab flashes the Array visualizer chart).
