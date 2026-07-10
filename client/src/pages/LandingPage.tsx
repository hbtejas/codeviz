import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2, BookOpen, Layers, Sparkles, Terminal, Activity, Zap, Play, CheckCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen text-slate-100 overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* ─ Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500">
            <Code2 size={16} color="white" />
          </div>
          <span className="text-lg font-bold gradient-text">CodeViz</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
          <Link to="/problems" className="hover:text-blue-400 transition-colors">Problems Library</Link>
          <Link to="/dsa" className="hover:text-blue-400 transition-colors">DSA Library</Link>
          <Link to="/compare" className="hover:text-blue-400 transition-colors">Algorithm Race</Link>
        </div>
        <div className="flex gap-2">
          <Link to="/sandbox" className="btn btn-ghost text-xs">Sandbox</Link>
          <Link to="/problems" className="btn btn-primary text-xs px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 border-none">
            Get Started
          </Link>
        </div>
      </header>

      {/* ─ Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Glow Ambient Circles */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

        {/* Feature badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-xs text-blue-400 mb-6 font-medium"
        >
          <Sparkles size={12} className="animate-spin-slow" />
          <span>Interactive Execution Tracing Engine</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]"
        >
          Visualize Your Code <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Step-by-Step, Line-by-Line.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-slate-400 max-w-2xl mb-8 leading-relaxed"
        >
          Write JavaScript or Python and watch it execute. Witness variable mutations, call stacks, 
          recursion trees, and 1D/2D Dynamic Programming tables animate in real-time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link to="/problems" className="btn btn-primary px-6 py-2.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 border-none shadow-[0_0_20px_rgba(96,165,250,0.3)]">
            Explore 180 Problems
          </Link>
          <Link to="/sandbox" className="btn btn-ghost px-6 py-2.5 text-xs border border-slate-700 text-slate-300 hover:bg-slate-800">
            Open Code Sandbox
          </Link>
        </motion.div>
      </section>

      {/* ─ Feature Cards Section ──────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-900">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10 text-white">
          Visualizers Built For Computer Science
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="panel p-6 flex flex-col gap-3 border border-slate-800/80 bg-slate-900/10 hover:border-blue-500/20 transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400">
              <Layers size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Execution Timelines</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scrub forwards, backwards, or play code like a video. See call frame updates and scopes sync instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="panel p-6 flex flex-col gap-3 border border-slate-800/80 bg-slate-900/10 hover:border-indigo-500/20 transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-400">
              <Activity size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Dynamic DP Grids</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize 1D and 2D caching tables filling cell-by-cell with highlight animations to understand state transitions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="panel p-6 flex flex-col gap-3 border border-slate-800/80 bg-slate-900/10 hover:border-purple-500/20 transition-all">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400">
              <Terminal size={18} />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Recursion Trees</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              D3-powered node charts showing recursive backtracking pathways, tree pruning events, and call return nodes.
            </p>
          </div>
        </div>
      </section>

      {/* ─ Mappings Section ──────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-slate-900 text-center flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
          Covers 30 LeetCode Patterns
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mb-8 leading-relaxed">
          From Sliding Window and Monotonic Stack to Segment Trees and Grid DP. We seed 180 classic problems so you can master the patterns behind the questions.
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
          {[
            'Sliding Window', 'Two Pointers', 'Fast & Slow Pointers', 'Binary Search', 'Prefix Sum',
            'Monotonic Stack', 'Top K Heaps', 'Topological Sort', 'Union-Find DSU', 'Grid DP', 'Recursion Backtracking'
          ].map((tag) => (
            <span key={tag} className="badge badge-blue text-[10px] px-3 py-1 bg-slate-900/60 text-slate-300 border border-slate-800">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ─ Footer ─────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-6 px-6 border-t border-slate-900 glass text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} CodeViz. Powered by Node.js & React.
      </footer>
    </div>
  );
};
