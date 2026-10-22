"use client";

import { motion, useReducedMotion } from "motion/react";

// A short purple bar under a heading that draws out from the left once the
// heading's words have landed.
export function HeadingRule({ delay = 0 }: { delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className="mt-4 block h-0.5 w-12 origin-left bg-accent"
      initial={{ transform: "scaleX(0)" }}
      whileInView={{ transform: "scaleX(1)" }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    />
  );
}
