# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

1btc.news client - A React SPA for viewing and posting Bitcoin ordinal news inscriptions. Fetches data from the inscribe.news API.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
```

No test suite is configured.

## Architecture

### Tech Stack
- React 18 + TypeScript + Vite
- Chakra UI for components and theming
- React Router v6 for client-side routing
- React Markdown with GFM and raw HTML support

### Source Structure
```
src/
├── main.tsx              # React root with HelmetProvider
├── App.tsx               # Router setup with ChakraProvider
├── helpers.ts            # Utility functions (word count, reading time)
├── components/           # Reusable UI components
├── routes/               # Page components (one per route)
└── style/
    ├── news.css          # Markdown content styles
    ├── theme.ts          # Chakra theme (re-exports from theme/)
    └── theme/            # Modular theme config (colors, fonts, components)

lib/
└── api-types.ts          # TypeScript types for API responses
```

### Routes
- `/` - RecentNews: Homepage listing recent inscribed articles
- `/post-news` - PostNews: Form to generate news inscription JSON
- `/view-news` - ViewNews: Individual article viewer (markdown rendered)

### API Integration
Backend: `https://inscribe.news/api/`
- `/api/data/` - List of news inscriptions
- `/api/info/{id}` - Inscription metadata
- `/api/content/{id}` - Inscription content (news JSON)

### Key Types (lib/api-types.ts)
- `OrdinalNews` - News standard schema with p, op, title, body, author fields
- `InscriptionMeta` - Metadata for inscriptions stored in KV
- `HiroApiInscription` - Raw data from Hiro ordinals API

### Styling
- Chakra UI components with custom theme extension
- Dark mode default (no toggle)
- Custom "Really Sans" fonts in `/public/fonts/`
- Markdown content styled via `.ord-news-body` class in news.css

### Prettier Config
Defined in package.json: single quotes, 2-space tabs, trailing commas (ES5), 100 char width.
