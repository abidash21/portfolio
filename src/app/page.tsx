import { CountUp } from "@/components/count-up";
import { FadeIn } from "@/components/fade-in";
import { HeadingRule } from "@/components/heading-rule";
import { ResumeButtons } from "@/components/resume-buttons";
import { Section } from "@/components/section";
import { SplitText } from "@/components/split-text";
import {
  achievements,
  education,
  profile,
  ratings,
  roles,
  skills,
} from "@/content/resume";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const mailto = `mailto:${profile.email}`;

function Header() {
  return (
    <header className="flex items-center justify-between gap-6 py-6">
      <a
        href="#top"
        className="press text-[17px] font-medium tracking-[-0.01em]"
      >
        {profile.name}
      </a>
      <nav aria-label="Primary" className="flex items-center gap-6">
        <ul className="hidden items-center gap-6 font-mono text-[13px] tracking-[0.08em] text-muted uppercase sm:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <ResumeButtons size="sm" />
      </nav>
    </header>
  );
}

function Hero() {
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

function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="flex flex-col gap-16"
    >
      <div>
        <h2 id="work-title" className="text-4xl font-medium tracking-tight">
          <SplitText text="Work" />
        </h2>
        <HeadingRule delay={0.15} />
      </div>
      {roles.map((role) => (
        <div
          key={role.company}
          className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-12"
        >
          <FadeIn className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <h3 className="text-2xl font-medium tracking-[-0.02em]">
                {role.company}
              </h3>
              <p className="mt-2 text-[17px] leading-relaxed">
                {role.role}
                <br />
                <span className="font-mono text-[14px] text-muted">
                  {role.location}
                </span>
                <br />
                <span className="font-mono text-[14px] text-muted">
                  {role.period}
                </span>
              </p>
            </div>
          </FadeIn>
          <ul className="flex list-disc flex-col gap-4 pl-5 marker:text-accent md:col-span-8">
            {role.highlights.map((text, i) => (
              <FadeIn
                as="li"
                key={text}
                delay={Math.min(i, 3) * 0.06}
                className="max-w-[62ch] text-[17px] leading-relaxed"
              >
                {text}
              </FadeIn>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export default function Home() {
  return (
    <div id="top" className="mx-auto max-w-300 px-4 sm:px-6 md:px-8">
      <Header />
      <main className="flex flex-col gap-28 pb-28 md:gap-40 md:pb-40">
        <Hero />
        <Work />

        <Section id="skills" title="Skills">
          <dl className="flex flex-col gap-6">
            {skills.map((skill) => (
              <div
                key={skill.group}
                className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-[14rem_1fr]"
              >
                <dt className="font-mono text-[13px] tracking-[0.08em] text-muted uppercase">
                  {skill.group}
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-1.5 text-[17px] leading-relaxed">
                    {skill.items.map((name, i) => (
                      <FadeIn as="li" key={name} delay={i * 0.04}>
                        {name}
                        {i < skill.items.length - 1 && ","}
                      </FadeIn>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="education" title="Education and more">
          <div className="flex flex-col gap-12">
            <div>
              <h3 className="text-2xl font-medium tracking-[-0.02em]">
                {education.school}
              </h3>
              <p className="mt-2 text-[17px]">
                {education.degree}, {education.detail}, {education.period}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {ratings.map((item, i) => (
                <FadeIn as="li" key={item.site} delay={i * 0.08}>
                  <p className="text-4xl leading-none font-medium tracking-[-0.03em] text-accent tabular-nums">
                    <CountUp value={item.rating} />
                  </p>
                  <p className="mt-3 flex items-center gap-2 font-mono text-[13px] text-muted">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      {item.site}
                    </a>
                    {item.note && (
                      <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[12px] leading-none text-accent">
                        {item.note}
                      </span>
                    )}
                  </p>
                </FadeIn>
              ))}
            </ul>

            <ul className="flex list-disc flex-col gap-3 pl-5 text-[17px] leading-relaxed marker:text-accent">
              {achievements.map((item, i) => (
                <FadeIn
                  as="li"
                  key={item}
                  delay={i * 0.06}
                  className="max-w-[62ch]"
                >
                  {item}
                </FadeIn>
              ))}
            </ul>
          </div>
        </Section>
      </main>

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
    </div>
  );
}
