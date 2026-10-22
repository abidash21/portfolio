import { FadeIn } from "@/components/fade-in";
import { HeadingRule } from "@/components/heading-rule";
import { SplitText } from "@/components/split-text";
import { profile } from "@/content/resume";

const mailto = `mailto:${profile.email}`;

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="text-4xl font-medium tracking-tight">
        <SplitText text="Contact" />
      </h2>
      <HeadingRule delay={0.15} />
      <FadeIn delay={0.1}>
        <p className="mt-4 max-w-[40ch] text-[17px] leading-relaxed text-muted">
          The quickest way to reach me is WhatsApp.
        </p>
        <a
          href={profile.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="link mt-6 inline-block text-2xl font-medium tracking-[-0.02em] md:text-4xl"
        >
          Message me on WhatsApp
        </a>
        <p className="mt-4 text-[17px] text-muted">
          Or email{" "}
          <a href={mailto} className="link break-all">
            {profile.email}
          </a>
        </p>
      </FadeIn>
    </section>
  );
}
