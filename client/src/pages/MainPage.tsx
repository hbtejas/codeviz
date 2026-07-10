import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeEditor } from '../components/Editor/CodeEditor';
import { PlaybackControls } from '../components/Controls/PlaybackControls';
import { VisualizerPanel } from '../components/Visualizer/VisualizerPanel';
import { useExecutionStore } from '../store/useExecutionStore';
import { Share2, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SharedNavbar } from '../components/SharedNavbar';

export const MainPage: React.FC = () => {
  const { saveSnippet } = useExecutionStore();
  const [saveModal, setSaveModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [title, setTitle] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const slug = await saveSnippet(title || 'Untitled Snippet');
    setSaving(false);
    if (slug) {
      const url = `${window.location.origin}/viz/${slug}`;
      setShareUrl(url);
      setSaveModal(false);
      setShareModal(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ─ Header ─────────────────────────────────────────────────────────── */}
      <SharedNavbar>
        <button
          className="btn btn-ghost text-xs gap-1.5"
          onClick={() => setSaveModal(true)}
          id="header-save-btn"
        >
          <Share2 size={13} />
          Save & Share
        </button>
      </SharedNavbar>

      {/* ─ Main split pane ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor + Controls */}
        <div className="flex flex-col border-r"
             style={{ width: '50%', borderColor: 'var(--border-subtle)' }}>
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
          <PlaybackControls
            onSave={() => setSaveModal(true)}
            onShare={() => setSaveModal(true)}
          />
        </div>

        {/* Right: Visualizer */}
        <div className="flex-1 overflow-hidden">
          <VisualizerPanel />
        </div>
      </div>

      {/* ─ Save modal ─────────────────────────────────────────────────────── */}
      {saveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="panel p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Save Snippet</h2>
              <button className="btn-icon" onClick={() => setSaveModal(false)}>
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Snippet title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm mb-4 outline-none focus:ring-1"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setSaveModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save & Get Link'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─ Share modal ────────────────────────────────────────────────────── */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="panel p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Snippet Saved! 🎉</h2>
              <button className="btn-icon" onClick={() => setShareModal(false)}>
                <X size={14} />
              </button>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              Share this link with anyone — no account needed:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 rounded-lg text-xs mono outline-none"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--accent-cyan)' }}
              />
              <button className="btn btn-primary text-xs" onClick={handleCopy}>
                {copied ? <><Check size={12} /> Copied!</> : <><Share2 size={12} /> Copy</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
