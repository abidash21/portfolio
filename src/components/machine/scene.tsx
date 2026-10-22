"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";

interface Story {
  // 0 assembled, 1 fully apart.
  explode: MotionValue<number>;
  // How far the ticket has got, from the roadmap (0) to the data tray (1).
  journey: MotionValue<number>;
  // The KPI needle and the done card, after the work lands.
  kpi: MotionValue<number>;
}

const StoryContext = createContext<Story | null>(null);

export const useStory = () => useContext(StoryContext);

const WIDE = "(min-width: 1024px)";

function useWide() {
  return useSyncExternalStore(
    (changed) => {
      const query = window.matchMedia(WIDE);
      query.addEventListener("change", changed);
      return () => query.removeEventListener("change", changed);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

const clamp = (x: number) => Math.min(1, Math.max(0, x));

// The story clock runs from the hero's centre to Contact's centre, each
// reaching the middle of the screen. Between them it advances by one at each
// section: apart by Work, through the pipeline by Skills, landed by Education,
// back together and shipped by Contact.
const SECTIONS = ["work", "skills", "education"];

// Lays out the hero, the sections and Contact with the figure beside them.
// On wide screens the figure stays pinned in a right-hand column the whole
// way; on narrow screens it sits between the hero and Work.
export function MachineScene({
  hero,
  sections,
  contact,
  figure,
}: {
  hero: ReactNode;
  sections: ReactNode;
  contact: ReactNode;
  figure: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cell = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const marks = useRef<number[]>([]);
  // Where the hero's and Contact's centres sit on screen at the first and
  // last mark, relative to the screen's centre.
  const lines = useRef({ start: 0, end: 0 });
  const reduceMotion = useReducedMotion();
  const wide = useWide();
  const wideRef = useRef(wide);
  wideRef.current = wide;

  // Scroll positions at which each stop reaches its line, and the figure's
  // margins so it rests centred on the hero and unpins centred on Contact.
  useEffect(() => {
    const node = wrap.current;
    if (!node) return;
    const measure = () => {
      const vh = window.innerHeight;
      const most = document.documentElement.scrollHeight - vh;
      const box = (el: Element | null) => {
        const rect = el?.getBoundingClientRect();
        return rect
          ? { top: rect.top + window.scrollY, height: rect.height }
          : { top: most + vh, height: 0 };
      };
      const fit = (y: number) => Math.min(Math.max(y, 0), most);
      const hero = box(heroRef.current);
      const end = box(contactRef.current);
      const centre = ({ top, height }: { top: number; height: number }) =>
        top + height / 2;
      const first = fit(centre(hero) - vh / 2);
      const last = fit(centre(end) - vh / 2);
      marks.current = [
        first,
        ...SECTIONS.map((id, i) =>
          fit(box(document.getElementById(id)).top - vh * (i ? 0.6 : 0.3)),
        ),
        last,
      ];
      lines.current = {
        start: centre(hero) - first - vh / 2,
        end: centre(end) - last - vh / 2,
      };
      const fig = figRef.current;
      const holder = cell.current;
      if (fig && holder) {
        const h = fig.offsetHeight;
        holder.style.setProperty("--fig-h", `${h}px`);
        holder.style.setProperty("--fig-start", `${hero.height / 2 - h / 2}px`);
        holder.style.setProperty("--fig-end", `${end.height / 2 - h / 2}px`);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (figRef.current) observer.observe(figRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollY } = useScroll();
  const { scrollYProgress: past } = useScroll({
    target: cell,
    offset: ["start 0.9", "end 0.1"],
  });

  const clock = useTransform(() => {
    if (!wideRef.current) return past.get() * 4;
    const y = scrollY.get();
    const [start, ...stops] = marks.current;
    if (start === undefined || y <= start) return 0;
    let from = start;
    for (const [i, to] of stops.entries()) {
      if (y < to) return i + clamp((y - from) / Math.max(to - from, 1));
      from = to;
    }
    return stops.length;
  });
  // The pinned figure rides from the hero's centre line to Contact's: when
  // the page can't scroll a centre to the middle of the screen, the figure
  // meets it where it is instead.
  const shift = useTransform(() => {
    if (!wideRef.current) return 0;
    const { start, end } = lines.current;
    return start + (end - start) * clamp(clock.get() / (SECTIONS.length + 1));
  });
  const t = useSpring(clock, { stiffness: 140, damping: 30, mass: 0.6 });

  const explodeLive = useTransform(() => {
    const at = t.get();
    return Math.min(clamp(at / 0.8), 1 - clamp((at - 3.3) / 0.65));
  });
  const journeyLive = useTransform(() => clamp((t.get() - 1) / 2));
  const kpiLive = useTransform(() => clamp((t.get() - 3) / 0.45));

  const still = {
    explode: useMotionValue(0.6),
    journey: useMotionValue(0.4),
    kpi: useMotionValue(0),
  };
  const story: Story = reduceMotion
    ? still
    : { explode: explodeLive, journey: journeyLive, kpi: kpiLive };

  return (
    <StoryContext value={story}>
      <div
        ref={wrap}
        className="grid grid-cols-1 gap-y-20 md:gap-y-28 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-40"
      >
        <div
          ref={heroRef}
          className="lg:relative lg:z-10 lg:col-span-12 lg:col-start-1 lg:row-start-1"
        >
          {hero}
        </div>
        <div
          ref={cell}
          className="lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1"
        >
          <motion.div
            ref={figRef}
            className="lg:sticky lg:top-[calc(50svh-var(--fig-h,0px)/2)] lg:mt-(--fig-start) lg:mb-(--fig-end)"
            style={{ y: shift }}
          >
            {figure}
          </motion.div>
        </div>
        <div className="flex flex-col gap-28 md:gap-40 lg:col-span-7 lg:col-start-1 lg:row-start-2">
          {sections}
        </div>
        <div
          ref={contactRef}
          className="lg:col-span-7 lg:col-start-1 lg:row-start-3"
        >
          {contact}
        </div>
      </div>
    </StoryContext>
  );
}
