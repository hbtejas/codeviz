const Problem = require('../models/Problem');

// Maps specific LeetCode numbers to their titles, descriptions, and clean starter codes.
const MANUAL_MAPPING = {
  1: {
    title: 'Two Sum',
    description: 'Find two indices in an array that add up to a specific target value using a Hash Map.',
    javascript: `function twoSum(nums, target) {
  let map = {};
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map[complement] !== undefined) return [map[complement], i];
    map[nums[i]] = i;
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9));`
  },
  3: {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Find the length of the longest substring without repeating characters using a sliding window.',
    javascript: `function lengthOfLongestSubstring(s) {
  let map = {};
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    let char = s[right];
    if (map[char] !== undefined && map[char] >= left) left = map[char] + 1;
    map[char] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
console.log(lengthOfLongestSubstring("abcabcbb"));`
  },
  11: {
    title: 'Container With Most Water',
    description: 'Find two lines that forms a container holding the maximum area of water.',
    javascript: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxArea = 0;
  while (left < right) {
    let area = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`
  },
  21: {
    title: 'Merge Two Sorted Lists',
    description: 'Merge two sorted lists into one sorted list by traversing node pointers.',
    javascript: `function mergeSortedArrays(l1, l2) {
  let merged = [];
  let i = 0, j = 0;
  while (i < l1.length && j < l2.length) {
    if (l1[i] < l2[j]) merged.push(l1[i++]);
    else merged.push(l2[j++]);
  }
  return [...merged, ...l1.slice(i), ...l2.slice(j)];
}
console.log(mergeSortedArrays([1, 2, 4], [1, 3, 4]));`
  },
  45: {
    title: 'Jump Game II',
    description: 'Find the minimum number of jumps to reach the last index of the array.',
    javascript: `function jump(nums) {
  let jumps = 0, currentEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
    }
  }
  return jumps;
}
console.log(jump([2, 3, 1, 1, 4]));`
  },
  56: {
    title: 'Merge Intervals',
    description: 'Merge overlapping interval ranges together into non-overlapping segments.',
    javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  let merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    let last = merged[merged.length - 1];
    let curr = intervals[i];
    if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);
    else merged.push(curr);
  }
  return merged;
}
console.log(JSON.stringify(merge([[1, 3], [2, 6], [8, 10]])));`
  },
  62: {
    title: 'Unique Paths',
    description: 'Find total unique paths on an M x N grid starting from top-left to bottom-right.',
    javascript: `function uniquePaths(m, n) {
  let dp = Array.from({length: m}, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
console.log(uniquePaths(3, 3));`
  },
  70: {
    title: 'Climbing Stairs',
    description: 'Calculate distinct ways to reach N steps climbing 1 or 2 steps each time.',
    javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
console.log(climbStairs(5));`
  },
  78: {
    title: 'Subsets',
    description: 'Generate the complete power set of all subsets of unique integers.',
    javascript: `function subsets(nums) {
  let result = [];
  let path = [];
  function backtrack(idx) {
    result.push([...path]);
    for (let i = idx; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return result;
}
console.log(JSON.stringify(subsets([1, 2])));`
  },
  98: {
    title: 'Validate Binary Search Tree',
    description: 'Validate if a binary tree structure matches BST range attributes.',
    javascript: `function isValidBST(arr, idx = 0, min = -Infinity, max = Infinity) {
  if (idx >= arr.length || arr[idx] === null) return true;
  let val = arr[idx];
  if (val <= min || val >= max) return false;
  return isValidBST(arr, 2 * idx + 1, min, val) && isValidBST(arr, 2 * idx + 2, val, max);
}
console.log(isValidBST([2, 1, 3]));`
  },
  102: {
    title: 'Binary Tree Level Order Traversal',
    description: 'Traverse binary tree nodes level by level using a BFS Queue.',
    javascript: `function levelOrder(arr) {
  let result = [];
  let queue = [{ idx: 0, lvl: 0 }];
  while (queue.length > 0) {
    let { idx, lvl } = queue.shift();
    if (idx >= arr.length || arr[idx] === null) continue;
    if (!result[lvl]) result[lvl] = [];
    result[lvl].push(arr[idx]);
    queue.push({ idx: 2 * idx + 1, lvl: lvl + 1 });
    queue.push({ idx: 2 * idx + 2, lvl: lvl + 1 });
  }
  return result;
}
console.log(JSON.stringify(levelOrder([3, 9, 20, null, null, 15, 7])));`
  },
  104: {
    title: 'Maximum Depth of Binary Tree',
    description: 'Determine the height / maximum depth of a binary tree recursively.',
    javascript: `function maxDepth(arr, index = 0) {
  if (index >= arr.length || arr[index] === null) return 0;
  let left = maxDepth(arr, 2 * index + 1);
  let right = maxDepth(arr, 2 * index + 2);
  return Math.max(left, right) + 1;
}
console.log(maxDepth([3, 9, 20, null, null, 15, 7]));`
  },
  136: {
    title: 'Single Number',
    description: 'Identify the unique non-duplicate number using XOR bit operations.',
    javascript: `function singleNumber(nums) {
  let ans = 0;
  for (let n of nums) ans ^= n;
  return ans;
}
console.log(singleNumber([4, 1, 2, 1, 2]));`
  },
  141: {
    title: 'Linked List Cycle Detection',
    description: 'Detect pointer cycles inside a sequence using Slow and Fast pointers.',
    javascript: `function hasCycle(arr) {
  let slow = 0, fast = 0;
  while (fast < arr.length && fast + 1 < arr.length) {
    slow += 1;
    fast += 2;
    if (arr[slow] === arr[fast]) return true;
  }
  return false;
}
console.log(hasCycle([3, 2, 0, -4, 2]));`
  },
  200: {
    title: 'Number of Islands',
    description: 'Count land components inside grid using recursive depth-first traverse.',
    javascript: `function numIslands(grid) {
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') { count++; dfs(i, j); }
    }
  }
  return count;
}
console.log(numIslands([["1","1","0"],["1","1","0"],["0","0","0"]]));`
  },
  704: {
    title: 'Binary Search',
    description: 'Determine the index position of target inside a sorted array in O(log n).',
    javascript: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
console.log(search([-1, 0, 3, 5, 9, 12], 9));`
  }
};

