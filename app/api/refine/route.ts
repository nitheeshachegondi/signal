import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";
import { REFINE_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { draft, platform, tone, painPoint } = await req.json();

    if (!draft || !platform) {
      return NextResponse.json(
        { error: "Paste the draft content and pick a platform." },
        { status: 400 }
      );
    }

    const userPrompt = `Platform: ${platform}
Tone: ${tone || "confident, no fluff"}
Audience pain point to speak to (optional): ${painPoint || "none specified"}

Draft to refine:
"""
${draft}
"""`;

    const raw = await askGroq(REFINE_SYSTEM_PROMPT, userPrompt, true);
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}