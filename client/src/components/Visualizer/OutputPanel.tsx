import React from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { Terminal } from 'lucide-react';

export const OutputPanel: React.FC = () => {
  const { trace, currentStep, finalOutput, execError } = useExecutionStore();

  const step = trace[currentStep];
  const output = step?.output ?? finalOutput ?? '';
  const error = step?.error ?? execError ?? null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b"
           style={{ borderColor: 'var(--border-subtle)' }}>
        <Terminal size={13} style={{ color: 'var(--text-muted)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Output</span>
        {error && <span className="badge badge-red ml-auto">Error</span>}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {error && (
          <div className="card p-3 mb-3" style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-red)' }}>Error</p>
            <pre className="text-xs mono whitespace-pre-wrap" style={{ color: 'var(--accent-red)' }}>
              {error}
            </pre>
          </div>
        )}

        {output ? (
          <pre className="text-xs mono whitespace-pre-wrap leading-relaxed"
               style={{ color: 'var(--accent-green)' }}>
            {output}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
            <p className="text-xs">No output yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
