import type { TraceStep } from '../types';
import type { PatternPlugin, AnnotationMap, CellPointer } from './types';

/**
 * Two Pointers Pattern Plugin
 *
 * Detects two index variables that traverse an array from opposite ends
 * (or same direction). Common variable names: left/right, lo/hi, i/j, start/end.
 */

const LEFT_NAMES = new Set(['left', 'lo', 'l', 'start', 'i', 'p1', 'ptr1', 'slow']);
const RIGHT_NAMES = new Set(['right', 'hi', 'r', 'end', 'j', 'p2', 'ptr2', 'fast']);

function findPointerVars(vars: Record<string, unknown>): { left: string | null; right: string | null; arrayVar: string | null } {
  let left: string | null = null;
  let right: string | null = null;
  let arrayVar: string | null = null;

  for (const [k, v] of Object.entries(vars)) {
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0) {
      if (!left && LEFT_NAMES.has(k.toLowerCase())) left = k;
      else if (!right && RIGHT_NAMES.has(k.toLowerCase())) right = k;
    }
    if (Array.isArray(v) && v.length > 1 && v.every(x => typeof x === 'number' || typeof x === 'string')) {
      if (!arrayVar) arrayVar = k;
    }
  }
  return { left, right, arrayVar };
}

export const twoPointersPlugin: PatternPlugin = {
  id: 'two-pointers',
  name: 'Two Pointers',
  description: 'Two index variables move through an array, typically toward each other or in the same direction.',
  color: 'var(--accent-blue)',

  detectRelevance(trace) {
    let score = 0;
    let stepsWithBoth = 0;

    for (const step of trace) {
      const { left, right } = findPointerVars(step.variables);
      if (left && right) stepsWithBoth++;
    }

    if (trace.length > 0) score = stepsWithBoth / trace.length;

    // Bonus: if left and right ever converge toward each other
    const firstStep = trace[0];
    const lastStep = trace[trace.length - 1];
    if (firstStep && lastStep) {
      const { left: lk, right: rk, arrayVar } = findPointerVars(firstStep.variables);
      if (lk && rk && arrayVar) {
        const arr = firstStep.variables[arrayVar] as unknown[];
        const firstL = firstStep.variables[lk] as number;
        const firstR = firstStep.variables[rk] as number;
        const lastL = lastStep.variables[lk] as number ?? firstL;
        const lastR = lastStep.variables[rk] as number ?? firstR;
        // Converging: left increases, right decreases
        if (lastL > firstL && lastR < firstR) score = Math.min(1, score + 0.3);
      }
    }

    return Math.min(1, score);
  },

  annotateStep(step, prevStep) {
    const { left: lk, right: rk, arrayVar } = findPointerVars(step.variables);
    const cellStates: AnnotationMap['cellStates'] = {};
    const pointers: CellPointer[] = [];

    const arr = arrayVar ? (step.variables[arrayVar] as unknown[]) : null;
    const leftIdx = lk ? (step.variables[lk] as number) : null;
    const rightIdx = rk ? (step.variables[rk] as number) : null;

    if (arr && leftIdx !== null) {
      cellStates[leftIdx] = 'left';
      pointers.push({ index: leftIdx, label: lk!, color: 'var(--accent-blue)' });
    }
    if (arr && rightIdx !== null && rightIdx !== leftIdx) {
      cellStates[rightIdx] = 'right';
      pointers.push({ index: rightIdx, label: rk!, color: 'var(--accent-red)' });
    }

    // Mark cells between pointers as 'window' (search space)
    if (arr && leftIdx !== null && rightIdx !== null) {
      for (let i = 0; i < arr.length; i++) {
        if (i < leftIdx || i > rightIdx) cellStates[i] = 'excluded';
        else if (!cellStates[i]) cellStates[i] = 'window';
      }
    }

    const leftVal = lk ? `${lk}=${leftIdx}` : '';
    const rightVal = rk ? `${rk}=${rightIdx}` : '';
    const desc = leftIdx !== null && rightIdx !== null
      ? `Two Pointers: ${leftVal}, ${rightVal}${leftIdx === rightIdx ? ' — pointers met!' : ''}`
      : 'Two Pointers pattern active';

    return { cellStates, pointers, stepDescription: desc, patternHint: 'Two Pointers' };
  },
};
