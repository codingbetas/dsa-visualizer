export type ElementStatus = 
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'sorted';

export interface ArrayElement {
  value: number;
  status: ElementStatus;
}

export interface SortingStep {
  array: ArrayElement[];
  description: string;
  comparisons: number;
  swaps: number;
  highlightedIndices?: number[];
}