"use client";

import React from 'react';

// Test aliased hooks from destructuring
const {
  useState: useCount,
  useEffect: useLifecycle
} = React;
export default function Counter() {
  const [count, setCount] = useCount(0);
  useLifecycle(() => {
    // [NeuroLint] Removed console.log: 'Component mounted'
  }, []);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}