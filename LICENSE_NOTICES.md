# Third-Party License Notices

NeuroLint uses the following open-source dependencies. This document provides attribution and licensing information for each.

---

## Core Dependencies

### @babel/* packages
- **Packages:** @babel/parser, @babel/traverse, @babel/generator, @babel/types
- **License:** MIT
- **Copyright:** Copyright (c) 2014-present Sebastian McKenzie and other contributors
- **Purpose:** AST parsing and code transformation engine
- **Source:** https://github.com/babel/babel

### Express
- **Package:** express
- **License:** MIT
- **Copyright:** Copyright (c) 2009-present TJ Holowaychuk and other contributors
- **Purpose:** Web server framework for API endpoints
- **Source:** https://github.com/expressjs/express

### CORS
- **Package:** cors
- **License:** MIT
- **Copyright:** Copyright (c) 2013 Troy Goode
- **Purpose:** Cross-Origin Resource Sharing middleware
- **Source:** https://github.com/expressjs/cors

### glob
- **Package:** glob
- **License:** ISC
- **Copyright:** Copyright (c) Isaac Z. Schlueter and Contributors
- **Purpose:** File pattern matching
- **Source:** https://github.com/isaacs/node-glob

### Ora
- **Package:** ora
- **License:** MIT
- **Copyright:** Copyright (c) Sindre Sorhus
- **Purpose:** CLI spinner and progress indicators
- **Source:** https://github.com/sindresorhus/ora

### log-symbols
- **Package:** log-symbols
- **License:** MIT
- **Copyright:** Copyright (c) Sindre Sorhus
- **Purpose:** Colored symbols for terminal output
- **Source:** https://github.com/sindresorhus/log-symbols

### CLI utilities
- **Packages:** cli-cursor, restore-cursor, strip-ansi, wcwidth
- **License:** MIT
- **Copyright:** Various contributors
- **Purpose:** Terminal manipulation and text formatting utilities

---

## Development Dependencies

### React & React DOM
- **Packages:** react, react-dom
- **License:** MIT
- **Copyright:** Copyright (c) Meta Platforms, Inc. and affiliates
- **Purpose:** Landing page UI framework
- **Source:** https://github.com/facebook/react

### Vite
- **Package:** vite
- **License:** MIT
- **Copyright:** Copyright (c) 2019-present Evan You & Vite Contributors
- **Purpose:** Build tool for landing page
- **Source:** https://github.com/vitejs/vite

### Tailwind CSS
- **Package:** tailwindcss
- **License:** MIT
- **Copyright:** Copyright (c) Tailwind Labs, Inc.
- **Purpose:** Utility-first CSS framework
- **Source:** https://github.com/tailwindlabs/tailwindcss

### PostCSS & Autoprefixer
- **Packages:** postcss, autoprefixer
- **License:** MIT
- **Copyright:** Andrey Sitnik and other contributors
- **Purpose:** CSS processing and vendor prefixing
- **Source:** https://github.com/postcss/postcss

### Jest
- **Package:** jest, @types/jest
- **License:** MIT
- **Copyright:** Copyright (c) Meta Platforms, Inc. and affiliates
- **Purpose:** Testing framework
- **Source:** https://github.com/jestjs/jest

### lucide-react
- **Package:** lucide-react
- **License:** ISC
- **Copyright:** Copyright (c) 2022, Lucide Contributors
- **Purpose:** Icon library for landing page
- **Source:** https://github.com/lucide-icons/lucide

### next-themes
- **Package:** next-themes
- **License:** MIT
- **Copyright:** Copyright (c) 2020 Emil Kowalski
- **Purpose:** Theme management for landing page
- **Source:** https://github.com/pacocoursey/next-themes

---

## License Compatibility

All third-party dependencies use permissive licenses (MIT, ISC) that are compatible with the Business Source License 1.1 under which NeuroLint is distributed.

### MIT License Summary
The MIT License is a permissive license that allows:
- Commercial use
- Modification
- Distribution
- Private use

With the only requirement being:
- License and copyright notice inclusion

### ISC License Summary
The ISC License is functionally equivalent to MIT, allowing the same freedoms with similar attribution requirements.

---

## Full License Texts

Full license texts for all dependencies can be found in their respective `node_modules` directories or at their source repositories listed above.

---

## Updates

This file was last updated: November 22, 2025

For the most current dependency information, run:
```bash
npm list --depth=0
```

---

**Note:** If you believe there is a licensing issue or have questions about third-party licenses, please contact: contact@neurolint.dev
