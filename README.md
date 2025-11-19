# NeuroLint CLI - Experimental Repository

> ⚠️ **This is NOT the main NeuroLint repository.** This is an experimental test repo.

## What This Is

This repository contains **copied files** from the main NeuroLint CLI project for testing and experimentation. It was created to explore building a web dashboard called "Fixwise" - but that dashboard **does not currently exist**.

## The Real Product

The actual working product is available on npm:

```bash
npm install -g @neurolint/cli
```

- **Package:** `@neurolint/cli`
- **Version:** 1.3.3
- **Published:** 3 months ago
- **NPM Page:** https://www.npmjs.com/package/@neurolint/cli

## What's in This Repo

### ✅ Files That Exist (Copied from main repo):
- `cli.js` - Main CLI entry point
- `scripts/` - 7 fix layer implementations
- `fix-master.js` - Layer orchestrator
- `ast-transformer.js` - AST-based code analysis
- `backup-manager.js` - Backup system
- `validator.js` - Code validation
- `selector.js` - Smart layer selection
- `shared-core/` - Core utilities

### ❌ What Doesn't Exist:
- No `server/` backend
- No `client/` React frontend (just 2 backup files)
- No Fixwise web dashboard
- No database implementation

## What is NeuroLint?

NeuroLint is a **deterministic code analysis and transformation tool** for TypeScript, JavaScript, React, and Next.js projects. It uses rule-based intelligence (NOT AI) to automatically detect and fix common code issues.

### Origin Story

Born from frustration when working on Taxfy.co.za with 700+ ESLint errors, hydration bugs, and missing React keys. Instead of fixing manually, an intelligent multi-layer system was created that reduced 600+ issues down to just 70.

### The 7 Layers

**Free Tier (No Authentication Required):**
1. **Configuration** - tsconfig.json, next.config.js fixes
2. **Patterns** - HTML entities, console.log removal

**Paid Tier (Requires API Key):**
3. **Components** - React keys, accessibility attributes
4. **Hydration** - SSR/hydration safety guards
5. **Next.js** - App Router optimization
6. **Testing** - Error boundaries, test generation
7. **Adaptive** - Pattern learning and custom rules

## How to Use NeuroLint

### Install the Real CLI

```bash
# Install from npm
npm install -g @neurolint/cli

# Check version
neurolint --version

# See available commands
neurolint --help
```

### Try Free Tier (No Authentication)

```bash
# Analyze your codebase
neurolint analyze src/

# Fix free tier issues (layers 1-2)
neurolint fix src/ --layers=1,2 --verbose

# Preview changes first
neurolint fix src/ --layers=1,2 --dry-run
```

### Use Paid Layers (Requires API Key)

```bash
# Get API key from https://app.neurolint.dev/dashboard
neurolint login <your-api-key>

# Check authentication
neurolint status

# Fix all issues
neurolint fix src/ --all-layers --verbose
```

## Documentation

See [`CLI_USAGE.md`](./CLI_USAGE.md) for complete documentation including:
- Free vs paid tier breakdown
- Authentication setup
- Layer capabilities
- Real-world examples
- Troubleshooting guide

## Repo Status

**Purpose:** Experimental/testing for potential web dashboard
**Status:** Planning stage only
**Main Product:** Published npm package `@neurolint/cli`

## Contributing

This is an experimental repository. For the main product:
- Use the npm package: `@neurolint/cli`
- Visit: https://www.npmjs.com/package/@neurolint/cli

---

**🚀 Want to use NeuroLint? Install from npm, don't use this repo directly.**
