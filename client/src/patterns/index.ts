import { twoPointersPlugin } from './twoPointers';
import { slidingWindowPlugin } from './slidingWindow';
import { binarySearchPlugin } from './binarySearch';
import { dpTablePlugin } from './dpTable';
import { backtrackingPlugin } from './backtracking';
import type { PatternPlugin } from './types';

export const PATTERN_PLUGINS: PatternPlugin[] = [
  twoPointersPlugin,
  slidingWindowPlugin,
  binarySearchPlugin,
  dpTablePlugin,
  backtrackingPlugin,
];

export * from './types';
export { twoPointersPlugin, slidingWindowPlugin, binarySearchPlugin, dpTablePlugin, backtrackingPlugin };
