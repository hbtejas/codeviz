// ─── Execution trace types ──────────────────────────────────────────────────

export type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'c';

export type TraceEvent = 'line' | 'call' | 'return' | 'exception';

export interface CallFrame {
  function: string;
  line: number;
}

export interface TraceStep {
  line: number;
  event: TraceEvent;
  variables: Record<string, unknown>;
  callStack: CallFrame[];
  output: string;
  returnValue?: unknown;
  error?: string;
  traceback?: string;
}

export interface ExecutionResult {
  steps: TraceStep[];
  totalSteps: number;
  finalOutput: string;
  error: string | null;
  language: Language;
  elapsed: number;
}

// ─── DSA Example types ──────────────────────────────────────────────────────

export type DSACategory =
  | 'sorting'
  | 'searching'
  | 'data-structures'
  | 'graph'
  | 'recursion';

export interface DSAExample {
  id: string;
  category: DSACategory;
  title: string;
  description: string;
  language: Language;
  code: string;
  complexity: { time: string; space: string };
}

// ─── Snippet types ──────────────────────────────────────────────────────────

export interface Snippet {
  slug: string;
  code: string;
  language: Language;
  title: string;
  sessionId?: string;
  createdAt?: string;
}

// ─── Visualizer detection ───────────────────────────────────────────────────

export type VisualizerType =
  | 'array'
  | 'linkedlist'
  | 'stack'
  | 'queue'
  | 'tree'
  | 'graph'
  | 'variables'
  | 'callstack'
  | 'output';
