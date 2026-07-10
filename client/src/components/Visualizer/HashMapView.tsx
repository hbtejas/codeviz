import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database } from 'lucide-react';

interface HashMapViewProps {
  mapData: Record<string, unknown> | null;
}

export const HashMapView: React.FC<HashMapViewProps> = ({ mapData }) => {
  if (!mapData || Object.keys(mapData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 p-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <Database size={24} className="opacity-40" />
        No active Hash Map / Dictionary in scope
      </div>
    );
  }

  const entries = Object.entries(mapData);

  return (
    <div className="flex flex-col gap-2 p-4 h-full overflow-y-auto">
      <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        Hash Map / Lookup Table ({entries.length} entries)
      </div>
      <div className="flex flex-col gap-1.5 mt-2">
        <AnimatePresence>
          {entries.map(([key, val]) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-between px-3 py-1.5 rounded border text-xs"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="mono px-1.5 py-0.5 rounded text-[11px]" style={{ background: 'rgba(96,165,250,0.15)', color: 'var(--accent-blue)' }}>
                  key: {key}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="mono text-slate-300 font-bold">
                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
