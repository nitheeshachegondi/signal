"use client";

import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Result = {
  competitors: { name: string; why: string }[];
  search_snapshot: string;
  ai_visibility_snapshot: string;
  seo_actions: string[];
  geo_actions: string[];
  priority_actions: string[];
};

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, category, notes }),
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

  return (
    <main className="min-h-screen" style={{ background: "var(--noir)", color: "var(--paper2)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <Link href="/" className="font-mono text-sm" style={{ color: "var(--steel2)" }}>← Signal</Link>

        <RevealHeading>Visibility check</RevealHeading>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-3"
          style={{ color: "var(--steel2)" }}
        >
          Link your website. We&apos;ll pull your live title and meta tags,
          then estimate your competitive standing and what it takes to get
          surfaced by search and AI platforms.
        </motion.p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Field label="Website link" required>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourbrand.com"
              required
              className="input"
            />
          </Field>
          <Field label="Category (optional)">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. project management SaaS, EdTech, local service"
              className="input"
            />
          </Field>
          <Field label="Anything else worth knowing (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Known competitors, target city, what makes you different..."
              className="input"
            />
          </Field>

          <MagneticSubmit disabled={loading}>
            {loading ? "Scanning..." : "Run the check"}
          </MagneticSubmit>
        </form>

        {error && (
          <p className="mt-6 font-mono text-sm" style={{ color: "#FF7A6E" }}>{error}</p>
        )}

        {result && <ResultView result={result} />}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: var(--noir-soft);
          border: 1px solid var(--hairline);
          color: var(--paper2);
          padding: 12px 14px;
          font-family: var(--font-inter), sans-serif;
        }
        .input:focus {
          outline: 2px solid var(--ember);
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}

function RevealHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden mt-6">
      <motion.h1
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="font-display font-black text-4xl md:text-5xl"
      >
        {children}
      </motion.h1>
    </div>
  );
}

function MagneticSubmit({ disabled, children }: { disabled: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.15 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ x: springX, y: springY }} className="inline-block">
      <button
        type="submit"
        disabled={disabled}
        className="px-7 py-4 rounded-full font-medium disabled:opacity-50"
        style={{ background: "var(--ember)", color: "var(--noir)" }}
      >
        {children}
      </button>
    </motion.div>
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

function ResultView({ result }: { result: Result }) {
  return (
    <div className="mt-14 space-y-10 border-t pt-10" style={{ borderColor: "var(--hairline)" }}>
      <section>
        <h2 className="font-display font-bold text-xl" style={{ color: "var(--ember)" }}>Likely competitors</h2>
        <ul className="mt-4 space-y-3">
          {result.competitors?.map((c, i) => (
            <li key={i}>
              <span className="font-medium">{c.name}</span>
              <span style={{ color: "var(--steel2)" }}> — {c.why}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display font-bold text-xl" style={{ color: "var(--ember)" }}>Google search snapshot</h2>
        <p className="mt-3" style={{ color: "var(--steel2)" }}>{result.search_snapshot}</p>
      </section>

      <section>
        <h2 className="font-display font-bold text-xl" style={{ color: "var(--ember)" }}>AI visibility snapshot</h2>
        <p className="mt-3" style={{ color: "var(--steel2)" }}>{result.ai_visibility_snapshot}</p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-mono text-sm" style={{ color: "var(--steel2)" }}>SEO actions</h3>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            {result.seo_actions?.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-sm" style={{ color: "var(--steel2)" }}>GEO actions (AI platforms)</h3>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            {result.geo_actions?.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      </section>

      <section className="p-6 border" style={{ borderColor: "var(--ember)" }}>
        <h3 className="font-display font-bold" style={{ color: "var(--ember)" }}>Top 5 priorities</h3>
        <ol className="mt-3 space-y-2 list-decimal pl-5">
          {result.priority_actions?.map((a, i) => <li key={i}>{a}</li>)}
        </ol>
      </section>
    </div>
  );
}