import type { JournalPost } from "~types/content";

/**
 * Initial journal posts shown on the top page.
 * Real content will be supplied by the press release
 * draft from the parallel writing session, then moved
 * to microCMS for ongoing posts.
 */
export const journalPosts: readonly JournalPost[] = [
  {
    slug: "press-release-2026-08-01-unification",
    category: "press",
    categoryLabel: "PRESS RELEASE",
    title: "船から、島へ。",
    subtitle: "2026年8月1日、iLe に統一。",
    publishedAt: "2026-08-01",
    publishedAtLabel: "August 1, 2026",
    summary:
      "創業7周年を迎える株式会社ingは、運営する美容室4店舗（iLe原宿・nehus原宿・nehus名古屋・nehus長岡）を、すべて『iLe』ブランドに統一いたします。",
  },
  {
    slug: "story-seven-years",
    category: "story",
    categoryLabel: "STORY",
    title: "7年で、船が島になった。",
    publishedAt: "2026-07-28",
    publishedAtLabel: "July 28, 2026",
    summary:
      "原宿の小さな iLe から始まり、各地に船を出し、それぞれの土地で確かな島となるまでの7年間の物語。",
  },
];
