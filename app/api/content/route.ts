import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { CONTENT_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { brand, platform, topic, tone, painPoint, trend } = await req.json();

    if (!brand || !platform || !topic) {
      return NextResponse.json(
        { error: "Brand, platform, and topic are required." },
        { status: 400 }
      );
    }

    const userPrompt = `Brand: ${brand}
Platform: ${platform}
Topic/goal: ${topic}
Tone: ${tone || "confident, no fluff"}
Audience pain point to speak to: ${painPoint || "none specified"}
Trending headline to relate to (use lightly, only if it fits): ${trend || "none"}`;

    const raw = await askGroq(CONTENT_SYSTEM_PROMPT, userPrompt, true);
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}