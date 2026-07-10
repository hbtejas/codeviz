import type { PatternPlugin, AnnotationMap, CellPointer, WindowRange } from './types';

/**
 * Sliding Window Pattern Plugin
 *
 * Detects a window bounded by two non-decreasing index variables.
 * Common vars: left/right, start/end, l/r, windowStart/windowEnd.
 * The key marker: both pointers only move forward (never reset to 0 after init).
 */

const START_NAMES = new Set(['left', 'start', 'l', 'windowstart', 'lo', 'begin', 'windowleft']);
const END_NAMES   = new Set(['right', 'end', 'r', 'windowend', 'hi', 'finish', 'windowright']);

function findWindowVars(vars: Record<string, unknown>) {
  let startVar: string | null = null;
  let endVar: string | null = null;
  let arrayVar: string | null = null;
  let maxLenVar: string | null = null;

  for (const [k, v] of Object.entries(vars)) {
    const kl = k.toLowerCase();
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0) {
      if (!startVar && START_NAMES.has(kl)) startVar = k;
      else if (!endVar && END_NAMES.has(kl)) endVar = k;
      if (kl.includes('maxlen') || kl.includes('maxsize') || kl === 'result') maxLenVar = k;
    }
    if (Array.isArray(v) && v.length > 1) {
      if (!arrayVar) arrayVar = k;
    }
  }
  return { startVar, endVar, arrayVar, maxLenVar };
}

function isMonotonicallyNonDecreasing(values: number[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1]) return false;
  }
  return true;
}

export const slidingWindowPlugin: PatternPlugin = {
  id: 'sliding-window',
  name: 'Sliding Window',
  description: 'A window defined by two non-decreasing pointers slides over an array/string.',
  color: 'var(--accent-amber)',

  detectRelevance(trace) {
    const leftVals: number[] = [];
    const rightVals: number[] = [];
    let stepsWithBoth = 0;

    for (const step of trace) {
      const { startVar, endVar } = findWindowVars(step.variables);
      if (startVar && endVar) {
        leftVals.push(step.variables[startVar] as number);
        rightVals.push(step.variables[endVar] as number);
        stepsWithBoth++;
      }
    }

    if (stepsWithBoth < 2) return 0;

    const baseScore = stepsWithBoth / trace.length;
    const bothNonDecreasing =
      isMonotonicallyNonDecreasing(leftVals) && isMonotonicallyNonDecreasing(rightVals);

    return bothNonDecreasing ? Math.min(1, baseScore + 0.4) : baseScore * 0.5;
  },

  annotateStep(step) {
    const { startVar, endVar, arrayVar, maxLenVar } = findWindowVars(step.variables);
    const cellStates: AnnotationMap['cellStates'] = {};
    const pointers: CellPointer[] = [];
    let windowRange: WindowRange | undefined;

    const arr = arrayVar ? (step.variables[arrayVar] as unknown[]) : null;
    const startIdx = startVar ? (step.variables[startVar] as number) : null;
    const endIdx   = endVar   ? (step.variables[endVar]   as number) : null;

    if (arr && startIdx !== null && endIdx !== null) {
      for (let i = 0; i < arr.length; i++) {
        if (i < startIdx || i > endIdx) cellStates[i] = 'excluded';
        else if (i === startIdx || i === endIdx) cellStates[i] = 'window-edge';
        else cellStates[i] = 'window';
      }

      if (startVar) pointers.push({ index: startIdx, label: startVar, color: 'var(--accent-amber)' });
      if (endVar && endIdx !== startIdx) pointers.push({ index: endIdx, label: endVar, color: 'var(--accent-cyan)' });

      windowRange = {
        start: startIdx,
        end: endIdx,
        label: maxLenVar ? `size=${endIdx - startIdx + 1}` : `window[${startIdx}..${endIdx}]`,
      };
    }

    const windowSize = startIdx !== null && endIdx !== null ? endIdx - startIdx + 1 : 0;
    const maxLen = maxLenVar ? ` | best=${step.variables[maxLenVar]}` : '';
    const desc = windowSize >= 0
      ? `Sliding Window: size=${windowSize}${maxLen}`
      : 'Sliding Window active';

    return { cellStates, pointers, windowRange, stepDescription: desc, patternHint: 'Sliding Window' };
  },
};
