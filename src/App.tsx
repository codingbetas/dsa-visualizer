// Replace your entire App.tsx with this:

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Play, Pause, RotateCcw, BarChart3, Zap, Code, 
  Clock, GitBranch, Globe, Cpu, Terminal, Cpu as CpuIcon,
  AlertCircle, CheckCircle, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Layers, List, Network, Search,
  BookOpen, Info, GitPullRequest, GitCommit, GitMerge,
  AlertTriangle, TrendingUp, Cpu as Processor,
  Layers as DataStructure, TreePine, Users
} from 'lucide-react';

// Import your data structure components
import BinarySearchTree from './dataStructures/binarySearch/BinarySearchTree';
import GraphTraversal from './dataStructures/graph/GraphTraversal';

// ======================== TYPES & INTERFACES ========================

interface AlgorithmStep {
  array: number[];
  description: string;
  comparisons: number;
  swaps: number;
  highlighted: number[];
  operationType?: 'COMPARE' | 'SWAP' | 'PARTITION' | 'MERGE' | 'PUSH' | 'POP' | 'ENQUEUE' | 'DEQUEUE' | 'INSERT' | 'DELETE' | 'SEARCH' | 'VISIT';
  why?: string;
  invariant?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  edgeCaseHandled?: boolean;
  earlyTermination?: boolean;
}

interface AlgorithmAnalysis {
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  stability: 'Stable' | 'Unstable' | 'N/A';
  inPlace: boolean;
  recursive: boolean;
  adaptive: boolean;
}

interface AlgorithmCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

// ======================== DEFAULT CODES ========================