// Complete list of LeetCode numbers mapped to pattern category IDs
const CATEGORIES_MAPPING = {
  'sliding-window': [3, 76, 209, 424, 567, 904],
  'two-pointers': [11, 15, 16, 18, 42, 167],
  'fast-slow-pointers': [141, 142, 19, 876, 160, 234],
  'binary-search': [33, 34, 35, 153, 162, 704],
  'binary-search-on-answer': [875, 1011, 410, 774, 1283, 1482],
  'hashing-frequency-maps': [1, 49, 128, 217, 242, 347],
  'prefix-sum-running-sum': [303, 560, 724, 930, 974, 523],
  'difference-array-range-updates': [370, 1094, 1109, 1893, 1943, 2381],
  'monotonic-stack': [739, 496, 503, 84, 85, 901],
  'monotonic-queue-deque': [239, 862, 1425, 1438, 1499, 1696],
  'heap-top-k': [215, 347, 692, 703, 973, 1046],
  'intervals': [56, 57, 252, 253, 435, 452],
  'greedy-scheduling-sorting': [45, 55, 406, 621, 763, 134],
  'linked-list-manipulation': [21, 23, 24, 25, 92, 138],
  'tree-dfs': [104, 112, 113, 543, 124, 226],
  'tree-bfs-level-order': [102, 103, 199, 515, 637, 116],
  'bst-problems': [98, 99, 230, 235, 450, 700],
  'backtracking-basics': [46, 47, 77, 78, 90, 39],
  'backtracking-with-constraints': [40, 17, 79, 131, 51, 52],
  'graph-bfs-dfs': [200, 695, 733, 994, 1091, 1254],
  'topological-sort-dag': [207, 210, 802, 1462, 1203, 2115],
  'union-find-dsu': [547, 684, 1319, 1579, 990, 1202],
  'shortest-path': [743, 787, 1514, 1631, 1334, 1976],
  'mst-graph-greedy': [1584, 1135, 1168, 1489, 778, 1102],
  'trie': [208, 211, 212, 648, 677, 1268],
  'bit-manipulation': [136, 137, 191, 338, 268, 190],
  '1d-dp-basics': [70, 198, 213, 322, 279, 300],
  'knapsack-subset-dp': [416, 494, 518, 474, 1049, 879],
  'grid-dp': [62, 63, 64, 221, 931, 120],
  'string-dp-sequence-dp': [1143, 72, 115, 583, 97, 1312]
};

