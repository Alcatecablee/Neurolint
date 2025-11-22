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

/**
 * Layer 4: Hydration and SSR Fixes
 * - Add window/document guards
 * - Add mounted state for theme providers
 * - Fix hydration mismatches in useEffect
 */
async function isRegularFile(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function transform(code, options = {}) {
  const { dryRun = false, verbose = false, filePath = process.cwd() } = options;
  const results = [];
  let changeCount = 0;
  let updatedCode = code;

  try {
    // Create centralized backup if it exists and is regular file
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

    // Phase 3: Enhanced Hydration Fixes (Layer 4)
    const hydrationFixes = [
      // Phase 3: Enhanced LocalStorage SSR Guard
      // Only apply if not already wrapped
      {
        name: 'LocalStorage SSR Guard',
        pattern: /(?<!typeof window !== "undefined" \? )localStorage\.(getItem|setItem|removeItem)\(([^)]+)\)/g,
        replacement: (match, method, args) => {
          // Check if already wrapped
          if (updatedCode.includes(`typeof window !== "undefined" ? ${match}`)) {
            return match;
          }
          return `(typeof window !== "undefined" ? localStorage.${method}(${args}) : null)`;
        },
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      },
      
      // Phase 3: Enhanced Window SSR Guard (only window.matchMedia, not window.addEventListener)
      {
        name: 'Window SSR Guard',
        pattern: /(?<!typeof window !== "undefined" \? )window\.matchMedia\s*\(\s*(['"`])([^'"`]+)\1\s*\)/g,
        replacement: (match, quote, query) => {
          // Check if already wrapped
          if (updatedCode.includes(`typeof window !== "undefined" ? ${match}`)) {
            return match;
          }
          return `(typeof window !== "undefined" ? window.matchMedia(${quote}${query}${quote}) : null)`;
        },
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      },
      
      // Phase 3: Enhanced Document SSR Guard  
      {
        name: 'Document SSR Guard',
        pattern: /(?<!typeof document !== "undefined" \? )document\.(documentElement|body|querySelector|querySelectorAll|getElementById)\b(\([^)]*\))?/g,
        replacement: (match, method, call = '') => {
          // Check if already wrapped
          if (updatedCode.includes(`typeof document !== "undefined" ? ${match}`)) {
            return match;
          }
          return `(typeof document !== "undefined" ? document.${method}${call} : null)`;
        },
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      },
      
      // Phase 3: Add proper useEffect cleanup for event listeners
      {
        name: 'useEffect Cleanup',
        pattern: /(useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?)(window\.)?addEventListener\s*\(\s*(['"][\w-]+['"])\s*,\s*(\w+)\s*\)\s*;?\s*([\s\S]*?\}\s*,\s*\[[^\]]*\]\s*\))/gm,
        replacement: (match, beforeAdd, windowPrefix, event, handler, afterAdd) => {
          // Check if cleanup already exists
          if (match.includes(`removeEventListener(${event}, ${handler})`)) {
            return match;
          }
          // Add cleanup return statement
          const prefix = windowPrefix || '';
          return `${beforeAdd}${prefix}addEventListener(${event}, ${handler});
    return () => ${prefix}removeEventListener(${event}, ${handler});${afterAdd}`;
        },
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      },
    ];

    // Phase 3: Enhanced hydration pattern detection
    const hydrationPatterns = [
      // Phase 3: Detect hydration mismatches
      {
        pattern: /useState\s*\(\s*localStorage\.getItem\s*\([^)]+\)\s*\)/g,
        description: 'Direct localStorage usage in useState can cause hydration mismatches'
      },
      {
        pattern: /window\./g,
        description: 'Direct window usage without SSR guards'
      },
      {
        pattern: /document\./g,
        description: 'Direct document usage without SSR guards'
      },
      {
        pattern: /addEventListener\s*\([^)]+\)/g,
        description: 'Event listeners without cleanup can cause memory leaks'
      }
    ];

    // Phase 3: Apply enhanced hydration fixes
    const fileExt = path.extname(filePath).slice(1);
    let hydrationChanges = 0;
    
    hydrationFixes.forEach(fix => {
      if (fix.fileTypes.includes(fileExt)) {
        const matches = updatedCode.match(fix.pattern) || [];
        if (matches.length) {
          updatedCode = updatedCode.replace(fix.pattern, fix.replacement);
          hydrationChanges += matches.length;
          results.push({
            type: 'hydration',
            file: filePath,
            success: true,
            changes: matches.length,
            details: `Applied ${fix.name}`
          });
          if (verbose) {
            process.stdout.write(`[INFO] Applied Phase 3 hydration fix: ${fix.name}\n`);
          }
        }
      }
    });

    // Phase 3: Detect and warn about hydration issues
    hydrationPatterns.forEach(pattern => {
      const matches = updatedCode.match(pattern.pattern) || [];
      if (matches.length > 0) {
        results.push({
          type: 'hydration-warning',
          file: filePath,
          success: true,
          changes: 0,
          details: `Detected ${matches.length} potential hydration issues: ${pattern.description}`
        });
        if (verbose) {
          process.stdout.write(`[WARNING] Potential hydration issue: ${pattern.description}\n`);
        }
      }
    });

    changeCount += hydrationChanges;

    // Enhanced SSR Guards and Hydration Safety Patterns (Next.js 15.5 + Community patterns)
    const enhancedHydrationFixes = [
      {
        name: 'Theme Provider SSR Guard',
        pattern: /document\.documentElement\.classList\.(add|remove|toggle)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
        replacement: (match, method, className) => 
          `typeof document !== "undefined" ? document.documentElement.classList.${method}('${className}') : null`,
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      },
      {
        name: 'Event Listener SSR Guard',
        pattern: /(?<!window\.)(?<!typeof window !== "undefined" \? )(addEventListener|removeEventListener)\s*\(\s*([^,]+),\s*([^)]+)\s*\)/g,
        replacement: (match, method, event, handler) => {
          // Don't wrap if it's already inside a guard or if window. prefix exists
          if (updatedCode.includes(`typeof window !== "undefined" ? ${match}`)) {
            return match;
          }
          return `(typeof window !== "undefined" ? ${method}(${event}, ${handler}) : null)`;
        },
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      },
      {
        name: 'Timeout/Interval SSR Guard',
        pattern: /(setTimeout|setInterval)\s*\(\s*([^,]+)(?:,\s*([^)]+))?\s*\)/g,
        replacement: (match, method, callback, delay) => 
          `typeof window !== "undefined" ? ${method}(${callback}${delay ? `, ${delay}` : ''}) : null`,
        fileTypes: ['ts', 'tsx', 'js', 'jsx']
      }
    ];

    enhancedHydrationFixes.forEach(fix => {
      if (fix.fileTypes.includes(fileExt)) {
        const matches = updatedCode.match(fix.pattern) || [];
        if (matches.length) {
          updatedCode = updatedCode.replace(fix.pattern, fix.replacement);
          changeCount += matches.length;
          results.push({
            type: 'enhanced-hydration',
            file: filePath,
            success: true,
            changes: matches.length,
            details: `Applied ${fix.name}`
          });
        }
      }
    });

    // Theme Provider Hydration
    if (fileExt === 'tsx' && updatedCode.includes('ThemeProvider') && !updatedCode.includes('mounted')) {
      const mountedStatePattern = /const \[theme, setTheme\] = useState<Theme>\('light'\);/;
      if (mountedStatePattern.test(updatedCode)) {
        updatedCode = updatedCode.replace(
          mountedStatePattern,
          `const [theme, setTheme] = useState<Theme>('light');\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => {\n    setMounted(true);\n  }, []);`
        ).replace(
          /return \(\s*<ThemeContext\.Provider/,
          `if (!mounted) {\n    return <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>{children}</ThemeContext.Provider>;\n  }\n\n  return (\n    <ThemeContext.Provider`
        );
        changeCount++;
        results.push({
          type: 'theme_provider',
          file: filePath,
          success: true,
          changes: 1,
          details: 'Added mounted state to ThemeProvider'
        });
      }
    }

    // Add 'use client' directive for client-only components
    if (fileExt === 'tsx' && updatedCode.includes('useTheme') && !updatedCode.includes("'use client'")) {
      updatedCode = "'use client';\n\n" + updatedCode;
      changeCount++;
      results.push({
        type: 'client_directive',
        file: filePath,
        success: true,
        changes: 1,
        details: "Added 'use client' directive"
      });
    }

    if (dryRun) {
      return {
        success: true,
        code: updatedCode,
        originalCode: code,
        changeCount,
        results
      };
    }

    // Write changes if not dry-run
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