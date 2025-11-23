/**
 * Test file for enhanced-react19-dom.js script
 * Tests React 19 DOM API transformations
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom/test-utils';

function App() {
  return <div>Hello World</div>;
}

// Test 1: ReactDOM.render (should convert to createRoot)
ReactDOM.render(<App />, document.getElementById('root'));

// Test 2: ReactDOM.hydrate (should convert to hydrateRoot)
ReactDOM.hydrate(<App />, document.getElementById('root'));

// Test 3: Multiple render calls (should generate unique root variables)
ReactDOM.render(<App />, document.getElementById('root1'));
ReactDOM.render(<App />, document.getElementById('root2'));

// Test 4: unmountComponentAtNode (should warn)
ReactDOM.unmountComponentAtNode(document.getElementById('root'));

// Test 5: findDOMNode (should warn)
const node = ReactDOM.findDOMNode(this);
