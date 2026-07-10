import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Sparkles, Flame, CheckSquare, Trash2 } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { SharedNavbar } from '../components/SharedNavbar';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const ProgressDashboard: React.FC = () => {
  const { solvedProblems, viewedPatterns, streak, resetProgress } = useProgressStore();

  // Mock radar datasets based on solvedProblems list count per pattern category
  const twoPointerCount = solvedProblems.filter(p => p === 'two-sum' || p === 'valid-palindrome').length;
  const slidingWindowCount = solvedProblems.filter(p => p === 'max-subarray').length;
  const binarySearchCount = solvedProblems.filter(p => p === 'binary-search-prob').length;
  const dpCount = solvedProblems.filter(p => p === 'climbing-stairs' || p === 'max-subarray').length;
  const backtrackingCount = solvedProblems.filter(p => p === 'subsets').length;

  const data = {
    labels: ['Two Pointers', 'Sliding Window', 'Binary Search', 'DP Table', 'Backtracking'],
    datasets: [
      {
        label: 'My Mastery Level',
        data: [
          Math.min(10, twoPointerCount * 5),
          Math.min(10, slidingWindowCount * 8),
          Math.min(10, binarySearchCount * 8),
          Math.min(10, dpCount * 5),
          Math.min(10, backtrackingCount * 8)
        ],
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(56, 189, 248, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(56, 189, 248, 1)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 10, family: 'JetBrains Mono' } }
      }
    },
    scales: {
      r: {
        grid: { color: '#334155' },
        angleLines: { color: '#334155' },
        pointLabels: { color: '#94a3b8', font: { size: 10, family: 'Inter' } },
        ticks: { display: false }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <SharedNavbar>
        <div className="flex items-center gap-2 pr-4 mr-2">
          <Link to="/problems" className="btn-icon mr-1">
            <ArrowLeft size={14} />
          </Link>
          <span className="text-xs font-bold text-slate-200">Progress Tracker Dashboard</span>
        </div>
      </SharedNavbar>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* Streak & Solved Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="panel p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500">Solved Problems</span>
              <span className="text-2xl font-bold text-slate-100 mt-1">{solvedProblems.length} / 6</span>
            </div>
            <CheckSquare size={32} className="text-emerald-400 opacity-80" />
          </div>

          <div className="panel p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500">Daily Streak</span>
              <span className="text-2xl font-bold text-slate-100 mt-1">{streak} Days</span>
            </div>
            <Flame size={32} className="text-amber-400 opacity-80" />
          </div>

          <div className="panel p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500">Mastered Patterns</span>
              <span className="text-2xl font-bold text-slate-100 mt-1">{viewedPatterns.length} / 5</span>
            </div>
            <Award size={32} className="text-purple-400 opacity-80" />
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Radar Chart */}
          <div className="flex-1 panel p-6 flex flex-col items-center gap-2 min-h-[350px]">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 self-start">Mastery Radar Map</h3>
            <div className="w-full flex-1">
              <Radar data={data} options={options} />
            </div>
          </div>

          {/* Right: Solved Problems List */}
          <div className="w-full md:w-80 panel p-6 flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Completed Challenges</h3>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px]">
              {solvedProblems.map(p => (
                <div key={p} className="p-2 rounded text-xs border border-emerald-500/20 bg-emerald-500/5 text-slate-200 flex items-center justify-between">
                  <span>✓ {p.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
              ))}
              {solvedProblems.length === 0 && (
                <span className="text-xs text-slate-500">No completed problems yet. Start practicing!</span>
              )}
            </div>

            <button
              className="btn btn-ghost text-xs text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 py-1.5 mt-auto flex items-center justify-center gap-1.5"
              onClick={resetProgress}
            >
              <Trash2 size={13} />
              Reset My Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
