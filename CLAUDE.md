# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16** application using the **App Router** with **Sanity CMS** as the headless content backend.

### Tech Stack
- **Next.js 16** with App Router (`src/app/`)
- **React 19** with Server Components by default
- **Tailwind CSS v4** (uses `@import "tailwindcss"` syntax, not v3's `@tailwind` directives)
- **Sanity CMS** via `next-sanity` for content management
- **TypeScript** with strict mode

### Project Structure
```
src/
├── app/           # Next.js App Router pages and layouts
│   ├── layout.tsx # Root layout with Geist fonts
│   ├── page.tsx   # Home page
│   └── globals.css
└── sanity/
    └── client.ts  # Sanity client configuration
```

### Sanity Configuration
- **Project ID**: `glu8suiv`
- **Dataset**: `production`
- **API Version**: `2024-01-01`
- CDN disabled for fresh content

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Styling
Tailwind CSS v4 with CSS variables for theming:
- Light/dark mode via `prefers-color-scheme`
- Custom fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`)
- Theme colors defined in `globals.css` using `@theme inline` directive
