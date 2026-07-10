import { create } from 'zustand';
import { nanoid } from 'nanoid';
import axios from 'axios';
import type { Language, TraceStep, ExecutionResult } from '../types';

// ─── Language starter templates ─────────────────────────────────────────────

export const STARTER_TEMPLATES: Record<Language, Record<string, string>> = {
  javascript: {
    'Bubble Sort': `// Bubble Sort
let arr = [64, 34, 25, 12, 22, 11, 90];
for (let i = 0; i < arr.length - 1; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
  }
}
console.log(arr);`,
    'Binary Search': `// Binary Search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
const arr = [2, 3, 4, 10, 40];
console.log(binarySearch(arr, 10));`,
    Fibonacci: `// Fibonacci Recursion
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(7));`,
    'BFS Graph': `// Breadth-First Search
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const n of graph[node] || []) {
      if (!visited.has(n)) { visited.add(n); queue.push(n); }
    }
  }
  return order;
}
const graph = { 0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1], 5:[2] };
console.log(bfs(graph, 0));`,
    'Quick Sort': `// Quick Sort
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
console.log(quickSort([10, 7, 8, 9, 1, 5]));`,
  },
  python: {
    'Bubble Sort': `# Bubble Sort
arr = [64, 34, 25, 12, 22, 11, 90]
n = len(arr)
for i in range(n - 1):
    for j in range(n - i - 1):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
print(arr)`,
    Fibonacci: `# Fibonacci Recursion
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(7))`,
    'BST Insert': `# BST Insert & Traversal
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return Node(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder(root, result=[]):
    if root:
        inorder(root.left, result)
        result.append(root.val)
        inorder(root.right, result)
    return result

root = None
for v in [5, 3, 7, 1, 4, 6, 8]:
    root = insert(root, v)
print(inorder(root, []))`,
    'List Operations': `# List Operations
data = []
for i in range(1, 6):
    data.append(i * i)
    print(f"After append: {data}")

total = sum(data)
print(f"Sum: {total}")`,
  },
  java: {
    'Hello World': `// Java Hello World
public class Main {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        int sum = x + y;
        System.out.println("Sum: " + sum);
    }
}`,
  },
  cpp: {
    'Hello World': `// C++ Bubble Sort
#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
    for (int x : arr) cout << x << " ";
    return 0;
}`,
  },
  c: {
    'Hello World': `// C Bubble Sort
#include <stdio.h>
int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
            }
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
  },
};

// ─── Session ID ─────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  const key = 'codeviz_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = nanoid(16);
    localStorage.setItem(key, id);
  }
  return id;
}

// ─── Store shape ─────────────────────────────────────────────────────────────

interface ExecutionState {
  // Code
  code: string;
  language: Language;
  setCode: (code: string) => void;
  setLanguage: (lang: Language) => void;
  loadTemplate: (template: string) => void;

  // Trace
  trace: TraceStep[];
  currentStep: number;
  isLoading: boolean;
  execError: string | null;
  finalOutput: string;

  // Playback
  isPlaying: boolean;
  speed: number; // steps per second
  setSpeed: (s: number) => void;

  // Actions
  execute: () => Promise<void>;
  stepForward: () => void;
  stepBack: () => void;
  seekTo: (n: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;

  // Save/Share
  sessionId: string;
  saveSnippet: (title: string) => Promise<string | null>;
  loadSnippet: (slug: string) => Promise<boolean>;

  // Internal
  _playTimer: ReturnType<typeof setInterval> | null;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  // ── Code
  code: STARTER_TEMPLATES.javascript['Bubble Sort'],
  language: 'javascript',
  setCode: (code) => set({ code }),
  setLanguage: (language) => {
    const templates = STARTER_TEMPLATES[language];
    const firstKey = Object.keys(templates)[0];
    set({ language, code: templates[firstKey], trace: [], currentStep: 0, execError: null });
  },
  loadTemplate: (templateName) => {
    const { language } = get();
    const template = STARTER_TEMPLATES[language][templateName];
    if (template) set({ code: template, trace: [], currentStep: 0, execError: null });
  },

  // ── Trace state
  trace: [],
  currentStep: 0,
  isLoading: false,
  execError: null,
  finalOutput: '',

  // ── Playback state
  isPlaying: false,
  speed: 2,
  setSpeed: (speed) => set({ speed }),

  // ── Execute
  execute: async () => {
    const { code, language, _playTimer } = get();
    if (_playTimer) clearInterval(_playTimer);
    set({ isLoading: true, trace: [], currentStep: 0, isPlaying: false, execError: null, finalOutput: '' });

    try {
      const res = await axios.post<ExecutionResult>('/api/execute', { code, language });
      const { steps, finalOutput, error } = res.data;
      set({
        trace: steps,
        finalOutput: finalOutput || '',
        execError: error,
        isLoading: false,
        currentStep: 0,
      });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : 'Execution failed';
      set({ isLoading: false, execError: msg });
    }
  },

  // ── Playback controls
  stepForward: () => {
    const { currentStep, trace } = get();
    if (currentStep < trace.length - 1) set({ currentStep: currentStep + 1 });
  },
  stepBack: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  seekTo: (n) => {
    const { trace } = get();
    const idx = Math.max(0, Math.min(n, trace.length - 1));
    set({ currentStep: idx });
  },
  play: () => {
    const { _playTimer, speed } = get();
    if (_playTimer) clearInterval(_playTimer);
    const interval = Math.max(100, 1000 / speed);
    const timer = setInterval(() => {
      const { currentStep, trace, pause } = get();
      if (currentStep >= trace.length - 1) {
        pause();
        return;
      }
      set({ currentStep: currentStep + 1 });
    }, interval);
    set({ isPlaying: true, _playTimer: timer });
  },
  pause: () => {
    const { _playTimer } = get();
    if (_playTimer) clearInterval(_playTimer);
    set({ isPlaying: false, _playTimer: null });
  },
  reset: () => {
    const { _playTimer } = get();
    if (_playTimer) clearInterval(_playTimer);
    set({ currentStep: 0, isPlaying: false, _playTimer: null });
  },

  // ── Save / Share
  sessionId: getOrCreateSessionId(),
  saveSnippet: async (title) => {
    const { code, language, sessionId } = get();
    try {
      const res = await axios.post<{ slug: string }>('/api/snippets', {
        code, language, title, sessionId,
      });
      return res.data.slug;
    } catch {
      return null;
    }
  },
  loadSnippet: async (slug) => {
    try {
      const res = await axios.get<{ code: string; language: Language }>(`/api/snippets/${slug}`);
      const { code, language } = res.data;
      set({ code, language, trace: [], currentStep: 0 });
      return true;
    } catch {
      return false;
    }
  },

  // Internal
  _playTimer: null,
}));
