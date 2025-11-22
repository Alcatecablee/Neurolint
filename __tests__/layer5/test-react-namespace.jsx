"use client";

import React from 'react';

// Test React.useState() namespace calls
export default function Counter() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    // [NeuroLint] Removed console.log: 'Count changed:', count
  }, [count]);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}