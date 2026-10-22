"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useRef } from "react";

type SplitTextProps = {
  text: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  hoverAccent?: boolean;
};

// Reveals text a word (or letter) at a time, each rising out of its own
// clipped line. Screen readers get the plain string once. Visibility is
// watched on the wrapper, not each letter: a letter starts clipped by its
// line, so it barely intersects and may never trigger near the page end.
export function SplitText({
  text,
  by = "word",
  delay = 0,
  stagger = by === "char" ? 0.03 : 0.06,
  hoverAccent = false,
}: SplitTextProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const words = text.split(" ");
  let index = 0;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {words.map((word, w) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: words are static and ordered
          <Fragment key={`${word}-${w}`}>
            <span className="inline-block whitespace-nowrap">
              {(by === "char" ? [...word] : [word]).map((part, p) => {
                const i = index++;
                return (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: letters are static and ordered
                    key={p}
                    className="inline-block overflow-hidden pb-[0.08em] align-bottom"
                  >
                    <motion.span
                      className={
                        hoverAccent
                          ? "split-char-hover inline-block"
                          : "inline-block"
                      }
                      initial={{ opacity: 0, transform: "translateY(105%)" }}
                      animate={
                        inView
                          ? { opacity: 1, transform: "translateY(0%)" }
                          : undefined
                      }
                      transition={{
                        duration: 0.7,
                        delay: delay + i * stagger,
                        ease: [0.23, 1, 0.32, 1],
                        ...(reduceMotion && { transform: { duration: 0 } }),
                      }}
                    >
                      {part}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  );
}
