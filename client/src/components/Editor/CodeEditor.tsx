import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { useExecutionStore, STARTER_TEMPLATES } from '../../store/useExecutionStore';
import type { Language } from '../../types';
import { ChevronDown } from 'lucide-react';

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
};

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
};

export const CodeEditor: React.FC = () => {
  const { code, language, setCode, setLanguage, loadTemplate, trace, currentStep } =
    useExecutionStore();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const decorationsRef = useRef<Monaco.editor.IEditorDecorationsCollection | null>(null);
  const [showTemplates, setShowTemplates] = React.useState(false);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define a premium dark theme
    monaco.editor.defineTheme('codeviz-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '4a5568', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'a78bfa' },
        { token: 'string', foreground: '4ade80' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '60a5fa' },
        { token: 'function', foreground: '22d3ee' },
      ],
      colors: {
        'editor.background': '#0f1426',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1a2035',
        'editor.selectionBackground': '#2d3748',
        'editorLineNumber.foreground': '#2d3748',
        'editorLineNumber.activeForeground': '#60a5fa',
        'editor.inactiveSelectionBackground': '#1e2535',
        'editorGutter.background': '#0f1426',
        'scrollbarSlider.background': '#1e293b80',
        'scrollbarSlider.hoverBackground': '#2d3748',
      },
    });
    monaco.editor.setTheme('codeviz-dark');
  };

  // Highlight current executing line
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco || trace.length === 0) return;

    const step = trace[currentStep];
    if (!step || step.line < 1) return;

    if (decorationsRef.current) {
      decorationsRef.current.clear();
    }

    decorationsRef.current = editor.createDecorationsCollection([
      {
        range: new monaco.Range(step.line, 1, step.line, 1),
        options: {
          isWholeLine: true,
          className: 'bg-blue-500/20 border-l-2 border-blue-400',
          glyphMarginClassName: 'bg-blue-500',
        },

      },
    ]);

    // Scroll to line
    editor.revealLineInCenterIfOutsideViewport(step.line, monaco.editor.ScrollType.Smooth);
  }, [currentStep, trace]);

  const templates = STARTER_TEMPLATES[language];
  const templateNames = Object.keys(templates);

  return (
    <div className="flex flex-col h-full">
      {/* ─ Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b"
           style={{ borderColor: 'var(--border-subtle)' }}>
        {/* Language selector */}
        <div className="flex gap-1">
          {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`btn text-xs px-3 py-1.5 ${
                language === lang ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Template picker */}
        <div className="relative">
          <button
            id="template-picker-btn"
            className="btn btn-ghost text-xs"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            Templates <ChevronDown size={12} />
          </button>
          {showTemplates && (
            <div
              className="absolute right-0 top-full mt-1 z-50 panel py-1 min-w-[160px]"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            >
              {templateNames.map((name) => (
                <button
                  key={name}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => { loadTemplate(name); setShowTemplates(false); }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─ Monaco Editor ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language]}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            glyphMargin: true,
            folding: true,
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>
    </div>
  );
};
