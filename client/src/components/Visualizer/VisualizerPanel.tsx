import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from './VariablePanel';
import { CallStackView } from './CallStackView';
import { ArrayView } from './ArrayView';
import { OutputPanel } from './OutputPanel';
import { RecursionTreeView } from './RecursionTreeView';
import { DPTableView } from './DPTableView';
import { HashMapView } from './HashMapView';
import { useExecutionStore } from '../../store/useExecutionStore';
import { autoDetectPattern } from '../../patterns/autoDetect';
import {
  BarChart2, Layers, Variable, Terminal, GitBranch, Info, Grid, Database
} from 'lucide-react';

type PanelId = 'arrays' | 'variables' | 'callstack' | 'recursion' | 'dpTable' | 'hashMap' | 'output';

const PANELS: { id: PanelId; label: string; icon: React.ReactNode }[] = [
  { id: 'arrays',    label: 'Arrays',      icon: <BarChart2 size={14} /> },
  { id: 'dpTable',   label: 'DP Table',    icon: <Grid size={14} /> },
  { id: 'hashMap',   label: 'Hash Map',    icon: <Database size={14} /> },
  { id: 'variables', label: 'Variables',   icon: <Variable size={14} /> },
  { id: 'callstack', label: 'Call Stack',  icon: <Layers size={14} /> },
  { id: 'recursion', label: 'Recursion',   icon: <GitBranch size={14} /> },
  { id: 'output',    label: 'Output',      icon: <Terminal size={14} /> },
];

export const VisualizerPanel: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelId>('arrays');
  const { trace, currentStep, isLoading, execError } = useExecutionStore();

  const step = trace[currentStep];
  const prevStep = currentStep > 0 ? trace[currentStep - 1] : null;

  // Auto detect active pattern
  const { plugin, confidence } = autoDetectPattern(trace);
  const annotations = plugin ? plugin.annotateStep(step, prevStep, trace) : undefined;

  // Search for any active DP matrix or memo in variables to feed the DP tab
  let dpData: unknown = null;
  if (step?.variables) {
    for (const [k, v] of Object.entries(step.variables)) {
      if (['dp', 'memo', 'table', 'cache', 'grid'].includes(k.toLowerCase()) && Array.isArray(v)) {
        dpData = v;
        break;
      }
    }
    // Fallback: look for any array that contains arrays or is a number array of length >= 5
    if (!dpData) {
      for (const v of Object.values(step.variables)) {
        if (Array.isArray(v) && v.length > 0) {
          dpData = v;
          break;
        }
      }
    }
  }

  // Search for any active hash map or object dict to feed the HashMap tab
  let mapData: Record<string, unknown> | null = null;
  if (step?.variables) {
    for (const [k, v] of Object.entries(step.variables)) {
      const isDict = v && typeof v === 'object' && !Array.isArray(v) && k.toLowerCase() !== 'math' && k.toLowerCase() !== 'json' && k.toLowerCase() !== 'console';
      if (isDict) {
        mapData = v as Record<string, unknown>;
        break;
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ─ Step info header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2 border-b"
           style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <Info size={13} style={{ color: 'var(--text-muted)' }} />
        {isLoading ? (
          <span className="text-xs animate-pulse" style={{ color: 'var(--accent-blue)' }}>
            Executing...
          </span>
        ) : step ? (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span style={{ color: 'var(--text-muted)' }}>
              Step {currentStep + 1}/{trace.length}
            </span>
            <span className="mono" style={{ color: 'var(--text-secondary)' }}>
              Line {step.line}
            </span>
            <span className={`badge ${
              step.event === 'exception' ? 'badge-red' :
              step.event === 'return'    ? 'badge-green' :
              step.event === 'call'      ? 'badge-purple' :
              'badge-blue'
            }`}>
              {step.event}
            </span>
            {step.callStack[0]?.function && (
              <span className="mono" style={{ color: 'var(--text-muted)' }}>
                in <span style={{ color: 'var(--accent-cyan)' }}>{step.callStack[step.callStack.length - 1]?.function}()</span>
              </span>
            )}
            {plugin && (
              <span className="badge badge-amber ml-2 animate-pulse">
                🔍 {plugin.name} ({confidence}%)
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {execError ? '⚠ Execution error' : 'Run code to begin visualization'}
          </span>
        )}
      </div>

      {/* Step description from annotation plugin if available */}
      {annotations?.stepDescription && (
        <div className="px-4 py-2 border-b text-xs flex justify-between items-center"
             style={{ background: 'rgba(96, 165, 250, 0.05)', borderColor: 'var(--border-subtle)' }}>
          <span style={{ color: 'var(--accent-blue)' }}>💡 {annotations.stepDescription}</span>
        </div>
      )}

      {/* ─ Panel tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-0.5 px-2 pt-2 border-b overflow-x-auto"
           style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}>
        {PANELS.map((p) => {
          // Highlight DP and HashMap tabs if active variables exist
          const hasHighlight = 
            (p.id === 'dpTable' && dpData) || 
            (p.id === 'hashMap' && mapData);
          
          return (
            <button
              key={p.id}
              id={`panel-tab-${p.id}`}
              onClick={() => setActivePanel(p.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-all shrink-0 ${
                activePanel === p.id
                  ? 'border-blue-400 text-blue-400'
                  : hasHighlight 
                    ? 'border-transparent text-emerald-400 hover:text-emerald-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {p.icon}
              {p.label}
              {hasHighlight && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* ─ Active panel ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden" style={{ background: 'var(--bg-panel)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activePanel === 'arrays'    && <ArrayView annotations={annotations} />}
            {activePanel === 'dpTable'   && <DPTableView dpData={dpData} annotations={annotations} />}
            {activePanel === 'hashMap'   && <HashMapView mapData={mapData} />}
            {activePanel === 'variables' && <VariablePanel />}
            {activePanel === 'callstack' && <CallStackView />}
            {activePanel === 'recursion' && <RecursionTreeView />}
            {activePanel === 'output'    && <OutputPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

