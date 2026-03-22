import { NextRequest, NextResponse } from 'next/server';
import { getIconById, getPresetById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const iconId = parseInt(id);

    if (isNaN(iconId)) {
      return NextResponse.json(
        { error: 'Invalid icon ID' },
        { status: 400 }
      );
    }

    const icon = await getIconById(iconId);
    
    if (!icon) {
      return NextResponse.json(
        { error: 'Icon not found' },
        { status: 404 }
      );
    }

    const preset = await getPresetById(icon.preset_id);

    return NextResponse.json({ icon, preset });
  } catch (error) {
    console.error('Error fetching icon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch icon' },
      { status: 500 }
    );
  }
}
