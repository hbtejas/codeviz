import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { DSALibrary } from './pages/DSALibrary';
import { SharedSnippetPage } from './pages/SharedSnippetPage';
import { ProblemLibrary } from './pages/ProblemLibrary';
import { ProblemDetail } from './pages/ProblemDetail';
import { CompareMode } from './pages/CompareMode';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { HomePage } from './pages/HomePage';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sandbox" element={<MainPage />} />
        <Route path="/dsa" element={<DSALibrary />} />
        <Route path="/problems" element={<ProblemLibrary />} />
        <Route path="/problem/:problemId" element={<ProblemDetail />} />
        <Route path="/compare" element={<CompareMode />} />
        <Route path="/progress" element={<ProgressDashboard />} />
        <Route path="/viz/:slug" element={<SharedSnippetPage />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;

