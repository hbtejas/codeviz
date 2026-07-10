import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

interface SharedNavbarProps {
  children?: React.ReactNode;
}

export const SharedNavbar: React.FC<SharedNavbarProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/sandbox', label: 'Sandbox' },
    { path: '/problems', label: 'Problems' },
    { path: '/dsa', label: 'DSA Library' },
    { path: '/compare', label: 'Algorithm Race' },
    { path: '/progress', label: 'Progress' },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b glass sticky top-0 z-50 shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-6">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-400">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path === '/problems' && currentPath.startsWith('/problem/'));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-150 ${
                  isActive ? 'text-blue-400 font-bold' : 'hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  );
};
