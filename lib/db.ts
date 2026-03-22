import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_PG_DB_URL!);

export async function initDb() {
  // Create presets table (folders) - preserve existing data
  await sql`
    CREATE TABLE IF NOT EXISTS presets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create icons table (SVG icons in folders)
  await sql`
    CREATE TABLE IF NOT EXISTS icons (
      id SERIAL PRIMARY KEY,
      preset_id INTEGER NOT NULL REFERENCES presets(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      svg_code TEXT NOT NULL,
      width INTEGER NOT NULL DEFAULT 128,
      height INTEGER NOT NULL DEFAULT 128,
      color VARCHAR(7) NOT NULL DEFAULT '#ef4444',
      stroke_width DECIMAL(3,1) NOT NULL DEFAULT 2,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export interface Preset {
  id: number;
  name: string;
  created_at: Date;
}

export interface Icon {
  id: number;
  preset_id: number;
  name: string;
  svg_code: string;
  width: number;
  height: number;
  color: string;
  stroke_width: number;
  created_at: Date;
}

// Preset (folder) operations
export async function getPresets(): Promise<Preset[]> {
  await initDb();
  return await sql`SELECT * FROM presets ORDER BY created_at DESC` as Preset[];
}

export async function createPreset(name: string): Promise<Preset> {
  await initDb();
  const result = await sql`
    INSERT INTO presets (name)
    VALUES (${name})
    RETURNING *
  `;
  return result[0] as Preset;
}

export async function deletePreset(id: number): Promise<void> {
  await sql`DELETE FROM presets WHERE id = ${id}`;
}

// Icon operations
export async function getIconsByPreset(presetId: number): Promise<Icon[]> {
  await initDb();
  return await sql`SELECT * FROM icons WHERE preset_id = ${presetId} ORDER BY created_at DESC` as Icon[];
}

export async function createIcon(
  presetId: number,
  name: string,
  svgCode: string,
  width: number,
  height: number,
  color: string,
  strokeWidth: number
): Promise<Icon> {
  await initDb();
  const result = await sql`
    INSERT INTO icons (preset_id, name, svg_code, width, height, color, stroke_width)
    VALUES (${presetId}, ${name}, ${svgCode}, ${width}, ${height}, ${color}, ${strokeWidth})
    RETURNING *
  `;
  return result[0] as Icon;
}

export async function updateIcon(
  id: number,
  updates: {
    name?: string;
    svg_code?: string;
    width?: number;
    height?: number;
    color?: string;
    stroke_width?: number;
  }
): Promise<Icon> {
  // Build dynamic query using tagged template
  const result = await sql`
    UPDATE icons 
    SET 
      name = COALESCE(${updates.name ?? null}, name),
      svg_code = COALESCE(${updates.svg_code ?? null}, svg_code),
      width = COALESCE(${updates.width ?? null}, width),
      height = COALESCE(${updates.height ?? null}, height),
      color = COALESCE(${updates.color ?? null}, color),
      stroke_width = COALESCE(${updates.stroke_width ?? null}, stroke_width)
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] as Icon;
}

export async function deleteIcon(id: number): Promise<void> {
  await sql`DELETE FROM icons WHERE id = ${id}`;
}

export async function getPresetById(id: number): Promise<Preset | null> {
  await initDb();
  const result = await sql`SELECT * FROM presets WHERE id = ${id}`;
  return result[0] as Preset || null;
}

export async function getIconById(id: number): Promise<Icon | null> {
  await initDb();
  const result = await sql`SELECT * FROM icons WHERE id = ${id}`;
  return result[0] as Icon || null;
}