// Generates fallback code templates based on category signature to guarantee compile succeeds
function generateTemplateCode(num, patternId) {
  if (patternId.includes('dp') || patternId.includes('knapsack')) {
    return `// LeetCode #${num} (DP Dynamic Programming)\nlet dp = [0, 1, 1];\nfor (let i = 3; i <= 6; i++) {\n  dp[i] = dp[i-1] + dp[i-2];\n}\nconsole.log(dp);`;
  }
  if (patternId.includes('pointer') || patternId.includes('search')) {
    return `// LeetCode #${num} (Binary Search / Pointer Variant)\nlet arr = [1, 2, 4, 8, 16];\nlet left = 0, right = arr.length - 1;\nwhile (left <= right) {\n  let mid = Math.floor((left + right) / 2);\n  if (arr[mid] === 8) break;\n  if (arr[mid] < 8) left = mid + 1;\n  else right = mid - 1;\n}\nconsole.log(left);`;
  }
  if (patternId.includes('window')) {
    return `// LeetCode #${num} (Sliding Window)\nlet arr = [1, 3, -1, -3, 5, 3];\nlet left = 0, right = 0;\nwhile (right < arr.length) {\n  right++;\n  if (right - left > 2) left++;\n}\nconsole.log(left);`;
  }
  // General baseline fallback
  return `// LeetCode #${num} (${patternId.toUpperCase()})\nlet data = [5, 2, 8, 1, 9];\nfor (let i = 0; i < data.length; i++) {\n  data[i] = data[i] * 2;\n}\nconsole.log(data);`;
}

// Generate the complete set of 180 problems
function buildAllSeedData() {
  const problems = [];
  const entries = Object.entries(CATEGORIES_MAPPING);

  for (const [patternId, list] of entries) {
    const patternLabel = patternId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    for (const num of list) {
      const manual = MANUAL_MAPPING[num];
      const title = manual ? manual.title : `LeetCode #${num}: ${patternLabel} Variant`;
      const description = manual ? manual.description : `An algorithmic challenge (LeetCode #${num}) matching the ${patternLabel} strategy pattern. Run the code template to visualize step execution.`;
      const javascript = manual ? manual.javascript : generateTemplateCode(num, patternId);
      const python = `def solve(data):\n    # Python translation\n    return data\nprint(solve([1,2,3]))`;

      problems.push({
        problemId: `lc-${num}`,
        title,
        leetcodeNumber: num,
        difficulty: num % 3 === 0 ? 'Hard' : num % 2 === 0 ? 'Medium' : 'Easy',
        patterns: [patternId],
        dataStructures: ['array'],
        description,
        starterCode: {
          javascript,
          python,
          java: `// Starter template Java\npublic class Main {\n    public static void main(String[] args) {}\n}`,
          cpp: `// Starter template C++\n#include <iostream>\nint main() { return 0; }`
        },
        visualizerConfig: {
          primaryView: 'ArrayView',
          secondaryView: 'VariablePanel',
          annotations: [patternId]
        },
        testCases: [{ input: '[]', expectedOutput: '[]' }],
        topicSlug: patternId
      });
    }
  }
  return problems;
}

const ALL_SEED_PROBLEMS = buildAllSeedData();

async function seedProblems() {
  try {
    // Clear and completely repopulate collection with all 180 problems
    await Problem.deleteMany({});
    await Problem.insertMany(ALL_SEED_PROBLEMS);
    console.log(`[Seeding] Successfully seeded ${ALL_SEED_PROBLEMS.length} LeetCode-style category challenges.`);
  } catch (error) {
    console.error('[Seeding] Error seeding problems:', error.message);
  }
}

module.exports = { ALL_SEED_PROBLEMS, seedProblems };
