import { FadeIn } from "@/components/fade-in";
import { HeadingRule } from "@/components/heading-rule";
import { SplitText } from "@/components/split-text";
import { profile } from "@/content/resume";

const mailto = `mailto:${profile.email}`;

export function Footer() {
  return (
    <footer className="pb-10">
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="flex flex-col gap-12"
      >
        <div>
          <h2
            id="contact-title"
            className="text-4xl font-medium tracking-tight"
          >
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
        </div>
        <div>
          <p
            aria-hidden="true"
            className="text-[clamp(3rem,11.5vw,11rem)] leading-[0.9] font-medium tracking-[-0.04em] whitespace-nowrap text-ink"
          >
            <SplitText
              text={profile.name}
              by="char"
              stagger={0.025}
              hoverAccent
            />
          </p>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col justify-between gap-3 font-mono text-[13px] text-muted sm:flex-row">
              <p>
                Made with love by{" "}
                <a
                  href="https://ashutoshdash.in?utm_source=abinash-dash-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Ashutosh Dash
                </a>{" "}
                · Built with Next.js, Tailwind CSS and Motion.
              </p>
              <div className="flex gap-6">
                {profile.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-150 hover:text-ink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </footer>
  );
}
