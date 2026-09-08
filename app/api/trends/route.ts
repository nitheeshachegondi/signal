import { NextRequest, NextResponse } from "next/server";

// Pulls real, current headlines related to the topic from Google News RSS —
// no API key needed. This is what powers the "pick a trending angle" step
// on the content page, instead of the user typing a trend in by hand.
export async function POST(req: NextRequest) {
  try {
    const { topic, category } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "A topic is required." }, { status: 400 });
    }

    const query = encodeURIComponent(`${category ? category + " " : ""}${topic}`);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`News fetch failed (${res.status})`);
    }

    const xml = await res.text();

    // Lightweight extraction — pull <title> text from each <item>, skip the
    // first title (that's the feed's own title, not a headline).
    const itemBlocks = xml.split("<item>").slice(1);
    const headlines = itemBlocks
      .map((block) => {
        const match = block.match(/<title>([\s\S]*?)<\/title>/);
        if (!match) return null;
        return match[1]
          .replace("<![CDATA[", "")
          .replace("]]>", "")
          .trim();
      })
      .filter((t): t is string => !!t)
      .slice(0, 6);

    return NextResponse.json({ headlines });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not fetch trends.";
    // Fail soft — the content page treats an empty list as "skip this step",
    // it never blocks the user from generating content.
    return NextResponse.json({ headlines: [], error: message }, { status: 200 });
  }
}