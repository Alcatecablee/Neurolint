#!/usr/bin/env node

/**
 * NeuroLint - Licensed under Business Source License 1.1
 * Copyright (c) 2025 NeuroLint
 * Change Date: 2029-11-22 | Change License: GPL-3.0-or-later
 * Full license: https://github.com/Alcatecablee/Neurolint/blob/main/LICENSE
 */


const fs = require('fs').promises;
const path = require('path');
const BackupManager = require('../backup-manager');
const ASTTransformer = require('../ast-transformer');
const t = require('@babel/types');

/**
 * Layer 4: Hydration and SSR Fixes (AST-based)
 * - Add window/document guards using proper code parsing
 * - Add mounted state for theme providers
 * - Fix hydration mismatches in useEffect
 * - Handles nested parentheses correctly via AST
 */

async function isRegularFile(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

/**
 * Check if a node is already wrapped in SSR guard
 */
function isAlreadyGuarded(path, guardType = 'window') {
  let parent = path.parentPath;
  
  // Traverse up to find conditional expression
  while (parent) {
    if (t.isConditionalExpression(parent.node)) {
      const test = parent.node.test;
      // Check if it's a typeof guard
      if (t.isBinaryExpression(test) && 
          t.isUnaryExpression(test.left) && 
          test.left.operator === 'typeof') {
        
        const arg = test.left.argument;
        if (t.isIdentifier(arg)) {
          if (guardType === 'window' && arg.name === 'window') return true;
          if (guardType === 'document' && arg.name === 'document') return true;
        }
      }
    }
    parent = parent.parentPath;
  }
  return false;
}

/**
 * Wrap an expression with SSR guard
 */
function wrapWithSSRGuard(expression, guardType = 'window') {
  // Create: typeof window !== "undefined" ? expression : null
  return t.conditionalExpression(
    t.binaryExpression(
      '!==',
      t.unaryExpression('typeof', t.identifier(guardType)),
      t.stringLiteral('undefined')
    ),
    expression,
    t.nullLiteral()
  );
}

/**
 * Main AST-based hydration transform
 */
async function transform(code, options = {}) {
  const { dryRun = false, verbose = false, filePath = process.cwd() } = options;
  const results = [];
  let changeCount = 0;
  let updatedCode = code;

  try {
    // Create centralized backup
    const existsAsFile = await isRegularFile(filePath);
    if (existsAsFile && !dryRun) {
      try {
        const backupManager = new BackupManager({
          backupDir: '.neurolint-backups',
          maxBackups: 10
        });
        
        const backupResult = await backupManager.createBackup(filePath, 'layer-4-hydration');
        
        if (backupResult.success) {
          results.push({ type: 'backup', file: filePath, success: true, backupPath: backupResult.backupPath });
          if (verbose) process.stdout.write(`Created centralized backup: ${path.basename(backupResult.backupPath)}\n`);
        } else {
          if (verbose) process.stderr.write(`Warning: Could not create backup: ${backupResult.error}\n`);
        }
      } catch (error) {
        if (verbose) process.stderr.write(`Warning: Backup creation failed: ${error.message}\n`);
      }
    }

    // Check for empty input
    if (!code.trim()) {
      results.push({ type: 'empty', file: filePath, success: false, error: 'No changes were made' });
      return {
        success: false,
        code,
        originalCode: code,
        changeCount: 0,
        results
      };
    }

    // File type check
    const fileExt = path.extname(filePath).slice(1);
    if (!['ts', 'tsx', 'js', 'jsx'].includes(fileExt)) {
      return {
        success: true,
        code,
        originalCode: code,
        changeCount: 0,
        results
      };
    }

    // Create AST transformer
    const transformer = new ASTTransformer();
    const changes = [];

    // Define AST visitors for Layer 4 hydration fixes
    const visitors = {
      // Handle localStorage, sessionStorage calls
      MemberExpression(path) {
        // Check for localStorage/sessionStorage method calls
        if (t.isIdentifier(path.node.object)) {
          const objName = path.node.object.name;
          const propName = path.node.property.name;
          
          // localStorage.getItem, setItem, removeItem, etc.
          if ((objName === 'localStorage' || objName === 'sessionStorage') &&
              ['getItem', 'setItem', 'removeItem', 'clear'].includes(propName)) {
            
            // Only wrap if it's part of a call expression
            if (t.isCallExpression(path.parent) && path.parent.callee === path.node) {
              // Check if already guarded
              if (!isAlreadyGuarded(path.parentPath, 'window')) {
                // Wrap the entire CallExpression
                const callExpr = path.parentPath.node;
                const guarded = wrapWithSSRGuard(callExpr, 'window');
                path.parentPath.replaceWith(guarded);
                
                changes.push({
                  type: 'storage-guard',
                  description: `Added SSR guard for ${objName}.${propName}()`,
                  location: path.node.loc
                });
                changeCount++;
                
                if (verbose) {
                  process.stdout.write(`[INFO] Added SSR guard for ${objName}.${propName}()\n`);
                }
              }
            }
          }
          
          // window.matchMedia, window.location, etc.
          if (objName === 'window' && 
              ['matchMedia', 'location', 'navigator', 'innerWidth', 'innerHeight', 'scrollY', 'scrollX'].includes(propName)) {
            
            // Don't guard addEventListener/removeEventListener here (handled separately)
            if (['addEventListener', 'removeEventListener'].includes(propName)) {
              return;
            }
            
            if (!isAlreadyGuarded(path, 'window')) {
              // Check if this is part of an assignment's left-hand side
              let currentPath = path;
              let isAssignmentLHS = false;
              
              while (currentPath.parentPath) {
                if (t.isAssignmentExpression(currentPath.parent) && 
                    currentPath.node === currentPath.parent.left) {
                  isAssignmentLHS = true;
                  break;
                }
                if (t.isMemberExpression(currentPath.parent) || 
                    (t.isCallExpression(currentPath.parent) && currentPath.parent.callee === currentPath.node)) {
                  currentPath = currentPath.parentPath;
                } else {
                  break;
                }
              }
              
              if (isAssignmentLHS) {
                // Skip: Cannot guard assignment LHS as it produces invalid code
                // The assignment will fail gracefully on SSR
                return;
              }
              
              // Find the outermost expression in the chain to wrap
              let topPath = path;
              while (topPath.parentPath && 
                     (t.isMemberExpression(topPath.parent) || 
                      (t.isCallExpression(topPath.parent) && topPath.parent.callee === topPath.node))) {
                topPath = topPath.parentPath;
              }
              
              // Wrap the entire chain
              const guarded = wrapWithSSRGuard(topPath.node, 'window');
              topPath.replaceWith(guarded);
              
              changes.push({
                type: 'window-guard',
                description: `Added SSR guard for window.${propName} chain`,
                location: path.node.loc
              });
              changeCount++;
              
              if (verbose) {
                process.stdout.write(`[INFO] Added SSR guard for window.${propName} chain\n`);
              }
            }
          }
          
          // document.querySelector, document.getElementById, etc.
          if (objName === 'document' && 
              ['querySelector', 'querySelectorAll', 'getElementById', 'getElementsByClassName', 
               'getElementsByTagName', 'body', 'documentElement', 'head'].includes(propName)) {
            
            if (!isAlreadyGuarded(path, 'document')) {
              // Check if this is part of an assignment's left-hand side
              let currentPath = path;
              let isAssignmentLHS = false;
              
              while (currentPath.parentPath) {
                if (t.isAssignmentExpression(currentPath.parent) && 
                    currentPath.node === currentPath.parent.left) {
                  isAssignmentLHS = true;
                  break;
                }
                if (t.isMemberExpression(currentPath.parent) || 
                    (t.isCallExpression(currentPath.parent) && currentPath.parent.callee === currentPath.node)) {
                  currentPath = currentPath.parentPath;
                } else {
                  break;
                }
              }
              
              if (isAssignmentLHS) {
                // Skip: Cannot guard assignment LHS as it produces invalid code
                // The assignment will fail gracefully on SSR
                return;
              }
              
              // Find the outermost expression in the chain to wrap
              let topPath = path;
              while (topPath.parentPath && 
                     (t.isMemberExpression(topPath.parent) || 
                      (t.isCallExpression(topPath.parent) && topPath.parent.callee === topPath.node))) {
                topPath = topPath.parentPath;
              }
              
              // Wrap the entire chain
              const guarded = wrapWithSSRGuard(topPath.node, 'document');
              topPath.replaceWith(guarded);
              
              changes.push({
                type: 'document-guard',
                description: `Added SSR guard for document.${propName} chain`,
                location: path.node.loc
              });
              changeCount++;
              
              if (verbose) {
                process.stdout.write(`[INFO] Added SSR guard for document.${propName} chain\n`);
              }
            }
          }
        }
      },
      
      // Handle useEffect with addEventListener that needs cleanup
      CallExpression(path) {
        // Look for useEffect calls
        if (t.isIdentifier(path.node.callee, { name: 'useEffect' })) {
          const effectCallback = path.node.arguments[0];
          
          if (t.isArrowFunctionExpression(effectCallback) || t.isFunctionExpression(effectCallback)) {
            const body = effectCallback.body;
            
            // Track if we found addEventListener without cleanup
            let hasAddEventListener = false;
            let hasRemoveEventListener = false;
            let hasReturnCleanup = false;
            
            // Check body for addEventListener
            const checkBody = (node) => {
              if (t.isBlockStatement(node)) {
                node.body.forEach(statement => {
                  // Check for addEventListener
                  if (t.isExpressionStatement(statement) && 
                      t.isCallExpression(statement.expression)) {
                    const call = statement.expression;
                    if (t.isMemberExpression(call.callee)) {
                      const method = call.callee.property;
                      if (t.isIdentifier(method, { name: 'addEventListener' })) {
                        hasAddEventListener = true;
                      }
                    }
                  }
                  
                  // Check for return cleanup function
                  if (t.isReturnStatement(statement) && 
                      (t.isArrowFunctionExpression(statement.argument) || 
                       t.isFunctionExpression(statement.argument))) {
                    hasReturnCleanup = true;
                    
                    // Check if cleanup has removeEventListener
                    const cleanupBody = statement.argument.body;
                    if (t.isBlockStatement(cleanupBody)) {
                      cleanupBody.body.forEach(cleanupStmt => {
                        if (t.isExpressionStatement(cleanupStmt) && 
                            t.isCallExpression(cleanupStmt.expression)) {
                          const call = cleanupStmt.expression;
                          if (t.isMemberExpression(call.callee) && 
                              t.isIdentifier(call.callee.property, { name: 'removeEventListener' })) {
                            hasRemoveEventListener = true;
                          }
                        }
                      });
                    }
                  }
                });
              }
            };
            
            checkBody(body);
            
            // If we have addEventListener but no cleanup, add warning
            if (hasAddEventListener && !hasReturnCleanup) {
              changes.push({
                type: 'event-listener-warning',
                description: 'useEffect with addEventListener should return cleanup function',
                location: path.node.loc
              });
              
              if (verbose) {
                process.stdout.write('[WARNING] useEffect with addEventListener missing cleanup\n');
              }
            }
          }
        }
      }
    };

    // Apply AST transformations
    try {
      const result = transformer.transform(code, visitors, { filename: filePath });
      updatedCode = result.code;
      
      results.push(...changes.map(c => ({
        type: 'hydration',
        file: filePath,
        success: true,
        changes: 1,
        details: c.description
      })));
    } catch (error) {
      if (verbose) process.stderr.write(`AST transformation error: ${error.message}\n`);
      // Fall back to original code if AST fails
      return {
        success: false,
        code,
        originalCode: code,
        changeCount: 0,
        results: [{ type: 'error', file: filePath, success: false, error: error.message }]
      };
    }

    // Write changes if not dry-run
    if (dryRun) {
      return {
        success: true,
        code: updatedCode,
        originalCode: code,
        changeCount,
        results
      };
    }

    if (changeCount > 0 && existsAsFile) {
      await fs.writeFile(filePath, updatedCode);
      results.push({ type: 'write', file: filePath, success: true, changes: changeCount });
    }

    if (verbose && changeCount > 0) {
      process.stdout.write(`Layer 4 applied ${changeCount} changes to ${path.basename(filePath)}\n`);
    }

    return {
      success: results.every(r => r.success !== false),
      code: updatedCode,
      originalCode: code,
      changeCount,
      results
    };
  } catch (error) {
    if (verbose) process.stderr.write(`Layer 4 failed: ${error.message}\n`);
    results.push({ type: 'error', file: filePath, success: false, error: error.message });
    return {
      success: false,
      code,
      originalCode: code,
      changeCount: 0,
      results
    };
  }
}

module.exports = { transform };
