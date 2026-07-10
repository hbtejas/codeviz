import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HintLadderProps {
  patterns: string[];
  description: string;
}

export const HintLadder: React.FC<HintLadderProps> = ({ patterns, description: _description }) => {
  const [level, setLevel] = useState(0);

  const hints = [
    {
      title: 'Hint 1: Coding Pattern',
      content: `This problem matches the [${patterns.join(', ')}] algorithm pattern. You need variables that move across indices in a particular direction.`
    },
    {
      title: 'Hint 2: Approach & Strategy',
      content: 'Identify boundary conditions. Can you define left/right boundary index variables, or slide a window range, or use a caching table to store intermediate step results?'
    },
    {
      title: 'Hint 3: Algorithm Pseudocode',
      content: `Initialize pointers / variables.\nWhile condition is met:\n   Calculate change\n   If choice is optimal, record index\n   Increment/decrement pointers\nReturn final result`
    }
  ];

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <HelpCircle size={16} className="text-amber-400 animate-bounce" />
        <span>Stuck? Try Hint Ladder</span>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {hints.slice(0, level).map((hint, idx) => (
          <div key={idx} className="p-3 rounded text-xs border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
            <div className="font-bold text-slate-200 mb-1">{hint.title}</div>
            <div className="text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">{hint.content}</div>
          </div>
        ))}
      </div>

      {level < hints.length && (
        <button
          className="btn btn-ghost text-xs self-start gap-1 py-1 px-3 mt-1"
          onClick={() => setLevel(prev => prev + 1)}
        >
          Reveal Next Hint ({level + 1}/3)
        </button>
      )}
    </div>
  );
};
