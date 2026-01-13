import React, { useState } from 'react';
import { TreePine, Search, Plus, Minus, RotateCcw } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  depth: number;
  x: number;
  y: number;
}

const BinarySearchTree = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [operations, setOperations] = useState<string[]>([]);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  const insertNode = (root: TreeNode | null, value: number, depth: number = 0): TreeNode => {
    if (!root) {
      return { value, left: null, right: null, depth, x: 0, y: 0 };
    }
    
    if (value < root.value) {
      root.left = insertNode(root.left, value, depth + 1);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value, depth + 1);
    }
    
    return root;
  };

  const findNode = (root: TreeNode | null, value: number): boolean => {
    if (!root) return false;
    
    setOperations(prev => [...prev, `Visiting node ${root.value}`]);
    
    if (root.value === value) return true;
    if (value < root.value) return findNode(root.left, value);
    return findNode(root.right, value);
  };

  const handleInsert = () => {
    const value = parseInt(currentValue);
    if (isNaN(value)) return;
    
    setTree(prev => insertNode(prev, value));
    setOperations(prev => [...prev, `Inserted ${value} into BST`]);
    setCurrentValue('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;
    
    setOperations([]);
    const found = findNode(tree, value);
    setOperations(prev => [...prev, found ? `✅ Found ${value}!` : `❌ ${value} not found`]);
  };

  const resetTree = () => {
    setTree(null);
    setOperations([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <TreePine className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-800">Binary Search Tree</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Enter value"
            className="flex-1 p-2 border rounded"
          />
          <button onClick={handleInsert} className="bg-green-600 text-white px-4 rounded flex items-center gap-2">
            <Plus className="w-4 h-4" /> Insert
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value"
            className="flex-1 p-2 border rounded"
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 rounded flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>

        <button onClick={resetTree} className="w-full bg-gray-600 text-white p-2 rounded flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset Tree
        </button>

        <div className="border rounded p-4 h-48 overflow-auto">
          <h4 className="font-semibold mb-2">Operations:</h4>
          {operations.map((op, idx) => (
            <div key={idx} className="text-sm p-2 border-b">{op}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BinarySearchTree;