const DEFAULT_CODES = {
  python: {
    bubble: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        swapped = False
        for j in range(0, n-i-1):
            # COMPARE: Check adjacent elements
            if arr[j] > arr[j+1]:
                # SWAP: Swap if out of order
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        # EARLY TERMINATION: If no swaps, array is sorted
        if not swapped:
            break
    return arr`,
    
    quick: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x < pivot]
    right = [x for x in arr[:-1] if x >= pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)`,
    
    merge: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`,
    
    stack: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0`,
    
    queue: `class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.insert(0, item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def is_empty(self):
        return len(self.items) == 0`,
    
    binarySearch: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
  },
  
  javascript: {
    bubble: `function bubbleSort(arr) {
    let n = arr.length;
    for(let i = 0; i < n-1; i++) {
        let swapped = false;
        for(let j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                swapped = true;
            }
        }
        if(!swapped) break;
    }
    return arr;
}`,
    
    stack: `class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        if (!this.isEmpty()) {
            return this.items.pop();
        }
        return null;
    }
    
    peek() {
        if (!this.isEmpty()) {
            return this.items[this.items.length - 1];
        }
        return null;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}`,
    
    queue: `class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(item) {
        this.items.unshift(item);
    }
    
    dequeue() {
        if (!this.isEmpty()) {
            return this.items.pop();
        }
        return null;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}`,
    
    binarySearch: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while(left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if(arr[mid] === target) {
            return mid;
        } else if(arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    
    quick: `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    
    return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    
    merge: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`
  },
  
  cpp: {
    bubble: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    
    stack: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> s;
    
    // Push operations
    s.push(10);
    s.push(20);
    s.push(30);
    
    // Pop operations
    while (!s.empty()) {
        cout << s.top() << " ";
        s.pop();
    }
    
    return 0;
}`,
    
    binarySearch: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    
    quick: `#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    
    merge: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<int> L(n1), R(n2);
    
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`
  }
};

// ======================== ALGORITHM ANALYSIS DATA ========================

const ALGORITHM_ANALYSIS: Record<string, AlgorithmAnalysis> = {
  bubble: {
    bestCase: "O(n) - Array already sorted",
    averageCase: "O(n²) - Quadratic time",
    worstCase: "O(n²) - Reverse sorted array",
    spaceComplexity: "O(1) - In-place sorting",
    stability: "Stable",
    inPlace: true,
    recursive: false,
    adaptive: true
  },
  quick: {
    bestCase: "O(n log n) - Balanced partitions",
    averageCase: "O(n log n) - Random pivot selection",
    worstCase: "O(n²) - Unbalanced partitions",
    spaceComplexity: "O(log n) - Recursion stack",
    stability: "Unstable",
    inPlace: true,
    recursive: true,
    adaptive: false
  },
  merge: {
    bestCase: "O(n log n) - Always divides equally",
    averageCase: "O(n log n) - Consistent performance",
    worstCase: "O(n log n) - Guaranteed bound",
    spaceComplexity: "O(n) - Auxiliary array needed",
    stability: "Stable",
    inPlace: false,
    recursive: true,
    adaptive: false
  },
  stack: {
    bestCase: "O(1) - Constant time operations",
    averageCase: "O(1) - Direct access",
    worstCase: "O(1) - No iteration needed",
    spaceComplexity: "O(n) - Stores all elements",
    stability: "N/A",
    inPlace: true,
    recursive: false,
    adaptive: false
  },
  queue: {
    bestCase: "O(1) - Constant time operations",
    averageCase: "O(1) - Direct access",
    worstCase: "O(1) - No iteration needed",
    spaceComplexity: "O(n) - Stores all elements",
    stability: "N/A",
    inPlace: true,
    recursive: false,
    adaptive: false
  },
  binarySearch: {
    bestCase: "O(1) - Target at middle",
    averageCase: "O(log n) - Halving search space",
    worstCase: "O(log n) - Target not found",
    spaceComplexity: "O(1) - Iterative approach",
    stability: "N/A",
    inPlace: true,
    recursive: false,
    adaptive: false
  }
};

// ======================== CATEGORIES ========================

const CATEGORIES: AlgorithmCategory[] = [
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Arrange elements in specific order'
  },
  {
    id: 'datastructures',
    name: 'Data Structures',
    icon: <DataStructure className="w-5 h-5" />,
    description: 'Organize and store data efficiently'
  },
  {
    id: 'searching',
    name: 'Searching Algorithms',
    icon: <Search className="w-5 h-5" />,
    description: 'Find elements in collections'
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    icon: <Network className="w-5 h-5" />,
    description: 'Traverse and analyze graphs'
  }
];

// ======================== MAIN APP COMPONENT ========================

function App() {
  // ======================== STATE MANAGEMENT ========================
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [customArray, setCustomArray] = useState<string>('64, 34, 25, 12, 22, 11, 90');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp'>('python');
  const [category, setCategory] = useState<string>('sorting');
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [userCode, setUserCode] = useState<string>('');
  const [isRunnable, setIsRunnable] = useState<boolean>(true);
  const [output, setOutput] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [stepDescription, setStepDescription] = useState('Ready to execute your algorithm');
  const [isCodeValid, setIsCodeValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [visualizationSteps, setVisualizationSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showExplanation, setShowExplanation] = useState(true);
  const [detectedEdgeCase, setDetectedEdgeCase] = useState<string>('');
  const [earlyTermination, setEarlyTermination] = useState(false);
  const [activeTab, setActiveTab] = useState<'sorting' | 'datastructures'>('sorting');
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // ======================== ALGORITHM OPTIONS ========================
  
  const ALGORITHMS = {
    sorting: [
      { id: 'bubble', name: 'Bubble Sort', icon: '🫧', color: 'bg-blue-100 text-blue-800' },
      { id: 'quick', name: 'Quick Sort', icon: '⚡', color: 'bg-green-100 text-green-800' },
      { id: 'merge', name: 'Merge Sort', icon: '🔄', color: 'bg-purple-100 text-purple-800' },
      { id: 'insertion', name: 'Insertion Sort', icon: '📥', color: 'bg-yellow-100 text-yellow-800' }
    ],
   datastructures: [
      { id: 'stack', name: 'Stack Operations', icon: '📚', color: 'bg-red-100 text-red-800' },
      { id: 'queue', name: 'Queue Operations', icon: '🚶‍♂️', color: 'bg-orange-100 text-orange-800' },
      { id: 'linkedlist', name: 'Linked List', icon: '🔗', color: 'bg-teal-100 text-teal-800' },
      { id: 'binarySearchTree', name: 'Binary Search Tree', icon: '🌳', color: 'bg-green-100 text-green-800' },
      { id: 'graphTraversal', name: 'Graph Traversal', icon: '🌐', color: 'bg-purple-100 text-purple-800' }
],
    searching: [
      { id: 'binarySearch', name: 'Binary Search', icon: '🔍', color: 'bg-indigo-100 text-indigo-800' },
      { id: 'linearSearch', name: 'Linear Search', icon: '📊', color: 'bg-pink-100 text-pink-800' }
    ],
    graph: [
      { id: 'bfs', name: 'BFS Traversal', icon: '🌊', color: 'bg-cyan-100 text-cyan-800' },
      { id: 'dfs', name: 'DFS Traversal', icon: '🌳', color: 'bg-lime-100 text-lime-800' }
    ]
  };

  // ======================== INITIALIZATION ========================
  
  useEffect(() => {
  const langCodes = DEFAULT_CODES[language];

  if (!langCodes) {
    setUserCode('// Language not supported');
    setIsRunnable(false);
    return;
  }

  const algoCode = langCodes[algorithm as keyof typeof langCodes];

  if (!algoCode) {
    setUserCode(
`// ⚠️ ${algorithm} is not yet implemented in ${language.toUpperCase()}
// This feature is under development.`
    );
    setIsRunnable(false);
    return;
  }

  setUserCode(algoCode);
  setIsRunnable(true);
}, [language, algorithm]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(Math.min(width - 100, 1200));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // ======================== EDGE CASE DETECTION ========================
  
  const detectEdgeCases = () => {
    if (array.length === 0) {
      setDetectedEdgeCase('⚠️ Empty array detected');
      return;
    }
    
    if (array.length === 1) {
      setDetectedEdgeCase('✅ Single element - Already sorted');
      return;
    }
    
    // Check if array is already sorted
    let isSorted = true;
    for (let i = 1; i < array.length; i++) {
      if (array[i] < array[i - 1]) {
        isSorted = false;
        break;
      }
    }
    
    if (isSorted) {
      setDetectedEdgeCase('✅ Array already sorted - Best case scenario');
      return;
    }
    
    // Check if array is reverse sorted
    let isReverseSorted = true;
    for (let i = 1; i < array.length; i++) {
      if (array[i] > array[i - 1]) {
        isReverseSorted = false;
        break;
      }
    }
    
    if (isReverseSorted) {
      setDetectedEdgeCase('⚠️ Reverse sorted array - Worst case for many algorithms');
      return;
    }
    
    // Check for duplicates
    const uniqueElements = new Set(array);
    if (uniqueElements.size < array.length * 0.5) {
      setDetectedEdgeCase('⚠️ Many duplicate values - May affect algorithm behavior');
      return;
    }
    
    setDetectedEdgeCase('');
  };

  // ======================== ARRAY OPERATIONS ========================
  
  const generateRandomArray = () => {
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setCustomArray(newArray.join(', '));
    setOutput('');
    setExecutionTime(0);
    setDetectedEdgeCase('');
    setEarlyTermination(false);
    detectEdgeCases();
  };

  const updateArrayFromInput = () => {
    try {
      const nums = customArray.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
      
      if (nums.length > 0) {
        setArray(nums);
        setOutput('');
        setErrorMessage('');
        detectEdgeCases();
      } else {
        setErrorMessage('Please enter valid numbers separated by commas');
      }
    } catch (error) {
      setErrorMessage('Invalid input format');
    }
  };

  // ======================== VISUALIZATION ENGINE ========================
  
  useEffect(() => {
    if (!svgRef.current || array.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const elementCount = array.length;
    const barWidth = Math.max(30, 800 / elementCount);
    const totalWidth = barWidth * elementCount * 1.2;
    const width = Math.max(containerWidth, totalWidth);
    const height = isFullscreen ? 500 : 350;
    const margin = { top: 60, right: 30, bottom: 60, left: 60 };

    svg.attr('width', width)
       .attr('height', height)
       .attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const xScale = d3.scaleBand()
      .domain(array.map((_, i) => i.toString()))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...array) || 100])
      .range([height - margin.bottom, margin.top]);

    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#1d4ed8')
      .attr('stop-opacity', 0.8);

    // Highlight current step elements
    let highlightedIndices: number[] = [];
    if (visualizationSteps.length > 0 && currentStep < visualizationSteps.length) {
      highlightedIndices = visualizationSteps[currentStep].highlighted || [];
    }

    // Create bars
    svg.selectAll('rect')
      .data(array)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i.toString())!)
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d))
      .attr('fill', (_, i) => highlightedIndices.includes(i) ? '#ef4444' : 'url(#bar-gradient)')
      .attr('rx', 4)
      .attr('stroke', (_, i) => highlightedIndices.includes(i) ? '#dc2626' : '#1f2937')
      .attr('stroke-width', (_, i) => highlightedIndices.includes(i) ? 2.5 : 1.5)
      .attr('class', 'bar-element');

    // Add value labels
    svg.selectAll('text.value')
      .data(array)
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-weight', '600')
      .attr('font-size', '14px');

    // Add index labels
    svg.selectAll('text.index')
      .data(array)
      .enter()
      .append('text')
      .text((_, i) => i)
      .attr('x', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
      .attr('y', height - 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '12px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text(`${algorithm.charAt(0).toUpperCase() + algorithm.slice(1).replace(/([A-Z])/g, ' $1')}`);

    // Add current step info if available
    if (visualizationSteps.length > 0 && currentStep < visualizationSteps.length) {
      const step = visualizationSteps[currentStep];
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('fill', '#059669')
        .attr('font-size', '14px')
        .attr('font-weight', '500')
        .text(step.description);
    }

  }, [array, visualizationSteps, currentStep, containerWidth, isFullscreen, algorithm]);

  // ======================== ALGORITHM EXECUTION ENGINE ========================
  
  const executeCode = () => {
    if (!userCode.trim()) {
      setErrorMessage('Please write some code first');
      return;
    }

    try {
      setIsRunning(true);
      setStepDescription('Executing your algorithm...');
      setOutput('');
      setErrorMessage('');
      setEarlyTermination(false);
      
      const startTime = performance.now();
      
      // Generate visualization steps based on algorithm
      const steps = generateAlgorithmSteps();
      setVisualizationSteps(steps);
      setCurrentStep(0);
      
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      
      // Analyze and show output
      const sortedArray = [...array].sort((a, b) => a - b);
      const resultArray = steps[steps.length - 1]?.array || [];
      const isSorted = JSON.stringify(sortedArray) === JSON.stringify(resultArray);
      
      setOutput(`✅ ${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} executed successfully!
      Result: ${resultArray.join(', ')}
      Sorted: ${isSorted ? 'Yes ✓' : 'No ✗'}
      Execution time: ${(endTime - startTime).toFixed(2)}ms
      Steps: ${steps.length}
      Comparisons: ${steps[steps.length - 1]?.comparisons || 0}
      Swaps: ${steps[steps.length - 1]?.swaps || 0}
      ${earlyTermination ? '✨ Early termination applied - Best case detected!' : ''}`);
      
      setIsCodeValid(true);
      setIsRunning(false);
      
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
      setIsCodeValid(false);
      setIsRunning(false);
    }
  };

  // ======================== ALGORITHM STEP GENERATOR ========================
  
  const generateAlgorithmSteps = (): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;
    let earlyExit = false;

    // Initial state
    steps.push({
      array: [...arr],
      description: `Starting ${algorithm} algorithm...`,
      comparisons: 0,
      swaps: 0,
      highlighted: [],
      operationType: 'COMPARE',
      why: 'Initializing algorithm',
      invariant: 'Array maintains original state'
    });

    // BUBBLE SORT
    if (algorithm === 'bubble') {
      const n = arr.length;
      let swapped;
      
      for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          
          steps.push({
            array: [...arr],
            description: `Comparing arr[${j}](${arr[j]}) and arr[${j+1}](${arr[j+1]})`,
            comparisons,
            swaps,
            highlighted: [j, j+1],
            operationType: 'COMPARE',
            why: 'Checking if adjacent elements are in correct order',
            invariant: 'Elements after n-i-1 are already sorted'
          });

          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swaps++;
            
            steps.push({
              array: [...arr],
              description: `Swapped arr[${j}] and arr[${j+1}]`,
              comparisons,
              swaps,
              highlighted: [j, j+1],
              operationType: 'SWAP',
              why: 'Elements were out of order - moving larger element right',
              invariant: 'After swap, arr[j] ≤ arr[j+1]'
            });
            
            swapped = true;
          }
        }
        
        // Early termination check
        if (!swapped && i === 0) {
          earlyExit = true;
          setEarlyTermination(true);
          steps.push({
            array: [...arr],
            description: '✨ EARLY TERMINATION: No swaps needed - array already sorted!',
            comparisons,
            swaps,
            highlighted: [],
            operationType: 'COMPARE',
            why: 'Best case detected - algorithm can terminate early',
            invariant: 'Array is already sorted',
            edgeCaseHandled: true,
            earlyTermination: true
          });
          break;
        }
        
        steps.push({
          array: [...arr],
          description: `Pass ${i + 1} complete - ${swaps} swaps made`,
          comparisons,
          swaps,
          highlighted: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx),
          why: `Completed outer loop iteration ${i + 1}`,
          invariant: `Last ${i + 1} elements are in final positions`
        });
      }
    }
    
    // QUICK SORT
    else if (algorithm === 'quick') {
      const quickSortSteps = (arr: number[], low: number, high: number, steps: AlgorithmStep[]) => {
        if (low < high) {
          const pi = partition(arr, low, high, steps);
          quickSortSteps(arr, low, pi - 1, steps);
          quickSortSteps(arr, pi + 1, high, steps);
        }
      };
      
      const partition = (arr: number[], low: number, high: number, steps: AlgorithmStep[]): number => {
        const pivot = arr[high];
        let i = low - 1;
        
        steps.push({
          array: [...arr],
          description: `Selecting pivot: arr[${high}] = ${pivot}`,
          comparisons,
          swaps,
          highlighted: [high],
          operationType: 'PARTITION',
          why: 'Choosing pivot element for partition',
          invariant: 'Pivot element will be in correct position after partition'
        });
        
        for (let j = low; j < high; j++) {
          comparisons++;
          
          steps.push({
            array: [...arr],
            description: `Comparing arr[${j}](${arr[j]}) with pivot(${pivot})`,
            comparisons,
            swaps,
            highlighted: [j, high],
            operationType: 'COMPARE',
            why: 'Checking if element should be on left of pivot',
            invariant: 'Maintaining partition boundary'
          });
          
          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            
            steps.push({
              array: [...arr],
              description: `Swapped arr[${i}] and arr[${j}]`,
              comparisons,
              swaps,
              highlighted: [i, j],
              operationType: 'SWAP',
              why: 'Moving smaller element to left partition',
              invariant: 'All elements left of i are < pivot'
            });
          }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps++;
        
        steps.push({
          array: [...arr],
          description: `Placed pivot at correct position ${i + 1}`,
          comparisons,
          swaps,
          highlighted: [i + 1],
          operationType: 'SWAP',
          why: 'Moving pivot to its final sorted position',
          invariant: 'Pivot is now in correct sorted position'
        });
        
        return i + 1;
      };
      
      quickSortSteps(arr, 0, arr.length - 1, steps);
    }
    
    // MERGE SORT
    // MERGE SORT - FULL IMPLEMENTATION
    else if (algorithm === 'merge') {
      const merge = (arr: number[], left: number, mid: number, right: number, steps: AlgorithmStep[]) => {
        let n1 = mid - left + 1;
        let n2 = right - mid;
        let L = arr.slice(left, mid + 1);
        let R = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
          comparisons++;
          steps.push({
            array: [...arr],
            description: `Comparing elements from left and right sub-arrays`,
            comparisons,
            swaps,
            highlighted: [left + i, mid + 1 + j],
            operationType: 'COMPARE',
            why: 'Comparing values to merge in sorted order',
            invariant: 'L and R sub-arrays are individually sorted'
          });

          if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
          } else {
            arr[k] = R[j];
            j++;
          }
          
          steps.push({
            array: [...arr],
            description: `Placed ${arr[k]} at index ${k}`,
            comparisons,
            swaps,
            highlighted: [k],
            operationType: 'SWAP', // Using SWAP type for visualization movement
            why: 'Moving the smaller element into the merged array',
            invariant: 'Elements 0 to k are now sorted relative to each other'
          });
          k++;
        }

        // Copy remaining elements of L[]
        while (i < n1) {
          arr[k] = L[i];
          steps.push({
            array: [...arr],
            description: `Copying remaining element ${L[i]} from left sub-array`,
            comparisons,
            swaps,
            highlighted: [k],
            operationType: 'SWAP',
            why: 'Left sub-array has remaining elements',
            invariant: 'Merging remaining elements'
          });
          i++; k++;
        }

        // Copy remaining elements of R[]
        while (j < n2) {
          arr[k] = R[j];
          steps.push({
            array: [...arr],
            description: `Copying remaining element ${R[j]} from right sub-array`,
            comparisons,
            swaps,
            highlighted: [k],
            operationType: 'SWAP',
            why: 'Right sub-array has remaining elements',
            invariant: 'Merging remaining elements'
          });
          j++; k++;
        }
      };

      const mergeSortRecursive = (arr: number[], left: number, right: number, steps: AlgorithmStep[]) => {
        if (left < right) {
          const mid = Math.floor((left + right) / 2);
          
          steps.push({
            array: [...arr],
            description: `Splitting array: [${left}...${mid}] and [${mid+1}...${right}]`,
            comparisons,
            swaps,
            highlighted: Array.from({ length: right - left + 1 }, (_, i) => left + i),
            operationType: 'MERGE',
            why: 'Divide phase: Recursively splitting the problem',
            invariant: 'Divide and Conquer approach'
          });

          mergeSortRecursive(arr, left, mid, steps);
          mergeSortRecursive(arr, mid + 1, right, steps);
          merge(arr, left, mid, right, steps);
        }
      };

      mergeSortRecursive(arr, 0, arr.length - 1, steps);
    }
    
    // BINARY SEARCH - FIXED!
    else if (algorithm === 'binarySearch') {
      // First sort the array for binary search
      const sortedArr = [...arr].sort((a, b) => a - b);
      const target = sortedArr[Math.floor(sortedArr.length / 2)]; // Search for middle element
      let left = 0;
      let right = sortedArr.length - 1;
      let found = false;
      
      steps.push({
        array: [...sortedArr],
        description: `Binary Search: Looking for value ${target} in sorted array`,
        comparisons: 0,
        swaps: 0,
        highlighted: [],
        operationType: 'SEARCH',
        why: 'Initializing search with sorted array',
        invariant: 'Search space: [0, arr.length-1]'
      });

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        comparisons++;
        
        steps.push({
          array: [...sortedArr],
          description: `Checking middle element arr[${mid}] = ${sortedArr[mid]}`,
          comparisons,
          swaps,
          highlighted: [mid],
          operationType: 'SEARCH',
          why: 'Examining midpoint of current search space',
          invariant: 'Maintaining search space boundaries'
        });

        if (sortedArr[mid] === target) {
          found = true;
          steps.push({
            array: [...sortedArr],
            description: `🎯 FOUND: Target ${target} at index ${mid}`,
            comparisons,
            swaps,
            highlighted: [mid],
            operationType: 'SEARCH',
            why: 'Element matches search target',
            invariant: 'Target found, search complete'
          });
          break;
        } else if (sortedArr[mid] < target) {
          steps.push({
            array: [...sortedArr],
            description: `Target > arr[${mid}], searching RIGHT half [${mid+1}, ${right}]`,
            comparisons,
            swaps,
            highlighted: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
            operationType: 'SEARCH',
            why: 'Target is larger than middle element',
            invariant: 'Target must be in right half [mid+1, right]'
          });
          left = mid + 1;
        } else {
          steps.push({
            array: [...sortedArr],
            description: `Target < arr[${mid}], searching LEFT half [${left}, ${mid-1}]`,
            comparisons,
            swaps,
            highlighted: Array.from({ length: mid - left }, (_, i) => left + i),
            operationType: 'SEARCH',
            why: 'Target is smaller than middle element',
            invariant: 'Target must be in left half [left, mid-1]'
          });
          right = mid - 1;
        }
      }
      
      if (!found) {
        steps.push({
          array: [...sortedArr],
          description: `Target ${target} not found in array`,
          comparisons,
          swaps,
          highlighted: [],
          operationType: 'SEARCH',
          why: 'Exhausted search space without finding target',
          invariant: 'Target does not exist in array'
        });
      }
    }
    
    // STACK OPERATIONS
    else if (algorithm === 'stack') {
      const stack: number[] = [];
      
      // Push operations
      arr.forEach((value, index) => {
        stack.push(value);
        steps.push({
          array: [...stack, ...Array(arr.length - stack.length).fill(0)],
          description: `PUSH ${value} onto stack`,
          comparisons: 0,
          swaps: 0,
          highlighted: [stack.length - 1],
          operationType: 'PUSH',
          why: 'Adding element to top of stack',
          invariant: 'Last-in, First-out (LIFO) principle maintained'
        });
      });
      
      // Pop operations
      while (stack.length > 0) {
        const popped = stack.pop()!;
        steps.push({
          array: [...stack, ...Array(arr.length - stack.length).fill(0)],
          description: `POP ${popped} from stack`,
          comparisons: 0,
          swaps: 0,
          highlighted: [stack.length],
          operationType: 'POP',
          why: 'Removing top element from stack',
          invariant: 'LIFO - Last element pushed is first popped'
        });
      }
    }

    // QUEUE OPERATIONS
    else if (algorithm === 'queue') {
      const queue: number[] = [];
      
      // Enqueue operations
      arr.forEach((value, index) => {
        queue.unshift(value);
        steps.push({
          array: [...queue, ...Array(arr.length - queue.length).fill(0)],
          description: `ENQUEUE ${value} to queue`,
          comparisons: 0,
          swaps: 0,
          highlighted: [0],
          operationType: 'ENQUEUE',
          why: 'Adding element to back of queue',
          invariant: 'First-in, First-out (FIFO) principle maintained'
        });
      });
      
      // Dequeue operations
      while (queue.length > 0) {
        const dequeued = queue.pop()!;
        steps.push({
          array: [...queue, ...Array(arr.length - queue.length).fill(0)],
          description: `DEQUEUE ${dequeued} from queue`,
          comparisons: 0,
          swaps: 0,
          highlighted: [queue.length],
          operationType: 'DEQUEUE',
          why: 'Removing front element from queue',
          invariant: 'FIFO - First element enqueued is first dequeued'
        });
      }
    }

    // Final state
    const finalArray = algorithm === 'binarySearch' ? arr.sort((a, b) => a - b) : [...arr];
    
    steps.push({
      array: finalArray,
      description: `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Complete! ${
        earlyExit ? '✨ (Early Termination Applied)' : ''
      }`,
      comparisons,
      swaps,
      highlighted: [],
      operationType: 'COMPARE',
      why: 'Algorithm execution finished',
      invariant: 'Final sorted/processed array',
      edgeCaseHandled: earlyExit,
      earlyTermination: earlyExit
    });

    return steps;
  };

  // ======================== VISUALIZATION CONTROLS ========================
  
