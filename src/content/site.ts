import { profile } from "./resume";

// Canonical origin. Set NEXT_PUBLIC_SITE_URL once the domain is live;
// on Vercel the production URL is picked up automatically until then.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

export const site = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Abinash Dash is a software engineer in Bengaluru building lending systems at Equall: Spring Boot and Kafka backends, loan journey engines and document pipelines.",
  shareDescription:
    "Backend and distributed systems: loan journeys, Kafka pipelines, document engines.",
  locale: "en_IN",
  keywords: [
    "Abinash Dash",
    "software engineer",
    "backend engineer",
    "Spring Boot",
    "Apache Kafka",
    "Kotlin",
    "Java",
    "distributed systems",
    "fintech",
    "Bengaluru",
    "BIT Mesra",
  ],
};
