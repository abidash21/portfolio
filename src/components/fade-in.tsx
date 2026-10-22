"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
  // Shrinks the viewport's bottom edge; keep it small for content that
  // sits near the end of the page, or it can never scroll far enough.
  margin?: `0px 0px ${number}px 0px`;
};

// Fades content in once as it enters the viewport. With reduced motion
// it keeps the fade and drops the travel. The starting state is the same
// either way so the server and client markup match.
export function FadeIn({
  children,
  delay = 0,
  className,
  as = "div",
  margin = "0px 0px -80px 0px",
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === "li" ? motion.li : motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, transform: "translateY(14px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
        ...(reduceMotion && { transform: { duration: 0 } }),
      }}
    >
      {children}
    </Component>
  );
}
