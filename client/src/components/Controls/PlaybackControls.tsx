import React from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, RotateCcw,
  Zap, ChevronLeft, ChevronRight, Share2, Save,
} from 'lucide-react';
import { useExecutionStore } from '../../store/useExecutionStore';

interface PlaybackControlsProps {
  onSave?: () => void;
  onShare?: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 2, 4, 8];

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ onSave, onShare }) => {
  const {
    trace, currentStep, isPlaying, isLoading, speed,
    execute, stepForward, stepBack, play, pause, reset, seekTo, setSpeed,
  } = useExecutionStore();

  const hasTrace = trace.length > 0;
  const atStart = currentStep === 0;
  const atEnd = currentStep === trace.length - 1;
  const progress = hasTrace ? (currentStep / (trace.length - 1)) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) pause();
    else {
      if (atEnd) seekTo(0);
      play();
    }
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-2 border-t"
         style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>

      {/* ─ Main controls row ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Run button */}
        <motion.button
          id="run-btn"
          className="btn btn-primary gap-2"
          onClick={execute}
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLoading ? (
            <>
              <motion.div
                className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              />
              Running...
            </>
          ) : (
            <>
              <Zap size={14} />
              Run
            </>
          )}
        </motion.button>

        <div className="w-px h-6 bg-white/10" />

        {/* Step back */}
        <button
          id="step-back-btn"
          className="btn-icon"
          onClick={stepBack}
          disabled={!hasTrace || atStart}
          title="Step Back"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Play / Pause */}
        <button
          id="play-pause-btn"
          className={`btn-icon ${isPlaying ? 'active' : ''}`}
          onClick={handlePlayPause}
          disabled={!hasTrace}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Step forward */}
        <button
          id="step-fwd-btn"
          className="btn-icon"
          onClick={stepForward}
          disabled={!hasTrace || atEnd}
          title="Step Forward"
        >
          <ChevronRight size={16} />
        </button>

        {/* Reset */}
        <button
          id="reset-btn"
          className="btn-icon"
          onClick={reset}
          disabled={!hasTrace}
          title="Reset to Start"
        >
          <RotateCcw size={14} />
        </button>

        <div className="flex-1" />

        {/* Speed */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Speed</span>
          <div className="flex gap-0.5">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`btn text-xs px-2 py-1 ${speed === s ? 'btn-primary' : 'btn-ghost'}`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Save */}
        {onSave && (
          <button id="save-btn" className="btn btn-ghost text-xs" onClick={onSave}>
            <Save size={13} /> Save
          </button>
        )}
        {/* Share */}
        {onShare && (
          <button id="share-btn" className="btn btn-ghost text-xs" onClick={onShare}>
            <Share2 size={13} /> Share
          </button>
        )}
      </div>

      {/* ─ Timeline scrubber ─────────────────────────────────────────────── */}
      {hasTrace && (
        <div className="flex items-center gap-3">
          <span className="mono text-xs" style={{ color: 'var(--text-muted)', minWidth: 28 }}>
            {currentStep + 1}
          </span>
          <div className="flex-1 relative">
            <input
              id="timeline-scrubber"
              type="range"
              min={0}
              max={trace.length - 1}
              value={currentStep}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="timeline-track"
            />
            {/* Progress fill overlay */}
            <div
              className="absolute top-0 left-0 h-1 rounded-l pointer-events-none"
              style={{
                width: `${progress}%`,
                background: 'var(--gradient-accent)',
                marginTop: '1.5px',
              }}
            />
          </div>
          <span className="mono text-xs" style={{ color: 'var(--text-muted)', minWidth: 28, textAlign: 'right' }}>
            {trace.length}
          </span>

          {/* Current event badge */}
          {trace[currentStep] && (
            <span className={`badge ${
              trace[currentStep].event === 'exception' ? 'badge-red' :
              trace[currentStep].event === 'return'    ? 'badge-green' :
              trace[currentStep].event === 'call'      ? 'badge-purple' :
              'badge-blue'
            }`}>
              {trace[currentStep].event}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
