"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

type SplitTextProps = {
  text: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
};

// Reveals text a word (or letter) at a time, each rising out of its own
// clipped line. Screen readers get the plain string once.
export function SplitText({
  text,
  by = "word",
  delay = 0,
  stagger = by === "char" ? 0.03 : 0.06,
}: SplitTextProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  let index = 0;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
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
                      className="inline-block"
                      initial={{ opacity: 0, transform: "translateY(105%)" }}
                      whileInView={{ opacity: 1, transform: "translateY(0%)" }}
                      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
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
