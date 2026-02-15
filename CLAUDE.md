# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 16.1.0 with App Router
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS v4 with OKLCH color system
- **Component Library**: Radix UI primitives (Separator, Slot)
- **Icons**: Lucide React
- **TypeScript**: Path aliases configured as `@/*` pointing to root

### Application Structure

This is a personal portfolio website with a split-screen layout design:

- **Professional Section** (left/top): Dark slate theme with blue accents
  - Resume, Experience, Skills, Goals cards
  - Located in `components/professional-section.tsx`

- **Personal Section** (right/bottom): Light stone theme with amber accents
  - Biography, Family, Travel, Restaurants cards
  - Located in `components/personal-section.tsx`

### Component Organization

- **`app/`**: Next.js App Router pages and layouts
  - `page.tsx` - Home page with main layout
  - `layout.tsx` - Root layout with Geist fonts and metadata
  - `globals.css` - Tailwind imports and custom theme variables

- **`components/`**: React components
  - `navbar.tsx` - Fixed navigation with mobile menu
  - `professional-section.tsx` - Professional content grid
  - `personal-section.tsx` - Personal content grid
  - `ui/` - Reusable UI primitives (Card, Button, Badge, Separator)

- **`hooks/`**: Custom React hooks
  - `use-mobile.tsx` - Responsive breakpoint hook (768px threshold)

- **`lib/`**: Utility functions
  - `utils.ts` - Contains `cn()` helper for merging Tailwind classes

### Styling Conventions

- Uses Tailwind CSS v4 with `@import "tailwindcss"` syntax
- Custom theme uses OKLCH color format for better perceptual uniformity
- Dark mode support via `.dark` class variant
- Responsive design: mobile-first with `lg:` breakpoint for desktop
- Hover effects use subtle glows via `shadow-[0_0_20px_rgba(...)]` pattern

### Key Patterns

1. **Client Components**: Most interactive components use `"use client"` directive
2. **Component Structure**: UI components follow Radix UI patterns with compound components (Card, CardHeader, CardContent, etc.)
3. **Class Merging**: Use `cn()` utility from `lib/utils.ts` to merge Tailwind classes
4. **Icons**: Import from `lucide-react` and render as components
5. **Responsive Navigation**: Separate desktop/mobile navigation patterns in navbar

### Configuration Files

- `next.config.ts` - Next.js configuration (minimal/default setup)
- `tsconfig.json` - TypeScript with `@/*` path aliases
- `eslint.config.mjs` - ESLint with Next.js presets
- `postcss.config.mjs` - PostCSS configuration for Tailwind
