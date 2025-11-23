/**
 * Comprehensive test cases for AST-based console.log removal in arrow functions
 * Tests all edge cases that regex-based approach couldn't handle reliably
 */

// Test Case 1: Expression-bodied arrow with no parameters
const handler1 = () => console.log('test');

// Test Case 2: Expression-bodied arrow with single parameter (no parens)
const handler2 = value => console.log(value);

// Test Case 3: Expression-bodied arrow with single parameter (with parens)
const handler3 = (value) => console.log(value);

// Test Case 4: Expression-bodied arrow with multiple parameters
const handler4 = (a, b) => console.log(a, b);

// Test Case 5: Block-bodied arrow with ONLY console.log
const handler5 = () => {
  console.log('only statement');
};

// Test Case 6: Block-bodied arrow with console.log AND other statements (should NOT be empty block)
const handler6 = () => {
  console.log('logging');
  return 'value';
};

// Test Case 7: Nested arrow functions
const handler7 = () => {
  const inner = () => console.log('nested');
  return inner;
};

// Test Case 8: Arrow function in array
const handlers = [
  () => console.log('first'),
  (x) => console.log(x),
  value => console.log(value)
];

// Test Case 9: Arrow function as callback
setTimeout(() => console.log('timeout'), 1000);
array.map(item => console.log(item));
array.forEach(x => console.log(x));

// Test Case 10: Console variants (info, warn, error, debug)
const logInfo = () => console.info('info');
const logWarn = () => console.warn('warning');
const logError = () => console.error('error');
const logDebug = () => console.debug('debug');

// Test Case 11: Console.log in ternary expression (should replace with undefined)
const result = condition ? console.log('yes') : 'no';

// Test Case 12: Console.log in logical expression (should replace with undefined)
const value = flag && console.log('flag is true');

// Test Case 13: Console.log as standalone statement (should be removed)
console.log('standalone statement');

// Test Case 14: Alert/confirm/prompt in arrow functions
const alertHandler = () => alert('message');
const confirmHandler = () => confirm('Are you sure?');
const promptHandler = () => prompt('Enter value:');

// Test Case 15: Complex expression arrow (console.log with operators)
const complex = () => console.log('a') || console.log('b');

// Test Case 16: Arrow with destructured params
const destructured = ({ name, age }) => console.log(name, age);

// Test Case 17: Arrow with rest params
const rest = (...args) => console.log(args);

// Test Case 18: Arrow with default params
const defaults = (name = 'unknown') => console.log(name);

// Test Case 19: Immediately invoked arrow function
(() => console.log('IIFE'))();

// Test Case 20: Arrow returning arrow with console.log
const curried = (x) => (y) => console.log(x, y);
