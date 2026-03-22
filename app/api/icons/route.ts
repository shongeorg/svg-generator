import { NextRequest, NextResponse } from 'next/server';
import { getIconsByPreset, createIcon, updateIcon, deleteIcon } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const presetId = searchParams.get('presetId');

    if (!presetId) {
      return NextResponse.json(
        { error: 'presetId is required' },
        { status: 400 }
      );
    }

    const icons = await getIconsByPreset(parseInt(presetId));
    return NextResponse.json({ icons });
  } catch (error) {
    console.error('Error fetching icons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch icons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { presetId, name, svgCode, width, height, color, strokeWidth } = await request.json();

    if (!presetId || !name || !svgCode) {
      return NextResponse.json(
        { error: 'presetId, name, and svgCode are required' },
        { status: 400 }
      );
    }

    const icon = await createIcon(
      presetId,
      name.trim(),
      svgCode,
      width || 128,
      height || 128,
      color || '#ef4444',
      strokeWidth || 2
    );

    return NextResponse.json({ icon });
  } catch (error) {
    console.error('Error creating icon:', error);
    return NextResponse.json(
      { error: 'Failed to create icon' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json(
        { error: 'id and updates are required' },
        { status: 400 }
      );
    }

    const icon = await updateIcon(id, updates);
    return NextResponse.json({ icon });
  } catch (error) {
    console.error('Error updating icon:', error);
    return NextResponse.json(
      { error: 'Failed to update icon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await deleteIcon(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting icon:', error);
    return NextResponse.json(
      { error: 'Failed to delete icon' },
      { status: 500 }
    );
  }
}
