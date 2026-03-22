# SVG Generator - Project Context

## Project Overview

AI-powered SVG icon generator built with Next.js 16.2.1 and React 19. Users describe icons in natural language, Groq AI generates SVG code, and icons are organized in folders (presets) stored in Neon PostgreSQL.

**Live Demo:** https://svg-generator-ten.vercel.app

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.1 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| AI | Groq SDK (llama-3.3-70b-versatile) |
| Database | Neon PostgreSQL (@neondatabase/serverless) |
| Icons | Lucide React |
| Deployment | Vercel |

## Project Structure

```
svg-generator/
├── app/
│   ├── api/
│   │   ├── generate-svg/     # AI SVG generation endpoint
│   │   │   └── route.ts      # Groq API integration with prompt enrichment
│   │   ├── icons/            # CRUD for icons
│   │   │   └── route.ts      # GET/POST/PATCH/DELETE operations
│   │   └── presets/          # CRUD for folders/presets
│   │       └── route.ts      # GET/POST/DELETE operations
│   ├── page.tsx              # Main UI component (933 lines)
│   ├── layout.tsx            # Root layout with theme support
│   └── globals.css           # Global styles with Tailwind
├── lib/
│   └── db.ts                 # Neon DB connection & operations
├── public/                   # Static assets
├── .env                      # Environment variables (not tracked)
└── package.json
```

## Key Features

1. **AI Generation** - Natural language to SVG via Groq API with custom prompt enrichment
2. **Folder Organization** - Create presets (folders) to organize icons
3. **SVG Editor** - Manual editing of generated SVG code
4. **Customization** - Adjust width, height, color, stroke-width
5. **Download** - Export SVGs with applied settings
6. **Pre-made Icon Library** - 40+ built-in icons as fallback/templates

## Database Schema

```sql
-- presets (folders)
CREATE TABLE presets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- icons (SVG files in folders)
CREATE TABLE icons (
  id SERIAL PRIMARY KEY,
  preset_id INTEGER REFERENCES presets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  svg_code TEXT NOT NULL,
  width INTEGER DEFAULT 128,
  height INTEGER DEFAULT 128,
  color VARCHAR(7) DEFAULT '#ef4444',
  stroke_width DECIMAL(3,1) DEFAULT 2,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Commands

```bash
# Install dependencies
npm install

# Development (hot reload on port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

## Environment Variables

Required in `.env`:

```env
GROQ_API_KEY=your_groq_api_key
NEON_PG_DB_URL=your_neon_postgres_connection_string
```

## API Endpoints

### POST /api/generate-svg
Generates SVG from text prompt using Groq AI.
```json
{ "prompt": "heart icon" }
// Returns: { "svg": "<svg>...</svg>" }
```

### GET /api/icons?presetId=1
Returns all icons in a preset.

### POST /api/icons
Creates a new icon.
```json
{
  "presetId": 1,
  "name": "Heart",
  "svgCode": "<svg>...",
  "width": 128,
  "height": 128,
  "color": "#ef4444",
  "strokeWidth": 2
}
```

### PATCH /api/icons
Updates an icon.
```json
{
  "id": 1,
  "updates": { "name": "New Name", "color": "#000" }
}
```

### DELETE /api/icons?id=1
Deletes an icon.

### GET /api/presets
Returns all presets.

### POST /api/presets
Creates a new preset.
```json
{ "name": "Coffee Shop" }
```

### DELETE /api/presets?id=1
Deletes a preset (cascades to icons).

## Development Conventions

- **TypeScript:** Strict mode enabled
- **ESLint:** Next.js recommended config with TypeScript
- **Node Version:** 24.x (specified in `.nvmrc`)
- **Component Pattern:** All components use `'use client'` for interactivity
- **API Routes:** Next.js App Router `route.ts` pattern
- **Styling:** Tailwind CSS utility classes with custom color palette

## AI Prompt Enrichment

The `generate-svg/route.ts` contains an `enrichPrompt()` function that adds specific geometric instructions based on icon type:
- Detects keywords (heart, star, home, coffee, etc.)
- Adds precise coordinate instructions
- Ensures consistent 24x24 viewBox output
- Enforces stroke-based, fill-free design

## Common Icon Library

Built-in library of 40+ pre-defined icons (heart, star, home, user, search, settings, etc.) available as fallback options when AI generation is not needed.

## Notes

- AI may generate imperfect SVGs; manual editor is provided for corrections
- All data persists in Neon PostgreSQL
- Deployed on Vercel with automatic preview deployments
