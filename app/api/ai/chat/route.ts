import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Lightweight on-platform fallback generator (no external API required)
function generateFallbackReply(message: string): string {
  const lower = message.toLowerCase();

  const crisis = [
    'suicide',
    'kill myself',
    'self-harm',
    'hurt myself',
    'ending it',
    'end it all',
    'die',
  ];
  if (crisis.some((k) => lower.includes(k))) {
    return "I’m really glad you reached out. Your safety matters. If you’re in immediate danger or thinking about harming yourself, please call your local emergency number right now. You can also contact your campus counseling center or a 24/7 crisis hotline in your area. You’re not alone—help is available.";
  }

  const feelings = [
    { key: 'anxious', alts: ['anxious', 'anxiety', 'nervous', 'worried'] },
    { key: 'stressed', alts: ['stressed', 'overwhelmed', 'burned out', 'burnt out'] },
    { key: 'sad', alts: ['sad', 'down', 'depressed', 'low'] },
    { key: 'angry', alts: ['angry', 'mad', 'frustrated'] },
  ];
  const found = feelings.find((f) => f.alts.some((w) => lower.includes(w)));
  const reflection = found ? `It sounds like you’re feeling ${found.key}.` : 'I hear a lot going on for you.';
  return `${reflection} Thank you for sharing that with me. What do you feel you need most right now—space to vent, help planning next steps, or a grounding exercise together?`;
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = (await request.json()) as { messages?: ChatMessage[] };
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    const messages = (body.messages || []).filter((m) => m.content?.trim()).slice(-12);

    const apiKey = process.env.OPENAI_API_KEY;

    // If no external key configured, gracefully fall back to a supportive
    // on-platform response so the chat always works in the dashboard.
    if (!apiKey) {
      const lastUser = [...messages].reverse().find((m) => m.role === 'user');
      const reply = generateFallbackReply(lastUser?.content || '');
      return NextResponse.json({ reply });
    }

    const systemPrompt: ChatMessage = {
      role: 'system',
      content:
        'You are a supportive, concise AI tutor for students. Explain clearly, show steps when helpful, and offer next actions or resources. Keep responses short and actionable.',
    };

    const payload = {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 500,
      messages: [systemPrompt, ...messages],
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenAI API error:', text);
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 });
    }

    const data = (await resp.json()) as {
      choices?: Array<{ message?: { role: string; content?: string } }>;
    };

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      'I had trouble generating a response. Please try again.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('POST /api/ai/chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}