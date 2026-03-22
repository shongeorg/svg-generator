# SVG AI Generator - Implementation Plan

## Task 1: Install Dependencies
Install groq-sdk, @neondatabase/serverless, lucide-react

## Task 2: Database Setup
Create lib/db.ts with Neon client and auto-migration for presets table

## Task 3: API Routes
- app/api/generate-svg/route.ts - Groq AI SVG generation
- app/api/presets/route.ts - CRUD for presets

## Task 4: Main UI
Rewrite app/page.tsx with AI prompt input, SVG preview, controls, presets panel

## Task 5: Layout Update
Update app/layout.tsx title and metadata