import type { TraceStep } from '../types';
import type { PatternPlugin, AnnotationMap, CellPointer } from './types';

/**
 * Dynamic Programming Table Pattern Plugin
 * 
 * Detects 1D or 2D arrays named 'dp', 'memo', 'table', 'cache'.
 * Maps currently filling indices (often index loop vars like i, j).
 */

const DP_NAMES = new Set(['dp', 'memo', 'table', 'cache', 'grid']);

function findDPVars(vars: Record<string, unknown>) {
  let dpVar: string | null = null;
  let iVar: string | null = null;
  let jVar: string | null = null;

  for (const [k, v] of Object.entries(vars)) {
    const kl = k.toLowerCase();
    if (DP_NAMES.has(kl)) {
      if (Array.isArray(v)) {
        dpVar = k;
      }
    }
    if (typeof v === 'number' && Number.isInteger(v)) {
      if (kl === 'i' || kl === 'row') iVar = k;
      else if (kl === 'j' || kl === 'col') jVar = k;
    }
  }

  // Fallback: search for any 2D/1D array
  if (!dpVar) {
    for (const [k, v] of Object.entries(vars)) {
      if (Array.isArray(v) && v.length > 0) {
        dpVar = k;
        break;
      }
    }
  }

  return { dpVar, iVar, jVar };
}

export const dpTablePlugin: PatternPlugin = {
  id: 'dp-table',
  name: 'DP Table',
  description: 'Visualizes 1D or 2D dynamic programming matrices, tracking state transition cell by cell.',
  color: 'var(--accent-green)',

  detectRelevance(trace) {
    let dpSteps = 0;
    for (const step of trace) {
      const { dpVar } = findDPVars(step.variables);
      if (dpVar) dpSteps++;
    }
    if (trace.length === 0) return 0;
    return dpSteps / trace.length;
  },

  annotateStep(step) {
    const { dpVar, iVar, jVar } = findDPVars(step.variables);
    const cellStates: AnnotationMap['cellStates'] = {};
    const pointers: CellPointer[] = [];
    let dpCell: AnnotationMap['dpCell'];

    const dp = dpVar ? step.variables[dpVar] : null;
    const iIdx = iVar ? (step.variables[iVar] as number) : null;
    const jIdx = jVar ? (step.variables[jVar] as number) : null;

    if (Array.isArray(dp)) {
      const is2D = Array.isArray(dp[0]);

      if (is2D) {
        if (iIdx !== null && jIdx !== null) {
          dpCell = { row: iIdx, col: jIdx };
          pointers.push({ index: jIdx, label: 'DP', color: 'var(--accent-green)', row: iIdx, col: jIdx });
        }
      } else {
        if (iIdx !== null) {
          cellStates[iIdx] = 'dp-current';
          pointers.push({ index: iIdx, label: 'DP', color: 'var(--accent-green)' });
        }
      }
    }

    const desc = dpCell
      ? `DP Table: Filling dp[${dpCell.row}][${dpCell.col}]`
      : iIdx !== null
        ? `DP Table: Filling dp[${iIdx}]`
        : 'DP Table pattern active';

    return { cellStates, pointers, dpCell, stepDescription: desc, patternHint: 'Dynamic Programming' };
  }
};
