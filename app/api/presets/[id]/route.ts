import { NextRequest, NextResponse } from 'next/server';
import { getPresetById, getIconsByPreset } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const presetId = parseInt(id);

    if (isNaN(presetId)) {
      return NextResponse.json(
        { error: 'Invalid preset ID' },
        { status: 400 }
      );
    }

    const preset = await getPresetById(presetId);
    
    if (!preset) {
      return NextResponse.json(
        { error: 'Preset not found' },
        { status: 404 }
      );
    }

    const icons = await getIconsByPreset(presetId);

    return NextResponse.json({ preset, icons });
  } catch (error) {
    console.error('Error fetching preset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preset' },
      { status: 500 }
    );
  }
}
