"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type GenerateResult = {
  hook_options: string[];
  post: string;
  caption_or_script: string;
  hashtags: string[];
  prompt_template: string;
};

type RefineResult = {
  refined: string;
  changes: string[];
  hashtags: string[];
};

const PLATFORMS = ["Instagram Reel", "Instagram Post", "LinkedIn", "Blog"];

const TONES = [
  "Bold and confident — speaks with authority, no hedging",
  "Warm and friendly — like talking to a friend who gets it",
  "Witty and playful — light humor, doesn't take itself too seriously",
  "Professional and polished — clean, credible, built for LinkedIn",
  "Minimal and direct — short sentences, no fluff, straight to the point",
];

const PAIN_POINTS = [
  "Not enough time",
  "Price / value doubt",
  "Too many choices, hard to decide",
  "Trust — is this even good/real",
  "Fear of missing out",
  "Don't know where to start",
];

const WRITE_OWN = "Write your own";

type Mode = "generate" | "refine";

export default function ContentPage() {
  const [mode, setMode] = useState<Mode>("generate");

  return (
    <main className="min-h-screen" style={{ background: "var(--noir)", color: "var(--paper2)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <Link href="/" className="font-mono text-sm" style={{ color: "var(--steel2)" }}>← Signal</Link>

        <div className="overflow-hidden mt-6">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-display font-black text-4xl"
          >
            Content generator
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-3"
          style={{ color: "var(--steel2)" }}
        >
          Sharp hooks, platform-native copy — from scratch, or sharpen
          something you&apos;ve already written.
        </motion.p>

        <div className="mt-8 flex border rounded-full p-1" style={{ borderColor: "var(--hairline)" }}>
          <ModeButton active={mode === "generate"} onClick={() => setMode("generate")}>
            New content
          </ModeButton>
          <ModeButton active={mode === "refine"} onClick={() => setMode("refine")}>
            Refine existing
          </ModeButton>
        </div>

        {mode === "generate" ? <GenerateForm /> : <RefineForm />}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: var(--noir-soft);
          border: 1px solid var(--hairline);
          color: var(--paper2);
          padding: 12px 14px;
          font-family: "Segoe UI", sans-serif;
        }
        .input:focus {
          outline: 2px solid var(--ember);
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 px-4 py-2.5 text-sm font-medium rounded-full"
      style={{
        background: active ? "var(--ember)" : "transparent",
        color: active ? "var(--noir)" : "var(--paper2)",
      }}
    >
      {children}
    </button>
  );
}

function GenerateForm() {
  const [brand, setBrand] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [painPoint, setPainPoint] = useState(PAIN_POINTS[0]);
  const [customPainPoint, setCustomPainPoint] = useState("");

  const [trends, setTrends] = useState<string[]>([]);
  const [trend, setTrend] = useState("");
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsFetched, setTrendsFetched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerateResult | null>(null);

  async function fetchTrends() {
    if (!topic) {
      setError("Add a topic first, then fetch trending angles for it.");
      return;
    }
    setError("");
    setTrendsLoading(true);
    setTrendsFetched(false);
    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      const headlines: string[] = data.headlines || [];
      setTrends(headlines);
      setTrend(headlines.length ? headlines[0] : "None — skip trend");
      setTrendsFetched(true);
    } catch {
      setTrends([]);
      setTrend("None — skip trend");
      setTrendsFetched(true);
    } finally {
      setTrendsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          platform,
          topic,
          tone,
          painPoint: painPoint === WRITE_OWN ? customPainPoint : painPoint,
          trend: trend === "None — skip trend" ? "" : trend,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const painPointReady = painPoint === WRITE_OWN ? customPainPoint.trim().length > 0 : !!painPoint;
  const canGenerate = brand && platform && topic && tone && painPointReady && trendsFetched;

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <Field label="Brand name" required>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} required className="input" placeholder="Your brand" />
        </Field>

        <Field label="Platform" required>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <Field label="Topic / goal" required>
          <input
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setTrendsFetched(false);
            }}
            required
            className="input"
            placeholder="e.g. launch of a new product, why customers switch to us"
          />
        </Field>

        <OptionGroup label="Tone" name="tone" options={TONES} value={tone} onChange={setTone} />

        <div>
          <span className="block text-sm mb-2" style={{ color: "var(--steel2)" }}>
            Audience pain point *
          </span>
          <div className="space-y-2 border p-4" style={{ borderColor: "var(--hairline)" }}>
            {[...PAIN_POINTS, WRITE_OWN].map((p) => (
              <label key={p} className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="painPoint"
                  checked={painPoint === p}
                  onChange={() => setPainPoint(p)}
                  className="mt-1"
                />
                <span>{p}</span>
              </label>
            ))}
            {painPoint === WRITE_OWN && (
              <input
                value={customPainPoint}
                onChange={(e) => setCustomPainPoint(e.target.value)}
                placeholder="Describe the pain point in your own words"
                className="input mt-2"
              />
            )}
          </div>
        </div>

        <div>
          <span className="block text-sm mb-2" style={{ color: "var(--steel2)" }}>
            Trending angle *
          </span>
          {!trendsFetched ? (
            <button
              type="button"
              onClick={fetchTrends}
              disabled={trendsLoading}
              className="px-5 py-2.5 border text-sm disabled:opacity-50"
              style={{ borderColor: "var(--line-light)" }}
            >
              {trendsLoading ? "Fetching today's headlines..." : "Find trending news for this topic"}
            </button>
          ) : (
            <div className="space-y-2 border p-4" style={{ borderColor: "var(--hairline)" }}>
              {trends.length === 0 && (
                <p className="text-sm" style={{ color: "var(--steel2)" }}>
                  No live headlines matched closely enough — that&apos;s fine, skip it.
                </p>
              )}
              {[...trends, "None — skip trend"].map((h) => (
                <label key={h} className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="trend"
                    checked={trend === h}
                    onChange={() => setTrend(h)}
                    className="mt-1"
                  />
                  <span>{h}</span>
                </label>
              ))}
              <button
                type="button"
                onClick={fetchTrends}
                className="font-mono text-xs mt-2"
                style={{ color: "var(--ember)" }}
              >
                Refresh headlines
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !canGenerate}
          className="px-6 py-3 rounded-full font-medium disabled:opacity-50"
          style={{ background: "var(--ember)", color: "var(--noir)" }}
        >
          {loading ? "Writing..." : "Generate content"}
        </button>
        {!trendsFetched && (
          <p className="text-xs" style={{ color: "var(--steel2)" }}>
            Fetch a trending angle above to unlock generation.
          </p>
        )}
      </form>

      {error && <p className="mt-6 font-mono text-sm" style={{ color: "#FF7A6E" }}>{error}</p>}

      {result && (
        <div className="mt-14 space-y-10 border-t pt-10" style={{ borderColor: "var(--hairline)" }}>
          <Section title="Hook options">
            <ul className="mt-4 space-y-3">
              {result.hook_options?.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </Section>
          <Section title="Post">
            <p className="mt-3 whitespace-pre-wrap" style={{ color: "var(--steel2)" }}>{result.post}</p>
          </Section>
          <Section title="Caption / script">
            <p className="mt-3 whitespace-pre-wrap" style={{ color: "var(--steel2)" }}>{result.caption_or_script}</p>
          </Section>
          <div>
            <h3 className="font-mono text-sm" style={{ color: "var(--steel2)" }}>Hashtags</h3>
            <p className="mt-2 font-mono text-sm">{result.hashtags?.join("  ")}</p>
          </div>
          <div className="p-6 border" style={{ borderColor: "var(--ember)" }}>
            <h3 className="font-display font-bold" style={{ color: "var(--ember)" }}>Reusable prompt</h3>
            <p className="mt-3 whitespace-pre-wrap font-mono text-sm" style={{ color: "var(--steel2)" }}>{result.prompt_template}</p>
          </div>
        </div>
      )}
    </>
  );
}

function RefineForm() {
  const [draft, setDraft] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [painPoint, setPainPoint] = useState(PAIN_POINTS[0]);
  const [customPainPoint, setCustomPainPoint] = useState("");
  const [skipPainPoint, setSkipPainPoint] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RefineResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft,
          platform,
          tone,
          painPoint: skipPainPoint ? "" : painPoint === WRITE_OWN ? customPainPoint : painPoint,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const canRefine = draft.trim().length > 0 && platform && tone;

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <Field label="Paste what you've already written" required>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            required
            rows={6}
            className="input"
            placeholder="Paste your draft post, caption, or script here"
          />
        </Field>

        <Field label="Platform" required>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <OptionGroup label="Tone" name="refine-tone" options={TONES} value={tone} onChange={setTone} />

        <div>
          <label className="flex items-center gap-2 text-sm mb-2" style={{ color: "var(--steel2)" }}>
            <input type="checkbox" checked={skipPainPoint} onChange={(e) => setSkipPainPoint(e.target.checked)} />
            Skip pain point — just tighten what I wrote
          </label>
          {!skipPainPoint && (
            <div className="space-y-2 border p-4" style={{ borderColor: "var(--hairline)" }}>
              {[...PAIN_POINTS, WRITE_OWN].map((p) => (
                <label key={p} className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="refine-painPoint"
                    checked={painPoint === p}
                    onChange={() => setPainPoint(p)}
                    className="mt-1"
                  />
                  <span>{p}</span>
                </label>
              ))}
              {painPoint === WRITE_OWN && (
                <input
                  value={customPainPoint}
                  onChange={(e) => setCustomPainPoint(e.target.value)}
                  placeholder="Describe the pain point in your own words"
                  className="input mt-2"
                />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !canRefine}
          className="px-6 py-3 rounded-full font-medium disabled:opacity-50"
          style={{ background: "var(--ember)", color: "var(--noir)" }}
        >
          {loading ? "Refining..." : "Refine content"}
        </button>
      </form>

      {error && <p className="mt-6 font-mono text-sm" style={{ color: "#FF7A6E" }}>{error}</p>}

      {result && (
        <div className="mt-14 space-y-10 border-t pt-10" style={{ borderColor: "var(--hairline)" }}>
          <Section title="Refined version">
            <p className="mt-3 whitespace-pre-wrap" style={{ color: "var(--steel2)" }}>{result.refined}</p>
          </Section>
          <div className="p-6 border" style={{ borderColor: "var(--ember)" }}>
            <h3 className="font-display font-bold" style={{ color: "var(--ember)" }}>What changed</h3>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm" style={{ color: "var(--steel2)" }}>
              {result.changes?.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          {result.hashtags?.length > 0 && (
            <div>
              <h3 className="font-mono text-sm" style={{ color: "var(--steel2)" }}>Hashtags</h3>
              <p className="mt-2 font-mono text-sm">{result.hashtags.join("  ")}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function OptionGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="block text-sm mb-2" style={{ color: "var(--steel2)" }}>
        {label} *
      </span>
      <div className="space-y-2 border p-4" style={{ borderColor: "var(--hairline)" }}>
        {options.map((opt) => (
          <label key={opt} className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="mt-1"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm mb-2" style={{ color: "var(--steel2)" }}>
        {label}{required && " *"}
      </span>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-xl" style={{ color: "var(--ember)" }}>{title}</h2>
      {children}
    </section>
  );
}