import { CountUp } from "@/components/count-up";
import { FadeIn } from "@/components/fade-in";
import { Section } from "@/components/section";
import { achievements, education, ratings } from "@/content/resume";

export function Education() {
  return (
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
                  <span className="rounded-full border border-accent/40 px-2 py-0.5 text-xs leading-none text-accent shrink-0">
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
  );
}
