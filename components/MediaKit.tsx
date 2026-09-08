"use client";

import { useState } from "react";

type SampleWork = {
  title: string;
  note: string;
};

type MediaKitProps = {
  name: string;
  role: string;
  bio: string;
  styleTags: string[];
  sampleWork: SampleWork[];
  shareUrl: string;
};

export default function MediaKit({ name, role, bio, styleTags, sampleWork, shareUrl }: MediaKitProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail (permissions, non-https) — fail silently, the
      // link is still visible below for manual copy.
    }
  }

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 flex items-center justify-center font-display font-black text-xl shrink-0"
          style={{ background: "var(--ember)", color: "var(--noir)" }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="font-display font-black text-3xl">{name}</h1>
          <p className="font-mono text-sm" style={{ color: "var(--steel2)" }}>{role}</p>
        </div>
      </div>

      <p className="mt-8 max-w-xl" style={{ color: "var(--steel2)" }}>{bio}</p>

      {/* Style tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {styleTags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-3 py-1 border"
            style={{ borderColor: "var(--hairline)", color: "var(--paper2)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Sample work */}
      <div className="mt-12">
        <p className="font-mono text-sm" style={{ color: "var(--ember)" }}>Sample work</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-px" style={{ background: "var(--hairline)" }}>
          {sampleWork.map((w, i) => (
            <div key={i} className="p-6" style={{ background: "var(--noir)" }}>
              <p className="font-medium">{w.title}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--steel2)" }}>{w.note}</p>
            </div>
          ))}
          {sampleWork.length === 0 && (
            <div className="p-6" style={{ background: "var(--noir)" }}>
              <p className="text-sm" style={{ color: "var(--steel2)" }}>
                Sample work will appear here as client projects are completed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Share + contact */}
      <div className="mt-12 p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "var(--ember)" }}>
        <div>
          <p className="font-display font-bold" style={{ color: "var(--ember)" }}>Share this media kit</p>
          <p className="mt-1 text-sm font-mono break-all" style={{ color: "var(--steel2)" }}>{shareUrl}</p>
        </div>
        <button
          onClick={copyLink}
          className="px-5 py-2.5 rounded-full font-medium shrink-0"
          style={{ background: "var(--ember)", color: "var(--noir)" }}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}