# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Next.js 15, MDX, and TypeScript. The blog features Korean content with support for both MDX posts and YouTube video posts stored in a Vercel Postgres database.

## Commands

### Development
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
```

## Architecture

### Core Technologies
- **Next.js 15** with App Router
- **MDX** for content with frontmatter support
- **Tailwind CSS** for styling
- **TypeScript** (non-strict mode)
- **Vercel Postgres** for YouTube post storage

### Project Structure
- `/app` - Next.js app router pages and API routes
  - `[year]/[id]` - Dynamic routes for blog posts
  - `atom/route.ts` - RSS feed generation
  - `og/[id]` - Open Graph image generation
- `/src/posts` - MDX blog posts organized by year (2017-2025)
- `/src/components` - Reusable React components
  - `/ui` - MDX-specific UI components
- `/src/utils` - Core utilities for post management
- `/public` - Static assets and images

### Key Patterns

#### Post Management
Posts come from two sources:
1. **MDX files** in `/src/posts/[year]/[id].mdx`
2. **YouTube posts** from Vercel Postgres database

The `getPosts()` function in `src/utils/get-posts.ts` merges both sources and sorts by date.

#### MDX Processing
- Uses `@next/mdx` with custom plugins
- `rehype-pretty-code` for syntax highlighting
- Custom UI components in `/src/components/ui/` for MDX elements

#### Routing
- Legacy post IDs redirect to year-based routes via `next.config.mjs`
- Example: `/post-id` → `/2024/post-id`

#### Styling
- Dark mode support via custom theme effect script
- Tailwind CSS with custom styling for code blocks
- Inter font family

## Environment Variables
- `GOOGLE_ANALYTICS_ID` - Google Analytics tracking
- `POSTGRES_*` - Vercel Postgres connection (for YouTube posts)
