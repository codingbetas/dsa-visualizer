export const generateRandomArray = (size: number = 20, min: number = 10, max: number = 100): number[] => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export const generateSortedArray = (size: number = 20, min: number = 10): number[] => {
  return Array.from({ length: size }, (_, i) => min + i * 5);
};

export const generateReverseSortedArray = (size: number = 20, max: number = 100): number[] => {
  return Array.from({ length: size }, (_, i) => max - i * 5);
};

export const generateNearlySortedArray = (size: number = 20, swaps: number = 3): number[] => {
  const array = generateSortedArray(size);
  
  for (let i = 0; i < swaps; i++) {
    const index1 = Math.floor(Math.random() * size);
    const index2 = Math.floor(Math.random() * size);
    [array[index1], array[index2]] = [array[index2], array[index1]];
  }
  
  return array;
};