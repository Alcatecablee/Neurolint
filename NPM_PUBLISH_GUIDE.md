# npm Publish Guide for NeuroLint v1.3.4

## Pre-Publish Checklist

### 1. Verify Package Contents
The following files will be published (defined in package.json "files" field):
- cli.js
- ast-transformer.js
- backup-manager.js
- backup-manager-production.js
- backup-error-handler.js
- validator.js
- selector.js
- simple-ora.js
- fix-master.js
- scripts/ (directory)
- shared-core/ (directory)
- README.md
- CLI_USAGE.md

### 2. Current Version Status
- **Current npm version**: 1.3.3
- **New version**: 1.3.4
- **Package name**: neurolint-cli

### 3. Changes in v1.3.4
- Removed all emojis from documentation (README.md, CLI_USAGE.md, CONTRIBUTING.md)
- Removed all emojis from CLI output (cli.js)
- Replaced emojis with professional bracket notation: [SUCCESS], [!], [+], [i], [*]
- Professional appearance for enterprise users

---

## Publishing Steps

### Step 1: Login to npm
```bash
npm login
```
Enter your npm credentials when prompted.

### Step 2: Verify Package Before Publishing
```bash
npm pack --dry-run
```
This shows what files will be included in the package without creating a tarball.

### Step 3: Test Package Locally (Optional but Recommended)
```bash
# Create tarball
npm pack

# Install globally from tarball
npm install -g neurolint-cli-1.3.4.tgz

# Test the CLI
neurolint --version
neurolint --help

# Uninstall after testing
npm uninstall -g neurolint-cli
```

### Step 4: Publish to npm
```bash
npm publish --access public
```

**Important**: Since the package name is "neurolint-cli" (not scoped), you need `--access public`.

### Step 5: Verify Publication
```bash
# Check npm registry
npm view neurolint-cli

# Or visit
# https://www.npmjs.com/package/neurolint-cli
```

---

## Post-Publish Verification

### 1. Test Installation
```bash
# Install from npm
npm install -g neurolint-cli

# Verify version
neurolint --version  # Should show 1.3.4

# Test commands
neurolint --help
neurolint layers
```

### 2. Update GitHub Release (Optional)
Create a GitHub release tag for v1.3.4 with release notes:
- Professional appearance: Removed all emojis
- Replaced with bracket notation for enterprise-friendly output
- No functional changes, all 249 tests still passing

---

## Troubleshooting

### Error: "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- Verify you own the package or have publish rights
- Check if the package exists: `npm view neurolint-cli`

### Error: "Version already exists"
- Check current published version: `npm view neurolint-cli version`
- Bump version if needed: `npm version patch` (or minor/major)

### Error: "Package name too similar to existing packages"
- This shouldn't happen since neurolint-cli already exists
- Use exact name: "neurolint-cli"

---

## Quick Commands Summary

```bash
# 1. Login
npm login

# 2. Verify package
npm pack --dry-run

# 3. Publish
npm publish --access public

# 4. Verify
npm view neurolint-cli
```

---

## Next Steps After Publishing

1. **Update README badge**: The version badge should auto-update to 1.3.4
2. **Reddit launch**: Post to r/nextjs, r/reactjs, r/SideProject
3. **Product Hunt**: Continue 4-6 week preparation (40% → 100%)
4. **Monitor downloads**: Check npm stats at https://npmjs.com/package/neurolint-cli

---

## Additional Notes

- The package uses semantic versioning (semver)
- This is a patch release (1.3.3 → 1.3.4) for cosmetic improvements
- No breaking changes or new features
- All 249 tests still passing
- Professional appearance ready for enterprise adoption

