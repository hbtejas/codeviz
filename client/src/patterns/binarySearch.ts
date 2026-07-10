import type { TraceStep } from '../types';
import type { PatternPlugin, AnnotationMap, CellPointer } from './types';

/**
 * Binary Search Pattern Plugin
 * 
 * Detects standard low/high boundary pointers and a mid pointer.
 * Common vars: low/high/mid, l/r/m, left/right/mid.
 */

const LOW_NAMES = new Set(['low', 'l', 'left', 'start', 'lo']);
const HIGH_NAMES = new Set(['high', 'r', 'right', 'end', 'hi']);
const MID_NAMES = new Set(['mid', 'm', 'middle']);

function findBinarySearchVars(vars: Record<string, unknown>) {
  let lowVar: string | null = null;
  let highVar: string | null = null;
  let midVar: string | null = null;
  let arrayVar: string | null = null;

  for (const [k, v] of Object.entries(vars)) {
    const kl = k.toLowerCase();
    if (typeof v === 'number' && Number.isInteger(v)) {
      if (!lowVar && LOW_NAMES.has(kl)) lowVar = k;
      else if (!highVar && HIGH_NAMES.has(kl)) highVar = k;
      else if (!midVar && MID_NAMES.has(kl)) midVar = k;
    }
    if (Array.isArray(v) && v.length > 1) {
      if (!arrayVar) arrayVar = k;
    }
  }
  return { lowVar, highVar, midVar, arrayVar };
}

export const binarySearchPlugin: PatternPlugin = {
  id: 'binary-search',
  name: 'Binary Search',
  description: 'An algorithm searching sorted arrays by dividing the search interval in half repeatedly.',
  color: 'var(--accent-purple)',

  detectRelevance(trace) {
    let stepsWithLowHigh = 0;
    for (const step of trace) {
      const { lowVar, highVar } = findBinarySearchVars(step.variables);
      if (lowVar && highVar) stepsWithLowHigh++;
    }
    if (trace.length === 0) return 0;
    return stepsWithLowHigh / trace.length;
  },

  annotateStep(step) {
    const { lowVar, highVar, midVar, arrayVar } = findBinarySearchVars(step.variables);
    const cellStates: AnnotationMap['cellStates'] = {};
    const pointers: CellPointer[] = [];

    const arr = arrayVar ? (step.variables[arrayVar] as unknown[]) : null;
    const lowIdx = lowVar ? (step.variables[lowVar] as number) : null;
    const highIdx = highVar ? (step.variables[highVar] as number) : null;
    const midIdx = midVar ? (step.variables[midVar] as number) : null;

    if (arr) {
      // Everything outside low and high is excluded/greyed out
      for (let i = 0; i < arr.length; i++) {
        if (lowIdx !== null && i < lowIdx) cellStates[i] = 'excluded';
        else if (highIdx !== null && i > highIdx) cellStates[i] = 'excluded';
        else cellStates[i] = 'normal';
      }

      if (lowIdx !== null && lowIdx >= 0 && lowIdx < arr.length) {
        cellStates[lowIdx] = 'left';
        pointers.push({ index: lowIdx, label: 'L', color: 'var(--accent-blue)' });
      }

      if (highIdx !== null && highIdx >= 0 && highIdx < arr.length) {
        cellStates[highIdx] = 'right';
        pointers.push({ index: highIdx, label: 'H', color: 'var(--accent-red)' });
      }

      if (midIdx !== null && midIdx >= 0 && midIdx < arr.length) {
        cellStates[midIdx] = 'pivot';
        pointers.push({ index: midIdx, label: 'M', color: 'var(--accent-purple)' });
      }
    }

    const desc = midIdx !== null
      ? `Checking mid index ${midIdx} (value: ${arr ? arr[midIdx] : '?'})`
      : 'Binary Search search space boundaries active';

    return { cellStates, pointers, stepDescription: desc, patternHint: 'Modified Binary Search' };
  }
};
