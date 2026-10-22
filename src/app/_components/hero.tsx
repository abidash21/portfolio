import { FadeIn } from "@/components/fade-in";
import { ResumeButtons } from "@/components/resume-buttons";
import { SplitText } from "@/components/split-text";
import { profile } from "@/content/resume";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-[78svh] flex-col justify-between gap-16 pt-16 pb-8 md:pt-24"
    >
      <div>
        <h1
          id="hero-title"
          className="text-[clamp(3.5rem,11vw,9.5rem)] leading-[0.92] font-medium tracking-[-0.04em]"
        >
          <SplitText text={profile.name} by="char" hoverAccent />
        </h1>
        <FadeIn delay={0.45}>
          <p className="mt-8 max-w-[34ch] text-2xl leading-snug text-ink">
            {profile.summary}
          </p>
        </FadeIn>
        <FadeIn delay={0.55}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[17px]">
            <ResumeButtons />
            {profile.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
