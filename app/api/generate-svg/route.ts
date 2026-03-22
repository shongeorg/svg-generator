import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert SVG icon designer specializing in clean, minimal vector icons.

CRITICAL RULES:
1. Return ONLY the SVG code, no markdown, no explanations
2. Use viewBox="0 0 24 24" 
3. Use stroke="currentColor", fill="none"
4. Use stroke-width="2", stroke-linecap="round", stroke-linejoin="round"
5. Center all elements in the viewBox
6. Use simple geometric shapes: circles, rects, paths, lines
7. Keep coordinates within 0-24 range`;

function enrichPrompt(userPrompt: string): string {
  const input = userPrompt.toLowerCase();
  let extraContext = "";
  let specificInstructions = "";

  // Common UI Icons
  if (input.includes('heart') || input.includes('love') || input.includes('like')) {
    extraContext = "Classic symmetric heart shape";
    specificInstructions = `Draw a heart using TWO symmetric curves:
- Start at bottom point (12,21)
- Curve left to top-left bump (6,15) then to top-center (12,12)
- Mirror right: (12,12) to (18,15) to (12,21)
- Use smooth bezier curves (Q or C commands)`;
  } 
  else if (input.includes('star')) {
    extraContext = "5-pointed symmetric star";
    specificInstructions = `Draw a classic 5-pointed star:
- Center at (12,12)
- Outer points at radius ~8, inner at radius ~3
- Connect alternating outer/inner points
- Must have exactly 5 outer points`;
  }
  else if (input.includes('home') || input.includes('house')) {
    extraContext = "Simple house silhouette";
    specificInstructions = `Draw a house:
- Triangle roof: points at (4,10), (12,4), (20,10)
- Rect body: (6,10) to (18,20)
- Small door: rect at (10,14) to (14,20)
- Optional: small square window at (8,12) to (11,15)`;
  }
  else if (input.includes('user') || input.includes('person') || input.includes('profile') || input.includes('avatar')) {
    extraContext = "User avatar icon";
    specificInstructions = `Draw a user icon:
- Circle for head: center (12,8), radius 4
- Curved shoulders below: arc from (5,20) to (19,20), bulging down to (12,24)
- Gap between head and shoulders: ~2px`;
  }
  else if (input.includes('search') || input.includes('magnifying') || input.includes('find')) {
    extraContext = "Magnifying glass";
    specificInstructions = `Draw a search icon:
- Circle: center (10,10), radius 6
- Handle: line from (15,15) to (21,21), angled 45 degrees
- Handle length: ~6-7 units`;
  }
  else if (input.includes('menu') || input.includes('hamburger')) {
    extraContext = "Hamburger menu (3 lines)";
    specificInstructions = `Draw 3 horizontal lines:
- Line 1: y=6, from x=4 to x=20
- Line 2: y=12, from x=4 to x=20  
- Line 3: y=18, from x=4 to x=20
- Equal spacing between lines`;
  }
  else if (input.includes('close') || input.includes('x') || input.includes('cross')) {
    extraContext = "X mark";
    specificInstructions = `Draw an X with two diagonal lines:
- Line 1: from (6,6) to (18,18)
- Line 2: from (18,6) to (6,18)
- Lines must cross at center (12,12)`;
  }
  else if (input.includes('check') || input.includes('tick') || input.includes('done')) {
    extraContext = "Checkmark";
    specificInstructions = `Draw a checkmark:
- Start at (5,12)
- Go down-right to (10,18)
- Go up-right to (19,6)
- Sharp angle at bottom point`;
  }
  else if (input.includes('arrow')) {
    extraContext = "Directional arrow";
    const direction = input.includes('up') ? 'up' : 
                     input.includes('down') ? 'down' : 
                     input.includes('left') ? 'left' : 'right';
    specificInstructions = `Draw a ${direction} arrow:
- Shaft: main line in ${direction} direction
- Arrowhead: two lines at 45-degree angles forming a V
- Center the arrow in the viewBox`;
  }
  else if (input.includes('settings') || input.includes('gear') || input.includes('cog')) {
    extraContext = "Gear/settings icon";
    specificInstructions = `Draw a gear:
- Center circle: (12,12), radius 3
- 8 teeth evenly spaced around (every 45 degrees)
- Each tooth: small rectangle or trapezoid shape
- Outer circle connecting teeth tips`;
  }
  else if (input.includes('bell') || input.includes('notification')) {
    extraContext = "Notification bell";
    specificInstructions = `Draw a bell:
