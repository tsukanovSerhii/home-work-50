import React, { useState, useMemo, useCallback } from 'react';

const ExpensiveTask = ({ number }) => {
  const computeStart = performance.now();
  
  const calculatedResult = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 50000000; i++) {
      sum += i;
    }
    return sum + number;
  }, [number]);
  
  const computeEnd = performance.now();
  
  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      <h2 className="text-2xl font-bold border-b border-white/10 pb-3 mb-2 text-white">useMemo Demo</h2>
      <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
        <span className="text-slate-400">Calculated Result:</span>
        <span className="text-xl font-bold text-emerald-400">{calculatedResult}</span>
      </div>
      <div className="font-mono text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg text-center border border-amber-400/20">
        Compute Time: {(computeEnd - computeStart).toFixed(2)} ms
      </div>
      <p className="text-sm text-slate-400 mt-auto leading-relaxed">
        The calculation only runs when the "Target Number" changes. 
        Try incrementing the "Unrelated State" and notice how the compute time stays extremely low (near 0ms) because the result is memoized!
      </p>
    </div>
  );
};

const MemoizedChild = React.memo(({ onAction, items }) => {
  const renderStart = performance.now();
  let temp = 0;
  for (let i = 0; i < 10000000; i++) { temp += i; }
  const renderEnd = performance.now();
  
  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
      <h2 className="text-2xl font-bold border-b border-white/10 pb-3 mb-2 text-white">React.memo & useCallback</h2>
      <ul className="list-none max-h-[150px] overflow-y-auto border border-white/10 rounded-xl p-2 bg-black/10 custom-scrollbar">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center p-3 border-b border-white/10 text-white last:border-none animate-[slideIn_0.3s_ease]">
            <span className="text-purple-500 mr-3">→</span> {item}
          </li>
        ))}
      </ul>
      <button onClick={onAction} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
        Add Item
      </button>
      <div className="font-mono text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg text-center border border-amber-400/20">
        Child Render Time: {(renderEnd - renderStart).toFixed(2)} ms
      </div>
      <p className="text-sm text-slate-400 mt-auto leading-relaxed">
        This component is wrapped in <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded">React.memo</code>. Because we use <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded">useCallback</code> for the button action, the parent can re-render without causing this child to re-render.
      </p>
    </div>
  );
});

export const OptimizationDemo = () => {
  const [unrelatedState, setUnrelatedState] = useState(0);
  const [targetNumber, setTargetNumber] = useState(5);
  const [items, setItems] = useState(['Optimized Item 1', 'Optimized Item 2']);

  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, `Optimized Item ${prev.length + 1}`]);
  }, []); 

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.8s_ease-out] w-full max-w-5xl mx-auto">
      <header className="text-center mb-2">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">React Optimization</h1>
        <p className="text-slate-400 text-lg">Harnessing the power of useMemo, useCallback, and React.memo</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-white">Unrelated State Control</h3>
          <p className="text-slate-400 text-sm mb-4 min-h-[40px]">Changing this state forces the parent to re-render. Watch the child components resist the update!</p>
          <div className="flex items-center gap-4 mt-auto">
            <span className="text-lg font-semibold bg-white/5 py-2 px-4 rounded-xl border border-white/10 min-w-[140px] text-center text-white">Counter: {unrelatedState}</span>
            <button onClick={() => setUnrelatedState(s => s + 1)} className="bg-transparent border border-blue-500 text-white hover:bg-blue-500/10 font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              Increment Unrelated State
            </button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-2 text-white">Dependency Controls</h3>
          <p className="text-slate-400 text-sm mb-4 min-h-[40px]">Update the dependencies to see the components recalculate and re-render.</p>
          <div className="flex items-center gap-4 mt-auto">
            <button onClick={() => setTargetNumber(n => n + 1)} className="bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:brightness-110 font-semibold py-2.5 px-5 rounded-xl shadow-[0_4px_12px_rgba(139,92,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              Increment Target Number ({targetNumber})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpensiveTask number={targetNumber} />
        <MemoizedChild onAction={handleAddItem} items={items} />
      </div>
    </div>
  );
};
