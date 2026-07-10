import { create } from 'zustand';

interface ProgressState {
  solvedProblems: string[];
  viewedPatterns: string[];
  streak: number;
  lastSolvedDate: string | null;
  solveProblem: (problemId: string) => void;
  viewPattern: (patternId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => {
  // Load initial values from localStorage safely
  const loadInitial = () => {
    try {
      const solved = localStorage.getItem('codeviz_solved_problems');
      const patterns = localStorage.getItem('codeviz_viewed_patterns');
      const streakVal = localStorage.getItem('codeviz_streak');
      const dateVal = localStorage.getItem('codeviz_last_solved_date');

      return {
        solvedProblems: solved ? JSON.parse(solved) : [],
        viewedPatterns: patterns ? JSON.parse(patterns) : [],
        streak: streakVal ? parseInt(streakVal, 10) : 0,
        lastSolvedDate: dateVal || null,
      };
    } catch {
      return {
        solvedProblems: [],
        viewedPatterns: [],
        streak: 0,
        lastSolvedDate: null,
      };
    }
  };

  const initial = loadInitial();

  return {
    ...initial,

    solveProblem: (problemId) => {
      const { solvedProblems, streak, lastSolvedDate } = get();
      if (solvedProblems.includes(problemId)) return;

      const newSolved = [...solvedProblems, problemId];
      localStorage.setItem('codeviz_solved_problems', JSON.stringify(newSolved));

      // Calculate streak updates
      const today = new Date().toDateString();
      let newStreak = streak;

      if (lastSolvedDate !== today) {
        if (lastSolvedDate === new Date(Date.now() - 86400000).toDateString()) {
          newStreak = streak + 1; // consecutive day
        } else if (!lastSolvedDate) {
          newStreak = 1; // first solve ever
        } else {
          newStreak = 1; // reset broken streak
        }
        localStorage.setItem('codeviz_streak', String(newStreak));
        localStorage.setItem('codeviz_last_solved_date', today);
      }

      set({
        solvedProblems: newSolved,
        streak: newStreak,
        lastSolvedDate: today,
      });
    },

    viewPattern: (patternId) => {
      const { viewedPatterns } = get();
      if (viewedPatterns.includes(patternId)) return;

      const newPatterns = [...viewedPatterns, patternId];
      localStorage.setItem('codeviz_viewed_patterns', JSON.stringify(newPatterns));
      set({ viewedPatterns: newPatterns });
    },

    resetProgress: () => {
      localStorage.removeItem('codeviz_solved_problems');
      localStorage.removeItem('codeviz_viewed_patterns');
      localStorage.removeItem('codeviz_streak');
      localStorage.removeItem('codeviz_last_solved_date');
      set({
        solvedProblems: [],
        viewedPatterns: [],
        streak: 0,
        lastSolvedDate: null,
      });
    },
  };
});
