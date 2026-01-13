import { SortingStep, ArrayElement } from './types';

export const mergeSort = (array: number[]): SortingStep[] => {
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
    description: 'Starting Merge Sort',
    comparisons,
    swaps,
    highlightedIndices: []
  });

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;

    // Highlight the range being merged
    for (let idx = left; idx <= right; idx++) {
      arr[idx].status = 'swapping'; // Using 'swapping' for merge visualization
    }
    
    steps.push({
      array: cloneArray(arr),
      description: `Merging subarrays [${left}, ${mid}] and [${mid + 1}, ${right}]`,
      comparisons,
      swaps,
      highlightedIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx)
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      
      // Highlight elements being compared
      if (left + i <= mid) arr[left + i].status = 'comparing';
      if (mid + 1 + j <= right) arr[mid + 1 + j].status = 'comparing';
      
      steps.push({
        array: cloneArray(arr),
        description: `Comparing ${leftArr[i].value} and ${rightArr[j].value}`,
        comparisons,
        swaps,
        highlightedIndices: [left + i, mid + 1 + j]
      });

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = { ...leftArr[i], status: 'swapping' };
        i++;
      } else {
        arr[k] = { ...rightArr[j], status: 'swapping' };
        j++;
      }
      swaps++;
      k++;
      
      steps.push({
        array: cloneArray(arr),
        description: `Placing element in merged array`,
        comparisons,
        swaps,
        highlightedIndices: [k - 1]
      });
    }

    while (i < leftArr.length) {
      arr[k] = { ...leftArr[i], status: 'swapping' };
      steps.push({
        array: cloneArray(arr),
        description: `Copying remaining element from left subarray`,
        comparisons,
        swaps,
        highlightedIndices: [k]
      });
      i++;
      k++;
      swaps++;
    }

    while (j < rightArr.length) {
      arr[k] = { ...rightArr[j], status: 'swapping' };
      steps.push({
        array: cloneArray(arr),
        description: `Copying remaining element from right subarray`,
        comparisons,
        swaps,
        highlightedIndices: [k]
      });
      j++;
      k++;
      swaps++;
    }

    // Mark merged range as sorted
    for (let idx = left; idx <= right; idx++) {
      arr[idx].status = 'sorted';
    }
    
    steps.push({
      array: cloneArray(arr),
      description: `Subarray [${left}, ${right}] is now sorted`,
      comparisons,
      swaps,
      highlightedIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx)
    });
  };

  const sort = (left: number, right: number) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: cloneArray(arr),
      description: `Dividing array at index ${mid}`,
      comparisons,
      swaps,
      highlightedIndices: [mid]
    });

    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  };

  sort(0, arr.length - 1);
  
  steps.push({
    array: arr.map(el => ({ ...el, status: 'sorted' })),
    description: 'Merge Sort Complete!',
    comparisons,
    swaps,
    highlightedIndices: []
  });

  return steps;
};