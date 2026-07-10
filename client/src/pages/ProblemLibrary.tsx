import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ChevronRight, RefreshCw
} from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { SharedNavbar } from '../components/SharedNavbar';
interface Problem {
  problemId: string;
  title: string;
  leetcodeNumber: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patterns: string[];
  dataStructures: string[];
  description: string;
  topicSlug: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Patterns' },
  { id: 'sliding-window', label: '1. Sliding Window' },
  { id: 'two-pointers', label: '2. Two Pointers' },
  { id: 'fast-slow-pointers', label: '3. Fast/Slow Pointers' },
  { id: 'binary-search', label: '4. Binary Search' },
  { id: 'binary-search-on-answer', label: '5. Binary Search on Answer' },
  { id: 'hashing-frequency-maps', label: '6. Hashing / Maps' },
  { id: 'prefix-sum-running-sum', label: '7. Prefix Sum' },
  { id: 'difference-array-range-updates', label: '8. Difference Array' },
  { id: 'monotonic-stack', label: '9. Monotonic Stack' },
  { id: 'monotonic-queue-deque', label: '10. Monotonic Deque' },
  { id: 'heap-top-k', label: '11. Heap / Top K' },
  { id: 'intervals', label: '12. Intervals' },
  { id: 'greedy-scheduling-sorting', label: '13. Greedy / Sorting' },
  { id: 'linked-list-manipulation', label: '14. Linked List' },
  { id: 'tree-dfs', label: '15. Tree DFS' },
  { id: 'tree-bfs-level-order', label: '16. Tree BFS' },
  { id: 'bst-problems', label: '17. BST' },
  { id: 'backtracking-basics', label: '18. Backtracking Basics' },
  { id: 'backtracking-with-constraints', label: '19. Backtracking Constrained' },
  { id: 'graph-bfs-dfs', label: '20. Graph BFS / DFS' },
  { id: 'topological-sort-dag', label: '21. Topological Sort' },
  { id: 'union-find-dsu', label: '22. Union Find' },
  { id: 'shortest-path', label: '23. Shortest Path' },
  { id: 'mst-graph-greedy', label: '24. MST / Graph Greedy' },
  { id: 'trie', label: '25. Trie' },
  { id: 'bit-manipulation', label: '26. Bit Manipulation' },
  { id: '1d-dp-basics', label: '27. 1D DP Basics' },
  { id: 'knapsack-subset-dp', label: '28. Knapsack DP' },
  { id: 'grid-dp', label: '29. Grid DP' },
  { id: 'string-dp-sequence-dp', label: '30. String DP' }
];

export const ProblemLibrary: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { solvedProblems, streak } = useProgressStore();

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/problems');
        setProblems(response.data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.patterns.includes(activeCategory);
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SharedNavbar />

      {/* ─ Main Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Filters */}
        <div className="w-64 border-r p-4 flex flex-col gap-4 overflow-y-auto shrink-0" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Streak</div>
          <div className="panel p-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Daily Streak</span>
            <span className="text-sm font-bold text-amber-400">🔥 {streak} Days</span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Patterns</div>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Coding Practice Library</h1>
              <p className="text-xs text-slate-400 mt-1">Master LeetCode questions by learning reusable algorithmic patterns</p>
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded text-xs outline-none w-64 border focus:ring-1"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <RefreshCw size={14} className="animate-spin" />
              Loading problems...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredProblems.map((p, idx) => {
                  const isSolved = solvedProblems.includes(p.problemId);
                  const isEasy = p.difficulty === 'Easy';
                  const isMedium = p.difficulty === 'Medium';

                  return (
                    <motion.div
                      key={`${p.problemId}-${p.topicSlug}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >

                      <Link to={`/problem/${p.problemId}`} className="block h-full">
                        <div className="panel p-4 h-full flex flex-col justify-between hover:border-blue-500/30 transition-all cursor-pointer">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-bold text-slate-500">#{p.leetcodeNumber || '—'}</span>
                              <div className="flex gap-2">
                                <span className={`badge text-[9px] ${
                                  isEasy ? 'badge-green' : isMedium ? 'badge-amber' : 'badge-red'
                                }`}>
                                  {p.difficulty}
                                </span>
                                {isSolved && <CheckCircle2 size={13} className="text-emerald-400" />}
                              </div>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200">{p.title}</h3>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {p.patterns.map(pat => (
                                <span key={pat} className="badge badge-blue text-[9px]">
                                  {pat}
                                </span>
                              ))}
                            </div>
                            <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredProblems.length === 0 && (
            <div className="flex items-center justify-center py-20 text-xs text-slate-500">
              No matching problems found. Try searching something else.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
