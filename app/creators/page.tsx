"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CREATORS } from "@/lib/creators";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CreatorsPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--noir)", color: "var(--paper2)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <Link href="/" className="font-mono text-sm" style={{ color: "var(--steel2)" }}>← Signal</Link>

        <div className="overflow-hidden mt-6">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="font-display font-black text-4xl md:text-5xl"
          >
            Creators
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-3 max-w-xl"
          style={{ color: "var(--steel2)" }}
        >
          When a client subscribes, they&apos;re matched with a creator who
          takes the generator&apos;s output through to finished,
          publish-ready work.
        </motion.p>

        <div className="mt-12 grid sm:grid-cols-2 gap-px" style={{ background: "var(--hairline)" }}>
          {CREATORS.map((creator, i) => (
            <motion.div
              key={creator.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              style={{ background: "var(--noir)" }}
            >
              <Link href={`/creators/${creator.slug}`} className="block p-6 h-full">
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 flex items-center justify-center font-display font-black shrink-0"
                    style={{ background: "var(--ember)", color: "var(--noir)" }}
                  >
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-bold">{creator.name}</p>
                    <p className="font-mono text-xs" style={{ color: "var(--steel2)" }}>{creator.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm" style={{ color: "var(--steel2)" }}>{creator.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {creator.styleTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2.5 py-1 border"
                      style={{ borderColor: "var(--hairline)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
