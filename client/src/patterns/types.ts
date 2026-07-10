// ─── Pattern Annotation System Types ────────────────────────────────────────
import type { TraceStep } from '../types';

/**
 * State that can be applied to a cell in any indexed collection (array, string, etc.)
 */
export type CellState =
  | 'normal'
  | 'highlight'     // generic highlight
  | 'active'        // currently processing
  | 'visited'       // already processed
  | 'left'          // left pointer (two-pointers)
  | 'right'         // right pointer (two-pointers)
  | 'window'        // inside sliding window
  | 'window-edge'   // window boundary
  | 'pivot'         // pivot element (quicksort / binary search mid)
  | 'sorted'        // element in final sorted position
  | 'excluded'      // outside search range
  | 'comparing'     // being compared
  | 'swapping'      // being swapped
  | 'found'         // target found
  | 'dp-current'    // currently filling DP cell
  | 'dp-dependency' // cell that the current DP cell depends on
  | 'dp-filled'     // previously filled DP cell
  | 'backtrack'     // backtracking state
  | 'accepted';     // accepted solution path

/**
 * A labeled pointer rendered above an array cell
 */
export interface CellPointer {
  index: number;
  label: string;
  color: string;
  row?: number; // for 2D (DP tables)
  col?: number;
}

/**
 * A window range overlay (sliding window pattern)
 */
export interface WindowRange {
  start: number;
  end: number;
  label?: string;
}

/**
 * Hash map entry to display in HashMapView
 */
export interface HashEntry {
  key: string;
  value: string;
  isNew?: boolean;
  isLookup?: boolean;
}

/**
 * The complete annotation output for one trace step.
 * Visualizer components receive this as a prop and render accordingly.
 */
export interface AnnotationMap {
  // Per-cell states for the primary array/string variable
  cellStates: Record<string, CellState>;
  // Named pointers to render above cells
  pointers: CellPointer[];
  // Sliding window overlay
  windowRange?: WindowRange;
  // Currently active DP cell (row, col)
  dpCell?: { row: number; col: number };
  // Hash map entries to visualize
  hashEntries?: HashEntry[];
  // Human-readable description for the current step
  stepDescription: string;
  // The detected pattern name
  patternHint?: string;
}

/**
 * A pattern plugin — one per DSA pattern.
 * detectRelevance scores how likely this pattern applies to the trace (0–1).
 * annotateStep produces the visual annotation for a given step.
 */
export interface PatternPlugin {
  id: string;
  name: string;
  description: string;
  color: string; // badge color token

  /** Score 0–1: how relevant is this pattern for the given trace? */
  detectRelevance(trace: TraceStep[]): number;

  /** Produce annotation for one step */
  annotateStep(step: TraceStep, prevStep: TraceStep | null, trace: TraceStep[]): AnnotationMap;
}

/** Empty annotation — used as safe fallback */
export const EMPTY_ANNOTATION: AnnotationMap = {
  cellStates: {},
  pointers: [],
  stepDescription: '',
};
