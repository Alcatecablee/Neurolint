# NeuroLint CLI Usage Guide

## What is NeuroLint?

NeuroLint is a deterministic code analysis and transformation tool for TypeScript, JavaScript, React, and Next.js projects. It uses rule-based intelligence (not AI) to automatically detect and fix common code issues across 7 specialized layers.

## Origin Story

Born from frustration when a project had 700+ ESLint errors, hydration bugs, and missing React keys. Instead of fixing manually, an intelligent multi-layer fixing system was created that reduced 600+ issues down to just 70 - and NeuroLint was born.

## Installation

```bash
npm install -g @neurolint/cli
```

## 🆓 Free vs 💳 Paid Tiers

**IMPORTANT**: NeuroLint has a freemium model. Understand what's free before getting started.

### Free Tier (No Authentication Required)

**Layers 1-2** are completely free and work without an account:

#### Layer 1: Configuration Fixes
- TypeScript configuration (tsconfig.json)
- Next.js configuration (next.config.js)
- Package.json optimization
- ✅ **FREE - No auth required**

#### Layer 2: Pattern Fixes
- HTML entity corruption (`&quot;`, `&#x27;`, `&amp;`)
- Unused imports cleanup
- Console.log removal
- React pattern standardization
- ✅ **FREE - No auth required**

### Paid Tier (Requires Authentication)

**Layers 3-7** require an API key from https://app.neurolint.dev

#### Layer 3: Component Fixes
- Missing React keys in .map()
- Button variant props
- Missing aria-labels
- Image alt attributes
- Form field structure
- 💳 **REQUIRES AUTHENTICATION**

#### Layer 4: Hydration & SSR Fixes
- localStorage without SSR guards
- window/document access protection
- Theme provider hydration mismatches
- Client-only component wrapping
- 💳 **REQUIRES AUTHENTICATION**

#### Layer 5: Next.js App Router Fixes
- "use client" directive placement
- Server vs client component detection
- App Router optimizations
- 💳 **REQUIRES AUTHENTICATION**

#### Layer 6: Testing & Validation
- Test file generation
- Missing test coverage detection
- Quality improvements
- 💳 **REQUIRES AUTHENTICATION**

#### Layer 7: Adaptive Pattern Learning
- Learns from your codebase
- Custom rule generation
- Pattern recognition and application
- 💳 **REQUIRES AUTHENTICATION**

## Quick Start (Free Tier)

### Try It Without Authentication

```bash
# Install globally
npm install -g @neurolint/cli

# Analyze your project (works without auth)
neurolint analyze src/

# Fix free tier issues (layers 1-2)
neurolint fix src/ --layers=1,2 --verbose

# Preview what free tier can fix
neurolint fix src/ --layers=1,2 --dry-run
```

### What Free Tier Actually Fixes

**Example Before:**
```tsx
function Component() {
  console.log('Debug info');
  return <div>&quot;Hello&quot;</div>;
}
```

**Example After (Free Tier):**
```tsx
function Component() {
  // [NeuroLint] Removed console.log: 'Debug info'
  return <div>"Hello"</div>;
}
```

**What Free Tier DOES NOT Fix:**
- ❌ Missing React keys
- ❌ Hydration issues (localStorage, window access)
- ❌ Missing accessibility attributes
- ❌ "use client" directives

## Authentication (For Paid Layers)

To access layers 3-7, you need an API key:

```bash
# 1. Get API key from dashboard
# Visit: https://app.neurolint.dev/dashboard

# 2. Login with your key
neurolint login <your-api-key>

# 3. Check authentication status
neurolint status

# 4. Now you can use all layers
neurolint fix src/ --layers=3,4,5 --verbose
```

If you try to use layers 3-7 without authentication:
```bash
$ neurolint fix src/ --layers=3,4,5
❌ ERROR: Authentication required for selected layers
❌ Free tier allows fixes for layers 1-2 without authentication
```

## Basic Commands

### Show All Commands
```bash
neurolint --help
```

### Show Layer Information
```bash
neurolint layers --verbose
```

### Check Version
```bash
neurolint --version
```

### Get Project Statistics
```bash
neurolint stats .
```

Output:
```
Files: 61 (61 successful, 0 failed)
Issues: 15
States: 0, Backups: 0
Learned Rules: 0
Performance: 1609ms (14 files/sec)
Memory: 88.91MB (peak: 9.8MB)
```

## Usage Examples

### Free Tier Examples (No Auth Required)

**Analyze a Single File:**
```bash
neurolint analyze src/components/Button.tsx
```

**Analyze Entire Directory:**
```bash
neurolint analyze src/ --verbose
```

**Fix Free Tier Issues (Layers 1-2):**
```bash
# Preview changes first
neurolint fix src/ --layers=1,2 --dry-run --verbose

# Apply fixes
neurolint fix src/ --layers=1,2 --verbose
```

**Fix Specific Files:**
```bash
neurolint fix src/components/Button.tsx --layers=1,2
```

### Paid Tier Examples (Requires Auth)

**Fix React Keys (Layer 3):**
```bash
neurolint login <your-api-key>
neurolint fix src/ --layers=3 --verbose
```

**Fix Hydration Issues (Layer 4):**
```bash
neurolint fix src/ --layers=4 --verbose
```

**Fix Next.js App Router (Layer 5):**
```bash
neurolint fix src/ --layers=5 --verbose
```

**Apply All Layers:**
```bash
neurolint fix src/ --all-layers --verbose
```

**Combine Multiple Layers:**
```bash
neurolint fix src/ --layers=3,4,5 --verbose
```

## Migration Commands

