import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert SVG icon designer. Create clean, professional SVG icons based on the user's description.

CRITICAL RULES:
1. Return ONLY the SVG code, no explanations, no markdown
2. Use viewBox="0 0 24 24" for consistency
3. Use stroke="currentColor" for all strokes, fill="none" for outline icons
4. Use stroke-linecap="round" and stroke-linejoin="round" for smooth lines
5. Keep it SIMPLE - use basic shapes: circles, rectangles, paths, lines
6. Center the icon in the viewBox
7. Use stroke-width="2" as default

ICON DESIGN PRINCIPLES:
- For "coffee cup": draw a simple cup with handle (C-shape) and optionally steam lines above
- For "pizza": draw a triangle slice with circles for pepperoni
- For "heart": use a symmetric heart shape with two curves
- For "user/person": circle for head + curved line for shoulders
- For "settings": use a gear with teeth around circle

Example coffee cup SVG:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>

Now create the icon the user requested:`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let svgCode = response.choices[0]?.message?.content || '';
    
    // Clean up the response - remove markdown code blocks if present
    svgCode = svgCode.replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

    // Validate that it's an SVG
    if (!svgCode.includes('<svg') || !svgCode.includes('</svg>')) {
      return NextResponse.json(
        { error: 'Invalid SVG generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ svg: svgCode });
  } catch (error) {
    console.error('Error generating SVG:', error);
    return NextResponse.json(
      { error: 'Failed to generate SVG' },
      { status: 500 }
    );
  }
}
