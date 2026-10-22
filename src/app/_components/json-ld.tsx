import { education, profile, roles, skills } from "@/content/resume";
import { site, siteUrl } from "@/content/site";

// schema.org ProfilePage + Person, so search engines can tie the site,
// the social profiles and the current role to one entity.
export function JsonLd() {
  const person = {
    "@type": "Person",
    "@id": new URL("/#person", siteUrl).href,
    name: profile.name,
    jobTitle: profile.role,
    description: site.description,
    url: siteUrl.href,
    image: new URL("/opengraph-image", siteUrl).href,
    email: `mailto:${profile.email}`,
    sameAs: profile.links
      .filter((link) => !link.href.startsWith("https://wa.me"))
      .map((link) => link.href),
    worksFor: { "@type": "Organization", name: roles[0].company },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressCountry: "IN",
    },
    knowsAbout: skills.flatMap((group) => group.items).slice(0, 13),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: siteUrl.href,
    name: site.title,
    inLanguage: "en",
    mainEntity: person,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: escaped JSON-LD
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
