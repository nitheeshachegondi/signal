import { NextRequest, NextResponse } from "next/server";
import { askGroq } from "@/lib/groq";

const SYSTEM_PROMPT = `You are a marketing visibility analyst. Given a brand's website — and, when available, the actual live title/meta description/headings pulled from that page — produce a sharp, practical analysis of:
1. Likely competitors in the same category
2. How the brand likely shows up today in Google search vs in AI answer engines (ChatGPT, Perplexity, Gemini) — ground this in the real page content when it's provided; be honest that beyond that page snapshot this is an informed estimate, not a live ranking measurement
3. Concrete SEO actions to rank higher on Google — reference specifics from the real title/meta/headings when given (e.g. a missing or weak meta description, a vague title tag) rather than generic advice
4. Concrete GEO (Generative Engine Optimization) actions to get mentioned by AI platforms — things like structured data, clear factual pages, being citable, presence on forums/review sites AI models pull from
5. A short prioritized action list (top 5)

If a "Live page data" block is provided below, treat it as ground truth about the current page and reference it directly. If it says the page could not be fetched, fall back to reasoning from the URL/category/notes and say so plainly instead of inventing page content.

Respond ONLY as JSON with this shape:
{
  "competitors": [{"name": string, "why": string}],
  "search_snapshot": string,
  "ai_visibility_snapshot": string,
  "seo_actions": string[],
  "geo_actions": string[],
  "priority_actions": string[]
}`;

// Pulls the real <title>, meta description, and H1s from the submitted URL
// server-side — no API key needed. Same fail-soft pattern as /api/trends:
// a failed fetch never blocks the analysis, it just falls back to
// URL/category/notes-only reasoning.
async function fetchPageSignals(url: string) {
  try {
    const target = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const res = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) throw new Error(`Fetch failed (${res.status})`);

    const html = await res.text();

    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const description = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i
    )?.[1]?.trim();
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    if (!title && !description && h1s.length === 0) {
      return "Live page data: page fetched but no title, meta description, or H1s were found (likely a JS-rendered page) — treat as unavailable.";
    }

    return [
      "Live page data (fetched just now):",
      title ? `- Title tag: "${title}"` : "- Title tag: none found",
      description ? `- Meta description: "${description}"` : "- Meta description: none found",
      h1s.length ? `- H1 headings: ${h1s.map((h) => `"${h}"`).join(", ")}` : "- H1 headings: none found",
    ].join("\n");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return `Live page data: could not fetch the page (${message}) — treat as unavailable, reason from the URL/category/notes instead.`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, category, notes } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "A website link is required." }, { status: 400 });
    }

    const pageSignals = await fetchPageSignals(url);

    const userPrompt = `Website: ${url}
Category (if known): ${category || "not specified — infer from the URL/name"}
Additional notes from the brand owner: ${notes || "none"}

${pageSignals}`;

    const raw = await askGroq(SYSTEM_PROMPT, userPrompt, true);
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
