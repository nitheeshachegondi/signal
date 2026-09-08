# Signal — AI Visibility & Content Platform

Two tools in one app:

1. **/analyze** — submit a website link, get a competitor map, a Google
   search snapshot, and a GEO (Generative Engine Optimization) snapshot for
   AI platforms like ChatGPT/Gemini/Perplexity, plus prioritized actions.
2. **/content** — generate sharp, platform-native posts/reels/blog copy
   with a reusable prompt template.

Plus a creator-profile page (`/creators/moubani`) — the first entry in a
planned marketplace where a real content creator gets matched to a client
after they subscribe.

## Setup

```bash
npm install
cp .env.example .env.local
# then paste your Groq API key into .env.local
npm run dev
```

Get a free Groq API key at https://console.groq.com/keys — Groq hosts fast
inference for open models like Llama 3.3.

## What's built

- Landing page (`app/page.tsx`)
- Visibility/competitor analysis tool (`app/analyze`, `app/api/analyze`)
- Content generator tool (`app/content`, `app/api/content`)
- Creator profile page (`app/creators/moubani`)
- Shared Groq API helper (`lib/groq.ts`)

## Next steps to extend

- Swap the estimated search/AI-visibility snapshot for real data — a
  ranking API (e.g. SerpAPI) for Google, and periodic prompts sent to each
  AI platform to check for real mentions over time.
- Add auth + billing (e.g. Clerk + Stripe) so "client buys" actually
  triggers the creator-matching flow described on the Moubani page.
- Add more creator profiles once Moubani isn't the only one — turn
  `app/creators/moubani/page.tsx` into a dynamic `[creator]` route backed
  by a small database table instead of a hardcoded page.
- Persist analysis/content history per client (a database — Postgres via
  Supabase or Neon is a natural fit given the rest of the stack).
