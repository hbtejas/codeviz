import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';
import { useExecutionStore } from '../store/useExecutionStore';

export const AIStepExplainer: React.FC = () => {
  const { code, trace, currentStep } = useExecutionStore();
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const step = trace[currentStep];

  useEffect(() => {
    if (!step) return;

    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/api/explain', {
          code,
          line: step.line,
          variables: step.variables,
          event: step.event,
          stepIndex: currentStep,
          totalSteps: trace.length,
        });
        setExplanation(response.data.explanation);
      } catch {
        setExplanation('Failed to generate step explanation.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce a bit to avoid hammering API while scrubbing timeline fast
    const timer = setTimeout(fetchExplanation, 400);
    return () => clearTimeout(timer);
  }, [currentStep, step, code, trace.length]);

  if (!step) return null;

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border relative overflow-hidden"
         style={{
           background: 'rgba(124, 58, 237, 0.03)',
           borderColor: 'rgba(124, 58, 237, 0.2)',
           boxShadow: '0 4px 20px rgba(124, 58, 237, 0.03)'
         }}>
      {/* Sparkle Glow Top Border decoration */}
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-purple), transparent)' }} />
      
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--accent-purple)' }}>
        <Sparkles size={14} className="animate-pulse" />
        <span>AI Step Explainer</span>
      </div>

      <div className="text-xs min-h-[32px] mt-1 leading-relaxed text-slate-300">
        {loading ? (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={12} className="animate-spin" />
            <span>Analyzing variable state changes...</span>
          </div>
        ) : (
          explanation || 'No trace step loaded.'
        )}
      </div>
    </div>
  );
};
