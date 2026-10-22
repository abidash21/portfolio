"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Counts the number in a figure like "67%" or "40K+" up from zero the first
// time it is seen. Anything without a number is shown as written.
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const hasNumber = match !== null;
  const target = match ? Number(match[2]) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!hasNumber || !inView) return;
    if (reduceMotion) {
      setCurrent(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
  }, [hasNumber, inView, reduceMotion, target]);

  if (!match) return <span>{value}</span>;

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {match[1]}
        {current}
        {match[3]}
      </span>
    </span>
  );
}
