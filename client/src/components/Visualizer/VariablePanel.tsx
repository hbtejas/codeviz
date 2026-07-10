import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExecutionStore } from '../../store/useExecutionStore';
import { Variable } from 'lucide-react';

function formatValue(val: unknown, depth = 0): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'function') return '[Function]';
  if (Array.isArray(val)) {
    if (depth > 1) return `[…${val.length}]`;
    return `[${val.slice(0, 8).map((v) => formatValue(v, depth + 1)).join(', ')}${val.length > 8 ? ', …' : ''}]`;
  }
  if (typeof val === 'object') {
    if (depth > 1) return '{…}';
    const entries = Object.entries(val as Record<string, unknown>).slice(0, 5);
    const inner = entries.map(([k, v]) => `${k}: ${formatValue(v, depth + 1)}`).join(', ');
    return `{${inner}}`;
  }
  return String(val);
}

function getValueColor(val: unknown): string {
  if (typeof val === 'number') return 'var(--accent-amber)';
  if (typeof val === 'string') return 'var(--accent-green)';
  if (typeof val === 'boolean') return 'var(--accent-purple)';
  if (val === null || val === undefined) return 'var(--text-muted)';
  if (Array.isArray(val)) return 'var(--accent-cyan)';
  if (typeof val === 'object') return 'var(--accent-blue)';
  return 'var(--text-primary)';
}

export const VariablePanel: React.FC = () => {
  const { trace, currentStep } = useExecutionStore();
  const prevVarsRef = useRef<Record<string, unknown>>({});

  const step = trace[currentStep];
  const vars = step?.variables || {};
  const prevVars = prevVarsRef.current;

  // Detect changed variables
  const changedKeys = new Set<string>();
  for (const key of Object.keys(vars)) {
    if (JSON.stringify(vars[key]) !== JSON.stringify(prevVars[key])) {
      changedKeys.add(key);
    }
  }

  // Must be called unconditionally before any early returns
  useEffect(() => {
    prevVarsRef.current = vars;
  });

  if (trace.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-8"
           style={{ color: 'var(--text-muted)' }}>
        <Variable size={28} className="opacity-40" />
        <p className="text-xs">Run code to see variables</p>
      </div>
    );
  }

  const entries = Object.entries(vars);
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--text-muted)' }}>
        No variables in scope
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-1.5 p-3 overflow-y-auto h-full">
      <AnimatePresence mode="popLayout">
        {entries.map(([key, val]) => {
          const isChanged = changedKeys.has(key);
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className={`var-pill ${isChanged ? 'changed' : ''}`}
            >
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-blue)' }}>
                {key}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>=</span>
              <span
                className="text-xs mono flex-1 truncate"
                style={{ color: getValueColor(val) }}
                title={formatValue(val)}
              >
                {formatValue(val)}
              </span>
              {isChanged && (
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-xs badge-cyan badge"
                >
                  ↑
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
