const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Active model on Groq as of Aug 2026. llama-3.3-70b-versatile was retired —
// this is its replacement. Swap to "openai/gpt-oss-20b" for a smaller/cheaper
// option, or check https://console.groq.com/docs/models for the current list.
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export async function askGroq(system: string, user: string, jsonMode = false) {
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