### Next.js 15.5 Migration
```bash
# Preview migration changes (requires auth)
neurolint migrate . --all-layers --dry-run --verbose

# Apply migration with rollback safety
neurolint migrate . --all-layers --backup --verbose

# Migrate specific layers
neurolint migrate . --layers=1,2,5 --dry-run --verbose
```

### React 19 Migration
```bash
neurolint migrate-react19 . --dry-run --verbose
```

### ESLint to Biome Migration
```bash
neurolint migrate-biome . --dry-run --verbose
```

## Advanced Options

### Dry Run (Preview Changes)
```bash
neurolint fix src/ --layers=1,2 --dry-run --verbose
```

### Custom File Patterns
```bash
neurolint analyze src/ --include="**/*.tsx" --exclude="**/*.test.tsx"
```

### Output Formats
```bash
# JSON output
neurolint analyze src/ --format=json --output=results.json

# Console output (default)
neurolint analyze src/ --format=console
```

### Backup Management
```bash
# Enable backups (default)
neurolint fix src/ --backup

# Disable backups (not recommended)
neurolint fix src/ --no-backup

# Production-grade backups with encryption
neurolint fix src/ --production
```

### Parallel Processing
```bash
neurolint fix src/ --parallel=8 --verbose
```

### Clean Old Backups
```bash
# Clean backups older than 7 days
neurolint clean --older-than=7 --verbose

# Keep only latest 5 backups
neurolint clean --keep-latest=5 --verbose
```

## Rule Management (Layer 7 - Paid)

```bash
# List learned rules
neurolint rules --list

# Export rules
neurolint rules --export=my-rules.json

# Import rules
neurolint rules --import=my-rules.json

# Edit rule confidence
neurolint rules --edit=0 --confidence=0.9

# Delete a rule
neurolint rules --delete=0

# Reset all rules
neurolint rules --reset
```

## Real-World Workflow

### Step 1: Analyze First (Free)
```bash
# See what issues exist
neurolint analyze src/ --verbose
```

### Step 2: Fix Free Issues (Free)
```bash
# Fix HTML entities and console.logs
neurolint fix src/ --layers=1,2 --verbose
```

### Step 3: Decide if You Need Paid Layers
If analysis shows:
- Missing React keys → Need Layer 3
- Hydration issues → Need Layer 4
- Next.js issues → Need Layer 5

### Step 4: Get API Key & Fix Remaining Issues (Paid)
```bash
# Login and fix paid issues
neurolint login <your-api-key>
neurolint fix src/ --layers=3,4,5 --verbose
```

## Integration Examples

### Pre-commit Hook (Free Tier)
```bash
# In .husky/pre-commit
neurolint fix src/ --layers=1,2 --dry-run || exit 1
```

### CI/CD Pipeline
```bash
# Free tier - analyze only
neurolint analyze src/ --format=json --output=analysis.json

# Paid tier - analyze and fix
neurolint login $NEUROLINT_API_KEY
neurolint fix src/ --layers=1,2,3,4,5
```

### Team Collaboration (Paid)
```bash
# Export team rules
neurolint rules --export=team-rules.json

# Import on other machines
neurolint rules --import=team-rules.json
```

## Troubleshooting

### "Authentication required for selected layers"

**Problem:** You're trying to use layers 3-7 without authentication.

**Solution:**
```bash
# Get API key from https://app.neurolint.dev/dashboard
neurolint login <your-api-key>
neurolint status  # Verify authentication
```

### "No changes applied" but file was modified

**Issue:** Output may show conflicting messages about fixes.

**Solution:** Check the actual file - if changes are present, it worked. This is a reporting bug, not a functional bug.

### Command not working

**Check authentication status:**
```bash
neurolint status
```

**Check available layers:**
```bash
neurolint layers --verbose
```

**Try free tier first:**
```bash
neurolint fix src/ --layers=1,2 --verbose
```

## Philosophy

**NeuroLint is NOT AI-powered.** It uses:
- ✅ Deterministic rule-based transformations
- ✅ AST (Abstract Syntax Tree) parsing
- ✅ Pattern recognition
- ✅ Precise, predictable fixes

**No LLM hallucinations. No unpredictable rewrites. Just intelligent, rule-based code fixes.**

## Current Status

### ✅ Working Features
- **Analysis Engine:** Fully functional, analyzes code and detects issues
- **Layer Detection:** Smart recommendations for which layers to apply
- **Statistics:** Project health metrics and performance data
- **Backup System:** Creates backups before modifications
- **CLI Interface:** Complete command structure and help system
- **Free Tier (Layers 1-2):** HTML entity fixes, console.log removal, pattern cleanup

### 🔒 Requires Authentication
- **Layers 3-7:** React keys, accessibility, hydration, Next.js, testing, adaptive learning
- **API Authentication:** Connection to app.neurolint.dev required for paid features

## Support & Resources

- **Get API Key:** https://app.neurolint.dev/dashboard (for layers 3-7)
- **Published Package:** https://www.npmjs.com/package/@neurolint/cli
- **Issue Tracking:** Check npm page for latest updates

## Next Steps

1. **Try the free tier:** `neurolint analyze . && neurolint fix . --layers=1,2`
2. **Review detected issues:** See what paid layers could fix
3. **Decide on paid tier:** If you need React keys, hydration fixes, or accessibility improvements
4. **Get API key:** Visit https://app.neurolint.dev/dashboard
5. **Apply paid fixes:** `neurolint login <key>` then `neurolint fix . --all-layers`

---

**Built for developers who want deterministic, rule-based code quality - not AI-driven unpredictability.**
