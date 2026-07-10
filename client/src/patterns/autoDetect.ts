import type { TraceStep } from '../types';
import { PATTERN_PLUGINS } from './index';
import type { PatternPlugin } from './types';

export interface DetectionResult {
  plugin: PatternPlugin | null;
  confidence: number;
}

/**
 * Run relevance checks for all registered plugins on an execution trace
 * and return the best matching pattern.
 */
export function autoDetectPattern(trace: TraceStep[]): DetectionResult {
  if (!trace || trace.length === 0) {
    return { plugin: null, confidence: 0 };
  }

  let bestPlugin: PatternPlugin | null = null;
  let maxScore = 0;

  for (const plugin of PATTERN_PLUGINS) {
    try {
      const score = plugin.detectRelevance(trace);
      if (score > maxScore) {
        maxScore = score;
        bestPlugin = plugin;
      }
    } catch (err) {
      console.error(`Error checking pattern relevance for ${plugin.id}:`, err);
    }
  }

  // Only return if confidence threshold > 0.15
  if (maxScore > 0.15) {
    return { plugin: bestPlugin, confidence: Math.round(maxScore * 100) };
  }

  return { plugin: null, confidence: 0 };
}
