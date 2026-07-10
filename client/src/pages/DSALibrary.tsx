import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  BarChart2, Search, GitBranch, Cpu, ArrowLeft,
} from 'lucide-react';
import { SharedNavbar } from '../components/SharedNavbar';

// ─── Types ──────────────────────────────────────────────────────────────────

type AlgoStep = {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  current?: number;
  found?: number;
  description: string;
};

// ─── Algorithm Step Generators ──────────────────────────────────────────────

function generateArray(size = 12, max = 90): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 10);
}

function bubbleSortSteps(arr: number[]): AlgoStep[] {
  const a = [...arr];
  const steps: AlgoStep[] = [{ array: [...a], description: 'Starting Bubble Sort — compare adjacent pairs' }];
  const sorted: number[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], sorted: [...sorted], description: `Comparing index ${j} (${a[j]}) and ${j + 1} (${a[j + 1]})` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], swapping: [j, j + 1], sorted: [...sorted], description: `Swapping ${a[j + 1]} and ${a[j]} — they were out of order` });
      }
    }
    sorted.unshift(a.length - 1 - i);
  }
  sorted.push(0);
  steps.push({ array: [...a], sorted: a.map((_, i) => i), description: 'Array is fully sorted! ✓' });
  return steps;
}

function selectionSortSteps(arr: number[]): AlgoStep[] {
  const a = [...arr];
  const steps: AlgoStep[] = [{ array: [...a], description: 'Starting Selection Sort — find minimum each pass' }];
  const sorted: number[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], sorted: [...sorted], current: i, description: `Pass ${i + 1}: comparing min candidate ${a[minIdx]} with ${a[j]}` });
      if (a[j] < a[minIdx]) { minIdx = j; }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], swapping: [i, minIdx], sorted: [...sorted], description: `Placing ${a[i]} at position ${i}` });
    }
    sorted.push(i);
  }
  sorted.push(a.length - 1);
  steps.push({ array: [...a], sorted, description: 'Selection Sort complete! ✓' });
  return steps;
}

function insertionSortSteps(arr: number[]): AlgoStep[] {
  const a = [...arr];
  const steps: AlgoStep[] = [{ array: [...a], description: 'Insertion Sort — build sorted subarray from left' }];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], current: i, description: `Inserting ${key} into sorted position` });
    while (j >= 0 && a[j] > key) {
      steps.push({ array: [...a], comparing: [j, j + 1], description: `${a[j]} > ${key}, shifting right` });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    steps.push({ array: [...a], sorted: Array.from({ length: i + 1 }, (_, k) => k), description: `${key} placed at index ${j + 1}` });
  }
  steps.push({ array: [...a], sorted: a.map((_, i) => i), description: 'Insertion Sort complete! ✓' });
  return steps;
}

function quickSortSteps(arr: number[]): AlgoStep[] {
  const a = [...arr];
  const steps: AlgoStep[] = [{ array: [...a], description: 'Quick Sort — pick pivot, partition around it' }];
  const sorted: number[] = [];

  function partition(low: number, high: number) {
    const pivot = a[high];
    let i = low - 1;
    steps.push({ array: [...a], pivot: high, description: `Pivot = ${pivot} (index ${high})` });
    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], pivot: high, description: `Comparing ${a[j]} with pivot ${pivot}` });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        if (i !== j) steps.push({ array: [...a], swapping: [i, j], pivot: high, description: `Swapping ${a[j]} to left of pivot` });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ array: [...a], sorted: [...sorted, i + 1], description: `Pivot ${pivot} in final position ${i + 1}` });
    return i + 1;
  }

  function qs(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sorted.push(pi);
      qs(low, pi - 1);
      qs(pi + 1, high);
    }
  }

  qs(0, a.length - 1);
  steps.push({ array: [...a], sorted: a.map((_, i) => i), description: 'Quick Sort complete! ✓' });
  return steps;
}

function mergeSortSteps(arr: number[]): AlgoStep[] {
  const a = [...arr];
  const steps: AlgoStep[] = [{ array: [...a], description: 'Merge Sort — divide and conquer recursively' }];

  function mergeSort(arr: number[], start: number): number[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), start);
    const right = mergeSort(arr.slice(mid), start + mid);
    const merged: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    const result = [...merged, ...left.slice(i), ...right.slice(j)];
    for (let k = 0; k < result.length; k++) a[start + k] = result[k];
    steps.push({ array: [...a], description: `Merged subarray [${start}..${start + result.length - 1}]` });
    return result;
  }

  mergeSort([...arr], 0);
  steps.push({ array: [...a], sorted: a.map((_, i) => i), description: 'Merge Sort complete! ✓' });
  return steps;
}

