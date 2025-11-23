/**
 * Comprehensive test cases for AST-based console.log removal in arrow functions
 * Tests all edge cases that regex-based approach couldn't handle reliably
 */

// Test Case 1: Expression-bodied arrow with no parameters
const handler1 = () => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 2: Expression-bodied arrow with single parameter (no parens)
const handler2 = value => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 3: Expression-bodied arrow with single parameter (with parens)
const handler3 = value => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 4: Expression-bodied arrow with multiple parameters
const handler4 = (a, b) => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 5: Block-bodied arrow with ONLY console.log
const handler5 = () => {};

// Test Case 6: Block-bodied arrow with console.log AND other statements (should NOT be empty block)
const handler6 = () => {
  return 'value';
};

// Test Case 7: Nested arrow functions
const handler7 = () => {
  const inner = () => {} /* [NeuroLint] Removed console.log()*/;
  return inner;
};

// Test Case 8: Arrow function in array
const handlers = [() => {} /* [NeuroLint] Removed console.log()*/, x => {} /* [NeuroLint] Removed console.log()*/, value => {} /* [NeuroLint] Removed console.log()*/];

// Test Case 9: Arrow function as callback
setTimeout(() => {} /* [NeuroLint] Removed console.log()*/, 1000);
array.map(item => {} /* [NeuroLint] Removed console.log()*/);
array.forEach(x => {} /* [NeuroLint] Removed console.log()*/);

// Test Case 10: Console variants (info, warn, error, debug)
const logInfo = () => {} /* [NeuroLint] Removed console.info()*/;
const logWarn = () => {} /* [NeuroLint] Removed console.warn()*/;
const logError = () => {} /* [NeuroLint] Removed console.error()*/;
const logDebug = () => {} /* [NeuroLint] Removed console.debug()*/;

// Test Case 11: Console.log in ternary expression (should replace with undefined)
const result = condition ? undefined : 'no';

// Test Case 12: Console.log in logical expression (should replace with undefined)
const value = flag && undefined;

// Test Case 13: Console.log as standalone statement (should be removed)

// Test Case 14: Alert/confirm/prompt in arrow functions
const alertHandler = () => {} /* [NeuroLint] Removed alert()*/;
const confirmHandler = () => {} /* [NeuroLint] Removed confirm()*/;
const promptHandler = () => {} /* [NeuroLint] Removed prompt()*/;

// Test Case 15: Complex expression arrow (console.log with operators)
const complex = () => undefined || undefined;

// Test Case 16: Arrow with destructured params
const destructured = ({
  name,
  age
}) => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 17: Arrow with rest params
const rest = (...args) => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 18: Arrow with default params
const defaults = (name = 'unknown') => {} /* [NeuroLint] Removed console.log()*/;

// Test Case 19: Immediately invoked arrow function
(() => {} /* [NeuroLint] Removed console.log()*/)();

// Test Case 20: Arrow returning arrow with console.log
const curried = x => y => {} /* [NeuroLint] Removed console.log()*/;