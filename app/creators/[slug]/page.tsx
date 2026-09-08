"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import MediaKit from "@/components/MediaKit";
import { getCreator } from "@/lib/creators";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const creator = getCreator(slug);

  if (!creator) notFound();

  return (
    <main className="min-h-screen" style={{ background: "var(--noir)", color: "var(--paper2)" }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <Link href="/creators" className="font-mono text-sm" style={{ color: "var(--steel2)" }}>← Creators</Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <MediaKit
            name={creator.name}
            role={creator.role}
            bio={creator.bio}
            styleTags={creator.styleTags}
            sampleWork={creator.sampleWork}
            shareUrl={`https://signal.app/creators/${creator.slug}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-10 p-6 border"
          style={{ borderColor: "var(--hairline)" }}
        >
          <p className="font-mono text-sm" style={{ color: "var(--ember)" }}>How matching works</p>
          <p className="mt-3 text-sm" style={{ color: "var(--steel2)" }}>
            When a client subscribes, {creator.name} takes on the content
            execution for that brand — from the generator&apos;s output
            through to publish-ready work.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
