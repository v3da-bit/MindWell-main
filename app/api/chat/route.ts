import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const MODEL = "gemini-1.5-pro-latest"; // or "gemini-2.0-flash" when generally available

type Msg = { role: "user" | "assistant"; content: string };

function toGeminiMessages(history: Msg[]) {
  // Gemini expects an array of "contents" with parts
  return history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 500 });
    }
    const { messages } = (await req.json()) as { messages: Msg[] };

    const body = {
      contents: toGeminiMessages(messages.slice(-24)),
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return new Response(JSON.stringify({ error: `Gemini error: ${res.status} ${t}` }), {
        status: 500,
      });
    }
    const data = await res.json();
    // Gemini: data.candidates[0].content.parts[0].text
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, no response.";
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
