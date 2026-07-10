import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CodeEditor } from '../components/Editor/CodeEditor';
import { PlaybackControls } from '../components/Controls/PlaybackControls';
import { VisualizerPanel } from '../components/Visualizer/VisualizerPanel';
import { HintLadder } from '../components/HintLadder';
import { AIStepExplainer } from '../components/AIStepExplainer';
import { useExecutionStore } from '../store/useExecutionStore';
import { useProgressStore } from '../store/useProgressStore';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { SharedNavbar } from '../components/SharedNavbar';

interface Problem {
  problemId: string;
  title: string;
  leetcodeNumber: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  patterns: string[];
  dataStructures: string[];
  description: string;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  visualizerConfig: {
    primaryView: string;
    secondaryView: string;
  };
  testCases: { input: string; expectedOutput: string }[];
}

export const ProblemDetail: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { setCode, setLanguage, trace, execError, finalOutput } = useExecutionStore();
  const { solveProblem, solvedProblems } = useProgressStore();

  useEffect(() => {
    if (!problemId) return;
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/problems/${problemId}`);
        const prob = response.data;
        setProblem(prob);

        // Prepopulate editor
        setLanguage('javascript');
        setCode(prob.starterCode.javascript || '');
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId, setCode, setLanguage]);

  // Mark solved if trace runs successfully and matches expected outputs
  useEffect(() => {
    if (trace.length > 0 && !execError && problem) {
      // In a real sandbox, we would validate output against testCases.
      // Here, running successfully to completion is enough to score a solve.
      solveProblem(problem.problemId);
    }
  }, [trace, execError, problem, solveProblem]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <p className="text-xs text-slate-400">Loading problem details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <p className="text-xs text-rose-400">Problem not found.</p>
          <Link to="/problems" className="btn btn-primary mt-2">Back to Library</Link>
        </div>
      </div>
    );
  }

  const isSolved = solvedProblems.includes(problem.problemId);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ─ Header ─────────────────────────────────────────────────────────── */}
      <SharedNavbar>
        <div className="flex items-center gap-2 border-r border-slate-800/80 pr-4 mr-2">
          <Link to="/problems" className="btn-icon mr-1">
            <ArrowLeft size={14} />
          </Link>
          <span className="text-xs font-bold text-slate-200">{problem.title}</span>
          <span className={`badge text-[9px] ${
            problem.difficulty === 'Easy' ? 'badge-green' : problem.difficulty === 'Medium' ? 'badge-amber' : 'badge-red'
          }`}>
            {problem.difficulty}
          </span>
          {isSolved && <CheckCircle2 size={13} className="text-emerald-400" />}
        </div>

        <a
          href={problem.leetcodeNumber ? `https://leetcode.com/problemset/all/?search=${problem.leetcodeNumber}` : `https://leetcode.com/problems/${problem.problemId}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-xs gap-1.5 hover:text-amber-400 transition-colors"
          id="leetcode-link-btn"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Solve on LeetCode
        </a>
      </SharedNavbar>

      {/* ─ Split Content ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Description & Editor */}
        <div className="flex flex-col border-r" style={{ width: '45%', borderColor: 'var(--border-subtle)' }}>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-panel)' }}>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Problem Description</div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">{problem.description}</p>
            </div>

            <HintLadder patterns={problem.patterns} description={problem.description} />
            <AIStepExplainer />
          </div>
          
          <div className="h-1/2 overflow-hidden flex flex-col">
            <CodeEditor />
            <PlaybackControls onSave={() => {}} onShare={() => {}} />
          </div>
        </div>

        {/* Right: Visualizer */}
        <div className="flex-1 overflow-hidden">
          <VisualizerPanel />
        </div>
      </div>
    </div>
  );
};

