const express = require('express');
const router = express.Router();

const DSA_EXAMPLES = [
  // ── Sorting ──────────────────────────────────────────────────────────────────
  {
    id: 'bubble-sort',
    category: 'sorting',
    title: 'Bubble Sort',
    description: 'Compare adjacent elements and swap if out of order. Repeat until sorted.',
    language: 'javascript',
    code: `// Bubble Sort
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
    complexity: { time: 'O(n²)', space: 'O(1)' },
  },
  {
    id: 'selection-sort',
    category: 'sorting',
    title: 'Selection Sort',
    description: 'Find minimum element and place it at beginning. Repeat for remaining.',
    language: 'javascript',
    code: `// Selection Sort
let arr = [64, 25, 12, 22, 11];
for (let i = 0; i < arr.length - 1; i++) {
  let minIdx = i;
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[j] < arr[minIdx]) minIdx = j;
  }
  if (minIdx !== i) {
    let temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
}
console.log(arr);`,
    complexity: { time: 'O(n²)', space: 'O(1)' },
  },
  {
    id: 'insertion-sort',
    category: 'sorting',
    title: 'Insertion Sort',
    description: 'Build sorted array one item at a time by inserting each into correct position.',
    language: 'javascript',
    code: `// Insertion Sort
let arr = [12, 11, 13, 5, 6];
for (let i = 1; i < arr.length; i++) {
  let key = arr[i];
  let j = i - 1;
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j];
    j--;
  }
  arr[j + 1] = key;
}
console.log(arr);`,
    complexity: { time: 'O(n²)', space: 'O(1)' },
  },
  {
    id: 'merge-sort',
    category: 'sorting',
    title: 'Merge Sort',
    description: 'Divide array in half, recursively sort each half, then merge.',
    language: 'javascript',
    code: `// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}
let arr = [38, 27, 43, 3, 9, 82, 10];
console.log(mergeSort(arr));`,
    complexity: { time: 'O(n log n)', space: 'O(n)' },
  },
  {
    id: 'quick-sort',
    category: 'sorting',
    title: 'Quick Sort',
    description: 'Pick a pivot, partition array around it, recursively sort partitions.',
    language: 'javascript',
    code: `// Quick Sort
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
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
let arr = [10, 7, 8, 9, 1, 5];
console.log(quickSort(arr));`,
    complexity: { time: 'O(n log n) avg', space: 'O(log n)' },
  },
  // ── Searching ────────────────────────────────────────────────────────────────
  {
    id: 'binary-search',
    category: 'searching',
    title: 'Binary Search',
    description: 'Repeatedly halve the search space on a sorted array.',
    language: 'javascript',
    code: `// Binary Search
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
const target = 10;
console.log(binarySearch(arr, target));`,
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
  {
    id: 'linear-search',
    category: 'searching',
    title: 'Linear Search',
    description: 'Scan each element one by one until target is found.',
    language: 'javascript',
    code: `// Linear Search
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
const arr = [2, 3, 4, 10, 40, 7, 1];
const target = 10;
console.log(linearSearch(arr, target));`,
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
  // ── Recursion / DP ────────────────────────────────────────────────────────────
  {
    id: 'fibonacci',
    category: 'recursion',
    title: 'Fibonacci (Recursive)',
    description: 'Classic recursive Fibonacci — builds a call tree.',
    language: 'javascript',
    code: `// Fibonacci Recursion
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(7));`,
    complexity: { time: 'O(2^n)', space: 'O(n)' },
  },
  {
    id: 'factorial',
    category: 'recursion',
    title: 'Factorial (Recursive)',
    description: 'Recursive factorial shows a clean linear call stack.',
    language: 'javascript',
    code: `// Factorial Recursion
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(6));`,
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
  // ── Graph algorithms ─────────────────────────────────────────────────────────
  {
    id: 'bfs',
    category: 'graph',
    title: 'BFS — Breadth-First Search',
    description: 'Level-by-level traversal using a queue.',
    language: 'javascript',
    code: `// BFS
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const order = [];
  visited.add(start);
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
const graph = { 0: [1,2], 1: [0,3,4], 2: [0,5], 3:[1], 4:[1], 5:[2] };
console.log(bfs(graph, 0));`,
    complexity: { time: 'O(V + E)', space: 'O(V)' },
  },
  {
    id: 'dfs',
    category: 'graph',
    title: 'DFS — Depth-First Search',
    description: 'Explore as deep as possible before backtracking.',
    language: 'javascript',
    code: `// DFS
function dfs(graph, start, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, order);
    }
  }
  return order;
}
const graph = { 0: [1,2], 1: [0,3,4], 2: [0,5], 3:[1], 4:[1], 5:[2] };
console.log(dfs(graph, 0));`,
    complexity: { time: 'O(V + E)', space: 'O(V)' },
  },
  // ── Python examples ──────────────────────────────────────────────────────────
  {
    id: 'py-bubble-sort',
    category: 'sorting',
    title: 'Bubble Sort (Python)',
    description: 'Bubble sort in Python — great for visualizing swaps.',
    language: 'python',
    code: `# Bubble Sort
arr = [64, 34, 25, 12, 22, 11, 90]
n = len(arr)
for i in range(n - 1):
    for j in range(n - i - 1):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
print(arr)`,
    complexity: { time: 'O(n²)', space: 'O(1)' },
  },
  {
    id: 'py-fibonacci',
    category: 'recursion',
    title: 'Fibonacci (Python)',
    description: 'Recursive Fibonacci in Python.',
    language: 'python',
    code: `# Fibonacci
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(7))`,
    complexity: { time: 'O(2^n)', space: 'O(n)' },
  },
  {
    id: 'py-bst-insert',
    category: 'data-structures',
    title: 'BST Insert (Python)',
    description: 'Binary search tree insertion and in-order traversal.',
    language: 'python',
    code: `# BST Insert & Traversal
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
    complexity: { time: 'O(h)', space: 'O(h)' },
  },
];

router.get('/', (req, res) => {
  const { category } = req.query;
  let examples = DSA_EXAMPLES;
  if (category) {
    examples = examples.filter((e) => e.category === category);
  }
  res.json({ examples, total: examples.length });
});

router.get('/:id', (req, res) => {
  const example = DSA_EXAMPLES.find((e) => e.id === req.params.id);
  if (!example) return res.status(404).json({ error: 'Example not found.' });
  res.json(example);
});

module.exports = router;