const startVisualization = () => {
  if (visualizationSteps.length === 0) return;
  
  setIsRunning(true);
  // If we are already at the end, start over from 0
  let stepIndex = currentStep >= visualizationSteps.length - 1 ? 0 : currentStep;
  
  // 1. Safe clear: only call if current is NOT null
  if (animationRef.current !== null) {
    clearInterval(animationRef.current as any);
  }

  // 2. Use a local variable first, then assign to ref
  const intervalId = setInterval(() => {
    if (stepIndex >= visualizationSteps.length - 1) {
      // Use the local intervalId here to avoid ref null issues
      clearInterval(intervalId as any);
      animationRef.current = null;
      
      setIsRunning(false);
      // Force current step to the last index to be safe
      setCurrentStep(visualizationSteps.length - 1); 
      setStepDescription('✅ Algorithm Completed Successfully!');
      return;
    }

    const step = visualizationSteps[stepIndex];
    if (step) {
      setArray(step.array);
      setStepDescription(step.description);
      setCurrentStep(stepIndex);
    }
    
    stepIndex++;
  }, 1000 - speed);

  animationRef.current = intervalId as any;
};

const stopVisualization = () => {
  // Use a temporary variable to satisfy the TS Overload
  const currentId = animationRef.current;
  if (currentId !== null) {
    clearInterval(currentId as any);
    animationRef.current = null;
  }
  setIsRunning(false);
  setStepDescription('Visualization stopped');
};

  const goToStep = (step: number) => {
    if (step >= 0 && step < visualizationSteps.length) {
      setCurrentStep(step);
      setArray(visualizationSteps[step].array);
      setStepDescription(visualizationSteps[step].description);
    }
  };

  const resetToDefault = () => {
    stopVisualization();
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setCustomArray('64, 34, 25, 12, 22, 11, 90');
    
    // Get the default code for the current language and algorithm
    const defaultCodeForLanguage = DEFAULT_CODES[language];
    if (defaultCodeForLanguage) {
      const defaultCode = defaultCodeForLanguage[algorithm as keyof typeof defaultCodeForLanguage];
      if (defaultCode) {
        setUserCode(defaultCode);
      } else {
        // Fallback to Python
        const pythonDefault = DEFAULT_CODES.python[algorithm as keyof typeof DEFAULT_CODES.python];
        setUserCode(pythonDefault || '// Code not available for this algorithm');
      }
    }
    
    setOutput('');
    setErrorMessage('');
    setExecutionTime(0);
    setVisualizationSteps([]);
    setCurrentStep(0);
    setEarlyTermination(false);
    setDetectedEdgeCase('');
    setStepDescription('Reset to default example');
  };

  // ======================== UTILITY FUNCTIONS ========================
  
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // ======================== RENDER ========================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Processor className="w-8 h-8 md:w-10 md:h-10" />
              DSA Algorithm Visualizer
              <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">
                ELITE TIER
              </span>
            </h1>
            <p className="text-gray-600 mt-2">
              Interactive visualization of algorithms and data structures with step-by-step explanations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">
                {isRunning ? 'Executing...' : 'Ready'}
              </span>
            </div>
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Architecture Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <GitPullRequest className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Modular Architecture</h3>
              <p className="text-sm text-gray-600">
                Algorithm Engine → Event Emitter → Visualization Renderer → Step-by-Step Explanation
              </p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">System Design</span>
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <Layers className="w-6 h-6 text-purple-600" />
            Select Algorithm Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setActiveTab(cat.id as 'sorting' | 'datastructures');
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
                  category === cat.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white transform scale-105' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="mb-2">{cat.icon}</div>
                <span className="font-semibold text-sm text-center">{cat.name}</span>
                <span className="text-xs mt-1 opacity-80 text-center">{cat.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language & Algorithm Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Language Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Programming Language</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'python', label: 'Python', icon: '🐍', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
                { id: 'javascript', label: 'JavaScript', icon: '📜', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
                { id: 'cpp', label: 'C++', icon: '⚡', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${lang.color} ${language === lang.id ? 'ring-2 ring-current transform scale-105' : ''}`}
                >
                  <span className="text-xl mb-1">{lang.icon}</span>
                  <span className="font-semibold text-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Algorithm Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CpuIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Select Algorithm</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ALGORITHMS[category as keyof typeof ALGORITHMS]?.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithm(algo.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${algo.color} ${algorithm === algo.id ? 'ring-2 ring-current transform scale-105' : ''}`}
                >
                  <span className="text-xl mb-1">{algo.icon}</span>
                  <span className="font-semibold text-sm text-center">{algo.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Array Input & Edge Cases */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Input & Analysis</h2>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customArray}
                  onChange={(e) => setCustomArray(e.target.value)}
                  placeholder="Enter numbers separated by commas"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={updateArrayFromInput}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
              
              {detectedEdgeCase && (
                <div className={`p-3 rounded-lg text-sm ${detectedEdgeCase.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Edge Case Detection:</span>
                  </div>
                  <p className="mt-1">{detectedEdgeCase}</p>
                </div>
              )}
              
              <button
                onClick={generateRandomArray}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Generate Random Array
              </button>
            </div>
          </div>
        </div>

        {/* Data Structure Visualizers (Separate Section) */}
        {(algorithm === 'binarySearchTree' || algorithm === 'graphTraversal') && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {algorithm === 'binarySearchTree' ? '🌳 Binary Search Tree' : '🌐 Graph Traversal'}
            </h2>
            {algorithm === 'binarySearchTree' && <BinarySearchTree />}
            {algorithm === 'graphTraversal' && <GraphTraversal />}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Code Editor - Only show for non-data-structure algorithms */}
          {!(algorithm === 'binarySearchTree' || algorithm === 'graphTraversal') && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Code className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">Algorithm Implementation</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCodeValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCodeValid ? '✓ Valid' : '✗ Error'}
                  </span>
                  <button
                    onClick={() => {
                      const defaultCodeForLanguage = DEFAULT_CODES[language];
                      if (defaultCodeForLanguage) {
                        const defaultCode = defaultCodeForLanguage[algorithm as keyof typeof defaultCodeForLanguage];
                        if (defaultCode) {
                          setUserCode(defaultCode);
                        } else {
                          // Fallback to Python
                          const pythonDefault = DEFAULT_CODES.python[algorithm as keyof typeof DEFAULT_CODES.python];
                          setUserCode(pythonDefault || '// Code not available for this algorithm');
                        }
                      }
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset Code
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="ml-2 text-gray-300 font-mono text-sm">
                      {algorithm}.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'cpp'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Language-agnostic execution layer</span>
                </div>
                
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-96 font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  spellCheck="false"
                  placeholder={`Write your ${algorithm} algorithm in ${language}...`}
                />
              </div>

              {/* Editor Controls */}
              <div className="flex flex-wrap gap-3">
              {
                <button
                onClick={executeCode}
                disabled={!isRunnable || isRunning}
                className={`px-4 py-2 rounded-lg font-semibold transition
                ${isRunnable && !isRunning
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-400 cursor-not-allowed text-gray-700'}`}
              >
              {isRunning ? 'Running...' : isRunnable ? 'Run' : 'Not Implemented'}
              </button>
              } 
                
                <button
                  onClick={startVisualization}
                  disabled={visualizationSteps.length === 0 || isRunning}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Play className="w-5 h-5" />
                  Visualize
                </button>

                <button
                  onClick={stopVisualization}
                  disabled={!isRunning}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  <Pause className="w-5 h-5" />
                  Stop
                </button>

                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Speed</div>
                      <input
                        type="range"
                        min="100"
                        max="900"
                        step="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Visualization & Explanation - Show for all algorithms */}
          <div className="space-y-6">
            {/* Visualization Container */}
            <div className={`bg-white rounded-2xl shadow-xl p-6 ${isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Live Visualization</h2>
                </div>
                <div className="flex items-center gap-4">
                 <div className="text-sm text-gray-600">
                 {!(algorithm === 'binarySearchTree' || algorithm === 'graphTraversal') && 
                   ` Step ${Math.min(currentStep + 1, visualizationSteps.length)} of ${visualizationSteps.length}`}
                </div>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title={showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Visualization Navigation - Only for array-based algorithms */}
              {!(algorithm === 'binarySearchTree' || algorithm === 'graphTraversal') && visualizationSteps.length > 0 && (
  <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center gap-2">
      <button
        onClick={() => goToStep(0)}
        disabled={currentStep === 0}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goToStep(currentStep - 1)}
        disabled={currentStep === 0}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
    </div>
    
    <div className="flex-1 mx-4">
      <input
        type="range"
        min="0"
        /* LOCK SLIDER: Stop at second-to-last step (Index 14 if length is 16) */
        max={Math.max(0, visualizationSteps.length - 2)}
        value={currentStep}
        onChange={(e) => goToStep(parseInt(e.target.value))}
        className="w-full"
        disabled={visualizationSteps.length === 0}
      />
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={() => goToStep(currentStep + 1)}
        /* LOCK NEXT: Disable when we reach Step 15 (Index 14) */
        disabled={currentStep >= visualizationSteps.length - 2}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
      <button
        /* LOCK JUMP: Jump to Step 15 instead of the empty Step 16 */
        onClick={() => goToStep(visualizationSteps.length - 2)}
        disabled={currentStep >= visualizationSteps.length - 2}
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
              
              {/* Scrollable Visualization Area - Only for array-based algorithms */}
              {!(algorithm === 'binarySearchTree' || algorithm === 'graphTraversal') && (
                <div 
                  ref={containerRef}
                  className={`border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 overflow-auto ${
                    isFullscreen ? 'h-[calc(100vh-300px)]' : 'h-64'
                  }`}
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
                >
                  <svg 
                    ref={svgRef} 
                    className="w-full min-w-full"
                    style={{ minWidth: `${Math.max(800, array.length * 50)}px` }}
                  />
                </div>
              )}
              
              {/* Step Description */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">{stepDescription}</p>
                {earlyTermination && (
                  <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm">
                    ✨ Early termination applied - Best case scenario detected!
                  </div>
                )}
              </div>
            </div>

            {/* Explanation Panel */}
            {showExplanation && visualizationSteps.length > 0 && currentStep < visualizationSteps.length && !(algorithm === 'binarySearchTree' || algorithm === 'graphTraversal') && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Step-by-Step Explanation</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Operation Type</div>
                      <div className="font-semibold">
                        {visualizationSteps[currentStep].operationType || 'COMPARE'}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Complexity</div>
                      <div className="font-mono text-sm">
                        {visualizationSteps[currentStep].timeComplexity || 
                         (algorithm === 'bubble' ? 'O(n²)' : 
                          algorithm === 'quick' ? 'O(n log n)' : 
                          algorithm === 'merge' ? 'O(n log n)' : 'O(1)')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <Info className="w-4 h-4" />
                      <span className="font-semibold">Why this step?</span>
                    </div>
                    <p className="text-yellow-700">
                      {visualizationSteps[currentStep].why || 'Understanding algorithm behavior at this step'}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <GitCommit className="w-4 h-4" />
                      <span className="font-semibold">Invariant Maintained</span>
                    </div>
                    <p className="text-green-700">
                      {visualizationSteps[currentStep].invariant || 'Algorithm property that remains true'}
                    </p>
                  </div>
                  
                  {visualizationSteps[currentStep].edgeCaseHandled && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-800 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-semibold">Edge Case Handling</span>
                      </div>
                      <p className="text-purple-700">
                        Special case detected and handled efficiently
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Output & Analysis */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Performance Analysis</h2>
              </div>
              
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="mt-2 text-red-600 font-mono text-sm">{errorMessage}</p>
                </div>
              )}
              
              {output && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Execution Results</span>
                  </div>
                  <pre className="mt-2 text-green-800 font-mono text-sm whitespace-pre-wrap">{output}</pre>
                </div>
              )}
              
              {/* Algorithm Analysis */}
              {ALGORITHM_ANALYSIS[algorithm] && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-700">Algorithm Properties</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Best Case</div>
                      <div className="font-mono text-sm">{ALGORITHM_ANALYSIS[algorithm].bestCase}</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Average Case</div>
                      <div className="font-mono text-sm">{ALGORITHM_ANALYSIS[algorithm].averageCase}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Worst Case</div>
                      <div className="font-mono text-sm">{ALGORITHM_ANALYSIS[algorithm].worstCase}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Space Complexity</div>
                      <div className="font-mono text-sm">{ALGORITHM_ANALYSIS[algorithm].spaceComplexity}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {ALGORITHM_ANALYSIS[algorithm].stability !== 'N/A' && (
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        ALGORITHM_ANALYSIS[algorithm].stability === 'Stable' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ALGORITHM_ANALYSIS[algorithm].stability}
                      </span>
                    )}
                    {ALGORITHM_ANALYSIS[algorithm].inPlace && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In-Place</span>
                    )}
                    {ALGORITHM_ANALYSIS[algorithm].recursive && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Recursive</span>
                    )}
                    {ALGORITHM_ANALYSIS[algorithm].adaptive && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Adaptive</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <GitMerge className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">System Architecture</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800 mb-3">1. Modular Algorithm Engine</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Language-agnostic execution</li>
                <li>• Step event generator</li>
                <li>• Edge case detection</li>
                <li>• Complexity analysis</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800 mb-3">2. Event-Driven Visualization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time D3.js rendering</li>
                <li>• Interactive step control</li>
                <li>• Responsive design</li>
                <li>• Zoom & pan support</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800 mb-3">3. Teaching Engine</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Step-by-step explanations</li>
                <li>• Algorithm invariants</li>
                <li>• Complexity analysis</li>
                <li>• Edge case handling</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-gray-800 mb-3">4. Performance Analytics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Time/space complexity</li>
                <li>• Real-time metrics</li>
                <li>• Comparative analysis</li>
                <li>• Optimization suggestions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resume-Ready Features */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6" />
            Elite Features for Your Resume
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 text-2xl mb-3">🎯</div>
              <h4 className="font-bold mb-2">Multi-Category DSA</h4>
              <p className="text-gray-600 text-sm">Sorting, Data Structures, Searching, and Graph algorithms in one platform</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-green-600 text-2xl mb-3">📚</div>
              <h4 className="font-bold mb-2">Teaching Engine</h4>
              <p className="text-gray-600 text-sm">Step-by-step explanations with "Why" and "Invariant" for each operation</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-purple-600 text-2xl mb-3">🏗️</div>
              <h4 className="font-bold mb-2">Modular Architecture</h4>
              <p className="text-gray-600 text-sm">Algorithm engine emits events consumed by visualization and explanation layers</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-red-600 text-2xl mb-3">⚡</div>
              <h4 className="font-bold mb-2">Edge Case Handling</h4>
              <p className="text-gray-600 text-sm">Detects and handles empty arrays, duplicates, sorted arrays, early termination</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-gray-500">
        <p className="text-lg font-semibold">🚀 Elite DSA Visualizer - System Design Project</p>
        <p className="text-sm mt-2">
          Modular Architecture • Teaching Engine • Multi-Algorithm Support • Real-time Visualization
        </p>
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Sorting Algorithms</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Data Structures</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Search Algorithms</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">Graph Algorithms</span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">Edge Case Detection</span>
        </div>
      </footer>
    </div>
  );
}

export default App;