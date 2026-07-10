import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useExecutionStore } from '../store/useExecutionStore';
import { MainPage } from './MainPage';
import { Code2 } from 'lucide-react';

export const SharedSnippetPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { loadSnippet } = useExecutionStore();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const ok = await loadSnippet(slug);
      setError(!ok);
      setLoading(false);
    })();
  }, [slug, loadSnippet]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse"
               style={{ background: 'var(--gradient-accent)' }}>
            <Code2 size={20} color="white" />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm" style={{ color: 'var(--accent-red)' }}>Snippet not found or has expired.</p>
          <Link to="/" className="btn btn-primary">Go to Editor</Link>
        </div>
      </div>
    );
  }

  // Snippet loaded into store — render the main page
  return <MainPage />;
};
