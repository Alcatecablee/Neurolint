# NeuroLint SEO Implementation Guide

## Overview

This document outlines the comprehensive SEO implementation for neurolint.dev.

## Implemented SEO Elements

### 1. Meta Tags (index.html)

**Primary Meta Tags:**
- Title: `NeuroLint CLI - Fix React & Next.js Bugs Automatically | No AI, Just Results`
- Description: 155 characters, keyword-rich, compelling
- Keywords: React, Next.js, ESLint, code fixer, CLI tool, etc.
- Canonical URL: `https://www.neurolint.dev/`
- Robots: `index, follow, max-image-preview:large`

**Open Graph Tags:**
- og:type: website
- og:url: https://www.neurolint.dev/
- og:title: NeuroLint CLI - The Only Tool That Actually Fixes Your Code
- og:description: Compelling 160-char description
- og:image: https://www.neurolint.dev/og-image.png (1200x630)
- og:site_name: NeuroLint
- og:locale: en_US

**Twitter Card Tags:**
- twitter:card: summary_large_image
- twitter:site: @neurolint
- twitter:creator: @neurolint
- twitter:title, twitter:description, twitter:image

### 2. Structured Data (JSON-LD)

**SoftwareApplication Schema:**
- Application details, features, pricing (free)
- Download URL (npm)
- Software requirements
- License information

**Organization Schema:**
- Company name, URL, logo
- Social media profiles
- Contact information

**FAQPage Schema:**
- 5 common questions with answers
- Helps with rich snippets in search results

**WebSite Schema:**
- Site name and URL
- Search action capability

### 3. Technical SEO Files

**robots.txt** (`/public/robots.txt`):
- Allows all crawlers
- Specifies sitemap location
- Blocks non-essential paths

**sitemap.xml** (`/public/sitemap.xml`):
- Lists all pages with priorities
- Includes lastmod dates
- Change frequency hints

### 4. Social Sharing Image

**OG Image** (`/public/og-image.png`):
- Dimensions: 1200x630 (16:9)
- Dark theme matching site design
- Suitable for Facebook, Twitter, LinkedIn

### 5. Per-Page SEO (Quick Start)

Dynamic meta tag updates using useEffect:
- Custom title for Quick Start page
- Custom meta description
- Updated Open Graph tags

## Testing & Validation

### Tools to Use

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test: https://www.neurolint.dev/

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Test: https://www.neurolint.dev/

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Test: https://www.neurolint.dev/

4. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test structured data

5. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Check Core Web Vitals

### Validation Checklist

- [ ] Facebook debugger shows correct image and title
- [ ] Twitter card validator shows large image card
- [ ] LinkedIn shows proper preview
- [ ] Google Rich Results detects all schemas
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt

## Post-Launch SEO Tasks

### Google Search Console
1. Verify site ownership
2. Submit sitemap: https://www.neurolint.dev/sitemap.xml
3. Monitor indexing status
4. Check for crawl errors

### Analytics
1. Set up Google Analytics 4
2. Track key events (install command copy, demo clicks)
3. Monitor organic traffic growth

### Backlinks Strategy
1. GitHub README links
2. npm package page
3. Product Hunt launch
4. Developer community posts
5. Technical blog articles

## File Locations

| File | Path |
|------|------|
| Main HTML | `landing/index.html` |
| Robots.txt | `landing/public/robots.txt` |
| Sitemap.xml | `landing/public/sitemap.xml` |
| OG Image | `landing/public/og-image.png` |
| Quick Start SEO | `landing/src/QuickStart.tsx` |

## Keywords Targeted

**Primary:**
- React code fixer
- Next.js bug fixer
- ESLint auto fix
- Code fixing CLI

**Secondary:**
- Hydration error fix
- Missing React keys
- TypeScript code fixer
- AST code transformation

**Long-tail:**
- Automatically fix React hydration errors
- CLI tool to fix ESLint errors
- Deterministic code fixing tool
- Rule-based code transformation

## Notes

- React 19 incompatibility prevented react-helmet-async installation
- Using document manipulation for per-page SEO instead
- OG image generated and placed in public folder
- All schemas validate against schema.org specifications
