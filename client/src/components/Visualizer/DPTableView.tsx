import React from 'react';
import { motion } from 'framer-motion';
import type { AnnotationMap } from '../../patterns/types';

interface DPTableViewProps {
  dpData: unknown;
  annotations?: AnnotationMap;
}

export const DPTableView: React.FC<DPTableViewProps> = ({ dpData, annotations }) => {
  if (!dpData) return null;

  // Let's determine if it's 1D or 2D
  const is2D = Array.isArray(dpData) && Array.isArray((dpData as unknown[])[0]);

  if (is2D) {
    const matrix = dpData as unknown[][];
    const rowCount = matrix.length;
    const colCount = matrix[0]?.length || 0;

    return (
      <div className="flex flex-col gap-2 p-4 h-full overflow-auto">
        <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          2D Dynamic Programming Table ({rowCount}×{colCount})
        </div>
        <div className="grid gap-1 mt-2" style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}>
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-start">
              {row.map((val, cIdx) => {
                const isCurrent = annotations?.dpCell?.row === rIdx && annotations?.dpCell?.col === cIdx;
                
                // Color states
                let cellClass = "dp-cell border rounded text-xs flex items-center justify-center font-mono";
                let style: React.CSSProperties = {
                  width: '42px',
                  height: '42px',
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                };

                if (isCurrent) {
                  style.background = 'var(--accent-green)';
                  style.color = '#000';
                  style.borderColor = 'var(--accent-green)';
                  style.boxShadow = '0 0 10px var(--accent-green)';
                } else if (val !== null && val !== undefined) {
                  style.borderColor = 'rgba(74,222,128,0.2)';
                  style.background = 'rgba(74,222,128,0.05)';
                  style.color = 'var(--accent-green)';
                }

                return (
                  <motion.div
                    key={`${rIdx}-${cIdx}`}
                    layout
                    style={style}
                    className={cellClass}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    title={`dp[${rIdx}][${cIdx}] = ${JSON.stringify(val)}`}
                  >
                    {val === null || val === undefined ? '—' : String(val)}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 1D Array DP Table
  if (Array.isArray(dpData)) {
    const list = dpData as unknown[];
    return (
      <div className="flex flex-col gap-2 p-4 h-full overflow-auto">
        <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          1D DP Table ({list.length} elements)
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {list.map((val, idx) => {
            const isCurrent = annotations?.cellStates[idx] === 'dp-current';
            let style: React.CSSProperties = {
              width: '48px',
              height: '48px',
              borderColor: 'var(--border-subtle)',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
            };

            if (isCurrent) {
              style.background = 'var(--accent-green)';
              style.color = '#000';
              style.borderColor = 'var(--accent-green)';
              style.boxShadow = '0 0 10px var(--accent-green)';
            } else if (val !== null && val !== undefined) {
              style.borderColor = 'rgba(74,222,128,0.2)';
              style.background = 'rgba(74,222,128,0.05)';
              style.color = 'var(--accent-green)';
            }

            return (
              <motion.div
                key={idx}
                layout
                style={style}
                className="border rounded flex flex-col items-center justify-center font-mono"
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                title={`dp[${idx}] = ${JSON.stringify(val)}`}
              >
                <span className="text-xs font-bold">{val === null || val === undefined ? '—' : String(val)}</span>
                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{idx}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
