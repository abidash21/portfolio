"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const MINOR = 24;
const MAJOR = MINOR * 5;

// Graph-paper grid fixed behind the page: fine lines every 24px, a slightly
// stronger line every fifth. It fades in once and drifts a little on scroll.
export function MathBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -MAJOR],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.svg
        className="absolute inset-x-0 top-0 h-[calc(100%+120px)] w-full"
        style={{ y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.2, ease: "easeOut" }}
      >
        <defs>
          <pattern
            id="grid-minor"
            width={MINOR}
            height={MINOR}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M${MINOR} 0H0V${MINOR}`}
              fill="none"
              stroke="var(--grid-minor)"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="grid-major"
            width={MAJOR}
            height={MAJOR}
            patternUnits="userSpaceOnUse"
          >
            <rect width={MAJOR} height={MAJOR} fill="url(#grid-minor)" />
            <path
              d={`M${MAJOR} 0H0V${MAJOR}`}
              fill="none"
              stroke="var(--grid-major)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-major)" />
      </motion.svg>
    </div>
  );
}