- Dome shape on top (half-circle or arc)
- Flared bottom edges
- Small clapper at bottom center
- Optional: small circle/badge at top-right for unread`;
  }
  else if (input.includes('mail') || input.includes('email') || input.includes('envelope')) {
    extraContext = "Envelope/mail icon";
    specificInstructions = `Draw an envelope:
- Rectangle body: (3,6) to (21,18)
- Flap: triangle or V-shape on top
- Center line of flap from (3,6) to (12,12) to (21,6)`;
  }
  // Food & Drink
  else if (input.includes('coffee') || input.includes('cup') || input.includes('tea')) {
    extraContext = "Coffee/tea cup";
    specificInstructions = `Draw a cup:
- Cup body: U-shape or rectangle with rounded bottom
- Handle: C-shape on the RIGHT side
- Three wavy lines above for steam (vertical, slightly curved)
- Flat base/saucer optional`;
  }
  else if (input.includes('pizza')) {
    extraContext = "Pizza slice";
    specificInstructions = `Draw a pizza slice:
- Triangle pointing down: top edge curved (crust)
- Crust: thicker line or separate arc at top
- 3-4 small circles inside for pepperoni
- Optional: small dots for cheese texture`;
  }
  else if (input.includes('burger') || input.includes('hamburger')) {
    extraContext = "Hamburger";
    specificInstructions = `Draw a burger:
- Top bun: dome shape
- Middle layers: 2-3 horizontal lines (patty, cheese, lettuce)
- Bottom bun: flat arc
- Optional: sesame seeds as small dots on top`;
  }
  // Nature
  else if (input.includes('sun')) {
    extraContext = "Sun icon";
    specificInstructions = `Draw a sun:
- Center circle: (12,12), radius 4-5
- 8 rays evenly spaced around (every 45 degrees)
- Rays: lines from circle edge outward, length ~3-4`;
  }
  else if (input.includes('moon')) {
    extraContext = "Moon/crescent";
    specificInstructions = `Draw a crescent moon:
- Outer arc: large curve
- Inner arc: smaller curve offset to create crescent shape
- Tips should be sharp/pointed`;
  }
  else if (input.includes('cloud')) {
    extraContext = "Cloud";
    specificInstructions = `Draw a cloud:
- 3-4 overlapping circles/arcs forming cloud shape
- Flat bottom edge
- Bumpy/rounded top edge
- Overall horizontal oval shape`;
  }
  // Technology
  else if (input.includes('wifi') || input.includes('signal')) {
    extraContext = "WiFi signal";
    specificInstructions = `Draw WiFi arcs:
- Small dot at bottom center
- 3 curved arcs above, increasing in size
- Arcs should be concentric (same center)
- Gaps between arcs`;
  }
  else if (input.includes('battery')) {
    extraContext = "Battery icon";
    specificInstructions = `Draw a battery:
- Main rectangle: rounded corners
- Small positive terminal on top
- Optional: fill portion showing charge level`;
  }
  else if (input.includes('camera') || input.includes('photo')) {
    extraContext = "Camera";
    specificInstructions = `Draw a camera:
- Body: rectangle with rounded corners
- Lens: circle in center
- Optional: small flash/dot in corner
- Viewfinder bump on top`;
  }
  // Brand/logos
  else if (input.includes('starbucks') || input.includes('logo')) {
    extraContext = "Simplified brand logo";
    specificInstructions = `Create a simplified iconic version:
- Use basic geometric shapes (circles, curves)
- Focus on most recognizable silhouette
- Avoid fine details and text
- Make it work at small sizes`;
  }
  // Default
  else {
    extraContext = "Minimalist icon";
    specificInstructions = `Create a simple, recognizable icon:
- Use basic shapes: circles, rectangles, lines, curves
- Focus on the most distinctive feature
- Keep it centered in the viewBox
- Avoid complex details that won't render well at small sizes`;
  }

  return `Design Task: ${userPrompt}

Icon Type: ${extraContext}

Specific Instructions:
${specificInstructions}

Technical Requirements:
- ViewBox: 0 0 24 24
- Stroke: currentColor, Fill: none
- Stroke-width: 2
- Stroke-linecap: round, Stroke-linejoin: round
- All coordinates must be within 0-24 range
- Center the icon in the viewBox

Output: Only the SVG code, no explanations.`;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const finalPrompt = enrichPrompt(prompt);

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: finalPrompt }
      ],
      temperature: 0.1,
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
