import { FadeIn } from "@/components/fade-in";
import { Section } from "@/components/section";
import { skills } from "@/content/resume";

export function Skills() {
  return (
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
  );
}
