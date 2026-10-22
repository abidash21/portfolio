import { FadeIn } from "@/components/fade-in";
import { HeadingRule } from "@/components/heading-rule";
import { SplitText } from "@/components/split-text";
import { roles } from "@/content/resume";

export function Work() {
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