function binarySearchSteps(arr: number[]): AlgoStep[] {
  const sorted = [...arr].sort((a, b) => a - b);
  const target = sorted[Math.floor(sorted.length / 2) + 1];
  const steps: AlgoStep[] = [{ array: sorted, description: `Binary Search for ${target} in sorted array` }];
  let left = 0, right = sorted.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({ array: sorted, comparing: [left, right], current: mid, description: `Check mid = index ${mid}, value = ${sorted[mid]}` });
    if (sorted[mid] === target) {
      steps.push({ array: sorted, found: mid, description: `Found ${target} at index ${mid}! ✓` });
      break;
    } else if (sorted[mid] < target) {
      left = mid + 1;
      steps.push({ array: sorted, comparing: [mid + 1, right], description: `${sorted[mid]} < ${target}, search right half` });
    } else {
      right = mid - 1;
      steps.push({ array: sorted, comparing: [left, mid - 1], description: `${sorted[mid]} > ${target}, search left half` });
    }
  }
  return steps;
}

function linearSearchSteps(arr: number[]): AlgoStep[] {
  const target = arr[Math.floor(arr.length * 0.6)];
  const steps: AlgoStep[] = [{ array: [...arr], description: `Linear Search for ${target}` }];
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], current: i, description: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '==' : '!='} ${target}` });
    if (arr[i] === target) {
      steps.push({ array: [...arr], found: i, description: `Found ${target} at index ${i}! ✓` });
      break;
    }
  }
  return steps;
}

// ─── Algorithm registry ──────────────────────────────────────────────────────

const ALGORITHMS = [
  {
    id: 'bubble', category: 'sorting', name: 'Bubble Sort',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    description: 'Repeatedly compare adjacent elements and swap if out of order. The largest unsorted element "bubbles" to the end each pass.',
    generate: bubbleSortSteps,
  },
  {
    id: 'selection', category: 'sorting', name: 'Selection Sort',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    description: 'Find the minimum element in the unsorted portion and place it at the beginning. Repeat.',
    generate: selectionSortSteps,
  },
  {
    id: 'insertion', category: 'sorting', name: 'Insertion Sort',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    description: 'Build a sorted subarray by taking one element at a time and inserting it into its correct position.',
    generate: insertionSortSteps,
  },
  {
    id: 'quick', category: 'sorting', name: 'Quick Sort',
    complexity: { time: 'O(n log n) avg', space: 'O(log n)' },
    description: 'Choose a pivot, partition around it, then recursively sort each partition. Very efficient in practice.',
    generate: quickSortSteps,
  },
  {
    id: 'merge', category: 'sorting', name: 'Merge Sort',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    description: 'Divide the array in half, sort each half recursively, then merge them back together.',
    generate: mergeSortSteps,
  },
  {
    id: 'bsearch', category: 'searching', name: 'Binary Search',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    description: 'Repeatedly halve the search space by comparing the target with the middle element. Requires sorted array.',
    generate: binarySearchSteps,
  },
  {
    id: 'lsearch', category: 'searching', name: 'Linear Search',
    complexity: { time: 'O(n)', space: 'O(1)' },
    description: 'Scan each element sequentially until the target is found or the array is exhausted.',
    generate: linearSearchSteps,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: <Cpu size={13} /> },
  { id: 'sorting', label: 'Sorting', icon: <BarChart2 size={13} /> },
  { id: 'searching', label: 'Searching', icon: <Search size={13} /> },
  { id: 'graph', label: 'Graph', icon: <GitBranch size={13} /> },
];

// ─── Algorithm Card ──────────────────────────────────────────────────────────

interface AlgoCardProps {
  algo: typeof ALGORITHMS[0];
  onSelect: () => void;
}

const AlgoCard: React.FC<AlgoCardProps> = ({ algo, onSelect }) => (
  <motion.button
    whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(96,165,250,0.15)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className="card text-left p-4 flex flex-col gap-2 cursor-pointer w-full"
  >
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{algo.name}</h3>
      <span className={`badge ${algo.category === 'sorting' ? 'badge-blue' : algo.category === 'searching' ? 'badge-cyan' : 'badge-purple'}`}>
        {algo.category}
      </span>
    </div>
    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{algo.description}</p>
    <div className="flex gap-3 mt-1">
      <span className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Time:</span> <span className="mono badge-amber badge">{algo.complexity.time}</span></span>
      <span className="text-xs"><span style={{ color: 'var(--text-muted)' }}>Space:</span> <span className="mono badge-green badge">{algo.complexity.space}</span></span>
    </div>
  </motion.button>
);

// ─── Visualizer View ─────────────────────────────────────────────────────────

interface AlgoVisualizerProps {
  algo: typeof ALGORITHMS[0];
  onBack: () => void;
}

const AlgoVisualizer: React.FC<AlgoVisualizerProps> = ({ algo, onBack }) => {
  const [arr] = useState(() => generateArray(12, 85));
  const [steps, setSteps] = useState<AlgoStep[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = algo.generate(arr);
    setSteps(s);
    setCurrent(0);
    setIsPlaying(false);
  }, [algo, arr]);

  const play = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        if (c >= steps.length - 1) {
          clearInterval(timerRef.current!);
          setIsPlaying(false);
          return c;
        }
        return c + 1;
      });
    }, 1000 / speed);
    setIsPlaying(true);
  }, [steps.length, speed]);

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  const reset = () => {
    pause();
    setCurrent(0);
  };

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const step = steps[current];
  if (!step) return null;

  const maxVal = Math.max(...step.array);

  const getCellStyle = (idx: number): string => {
    if (step.found === idx) return 'array-cell sorted';
    if (step.sorted?.includes(idx)) return 'array-cell sorted';
    if (step.swapping?.includes(idx)) return 'array-cell swapping';
    if (step.comparing?.includes(idx)) return 'array-cell comparing';
    if (step.pivot === idx) return 'array-cell current';
    if (step.current === idx) return 'array-cell current';
    return 'array-cell';
  };

  return (
    <div className="flex flex-col gap-4 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button className="btn-icon" onClick={onBack}><ArrowLeft size={14} /></button>
        <div>
          <h2 className="text-lg font-bold">{algo.name}</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{algo.description}</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <span className="badge badge-amber mono">{algo.complexity.time}</span>
          <span className="badge badge-green mono">{algo.complexity.space}</span>
        </div>
      </div>

      {/* Array visualization */}
      <div className="panel p-4 flex flex-col gap-4">
        {/* Bar chart */}
        <div className="flex items-end gap-1 h-32">
          {step.array.map((val, idx) => (
            <motion.div
              key={idx}
              layout
              className="flex-1 rounded-t min-w-[8px] relative cursor-pointer"
              style={{
                height: `${(val / maxVal) * 100}%`,
                background:
                  step.found === idx ? 'var(--accent-green)' :
                  step.sorted?.includes(idx) ? 'rgba(74,222,128,0.5)' :
                  step.swapping?.includes(idx) ? 'var(--accent-red)' :
                  step.comparing?.includes(idx) ? 'var(--accent-amber)' :
                  step.pivot === idx ? 'var(--accent-purple)' :
                  step.current === idx ? 'var(--accent-cyan)' :
                  'rgba(96,165,250,0.5)',
                minHeight: 4,
                transition: 'height 0.25s ease, background 0.2s',
              }}
              title={`[${idx}] = ${val}`}
            />
          ))}
        </div>

        {/* Cell labels */}
        <div className="flex gap-1 flex-wrap">
          {step.array.map((val, idx) => (
            <div key={idx} className={getCellStyle(idx)} style={{ width: 40, height: 40, fontSize: 12 }}>
              {val}
            </div>
          ))}
        </div>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-3"
          style={{ borderColor: 'rgba(96,165,250,0.2)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs" style={{ color: 'var(--text-muted)' }}>
        <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: 'var(--accent-amber)' }} />Comparing</span>
        <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: 'var(--accent-red)' }} />Swapping</span>
        <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: 'var(--accent-green)' }} />Sorted</span>
        <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: 'var(--accent-purple)' }} />Pivot</span>
        <span><span className="inline-block w-3 h-3 rounded-sm mr-1" style={{ background: 'var(--accent-cyan)' }} />Current</span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-icon" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}><ChevronLeft size={15} /></button>
          <button className="btn-icon active" onClick={isPlaying ? pause : play}>{isPlaying ? <Pause size={15} /> : <Play size={15} />}</button>
          <button className="btn-icon" onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))} disabled={current >= steps.length - 1}><ChevronRight size={15} /></button>
          <button className="btn-icon" onClick={reset}><RotateCcw size={13} /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Speed</span>
            {[1, 2, 4].map((s) => (
              <button key={s} className={`btn text-xs px-2 py-1 ${speed === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSpeed(s)}>{s}×</button>
            ))}
          </div>
        </div>
        {/* Timeline */}
        <div className="flex items-center gap-2">
          <span className="text-xs mono" style={{ color: 'var(--text-muted)' }}>{current + 1}</span>
          <input
            type="range" min={0} max={steps.length - 1} value={current}
            onChange={(e) => { pause(); setCurrent(Number(e.target.value)); }}
            className="timeline-track flex-1"
          />
          <span className="text-xs mono" style={{ color: 'var(--text-muted)' }}>{steps.length}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main DSA Library Page ───────────────────────────────────────────────────

export const DSALibrary: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<typeof ALGORITHMS[0] | null>(null);

  const filtered = category === 'all' ? ALGORITHMS : ALGORITHMS.filter((a) => a.category === category);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      <SharedNavbar />

      {selected ? (
        <AlgoVisualizer algo={selected} onBack={() => setSelected(null)} />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold gradient-text mb-2">DSA Algorithm Library</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Interactive visualizations of classic data structures and algorithms — no code needed.
            </p>
          </motion.div>

          {/* Category filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`btn ${category === cat.id ? 'btn-primary' : 'btn-ghost'} gap-1.5`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Algorithm grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((algo, idx) => (
                <motion.div
                  key={algo.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <AlgoCard algo={algo} onSelect={() => setSelected(algo)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-20" style={{ color: 'var(--text-muted)' }}>
              <p className="text-sm">More algorithms coming soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
