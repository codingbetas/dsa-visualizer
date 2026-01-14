import React, { useState } from 'react';
import { Network, Play, RotateCcw, Users, GitBranch } from 'lucide-react';

const GraphTraversal = () => {
  const [nodes, setNodes] = useState([
    { id: 'A', x: 100, y: 100, visited: false },
    { id: 'B', x: 250, y: 100, visited: false },
    { id: 'C', x: 100, y: 250, visited: false },
    { id: 'D', x: 250, y: 250, visited: false },
    { id: 'E', x: 175, y: 175, visited: false },
  ]);
  
  const [edges, setEdges] = useState([
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'E', to: 'A' },
    { from: 'E', to: 'B' },
    { from: 'E', to: 'C' },
    { from: 'E', to: 'D' },
  ]);
  
  const [traversalType, setTraversalType] = useState<'BFS' | 'DFS'>('BFS');
  const [isRunning, setIsRunning] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [queueStack, setQueueStack] = useState<string[]>([]);

  const resetGraph = () => {
    setNodes(nodes.map(node => ({ ...node, visited: false })));
    setOrder([]);
    setQueueStack([]);
  };

  const simulateBFS = () => {
    resetGraph();
    setIsRunning(true);
    const startNode = 'A';
    const queue = [startNode];
    const visitedOrder: string[] = [];
    let step = 0;

    const interval = setInterval(() => {
      if (queue.length === 0) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      const current = queue.shift()!;
      visitedOrder.push(current);
      setOrder([...visitedOrder]);
      
      setQueueStack([...queue]);

      // Mark node as visited
      setNodes(prev => prev.map(node => 
        node.id === current ? { ...node, visited: true } : node
      ));

      // Add neighbors to queue
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => (edge.from === current ? edge.to : edge.from))
        .filter(id => !visitedOrder.includes(id) && !queue.includes(id));
      
      queue.push(...neighbors);
      
      step++;
    }, 1000);
  };

  const simulateDFS = () => {
    resetGraph();
    setIsRunning(true);
    const startNode = 'A';
    const stack = [startNode];
    const visitedOrder: string[] = [];
    let step = 0;

    const interval = setInterval(() => {
      if (stack.length === 0) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      const current = stack.pop()!;
      visitedOrder.push(current);
      setOrder([...visitedOrder]);
      
      setQueueStack([...stack]);

      // Mark node as visited
      setNodes(prev => prev.map(node => 
        node.id === current ? { ...node, visited: true } : node
      ));

      // Add neighbors to stack
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => (edge.from === current ? edge.to : edge.from))
        .filter(id => !visitedOrder.includes(id) && !stack.includes(id));
      
      stack.push(...neighbors.reverse());
      
      step++;
    }, 1000);
  };

  const startTraversal = () => {
    if (traversalType === 'BFS') {
      simulateBFS();
    } else {
      simulateDFS();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Graph Traversal</h3>
      </div>

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={() => setTraversalType('BFS')}
            className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
              traversalType === 'BFS' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" /> BFS
          </button>
          
          <button
            onClick={() => setTraversalType('DFS')}
            className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
              traversalType === 'DFS' ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            <GitBranch className="w-4 h-4" /> DFS
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={startTraversal}
            disabled={isRunning}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> Start {traversalType}
          </button>
          
          <button
            onClick={resetGraph}
            className="bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Visualization */}
        <div className="relative h-64 border rounded-lg bg-gray-50">
          {/* Draw edges */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <div
                key={idx}
                className="absolute h-0.5 bg-gray-300"
                style={{
                  left: fromNode.x,
                  top: fromNode.y + 15,
                  width: Math.sqrt(
                    Math.pow(toNode.x - fromNode.x, 2) + 
                    Math.pow(toNode.y - fromNode.y, 2)
                  ),
                  transform: `rotate(${Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)}rad)`,
                  transformOrigin: '0 0'
                }}
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                node.visited 
                  ? 'bg-green-500 border-green-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              style={{
                left: node.x - 24,
                top: node.y - 24,
              }}
            >
              <span className="font-bold">{node.id}</span>
            </div>
          ))}
        </div>

        {/* Traversal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Visited Order</div>
            <div className="font-mono">
              {order.length > 0 ? order.join(' → ') : 'Not started'}
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">
              {traversalType === 'BFS' ? 'Queue' : 'Stack'}
            </div>
            <div className="font-mono">
              {queueStack.length > 0 ? queueStack.join(', ') : 'Empty'}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How {traversalType} works:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {traversalType === 'BFS' ? 'Breadth-First Search' : 'Depth-First Search'}</li>
            <li>• {traversalType === 'BFS' ? 'Uses a Queue (FIFO)' : 'Uses a Stack (LIFO)'}</li>
            <li>• {traversalType === 'BFS' ? 'Explores neighbors first' : 'Explores depth first'}</li>
            <li>• Time Complexity: O(V + E)</li>
            <li>• Space Complexity: O(V)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GraphTraversal;