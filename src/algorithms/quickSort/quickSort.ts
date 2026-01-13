import { SortingStep, ArrayElement } from './types';

export const quickSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr: ArrayElement[] = array.map(value => ({ 
    value, 
    status: 'default' as const 
  }));
  let comparisons = 0;
  let swaps = 0;

  const cloneArray = (arr: ArrayElement[]): ArrayElement[] => {
    return arr.map(item => ({ ...item }));
  };

  steps.push({
    array: cloneArray(arr),
    description: 'Starting Quick Sort',
    comparisons,
    swaps,
    highlightedIndices: []
  });

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      arr[low].status = 'sorted';
      steps.push({
        array: cloneArray(arr),
        description: `Element ${arr[low].value} is in sorted position`,
        comparisons,
        swaps,
        highlightedIndices: [low]
      });
    }
  };

  const partition = (low: number, high: number): number => {
    // Create a pivot reference
    const pivotValue = arr[high].value;
    
    // Mark pivot element
    arr[high].status = 'sorted'; // Using 'sorted' for pivot visualization
    
    steps.push({
      array: cloneArray(arr),
      description: `Selecting pivot: ${pivotValue} at index ${high}`,
      comparisons,
      swaps,
      highlightedIndices: [high]
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Mark comparing
      arr[j].status = 'comparing';
      comparisons++;
      
      steps.push({
        array: cloneArray(arr),
        description: `Comparing ${arr[j].value} with pivot ${pivotValue}`,
        comparisons,
        swaps,
        highlightedIndices: [j, high]
      });

      if (arr[j].value < pivotValue) {
        i++;
        
        if (i !== j) {
          // Mark swapping
          arr[i].status = 'swapping';
          arr[j].status = 'swapping';
          
          steps.push({
            array: cloneArray(arr),
            description: `Moving ${arr[j].value} to correct position`,
            comparisons,
            swaps,
            highlightedIndices: [i, j, high]
          });

          // Perform swap
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          
          steps.push({
            array: cloneArray(arr),
            description: 'Elements rearranged',
            comparisons,
            swaps,
            highlightedIndices: [i, j, high]
          });

          // Reset status
          arr[i].status = 'default';
          arr[j].status = 'default';
        }
      } else {
        arr[j].status = 'default';
      }
    }

    // Place pivot in correct position
    arr[high].status = 'swapping';
    if (i + 1 < arr.length) {
      arr[i + 1].status = 'swapping';
    }
    
    steps.push({
      array: cloneArray(arr),
      description: `Placing pivot ${pivotValue} in correct position`,
      comparisons,
      swaps,
      highlightedIndices: [i + 1, high]
    });

    // Swap pivot to correct position
    if (i + 1 !== high) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swaps++;
    }
    
    arr[i + 1].status = 'sorted';
    arr[high].status = 'default';

    steps.push({
      array: cloneArray(arr),
      description: `Pivot ${pivotValue} now at position ${i + 1}`,
      comparisons,
      swaps,
      highlightedIndices: [i + 1]
    });

    return i + 1;
  };

  sort(0, arr.length - 1);
  
  // Mark all as sorted
  steps.push({
    array: arr.map(el => ({ ...el, status: 'sorted' })),
    description: 'Quick Sort Complete!',
    comparisons,
    swaps,
    highlightedIndices: []
  });

  return steps;
};