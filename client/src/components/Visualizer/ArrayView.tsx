import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionStore } from '../../store/useExecutionStore';
import { BarChart2 } from 'lucide-react';
import type { AnnotationMap, CellState } from '../../patterns/types';

interface ArrayCellProps {
  value: unknown;
  index: number;
  state: CellState;
  prevValue?: unknown;
  pointers: string[];
}

const ArrayCell: React.FC<ArrayCellProps> = ({ value, index, state, prevValue, pointers }) => {
  const didChange = JSON.stringify(value) !== JSON.stringify(prevValue);
  const label = Array.isArray(value)
    ? `[${(value as unknown[]).slice(0, 3).join(',')}…]`
    : String(value);

  // Map annotator states to CSS classes or colors
  let cellClass = `array-cell ${state}`;
  if (state === 'left') cellClass = 'array-cell comparing border-blue-400';
  if (state === 'right') cellClass = 'array-cell swapping border-rose-500';
  if (state === 'window') cellClass = 'array-cell normal border-amber-400 bg-amber-400/5';
  if (state === 'window-edge') cellClass = 'array-cell normal border-amber-500 bg-amber-500/20';
  if (state === 'excluded') cellClass = 'array-cell opacity-40 grayscale scale-95';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: didChange ? [1, 1.12, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-1 min-w-[50px] relative"
    >
      {/* Pointers wrapper */}
      <div className="h-6 flex flex-col items-center justify-end text-[10px] font-bold mono">
        {pointers.map((p, idx) => (
          <motion.span
            key={idx}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-1 py-0.2 rounded text-[9px]"
            style={{
              background: p.startsWith('L') || p.toLowerCase().includes('left') ? 'var(--accent-blue)' :
                          p.startsWith('R') || p.toLowerCase().includes('right') ? 'var(--accent-red)' :
                          'var(--accent-cyan)',
              color: '#000'
            }}
          >
            {p}
          </motion.span>
        ))}
      </div>

      <motion.div
        className={cellClass}
        animate={state === 'comparing' ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: state === 'comparing' ? Infinity : 0, duration: 0.7 }}
      >
        <span className="text-sm mono font-bold truncate max-w-[40px] text-center" title={String(value)}>
          {label}
        </span>
      </motion.div>
      <span className="text-xs mono" style={{ color: 'var(--text-muted)' }}>{index}</span>
    </motion.div>
  );
};

function detectArrayVars(
  vars: Record<string, unknown>,
  prevVars: Record<string, unknown>
): Array<{ name: string; current: unknown[]; prev: unknown[] }> {
  const results: Array<{ name: string; current: unknown[]; prev: unknown[] }> = [];

  for (const [key, val] of Object.entries(vars)) {
    if (Array.isArray(val) && val.length > 0 && val.length <= 30) {
      const isPrimitive = (v: unknown) =>
        typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean';
      if (val.every(isPrimitive)) {
        results.push({
          name: key,
          current: val,
          prev: Array.isArray(prevVars[key]) ? (prevVars[key] as unknown[]) : val,
        });
      }
    }
  }
  return results;
}

function getCellState(
  idx: number,
  current: unknown[],
  prev: unknown[],
  annotations?: AnnotationMap
): CellState {
  if (annotations && annotations.cellStates[idx] !== undefined) {
    return annotations.cellStates[idx];
  }
  const changed = JSON.stringify(current[idx]) !== JSON.stringify(prev[idx]);
  if (changed) return 'swapping';
  return 'normal';
}

interface ArrayViewProps {
  annotations?: AnnotationMap;
}

export const ArrayView: React.FC<ArrayViewProps> = ({ annotations }) => {
  const { trace, currentStep } = useExecutionStore();
  const prevVarsRef = useRef<Record<string, unknown>>({});

  const step = trace[currentStep];
  const vars = step?.variables || {};
  const prevVars = prevVarsRef.current;
  const arrays = trace.length > 0 ? detectArrayVars(vars, prevVars) : [];

  useEffect(() => {
    if (trace.length > 0) {
      prevVarsRef.current = { ...vars };
    }
  });

  if (trace.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-8"
           style={{ color: 'var(--text-muted)' }}>
        <BarChart2 size={28} className="opacity-40" />
        <p className="text-xs">Array variables will appear here</p>
      </div>
    );
  }

  if (arrays.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--text-muted)' }}>
        No array variables detected at this step
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {arrays.map(({ name, current, prev }) => (
        <div key={name} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold mono" style={{ color: 'var(--accent-cyan)' }}>
                {name}
              </span>
              <span className="badge badge-blue text-xs">{current.length} items</span>
            </div>
            {annotations?.patternHint && (
              <span className="badge badge-amber text-[10px] font-semibold">
                Pattern: {annotations.patternHint}
              </span>
            )}
          </div>

          {/* Sliding Window boundary indicators */}
          <div className="flex flex-wrap gap-2 items-end pt-2">
            <AnimatePresence mode="popLayout">
              {current.map((val, idx) => {
                const cellPointers = (annotations?.pointers || [])
                  .filter(p => p.index === idx)
                  .map(p => p.label);

                return (
                  <ArrayCell
                    key={idx}
                    value={val}
                    index={idx}
                    state={getCellState(idx, current, prev, annotations)}
                    prevValue={prev[idx]}
                    pointers={cellPointers}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Bar chart visualization */}
          {current.every((v) => typeof v === 'number') && current.length <= 20 && (
            <div className="flex items-end gap-1 h-16 mt-3">
              {(current as number[]).map((val, idx) => {
                const max = Math.max(...(current as number[]));
                const heightPct = max > 0 ? (val / max) * 100 : 0;
                const state = getCellState(idx, current, prev, annotations);
                return (
                  <motion.div
                    key={idx}
                    layout
                    className="flex-1 rounded-t min-w-[4px]"
                    style={{
                      height: `${heightPct}%`,
                      background:
                        state === 'swapping' || state === 'right' ? 'var(--accent-red)' :
                        state === 'comparing' || state === 'left' ? 'var(--accent-amber)' :
                        state === 'window' ? 'rgba(251,191,36,0.6)' :
                        state === 'excluded' ? 'rgba(148,163,184,0.1)' :
                        'var(--gradient-accent)',
                      minHeight: 2,
                      transition: 'height 0.3s ease',
                    }}
                    animate={{ height: `${heightPct}%` }}
                    title={`[${idx}] = ${val}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

