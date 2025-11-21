# How to Publish NeuroLint CLI to NPM

## Step 1: Login to NPM
```bash
npm login
```
Enter your npm credentials when prompted.

## Step 2: Test the Package Locally (Optional)
```bash
npm pack
```
This creates a .tgz file you can test installing elsewhere.

## Step 3: Publish to NPM
```bash
npm publish
```

## What Happens:
- NPM will package all files in this directory (excluding .npmignore)
- Upload to https://www.npmjs.com/package/neurolint-cli
- Users can install with: `npm install -g neurolint-cli`
- Users can run with: `neurolint analyze myfile.jsx`

## Important Notes:
- Make sure you have access to publish `neurolint-cli` on npm
- Version 1.3.4 will be published
- To publish updates later, bump version in package.json first

## Current Package Info:
- Name: neurolint-cli
- Version: 1.3.4
- Size: 120.6 KB
- Files: 26 core files
