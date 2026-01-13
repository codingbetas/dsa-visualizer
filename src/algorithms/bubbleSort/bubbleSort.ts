import { SortingStep, ArrayElement } from './types';

export const bubbleSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  // Create a mutable copy with proper typing
  const arr: ArrayElement[] = array.map(value => ({ 
    value, 
    status: 'default' as const 
  }));
  let comparisons = 0;
  let swaps = 0;

  // Helper function to clone array
  const cloneArray = (arr: ArrayElement[]): ArrayElement[] => {
    return arr.map(item => ({ ...item }));
  };

  // Initial state
  steps.push({
    array: cloneArray(arr),
    description: 'Starting Bubble Sort',
    comparisons,
    swaps,
    highlightedIndices: []
  });

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Compare step
      arr[j].status = 'comparing';
      arr[j + 1].status = 'comparing';
      comparisons++;
      
      steps.push({
        array: cloneArray(arr),
        description: `Comparing elements at indices ${j} and ${j + 1}`,
        comparisons,
        swaps,
        highlightedIndices: [j, j + 1]
      });

      if (arr[j].value > arr[j + 1].value) {
        // Swap step
        arr[j].status = 'swapping';
        arr[j + 1].status = 'swapping';
        
        steps.push({
          array: cloneArray(arr),
          description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`,
          comparisons,
          swaps,
          highlightedIndices: [j, j + 1]
        });

        // Perform swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        
        steps.push({
          array: cloneArray(arr),
          description: 'Elements swapped',
          comparisons,
          swaps,
          highlightedIndices: [j, j + 1]
        });
      }

      // Reset status
      arr[j].status = 'default';
      arr[j + 1].status = 'default';
      
      if (j === arr.length - i - 2) {
        arr[j + 1].status = 'sorted';
      }
    }
    
    // Mark last element as sorted
    arr[arr.length - i - 1].status = 'sorted';
    
    if (i === arr.length - 2) {
      arr[0].status = 'sorted';
    }
  }

  // Final sorted state
  steps.push({
    array: arr.map(el => ({ ...el, status: 'sorted' })),
    description: 'Bubble Sort Complete!',
    comparisons,
    swaps,
    highlightedIndices: []
  });

  return steps;
};