// Import all algorithms first
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';

// Re-export types individually to avoid conflicts
export type { SortingStep, ArrayElement } from './bubbleSort/types';

// Export all algorithms
export { bubbleSort } from './bubbleSort';
export { quickSort } from './quickSort';
export { mergeSort } from './mergeSort';
export * from './utils';

// Algorithm registry
export const algorithms = {
  bubbleSort: {
    name: 'Bubble Sort',
    function: bubbleSort,
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    stable: true
  },
  quickSort: {
    name: 'Quick Sort',
    function: quickSort,
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    stable: false
  },
  mergeSort: {
    name: 'Merge Sort',
    function: mergeSort,
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    stable: true
  }
};

// Helper function to generate arrays
export { generateRandomArray } from './utils';