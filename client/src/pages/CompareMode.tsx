import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, RotateCcw, Award, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SharedNavbar } from '../components/SharedNavbar';

const EXPERIMENTS = [
  {
    name: 'Sorting Comparison',
    leftTitle: 'Bubble Sort (O(n²))',
    rightTitle: 'Quick Sort (O(n log n))',
    leftCode: `let arr = [64, 34, 25, 12, 22];
for (let i = 0; i < arr.length - 1; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      let t = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = t;
    }
  }
}
console.log(arr);`,
    rightCode: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let pivot = arr[arr.length - 1];
  let left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
console.log(quickSort([64, 34, 25, 12, 22]));`
  },
  {
    name: 'Fibonacci Optimization',
    leftTitle: 'Recursive Fib (O(2ⁿ))',
    rightTitle: 'DP Fib Table (O(n))',
    leftCode: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(6));`,
    rightCode: `function fibDP(n) {
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
console.log(fibDP(6));`
  }
];

export const CompareMode: React.FC = () => {
  const [activeExp, setActiveExp] = useState(EXPERIMENTS[0]);
  const [loading, setLoading] = useState(false);
  const [leftSteps, setLeftSteps] = useState<number>(0);
  const [rightSteps, setRightSteps] = useState<number>(0);

  const runComparison = async () => {
    setLoading(true);
    try {
      const [resLeft, resRight] = await Promise.all([
        axios.post('/api/execute', { code: activeExp.leftCode, language: 'javascript' }),
        axios.post('/api/execute', { code: activeExp.rightCode, language: 'javascript' })
      ]);
      setLeftSteps(resLeft.data.totalSteps);
      setRightSteps(resRight.data.totalSteps);
    } catch (err) {
      console.error('Error running comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setLeftSteps(0);
    setRightSteps(0);
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      <SharedNavbar>
        <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 mr-2">
          <Link to="/problems" className="btn-icon mr-1">
            <ArrowLeft size={14} />
          </Link>
          <span className="text-xs font-bold text-slate-200">Performance Race</span>
        </div>

        <div className="flex gap-2">
          {EXPERIMENTS.map((exp, idx) => (
            <button
              key={idx}
              className={`btn text-xs px-2.5 py-1 ${activeExp.name === exp.name ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { setActiveExp(exp); resetComparison(); }}
            >
              {exp.name}
            </button>
          ))}
        </div>
      </SharedNavbar>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Left Side */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="panel p-4 flex flex-col gap-2 flex-1 overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{activeExp.leftTitle}</h3>
            <pre className="flex-1 bg-slate-950/40 p-4 border rounded font-mono text-[11px] overflow-auto text-slate-400">
              {activeExp.leftCode}
            </pre>
            <div className="text-xs font-bold flex items-center justify-between py-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-slate-400">Total Steps:</span>
              <span className={leftSteps > 0 ? "text-rose-400" : "text-slate-500"}>{leftSteps || 'Not run'}</span>
            </div>
          </div>
        </div>

        {/* Action Column Center */}
        <div className="flex flex-col items-center justify-center gap-4 shrink-0">
          <button className="btn btn-primary p-4 rounded-full" onClick={runComparison} disabled={loading}>
            <Play size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn btn-ghost p-3 rounded-full" onClick={resetComparison}>
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="panel p-4 flex flex-col gap-2 flex-1 overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{activeExp.rightTitle}</h3>
            <pre className="flex-1 bg-slate-950/40 p-4 border rounded font-mono text-[11px] overflow-auto text-slate-400">
              {activeExp.rightCode}
            </pre>
            <div className="text-xs font-bold flex items-center justify-between py-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-slate-400">Total Steps:</span>
              <span className={rightSteps > 0 ? "text-emerald-400" : "text-slate-500"}>{rightSteps || 'Not run'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison results */}
      {leftSteps > 0 && rightSteps > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t flex flex-col items-center justify-center gap-2"
          style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Award size={18} className="text-amber-400 animate-pulse" />
            <span>Optimal choice is {Math.round((leftSteps / rightSteps) * 100) / 100}x faster!</span>
          </div>
          <p className="text-xs text-slate-400">
            The optimal strategy significantly reduces operation loops and recursive calls.
          </p>
        </motion.div>
      )}
    </div>
  );
};
