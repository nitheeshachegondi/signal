const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Active model on Groq as of Sep 2026. llama-3.3-70b-versatile was
// decommissioned on Aug 16, 2026 — this (or qwen/qwen3.6-27b) is its
// recommended replacement. Check https://console.groq.com/docs/models
// for the current list before changing this.
const DEFAULT_MODEL = "openai/gpt-oss-120b";

async function callGroq(system: string, user: string, jsonMode: boolean) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Add it to your .env.local file.");
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// jsonMode calls occasionally come back with a stray key/quote embedded
// inside a string value (the model loses track of where it is mid-object),
// which breaks JSON.parse downstream. Rather than let that crash the
// request, validate here and retry once with an explicit correction.
export async function askGroq(system: string, user: string, jsonMode = false) {
  const first = await callGroq(system, user, jsonMode);

  if (!jsonMode) return first;

  try {
    JSON.parse(first);
    return first;
  } catch {
    const retrySystem = `${system}

IMPORTANT: Your previous response was invalid JSON — a key or quote ended up nested inside a string value. Return ONLY a single, flat, valid JSON object matching the requested shape. Do not put quotation marks or additional keys inside any string value.`;
    const second = await callGroq(retrySystem, user, jsonMode);

    try {
      JSON.parse(second);
      return second;
    } catch {
      // Still broken — let the caller's existing error handling take over
      // rather than silently returning something unparseable.
      return second;
    }
  }
}
