"use client";

import {
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { type ReactElement, useCallback, useEffect, useRef } from "react";
import type { Point3 } from "@/components/iso/iso-kit";
import "@/components/iso/iso.css";
import { useInView, useLoop } from "@/components/iso/react/live";
import "./engine.css";
import { useStory } from "./scene";
import {
  ARM_REST,
  ARM_SWING,
  ARM_WINDOW,
  armPaths,
  BAR_WINDOW,
  GATE_AT,
  IDLE,
  LOG,
  needleLevel,
  needlePath,
  SHIPPED,
  STAGES,
  STOPS,
} from "./story";
import {
  BAR_RISE,
  EX,
  EY,
  EZ,
  GAP,
  HEIGHT,
  MODULES,
  type ModuleId,
  ORDER,
  SCREEN,
  WIDTH,
} from "./view";

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => x * x * (3 - 2 * x);
const within = (j: number, [a, b]: [number, number]) =>
  ease(clamp((j - a) / (b - a)));

// Outer trays lead and travel twice as far, so every gap only ever opens.
const shareOf = (id: ModuleId, e: number) => {
  const lift = Math.abs(MODULES[id].lift);
  if (lift === 2) return ease(clamp(e / 0.85));
  if (lift === 1) return ease(clamp((e - 0.1) / 0.85));
  return ease(clamp(e));
};

const fine = (v: number) => Math.round(v * 100) / 100;
const screenOf = ([x, y, z]: Point3) => [
  EX[0] * x + EY[0] * y + EZ[0] * z,
  EX[1] * x + EY[1] * y + EZ[1] * z,
];
const translate = (p: Point3) => {
  const [sx, sy] = screenOf(p);
  return `translate(${fine(sx)} ${fine(sy)})`;
};

// Messages run along their lane and fade at both ends; the retried one walks
// back toward the start of its lane.
const LANE_SPAN = 144;
const TOKEN_GAP = LANE_SPAN / 4;
const SPEED = 16;
const RETRY_FROM = 24;
const RETRY_SPAN = 86;

function linesAt(journey: number, kpi: number) {
  const done = LOG.filter(([at]) => at <= journey).map(([, line]) => line);
  if (kpi > 0.6) done.push(SHIPPED);
  if (!done.length) return [IDLE];
  return done;
}

// The status line beside the figure: which tray is active and what it last
// did, or that the work has shipped.
function statusOf(journey: number, kpi: number, tray: ModuleId) {
  if (kpi > 0.6) return { index: "", name: "Shipped", detail: "✓" };
  const last = LOG.filter(([at]) => at <= journey).at(-1)?.[1];
  const detail = last
    ? last.replace(/^[$>]\s*/, "").replace(/\s+/g, " ")
    : "ready";
  const id = journey > 0 ? tray : "roadmap";
  return { index: MODULES[id].index, name: STAGES[id], detail };
}

type Props = Record<ModuleId | "ticket", ReactElement> & {
  label: string;
  className?: string;
};

export function MachineLive({ label, className, ticket, ...modules }: Props) {
  const story = useStory();
  const zero = useMotionValue(0);
  const explode: MotionValue<number> = story?.explode ?? zero;
  const journey: MotionValue<number> = story?.journey ?? zero;
  const kpi: MotionValue<number> = story?.kpi ?? zero;

  const root = useRef<HTMLDivElement>(null);
  const groups = useRef<Partial<Record<ModuleId, SVGGElement | null>>>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const ticketRef = useRef<SVGGElement>(null);
  const clock = useRef(0);
  const shown = useRef("");
  const statusRef = useRef<HTMLParagraphElement>(null);
  const said = useRef("");
  const inView = useInView(root);

  const render = useCallback(() => {
    const node = root.current;
    if (!node) return;
    const e = explode.get();
    const j = journey.get();
    const k = kpi.get();

    const lift: Record<ModuleId, number> = {
      data: 0,
      services: 0,
      pipeline: 0,
      workbench: 0,
      roadmap: 0,
    };
    for (const id of ORDER) {
      lift[id] = MODULES[id].lift * GAP * shareOf(id, e);
      const group = groups.current[id];
      if (!group) continue;
      if (lift[id])
        group.setAttribute("transform", translate([0, 0, lift[id]]));
      else group.removeAttribute("transform");
    }

    // The ticket: find its leg, interpolate in world space with each stop's
    // tray lift, and draw it in the leg's tray and slot.
    let leg = STOPS.length - 2;
    for (let i = 0; i < STOPS.length - 1; i++) {
      if (j < STOPS[i + 1].j) {
        leg = i;
        break;
      }
    }
    const a = STOPS[leg];
    const b = STOPS[leg + 1];
    const t = clamp((j - a.j) / (b.j - a.j || 1));
    const pa: Point3 = [a.at[0], a.at[1], a.at[2] + lift[a.tray]];
    const pb: Point3 = [b.at[0], b.at[1], b.at[2] + lift[b.tray]];
    const s = ease(t);
    const p: Point3 = [
      pa[0] + (pb[0] - pa[0]) * s,
      pa[1] + (pb[1] - pa[1]) * s,
      pa[2] + (pb[2] - pa[2]) * s - lift[a.tray],
    ];
    const card = ticketRef.current;
    if (card) {
      const slot = node.querySelector(
        `[data-slot="${b.slot}"][data-tray="${a.tray}"]`,
      );
      if (slot && card.parentNode !== slot) slot.appendChild(card);
      card.setAttribute("transform", translate(p));
    }

    // Focus: while the ticket is travelling, the tray it is in leads.
    const travelling = e > 0.6 && j > 0 && j < 1 && k < 0.2;
    node.toggleAttribute("data-focus", travelling);
    for (const id of ORDER) {
      groups.current[id]?.toggleAttribute(
        "data-on",
        travelling && id === a.tray,
      );
    }

    for (const [i, at] of GATE_AT.entries()) {
      const lamp = node.querySelector(`[data-lamp="${i}"] .iso-solid`);
      lamp?.toggleAttribute("data-lit", j >= at && k < 0.98);
    }

    const lines = linesAt(j, k).slice(-SCREEN.lines);
    const text = lines.join("\n");
    if (text !== shown.current) {
      shown.current = text;
      const slots = node.querySelectorAll<SVGTextElement>("[data-line]");
      const pad = SCREEN.lines - lines.length;
      slots.forEach((slot, i) => {
        slot.textContent = i < pad ? "" : lines[i - pad];
      });
    }

    const status = statusOf(j, k, a.tray);
    const line = `${status.index}|${status.name}|${status.detail}`;
    const holder = statusRef.current;
    if (holder && line !== said.current) {
      const first = said.current === "";
      said.current = line;
      const [index, name, detail] = holder.children;
      index.textContent = status.index;
      name.textContent = status.name;
      detail.textContent = status.index ? `· ${status.detail}` : status.detail;
      if (
        !first &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        holder.animate([{ opacity: 0.25 }, { opacity: 1 }], {
          duration: 180,
          easing: "ease-out",
        });
      }
    }

    const needle = node.querySelector("[data-needle] path");
    needle?.setAttribute("d", needlePath(needleLevel(k)));

    const arm = node.querySelector("[data-arm]");
    if (arm) {
      const swing = within(j, ARM_WINDOW) * (1 - within(j, [0.94, 1]) * 0.6);
      const paths = armPaths(ARM_REST + ARM_SWING * swing);
      arm.querySelector(".iso-fill")?.setAttribute("d", paths.fill);
      arm.querySelector(".iso-top")?.setAttribute("d", paths.top);
      arm.querySelector(".iso-edge")?.setAttribute("d", paths.outline);
    }

    node
      .querySelector("[data-bar]")
      ?.setAttribute(
        "transform",
        translate([0, 0, BAR_RISE * within(j, BAR_WINDOW)]),
      );

    const done = node.querySelector<SVGGElement>("[data-done]");
    if (done) done.style.opacity = String(ease(clamp((k - 0.4) / 0.6)));
  }, [explode, journey, kpi]);

  const place = useCallback((time: number) => {
    const tokens = root.current?.querySelectorAll<SVGGElement>("[data-token]");
    if (!tokens) return;
    for (const token of tokens) {
      let pos: number;
      let fade: number;
      if (token.dataset.retry !== undefined) {
        const run = (time * 5) % RETRY_SPAN;
        pos = RETRY_FROM - run;
        fade = clamp(Math.min(run, RETRY_SPAN - run) / 6);
      } else {
        const lane = Number(token.dataset.lane);
        const slot = Number(token.dataset.slot);
        const raw =
          (slot * TOKEN_GAP + lane * 11 + time * SPEED * (1 + lane * 0.18)) %
          LANE_SPAN;
        pos = raw - LANE_SPAN / 2;
        fade = clamp((LANE_SPAN / 2 - Math.abs(pos)) / 7);
      }
      token.setAttribute("transform", translate([pos, 0, 0]));
      token.style.opacity = fade < 1 ? String(fade) : "";
    }
  }, []);

  useEffect(() => {
    render();
    place(0);
  }, [render, place]);

  // The ticket is moved between trays outside React; put it back where React
  // left it before React unmounts the tree.
  useEffect(() => {
    const svg = svgRef.current;
    const card = ticketRef.current;
    return () => {
      if (svg && card && card.parentNode !== svg) svg.appendChild(card);
    };
  }, []);

  useMotionValueEvent(explode, "change", render);
  useMotionValueEvent(journey, "change", render);
  useMotionValueEvent(kpi, "change", render);

  // Run the message lanes only while the figure is on screen and open.
  useLoop((dt, calm) => {
    if (calm) return false;
    if (explode.get() < 0.15) return true;
    clock.current += dt;
    place(clock.current);
    return true;
  }, inView);

  return (
    <div ref={root} className={`iso le ${className ?? ""}`}>
      <svg
        ref={svgRef}
        className="iso-svg le-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={label}
        focusable="false"
      >
        {ORDER.map((id) => (
          <g
            key={id}
            data-module={id}
            ref={(node) => {
              groups.current[id] = node;
            }}
          >
            {modules[id]}
          </g>
        ))}
        <g ref={ticketRef} data-ticket-home="">
          {ticket}
        </g>
      </svg>
      <p ref={statusRef} className="le-status" aria-live="polite">
        <span className="le-status-index">01</span>
        <span className="le-status-name">Roadmap</span>
        <span className="le-status-detail">· ready</span>
      </p>
    </div>
  );
}
