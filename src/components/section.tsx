import type { ReactNode } from "react";
import { FadeIn } from "./fade-in";
import { HeadingRule } from "./heading-rule";
import { SplitText } from "./split-text";

type SectionProps = {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
};

// Two-column section: the heading holds the left of the grid, content the right.
export function Section({ id, title, intro, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12"
    >
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <h2
            id={`${id}-title`}
            className="text-3xl font-medium tracking-tight md:text-4xl"
          >
            <SplitText text={title} />
          </h2>
          <HeadingRule delay={0.2} />
          {intro && (
            <FadeIn delay={0.15}>
              <div className="mt-4 max-w-[34ch] text-[17px] leading-relaxed text-muted">
                {intro}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
      <FadeIn delay={0.12} className="lg:col-span-8">
        {children}
      </FadeIn>
    </section>
  );
}
