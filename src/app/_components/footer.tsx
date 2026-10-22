import { FadeIn } from "@/components/fade-in";
import { SplitText } from "@/components/split-text";
import { profile } from "@/content/resume";

export function Footer() {
  return (
    <footer className="pb-10">
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
    </footer>
  );
}
