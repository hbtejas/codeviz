import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExecutionStore } from '../../store/useExecutionStore';
import { Layers } from 'lucide-react';

export const CallStackView: React.FC = () => {
  const { trace, currentStep } = useExecutionStore();

  if (trace.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-8"
           style={{ color: 'var(--text-muted)' }}>
        <Layers size={28} className="opacity-40" />
        <p className="text-xs">Call stack appears during execution</p>
      </div>
    );
  }

  const step = trace[currentStep];
  const frames = step?.callStack || [];

  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto h-full">
      {/* Stack label */}
      <div className="flex items-center gap-2 mb-1">
        <Layers size={13} style={{ color: 'var(--text-muted)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Call Stack ({frames.length} frame{frames.length !== 1 ? 's' : ''})
        </span>
      </div>

      {frames.length === 0 ? (
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          No active frames
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {[...frames].reverse().map((frame, idx) => (
            <motion.div
              key={`${frame.function}-${idx}`}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className={`stack-frame ${idx === 0 ? 'active' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {idx === 0 && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--accent-purple)' }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                  )}
                  <span
                    className="text-xs font-semibold mono"
                    style={{ color: idx === 0 ? 'var(--accent-purple)' : 'var(--text-primary)' }}
                  >
                    {frame.function === '<module>' || frame.function === '<global>' ? 'global' : frame.function}
                    ()
                  </span>
                </div>
                <span className="text-xs mono" style={{ color: 'var(--text-muted)' }}>
                  line {frame.line}
                </span>
              </div>
              {idx === frames.length - 1 && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  ↑ entry point
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
