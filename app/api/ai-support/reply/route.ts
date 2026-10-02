import { NextRequest, NextResponse } from "next/server";

// Very simple reflective reply generator with basic safety checks.
function generateReply(message: string): string {
  const lower = message.toLowerCase();

  // Safety guard
  const crisisKeywords = [
    "suicide",
    "kill myself",
    "self-harm",
    "hurt myself",
    "ending it",
    "end it all",
    "die",
  ];
  if (crisisKeywords.some((k) => lower.includes(k))) {
    return (
      "I’m really glad you reached out. Your safety matters. If you’re in immediate danger or thinking about harming yourself, please call your local emergency number right now. You can also contact your campus counseling center or a 24/7 crisis hotline in your area. You’re not alone—help is available."
    );
  }

  // Gentle reflective response
  const feelings = [
    { key: "anxious", alts: ["anxious", "anxiety", "nervous", "worried"] },
    { key: "stressed", alts: ["stressed", "overwhelmed", "burned out", "burnt out"] },
    { key: "sad", alts: ["sad", "down", "depressed", "low"] },
    { key: "angry", alts: ["angry", "mad", "frustrated"] },
  ];
  const found = feelings.find((f) => f.alts.some((w) => lower.includes(w)));

  const reflection = found
    ? `It sounds like you’re feeling ${found.key}.`
    : "I hear a lot going on for you.";

  return (
    `${reflection} Thank you for sharing that with me. What do you feel you need most right now—space to vent, help planning next steps, or a grounding exercise together?`
  );
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = (await req.json()) as { message?: string };
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    const msg = (body.message || "").trim();
    if (!msg) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const reply = generateReply(msg);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
