// Dummy creator roster for the marketplace preview. Swap for a database
// table (see README) once real creators are onboarded.

export type Creator = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  styleTags: string[];
  sampleWork: { title: string; note: string }[];
};

export const CREATORS: Creator[] = [
  {
    slug: "moubani",
    name: "Moubani",
    role: "Content & post designer",
    bio: "Turns generated posts into finished graphics and reels for lifestyle and D2C brands — matched by category and voice.",
    styleTags: ["Instagram", "Reels", "Brand storytelling"],
    sampleWork: [
      { title: "D2C skincare launch reel", note: "3-part reel series, 40K views in week one." },
      { title: "Founder story carousel", note: "Turned a rough voice note into a 6-slide post." },
    ],
  },
  {
    slug: "arav",
    name: "Arav",
    role: "LinkedIn ghostwriter",
    bio: "Writes founder and exec voice posts for B2B SaaS — takes the generator's draft and sharpens it into something that sounds like one specific person, not a brand account.",
    styleTags: ["LinkedIn", "B2B", "Thought leadership"],
    sampleWork: [
      { title: "Founder weekly post series", note: "Grew a 200-follower account to 12K in 4 months." },
    ],
  },
  {
    slug: "priya",
    name: "Priya",
    role: "Short-form editor",
    bio: "Edits the beat-by-beat scripts from the generator into cut, captioned Reels/TikToks — pacing, on-screen text, and trend-aware sound.",
    styleTags: ["Reels", "TikTok", "Editing"],
    sampleWork: [
      { title: "Product-launch reel cutdown", note: "Turned a 3-min raw clip into a 22s reel." },
    ],
  },
  {
    slug: "devon",
    name: "Devon",
    role: "Blog & SEO writer",
    bio: "Takes the generator's blog draft and the /analyze report's SEO actions and turns them into a publish-ready, structured article.",
    styleTags: ["Blog", "SEO", "Long-form"],
    sampleWork: [
      { title: "Category guide rewrite", note: "Rebuilt an existing post around the priority SEO actions from a visibility check." },
    ],
  },
];

export function getCreator(slug: string): Creator | undefined {
  return CREATORS.find((c) => c.slug === slug);
}
