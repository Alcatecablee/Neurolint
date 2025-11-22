const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

class DemoTransformer {
  /**
   * Apply transformations to code based on detected layers
   */
  async transform(code, layers) {
    const appliedFixes = [];
    let transformedCode = code;
    
    try {
      // Parse code to AST
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      // Apply transformations for each layer
      if (layers.includes(2)) {
        this.applyLayer2Fixes(ast, appliedFixes);
      }
      
      if (layers.includes(3)) {
        this.applyLayer3Fixes(ast, appliedFixes);
      }
      
      if (layers.includes(4)) {
        this.applyLayer4Fixes(ast, appliedFixes);
      }

      // Generate transformed code
      const output = generate(ast, {
        retainLines: false,
        compact: false
      });
      
      transformedCode = output.code;
    } catch (error) {
      console.error('[DEMO-TRANSFORMER] Error:', error.message);
      // If transformation fails, try regex-based fallbacks
      transformedCode = this.applyRegexFallbacks(code, layers, appliedFixes);
    }

    return {
      code: transformedCode,
      appliedFixes
    };
  }

  /**
   * Layer 2: Pattern fixes (console.log removal, var to let - safer than const)
   */
  applyLayer2Fixes(ast, appliedFixes) {
    traverse(ast, {
      CallExpression(path) {
        // Remove console.log statements
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.object.name === 'console' &&
          path.node.callee.property.name === 'log'
        ) {
          path.remove();
          appliedFixes.push({
            type: 'console-removal',
            description: 'Removed console.log statement',
            layer: 2
          });
        }
      },
      VariableDeclaration(path) {
        // Convert var to let (safer than const since we don't know if it's reassigned)
        if (path.node.kind === 'var') {
          path.node.kind = 'let';
          appliedFixes.push({
            type: 'var-to-let',
            description: 'Converted var to let',
            layer: 2
          });
        }
      }
    });
  }

  /**
   * Layer 3: Component fixes (React keys, accessibility)
   */
  applyLayer3Fixes(ast, appliedFixes) {
    traverse(ast, {
      CallExpression(path) {
        // Add missing keys in .map() calls
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.property.name === 'map' &&
          path.node.arguments.length > 0
        ) {
          const callback = path.node.arguments[0];
          
          if (t.isArrowFunctionExpression(callback) || t.isFunctionExpression(callback)) {
            const body = callback.body;
            
            // Check if the return value is a JSX element
            let jsxElement = null;
            if (t.isJSXElement(body)) {
              jsxElement = body;
            } else if (t.isBlockStatement(body)) {
              // Find return statement with JSX
              const returnStmt = body.body.find(stmt => 
                t.isReturnStatement(stmt) && stmt.argument && t.isJSXElement(stmt.argument)
              );
              if (returnStmt) {
                jsxElement = returnStmt.argument;
              }
            } else if (body.type === 'JSXElement') {
              jsxElement = body;
            }

            // Add key prop if JSX element found and no key present
            if (jsxElement && jsxElement.openingElement) {
              const hasKey = jsxElement.openingElement.attributes.some(
                attr => t.isJSXAttribute(attr) && attr.name.name === 'key'
              );
              
              if (!hasKey) {
                let keyExpression = null;
                
                // Prefer index parameter if available (safer)
                if (callback.params.length >= 2 && t.isIdentifier(callback.params[1])) {
                  keyExpression = callback.params[1];
                } 
                // Fallback: use item.id only if first param is a simple identifier
                else if (callback.params.length >= 1 && t.isIdentifier(callback.params[0])) {
                  keyExpression = t.memberExpression(
                    callback.params[0],
                    t.identifier('id')
                  );
                }
                
                // Only add key if we have a safe expression
                if (keyExpression) {
                  const keyAttr = t.jsxAttribute(
                    t.jsxIdentifier('key'),
                    t.jsxExpressionContainer(keyExpression)
                  );
                  jsxElement.openingElement.attributes.push(keyAttr);
                  appliedFixes.push({
                    type: 'missing-key',
                    description: 'Added missing key prop in map iteration',
                    layer: 3
                  });
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Layer 4: Hydration fixes (typeof window checks for browser APIs)
   */
  applyLayer4Fixes(ast, appliedFixes) {
    traverse(ast, {
      VariableDeclarator(path) {
        // Wrap entire localStorage.getItem() calls in typeof window check
        if (
          path.node.init &&
          t.isCallExpression(path.node.init) &&
          t.isMemberExpression(path.node.init.callee) &&
          path.node.init.callee.object.name === 'localStorage' &&
          path.node.init.callee.property.name === 'getItem' &&
          !this.isAlreadyGuarded(path)
        ) {
          // Wrap: const x = localStorage.getItem('key')
          // Into: const x = typeof window !== 'undefined' ? localStorage.getItem('key') : null
          const check = t.conditionalExpression(
            t.binaryExpression(
              '!==',
              t.unaryExpression('typeof', t.identifier('window')),
              t.stringLiteral('undefined')
            ),
            path.node.init,
            t.nullLiteral()
          );
          
          path.node.init = check;
          appliedFixes.push({
            type: 'hydration-guard',
            description: 'Added typeof window check for SSR safety',
            layer: 4
          });
        }
      }
    });
  }

  /**
   * Check if a node is already guarded by typeof window check
   */
  isAlreadyGuarded(path) {
    let current = path.parentPath;
    while (current) {
      if (
        t.isConditionalExpression(current.node) &&
        current.node.test.type === 'BinaryExpression'
      ) {
        const test = current.node.test;
        if (
          test.left.type === 'UnaryExpression' &&
          test.left.operator === 'typeof' &&
          test.left.argument.name === 'window'
        ) {
          return true;
        }
      }
      if (t.isIfStatement(current.node)) {
        return true;
      }
      current = current.parentPath;
    }
    return false;
  }

  /**
   * Regex-based fallback transformations
   */
  applyRegexFallbacks(code, layers, appliedFixes) {
    let transformed = code;

    if (layers.includes(2)) {
      // Remove console.log statements
      const consolePattern = /console\.log\([^)]*\);?\s*/g;
      if (consolePattern.test(transformed)) {
        transformed = transformed.replace(consolePattern, '');
        appliedFixes.push({
          type: 'console-removal',
          description: 'Removed console.log statements',
          layer: 2
        });
      }

      // Convert var to let (safer than const)
      transformed = transformed.replace(/\bvar\b/g, 'let');
      if (code.includes('var ')) {
        appliedFixes.push({
          type: 'var-to-let',
          description: 'Converted var to let',
          layer: 2
        });
      }
    }

    if (layers.includes(4)) {
      // Add typeof window checks for localStorage
      if (code.includes('localStorage') && !code.includes('typeof window')) {
        transformed = transformed.replace(
          /localStorage\.getItem\((['"][^'"]+['"])\)/g,
          "typeof window !== 'undefined' ? localStorage.getItem($1) : null"
        );
        appliedFixes.push({
          type: 'hydration-guard',
          description: 'Added typeof window check for SSR safety',
          layer: 4
        });
      }
    }

    return transformed;
  }
}

module.exports = new DemoTransformer();
