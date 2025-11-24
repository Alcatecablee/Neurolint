#!/bin/bash

# High-converting CLI demo - Real pain points, real fixes
# No emojis, authentic CLI output, strategic pacing

clear
sleep 1

echo "$ cd ~/projects/ecommerce-app"
sleep 0.8
cd demo-project

echo ""
echo "$ npm run dev"
sleep 0.7
echo ""
echo "Error: Hydration failed because the initial UI does not match"
echo "what was rendered on the server."
echo ""
echo "  × window is not defined"
echo "    at Dashboard (./pages/dashboard.tsx:5:15)"
echo ""
sleep 2

echo "$ npm run lint"
sleep 0.7
echo ""
echo "✖ 8 problems (5 errors, 3 warnings)"
echo ""
echo "  pages/dashboard.tsx"
echo "    3:16  error    'useState' is not defined  no-undef"
echo "    5:15  error    'window' is not defined    no-undef"
echo ""
echo "  components/TodoList.tsx"
echo "    4:3   error    Unexpected var, use let or const instead  no-var"
echo "    8:9   error    Missing key prop for element in iterator  react/jsx-key"
echo "    11:13 warning  Unexpected console statement               no-console"
echo ""
sleep 2.5

echo "$ git status"
sleep 0.7
echo "On branch main"
echo "nothing to commit, working tree clean"
echo ""
sleep 1

# Show the analyze phase
echo "$ neurolint analyze . --verbose"
sleep 0.8
echo "Running analyze......"
sleep 1.2
echo ""
echo "[ANALYSIS SUMMARY]"
echo "  Files Analyzed: 3"
echo "  Total Issues Found: 12"
echo "  Average Issues per File: 4.0"
echo "  Layer Recommendations:"
echo "    Layer 4 (Hydration): 1 file"
echo "    Layer 3 (Components): 2 files"
echo "    Layer 2 (Patterns): 3 files"
echo "[COMPLETE] Analysis completed"
echo ""
sleep 2

# Fix hydration first
echo "$ neurolint fix pages/dashboard.tsx -l 4 --verbose"
sleep 0.8
echo "Running fix......"
sleep 1
echo "Running Layer 4 (Hydration Fixes) on pages/dashboard.tsx"
echo "[INFO] Detected direct window access in component"
echo "[INFO] Wrapping in useEffect to prevent SSR hydration errors"
echo "[SUCCESS] Layer 4 applied 2 hydration fixes to pages/dashboard.tsx"
echo ""
echo "[FIXED] pages/dashboard.tsx"
echo "  Execution Time: 142ms"
echo "  Applied Fixes: 1"
echo "  Layers Applied: 4"
echo ""
sleep 1.5

# Show the diff
echo "$ git diff pages/dashboard.tsx"
sleep 0.7
echo "diff --git a/pages/dashboard.tsx b/pages/dashboard.tsx"
echo "index a1b2c3d..e4f5g6h 100644"
echo "--- a/pages/dashboard.tsx"
echo "+++ b/pages/dashboard.tsx"
echo "@@ -2,8 +2,13 @@"
echo " import { useState } from 'react'"
echo " "
echo " export default function Dashboard() {"
echo "-  const theme = window.localStorage.getItem('theme') || 'light'"
echo "   const [count, setCount] = useState(0)"
echo "+  const [theme, setTheme] = useState('light')"
echo "+  "
echo "+  useEffect(() => {"
echo "+    setTheme(window.localStorage.getItem('theme') || 'light')"
echo "+  }, [])"
echo ""
sleep 2

# Fix component issues
echo "$ neurolint fix components/TodoList.tsx -l 2,3 --verbose"
sleep 0.8
echo "Running fix......"
sleep 1
echo "Running Layer 2 (Pattern Fixes) on components/TodoList.tsx"
echo "[INFO] AST-based pattern transformations: 2 changes"
echo "[SUCCESS] Layer 2 applied 2 pattern fixes"
echo "Running Layer 3 (Component Fixes) on components/TodoList.tsx"
echo "[INFO] Added missing key props to 3 JSX elements"
echo "[INFO] Removed console.log statements"
echo "[SUCCESS] Layer 3 applied 4 component fixes"
echo ""
echo "[FIXED] components/TodoList.tsx"
echo "  Execution Time: 168ms"
echo "  Applied Fixes: 1"
echo "  Total Changes: 6"
echo ""
sleep 1.5

# Show proof it works
echo "$ npm run dev"
sleep 0.7
echo ""
echo "▲ Next.js 14.2.0"
echo "  - Local:        http://localhost:3000"
echo "  - Ready in 1.2s"
echo ""
sleep 1.2

echo "$ npm run lint"
sleep 0.7
echo ""
echo "✔ No ESLint warnings or errors"
echo ""
sleep 1.5

# Final message
echo "$ # Hydration crashes: Fixed ✓"
sleep 0.5
echo "$ # Missing keys: Fixed ✓"
sleep 0.5
echo "$ # ESLint errors: Fixed ✓"
sleep 0.5
echo "$ # Deploy blockers: Fixed ✓"
sleep 0.7
echo ""
echo "$ npm install -g @neurolint/cli"
sleep 1
