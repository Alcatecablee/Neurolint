/**
 * Test file for react192-feature-detector.js
 * Tests detection of React 19.2 feature opportunities
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { animated, useSpring } from 'react-spring';

// Test 1: Manual animations (should detect View Transitions opportunity)
function Component1() {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  return <animated.div style={props}>Fade in</animated.div>;
}

// Test 2: useEffect with callbacks (should detect useEffectEvent opportunity)
function Component2({ onClick }) {
  useEffect(() => {
    // Non-reactive callback in useEffect
    onClick();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps
  
  return <div>Component</div>;
}

// Test 3: Hidden components (should detect Activity component opportunity)
function Component3({ isVisible }) {
  return (
    <div style={{ display: isVisible ? 'block' : 'none' }}>
      <ExpensiveComponent />
    </div>
  );
}

// Test 4: Conditional rendering with hidden state
function Component4({ show }) {
  return (
    <>
      {show ? <div>Visible</div> : null}
      <div hidden={!show}>Also visible</div>
    </>
  );
}

// Test 5: Navigation with animation
function Component5() {
  const router = useRouter();
  
  const navigate = () => {
    // Manual animation before navigation
    animateOut().then(() => {
      router.push('/next-page');
    });
  };
  
  return <button onClick={navigate}>Navigate</button>;
}
