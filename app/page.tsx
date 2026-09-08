"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_SHARP = [0.76, 0, 0.24, 1] as const;

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="min-h-screen" style={{ background: "var(--noir)", color: "var(--paper2)" }}>
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>

      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col justify-center max-w-5xl mx-auto px-6 md:px-10">
        <RevealLine delay={loading ? 0 : 0.1}>
          <p className="font-mono text-sm tracking-widest uppercase" style={{ color: "var(--ember)" }}>
            Signal — visibility &amp; content
          </p>
        </RevealLine>

        <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.95] mt-6">
          <RevealLine delay={loading ? 0 : 0.2}>Be found by</RevealLine>
          <RevealLine delay={loading ? 0 : 0.32}>
            search. <span style={{ color: "var(--ember)" }}>And by AI.</span>
          </RevealLine>
        </h1>

        <RevealLine delay={loading ? 0 : 0.46}>
          <p className="mt-8 text-lg md:text-xl max-w-xl" style={{ color: "var(--steel2)" }}>
            Drop your website link. See where you stand — then build the
            content that closes the gap.
          </p>
        </RevealLine>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 16 : 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
          className="mt-10"
        >
          <MagneticButton href="/analyze">Check your visibility →</MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 12 : 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease: EASE }}
          className="mt-10 pl-5 border-l-2 max-w-md"
          style={{ borderColor: "var(--ember)" }}
        >
          <p className="text-sm" style={{ color: "var(--steel2)" }}>
            A project-management SaaS went from zero mentions on ChatGPT to
            being the top recommendation for their category — in six weeks,
            using the same visibility check and content loop above.
          </p>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="border-y overflow-hidden py-5" style={{ borderColor: "var(--hairline)" }}>
        <div className="flex marquee-track">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      {/* Service rows */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <ServiceRow
          index="01"
          title="Visibility check"
          text="Your likely competitors, where you stand in Google, and what it takes to get surfaced inside AI answers — not just search results."
          href="/analyze"
          linkLabel="Run the check"
        />
        <ServiceRow
          index="02"
          title="Content generator"
          text="Sharp, platform-native posts and captions — never generic. Comes with a reusable prompt so you can keep going on your own."
          href="/content"
          linkLabel="Generate content"
        />
        <ServiceRow
          index="03"
          title="A real creator"
          text="Every plan can be matched with a real person — from Reels editors to LinkedIn ghostwriters — who turns this into finished, publish-ready work."
          href="/creators"
          linkLabel="Meet the creators"
        />
      </section>

      <footer className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <p className="font-mono text-xs" style={{ color: "var(--steel2)" }}>Signal</p>
      </footer>
    </main>
  );
}

/* ---------- Loader ---------- */

function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1300;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(onDone, 250);
      }
    }, 25);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: EASE_SHARP }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--noir)" }}
    >
      <div className="text-center">
        <p className="font-display font-black text-3xl tracking-widest" style={{ color: "var(--paper2)" }}>
          SIGNAL
        </p>
        <p className="font-mono text-sm mt-4" style={{ color: "var(--ember)" }}>{progress}%</p>
      </div>
    </motion.div>
  );
}

/* ---------- Masked line reveal ---------- */

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ScrollRevealLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- Magnetic button ---------- */

function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.15 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-medium text-lg"
        style={{ background: "var(--ember)", color: "var(--noir)" }}
      >
        {children}
      </Link>
    </motion.div>
  );
}

function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.15 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.5);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className="inline-block shrink-0"
    >
      <Link href={href} className="font-medium border-b-2 pb-0.5" style={{ borderColor: "var(--ember)", color: "var(--paper2)" }}>
        {children}
      </Link>
    </motion.div>
  );
}

/* ---------- Marquee content ---------- */

function MarqueeContent() {
  const items = ["VISIBILITY", "CONTENT", "AI SEARCH", "STRATEGY", "SIGNAL"];
  return (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display font-black text-3xl md:text-4xl uppercase mx-6" style={{ color: "var(--paper2)" }}>
            {item}
          </span>
          <span className="text-3xl" style={{ color: "var(--ember)" }}>✦</span>
        </span>
      ))}
    </div>
  );
}

/* ---------- Service row with scroll-triggered mask + fade/scale ---------- */

function ServiceRow({
  index,
  title,
  text,
  href,
  linkLabel,
}: {
  index: string;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid md:grid-cols-[80px_1fr_auto] gap-4 md:gap-10 items-start py-10 border-b"
      style={{ borderColor: "var(--hairline)" }}
    >
      <span className="font-mono text-sm" style={{ color: "var(--steel2)" }}>{index}</span>
      <div>
        <h2 className="font-display font-bold text-2xl md:text-3xl">
          <ScrollRevealLine>{title}</ScrollRevealLine>
        </h2>
        <p className="mt-3 max-w-lg" style={{ color: "var(--steel2)" }}>{text}</p>
      </div>
      <div className="self-center">
        <MagneticLink href={href}>{linkLabel} →</MagneticLink>
      </div>
    </motion.div>
  );
}