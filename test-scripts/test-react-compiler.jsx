/**
 * Test file for react-compiler-detector.js
 * Tests detection of manual memoization patterns
 */

import React, { useMemo, useCallback, memo, useRef, useEffect } from 'react';

// Test 1: useMemo (should be detected)
function Component1() {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue();
  }, []);
  
  return <div>{expensiveValue}</div>;
}

// Test 2: useCallback (should be detected)
function Component2({ onClick }) {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);
  
  return <button onClick={handleClick}>Click</button>;
}

// Test 3: React.memo (should be detected)
const MemoizedComponent = memo(function MyComponent({ value }) {
  return <div>{value}</div>;
});

// Test 4: useRef for previous values (should be detected)
function Component4() {
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  return null;
}

// Test 5: Multiple empty dependency arrays (should be detected)
function Component5() {
  useEffect(() => {}, []);
  useEffect(() => {}, []);
  useEffect(() => {}, []);
  useEffect(() => {}, []);
  
  return null;
}
