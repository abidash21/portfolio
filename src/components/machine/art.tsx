import { Fragment, type ReactElement, type ReactNode } from "react";
import {
  circleRing,
  corners,
  cylinder,
  depthOf,
  dotGrid,
  haloOf,
  insetPlan,
  lineOnTop,
  onTop,
  type Plan,
  type Plane,
  type Point3,
  planOutline,
  pointsAt,
  radialTicks,
  ring,
  sideMatrix,
  sideSeam,
  slabOf,
  topTicks,
} from "@/components/iso/iso-kit";
import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { MachineLive } from "./live";
import {
  ARM_REST,
  armPaths,
  BELT_Z,
  COLUMNS,
  GATES,
  LANE_Y,
  NEEDLE_Z,
  needleLevel,
  needlePath,
} from "./story";
import {
  at,
  BAR_RISE,
  FOOT,
  FOOT_H,
  GAUGE,
  GAUGE_FROM,
  GAUGE_SPAN,
  MODULES,
  type ModuleId,
  P,
  PIVOT,
  SCREEN,
  TOP,
  WALL,
  X0,
  X1,
  Y0,
  Y1,
} from "./view";

// Collects parts in painter's order and keys them.
function stack() {
  const list: ReactNode[] = [];
  const add = (...nodes: ReactNode[]) => {
    for (const node of nodes) {
      list.push(<Fragment key={list.length}>{node}</Fragment>);
    }
  };
  return { list, add };
}

const byDepth = <T,>(items: T[], at: (item: T) => Plane, z = 0) =>
  [...items].sort(
    (a, b) => depthOf([...at(a), z], P) - depthOf([...at(b), z], P),
  );

function hull(points: [number, number][]) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (
    o: [number, number],
    a: [number, number],
    b: [number, number],
  ) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: [number, number][]) => {
    const out: [number, number][] = [];
    for (const p of list) {
      while (
        out.length >= 2 &&
        cross(out[out.length - 2], out[out.length - 1], p) <= 0
      )
        out.pop();
      out.push(p);
    }
    return out.slice(0, -1);
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

const polygon = (points: [number, number][]) =>
  `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;

// The screen outline of a box, for clipping a part that slides out of a face.
const boxClip = (plan: Plan, z0: number, z1: number) =>
  polygon(
    hull(
      [plan.x, plan.x + plan.w].flatMap((x) =>
        [plan.y, plan.y + plan.d].flatMap((y) =>
          [z0, z1].map((z) => at([x, y, z] as Point3)),
        ),
      ),
    ),
  );

// A screw head: a faint ring with a dot in it, on a top face.
function screw([x, y]: Plane, z: number) {
  return (
    <>
      <Line d={ring(x, y, 1.6, z, P, 14)} tone="lo" />
      <Dots points={pointsAt([[x, y, z]], P)} size={0.5} tone="mid" />
    </>
  );
}

// A stamped index plate on the front (+y) face, top-left corner of a tray.
function indexPlate(id: ModuleId) {
  const { z, h, index } = MODULES[id];
  const tall = Math.min(Math.max(h - 7, 6), 10);
  return (
    <g transform={sideMatrix([X0 + 8, Y1], z + h - 3.5, P, "left")}>
      <rect className="le-plate" x={0} y={0} width={17} height={tall} rx={1} />
      <text
        className="iso-face-text le-index"
        x={8.5}
        y={tall / 2 + 1.9}
        fontSize={5.2}
        textAnchor="middle"
      >
        {index}
      </text>
    </g>
  );
}

// A drawer pull across the front face: two posts and a bar.
function pull(id: ModuleId) {
  const { z, h } = MODULES[id];
  const mid = z + h / 2 - 1.5;
  return (
    <>
      <Solid
        paths={slabOf({ x: -14, y: Y1, w: 3, d: 3, r: 0.4 }, mid, 3, P, 2)}
        tone="mid"
      />
      <Solid
        paths={slabOf({ x: 11, y: Y1, w: 3, d: 3, r: 0.4 }, mid, 3, P, 2)}
        tone="mid"
      />
      <Solid
        paths={slabOf({ x: -16, y: Y1 + 3, w: 32, d: 2.4, r: 1 }, mid, 3, P, 3)}
        tone="hi"
      />
    </>
  );
}

// Status LEDs on the right (+x) face; the live code lights the active tray's.
function leds(id: ModuleId) {
  const { z, h } = MODULES[id];
  return (
    <g data-leds="">
      <Dots
        points={[30, 36, 42].map((y) => at([X1, y, z + h - 4]))}
        size={0.8}
        tone="lo"
      />
    </g>
  );
}

const ticketSlot = (id: ModuleId, slot: "in" | "top") => (
  <g data-slot={slot} data-tray={id} />
);

// An open tray: floor, two back walls, contents, two front walls. The tray
// above sits on its rim, so everything inside stays below it. Contents may
// place the ticket's "in" slot themselves; otherwise it goes after them.
function tray(
  id: ModuleId,
  contents: (floor: number, slot: ReactNode) => ReactNode[],
  { handle = true }: { handle?: boolean } = {},
) {
  const { z, h } = MODULES[id];
  const rim = z + h;
  const floor = z + 2;
  const { list, add } = stack();
  const backY: Plan = { x: X0, y: Y0, w: X1 - WALL - X0, d: WALL, r: 1 };
  const backX: Plan = {
    x: X0,
    y: Y0 + WALL,
    w: WALL,
    d: Y1 - Y0 - WALL * 2,
    r: 1,
  };
  const frontX: Plan = {
    x: X1 - WALL,
    y: Y0,
    w: WALL,
    d: Y1 - WALL - Y0,
    r: 1,
  };
  const frontY: Plan = { x: X0, y: Y1 - WALL, w: X1 - X0, d: WALL, r: 1 };
  const pin = ([x, y]: Plane) => (
    <Solid paths={cylinder(x, y, 1.5, rim, 2.4, P, 16)} tone="mid" />
  );

  add(
    <Solid paths={slabOf(FOOT, z, 2, P, 3)} tone="lo" crease="none" />,
    <Line
      d={planOutline(insetPlan(FOOT, WALL + 3), floor, P, 3)}
      tone="faint"
    />,
    <Solid paths={slabOf(backY, z, h, P, 3)} tone="mid" />,
    <Solid paths={slabOf(backX, z, h, P, 3)} tone="mid" />,
    pin([X0 + WALL / 2, Y0 + WALL / 2]),
  );
  const slot = ticketSlot(id, "in");
  const inner = contents(floor, slot);
  add(...inner);
  if (!inner.includes(slot)) add(slot);
  add(
    <Solid paths={slabOf(frontX, z, h, P, 3)} tone="mid" />,
    <Solid
      paths={slabOf(frontY, z, h, P, 3, 0.5)}
      tone="mid"
      inner={<Line d={sideSeam(FOOT, z + 2, P, 3)} tone="faint" />}
    />,
    screw([X1 - WALL / 2, Y0 + WALL / 2], rim),
    screw([X0 + WALL / 2, Y1 - WALL / 2], rim),
    pin([X1 - WALL / 2, Y1 - WALL / 2]),
    indexPlate(id),
    leds(id),
  );
  if (handle) add(pull(id));
  add(ticketSlot(id, "top"));
  return list;
}

// 05 · Data: a disk pack on a spindle, a head arm that swings when a write
// lands, and a bar chart whose last bar rises: the metric moved.
const BARS = [
  { x: 22, h: 5 },
  { x: 33, h: 8 },
  { x: 44, h: 11 },
  { x: 55, h: 9 },
];

function dataModule() {
  const { list, add } = stack();
  add(<path className="iso-halo" d={haloOf(FOOT, -FOOT_H, FOOT_H, P)} />);
  for (const [x, y] of byDepth(corners(FOOT, 12), (p) => p)) {
    add(
      <Solid paths={cylinder(x, y, 6.5, -FOOT_H, 1.4, P, 24)} tone="lo" />,
      <Solid
        paths={cylinder(x, y, 4.6, -FOOT_H + 1.4, FOOT_H - 1.4, P, 24)}
        tone="mid"
      />,
    );
  }
  add(
    ...tray("data", (f) => {
      const parts = stack();
      const plinth: Plan = { x: 18, y: -45, w: 48, d: 14, r: 1 };
      const deck = f + 1.4;
      parts.add(
        <Solid paths={slabOf(plinth, f, 1.4, P, 2)} tone="lo" />,
        <Line
          d={planOutline(insetPlan(plinth, 1.5), deck, P, 2)}
          tone="faint"
        />,
      );
      for (const [i, bar] of BARS.entries()) {
        const plan: Plan = { x: bar.x, y: -42, w: 8, d: 8, r: 0.6 };
        if (i < BARS.length - 1) {
          parts.add(
            <Solid paths={slabOf(plan, deck, bar.h, P, 2, 0.4)} tone="mid" />,
          );
        } else {
          parts.add(
            <>
              <defs>
                <clipPath id="mx-bar-clip">
                  <path d={boxClip(plan, deck, deck + 40)} />
                </clipPath>
              </defs>
              <g clipPath="url(#mx-bar-clip)">
                <g data-bar="">
                  <Solid
                    paths={slabOf(
                      plan,
                      deck - BAR_RISE,
                      bar.h + BAR_RISE,
                      P,
                      2,
                      0.4,
                    )}
                    tone="hi"
                  />
                </g>
              </g>
              <Line d={planOutline(plan, deck, P, 2)} tone="lo" />
            </>,
          );
        }
      }
      const cx = -28;
      const cy = 0;
      parts.add(
        <Solid paths={cylinder(cx, cy, 34, f, 2, P, 72)} tone="lo" />,
        <Line d={ring(cx, cy, 31, f + 2, P, 72)} tone="faint" />,
      );
      const platters = [f + 4, f + 8.5, f + 13];
      let hub = f + 2;
      for (const [i, pz] of platters.entries()) {
        parts.add(
          <Solid
            paths={cylinder(cx, cy, 7, hub, pz - hub, P, 32)}
            tone="mid"
            crease="none"
          />,
          <Solid paths={cylinder(cx, cy, 30, pz, 1.6, P, 96, 0.6)} tone="hi" />,
        );
        if (i === platters.length - 1) {
          for (const r of [25, 19, 13]) {
            parts.add(
              <Line d={ring(cx, cy, r, pz + 1.6, P, 72)} tone="faint" />,
            );
          }
        }
        hub = pz + 1.6;
      }
      const arm = armPaths(ARM_REST);
      parts.add(
        <Solid paths={cylinder(cx, cy, 7, hub, 2.4, P, 32, 0.4)} tone="mid" />,
        <Dots
          points={pointsAt(
            circleRing(cx, cy, 4.4, 6).map(([x, y]) => [x, y, hub + 2.4]),
            P,
          )}
          size={0.45}
          tone="mid"
        />,
        <Solid
          paths={cylinder(PIVOT[0], PIVOT[1], 6, f, 15, P, 32, 0.5)}
          tone="mid"
        />,
        <g data-arm="" className="iso-solid">
          <path className="iso-fill" d={arm.fill} />
          <path className="iso-top" d={arm.top} />
          <path className="iso-line iso-edge" data-tone="hi" d={arm.outline} />
        </g>,
        <Solid
          paths={cylinder(PIVOT[0], PIVOT[1], 3, f + 16.2, 1.4, P, 20)}
          tone="mid"
        />,
      );
      return parts.list;
    }),
  );
  return list;
}

// 04 · Services: three lanes of messages, a retry lane, an offset ruler and
// the broker box.
export const LANES = [-28, LANE_Y, 6];
const RETRY = 24;
const TOKENS_PER_LANE = 4;

function servicesModule() {
  return tray("services", (f, slot) => {
    const { list, add } = stack();
    const strip: Plan = { x: -71, y: Y0 + WALL + 1, w: 142, d: 5, r: 0.6 };
    const ticks = topTicks(-69, 69, 4, 5, strip.y, f + 0.6, [1.6, 3], P);
    add(
      <Solid paths={slabOf(strip, f, 0.6, P, 2)} tone="lo" crease="none" />,
      <Line d={ticks.minor} tone="lo" />,
      <Line d={ticks.major} tone="mid" />,
    );
    const rail = (x0: number, x1: number, y: number) => (
      <Solid
        paths={slabOf({ x: x0, y, w: x1 - x0, d: 2, r: 0.6 }, f, 5, P, 2)}
        tone="mid"
      />
    );
    for (const [lane, yc] of LANES.entries()) {
      add(
        rail(-71, 71, yc - 8),
        <Line d={lineOnTop([-71, yc], [71, yc], f, P)} tone="faint" />,
      );
      for (let t = 0; t < TOKENS_PER_LANE; t++) {
        add(
          <g data-token="" data-lane={lane} data-slot={t}>
            <Solid
              paths={slabOf(
                { x: -4, y: yc - 4.5, w: 8, d: 9, r: 1 },
                f,
                6,
                P,
                3,
                0.4,
              )}
              tone="hi"
            />
          </g>,
        );
      }
      if (yc === LANE_Y) add(slot);
      add(rail(-71, 71, yc + 6));
    }
    add(
      rail(-71, 30, RETRY - 6.5),
      <Solid
        paths={slabOf(
          { x: -71, y: RETRY - 4.5, w: 4, d: 9, r: 0.6 },
          f,
          5,
          P,
          2,
        )}
        tone="mid"
      />,
      <g data-token="" data-retry="">
        <Solid
          paths={slabOf(
            { x: -3.5, y: RETRY - 3.5, w: 7, d: 7, r: 1 },
            f,
            5,
            P,
            3,
            0.4,
          )}
          tone="hi"
        />
      </g>,
      <Solid
        paths={slabOf(
          { x: 30, y: RETRY - 6.5, w: 4, d: 13, r: 0.6 },
          f,
          5,
          P,
          2,
        )}
        tone="mid"
      />,
      rail(-71, 30, RETRY + 4.5),
    );
    const broker: Plan = { x: 38, y: 33, w: 30, d: 9, r: 1 };
    add(
      <Solid paths={slabOf(broker, f, 7, P, 3, 0.4)} tone="mid" />,
      <Dots
        points={dotGrid(42, 36, 7, 1, 3.6, f + 7, P)}
        size={0.55}
        tone="hi"
        pulse
      />,
      <Line d={lineOnTop([41, 39.5], [65, 39.5], f + 7, P)} tone="faint" />,
    );
    return list;
  });
}

// 03 · Pipeline: a CI belt through three gates (build, test, review), each
// with a lamp that lights as the ticket passes under it.
function pipelineModule() {
  return tray("pipeline", (f, slot) => {
    const { list, add } = stack();
    const belt: Plan = { x: -72, y: -9, w: 144, d: 18, r: 9 };
    const strip: Plan = { x: -66, y: Y0 + WALL + 2, w: 132, d: 5, r: 0.6 };
    const ticks = topTicks(-64, 64, 4, 8, strip.y, f + 0.6, [1.6, 3], P);
    add(
      <Solid paths={slabOf(strip, f, 0.6, P, 2)} tone="lo" crease="none" />,
      <Line d={ticks.minor} tone="lo" />,
      <Line d={ticks.major} tone="mid" />,
      <Solid
        paths={slabOf({ x: -66, y: -12.5, w: 132, d: 1.6, r: 0.4 }, f, 4, P, 2)}
        tone="mid"
      />,
    );
    for (const x of GATES) {
      add(
        <Solid
          paths={slabOf(
            { x: x - 1.6, y: -14, w: 3.2, d: 3.2, r: 0.5 },
            f,
            10,
            P,
            2,
          )}
          tone="mid"
        />,
      );
    }
    add(<Solid paths={slabOf(belt, f, 3, P, 10, 0.5)} tone="mid" />);
    for (let x = -60; x <= 60; x += 6) {
      add(<Line d={lineOnTop([x, -9], [x, 9], BELT_Z, P)} tone="faint" />);
    }
    for (const cx of [-63, 63]) {
      add(<Solid paths={cylinder(cx, 0, 3, BELT_Z, 0.8, P, 20)} tone="lo" />);
    }
    add(slot);
    add(
      <Solid
        paths={slabOf({ x: -66, y: 10.9, w: 132, d: 1.6, r: 0.4 }, f, 4, P, 2)}
        tone="mid"
      />,
    );
    for (const [i, x] of GATES.entries()) {
      add(
        <Solid
          paths={slabOf(
            { x: x - 1.6, y: 10.8, w: 3.2, d: 3.2, r: 0.5 },
            f,
            10,
            P,
            2,
          )}
          tone="mid"
        />,
        <Solid
          paths={slabOf(
            { x: x - 2.2, y: -14.4, w: 4.4, d: 28.6, r: 0.8 },
            f + 10,
            1.8,
            P,
            2,
            0.3,
          )}
          tone="mid"
        />,
        <g data-lamp={i}>
          <Solid paths={cylinder(x, 0, 1.8, f + 11.8, 1.2, P, 20)} tone="hi" />
        </g>,
      );
    }
    return list;
  });
}

const LINE_KEYS = ["first", "second", "third", "fourth"];

// 02 · Workbench: a keyboard, a notebook, a mug, and a screen in the front
// face that prints what is being done.
function workbenchModule() {
  const { z, h } = MODULES.workbench;
  const rim = z + h;
  const parts = tray(
    "workbench",
    (f) => {
      const { list, add } = stack();
      const board: Plan = { x: -66, y: -14, w: 76, d: 31, r: 2 };
      add(
        <Solid paths={slabOf(board, f, 2.4, P, 3, 0.5)} tone="mid" />,
        <Line
          d={planOutline(insetPlan(board, 1.4), f + 2.4, P, 3)}
          tone="faint"
        />,
      );
      const keys: { plan: Plan }[] = [];
      for (let row = 0; row < 4; row++) {
        const y = -11.5 + row * 6.6;
        if (row < 3) {
          for (let col = 0; col < 12; col++) {
            keys.push({ plan: { x: -63.5 + col * 6, y, w: 5, d: 5, r: 0.8 } });
          }
        } else {
          for (const [x, w] of [
            [-63.5, 5],
            [-57.5, 5],
            [-51.5, 41],
            [-9.5, 5],
            [-3.5, 5],
          ]) {
            keys.push({ plan: { x, y, w, d: 5, r: 0.8 } });
          }
        }
      }
      for (const { plan } of byDepth(keys, ({ plan }) => [
        plan.x + plan.w / 2,
        plan.y + plan.d / 2,
      ])) {
        add(<Solid paths={slabOf(plan, f + 2.4, 1.4, P, 2, 0.3)} tone="hi" />);
      }
      const notebook: Plan = { x: 20, y: 2, w: 24, d: 32, r: 1 };
      add(
        <Solid paths={slabOf(notebook, f, 2.2, P, 2, 0.4)} tone="mid" />,
        <Dots
          points={[6, 10, 14, 18, 22, 26, 30].map((y) =>
            at([22.5, notebook.y + y, f + 2.2]),
          )}
          size={0.5}
          tone="mid"
        />,
        ...[8, 13, 18, 23, 28].map((y, i) => (
          <Line
            key={y}
            d={lineOnTop(
              [26, notebook.y + y],
              [26 + [14, 10, 15, 8, 12][i], notebook.y + y],
              f + 2.2,
              P,
            )}
            tone="lo"
            free
          />
        )),
      );
      const [mx, my] = [56, 22];
      add(
        <Solid
          paths={slabOf(
            { x: mx + 5, y: my - 1.5, w: 4, d: 3, r: 1 },
            f + 2,
            6,
            P,
            2,
          )}
          tone="mid"
        />,
        <Solid paths={cylinder(mx, my, 6, f, 10, P, 40, 0.5)} tone="mid" />,
        <path
          className="le-void"
          d={onTop(circleRing(mx, my, 4.8, 32), f + 10, P, true)}
        />,
        <Line d={ring(mx, my, 4.8, f + 10, P, 32)} tone="lo" />,
      );
      return list;
    },
    { handle: false },
  );
  const { u, v, w, h: sh, lines } = SCREEN;
  const pitch = sh / lines;
  return [
    ...parts.slice(0, -1),
    <g key="screen" transform={sideMatrix([X0, Y1], rim, P, "left")}>
      <rect
        className="le-plate"
        x={u - 2}
        y={v - 1.5}
        width={w + 4}
        height={sh + 3}
        rx={1.5}
      />
      <rect className="le-screen" x={u} y={v} width={w} height={sh} rx={0.8} />
      <clipPath id="mx-screen-clip">
        <rect x={u} y={v} width={w} height={sh} rx={0.8} />
      </clipPath>
      <g clipPath="url(#mx-screen-clip)">
        {LINE_KEYS.slice(0, lines).map((name, i) => (
          <text
            key={name}
            className="le-screen-text"
            data-line={i}
            x={u + 3}
            y={v + pitch * (i + 1) - 1.4}
            fontSize={3.4}
          >
            {i === lines - 1 ? "$ _" : ""}
          </text>
        ))}
      </g>
    </g>,
    parts[parts.length - 1],
  ];
}

// 01 · Roadmap: a closed lid carrying a kanban board (todo, doing, done) and
// a KPI gauge whose needle climbs once the work ships.
const CARD_ROWS = [-31, -19, -7, 5];

function card(x: number, y: number, z: number, width = 22) {
  return (
    <>
      <Solid
        paths={slabOf(
          { x: x - width / 2, y: y - 4.5, w: width, d: 9, r: 1 },
          z,
          1.2,
          P,
          2,
          0.3,
        )}
        tone="mid"
      />
      <Line
        d={lineOnTop(
          [x - width / 2 + 3, y - 1.5],
          [x + width / 2 - 6, y - 1.5],
          z + 1.2,
          P,
        )}
        tone="lo"
        free
      />
      <Line
        d={lineOnTop([x - width / 2 + 3, y + 1.5], [x, y + 1.5], z + 1.2, P)}
        tone="faint"
        free
      />
    </>
  );
}

function roadmapModule() {
  const { z, h } = MODULES.roadmap;
  const { list, add } = stack();
  const lid = TOP + 0.6;
  add(
    <Solid
      paths={slabOf(FOOT, z, h, P, 3, 1)}
      tone="mid"
      inner={<Line d={sideSeam(FOOT, z + 4, P, 3)} tone="faint" />}
    />,
    <Line d={planOutline(insetPlan(FOOT, 5), TOP, P, 3)} tone="faint" />,
  );
  for (const p of corners(FOOT, 6)) add(screw(p, TOP));
  // Kanban columns: an inlaid lane each, with a header strip at the back.
  for (const x of COLUMNS) {
    const lane: Plan = { x: x - 15, y: -42, w: 30, d: 84, r: 1.5 };
    add(
      <Solid paths={slabOf(lane, TOP, 0.6, P, 3)} tone="lo" crease="none" />,
      <Solid
        paths={slabOf({ x: x - 15, y: -42, w: 30, d: 5, r: 1.5 }, lid, 1, P, 3)}
        tone="mid"
      />,
    );
  }
  const columns: [number, number[]][] = [
    [COLUMNS[0], [0, 1]],
    [COLUMNS[1], [0]],
    [COLUMNS[2], [0, 1, 2]],
  ];
  for (const [x, rows] of columns) {
    for (const row of rows) add(card(x, CARD_ROWS[row], lid));
  }
  add(<g data-done="">{card(COLUMNS[2], CARD_ROWS[3], lid)}</g>);
  // KPI gauge.
  const { x: gx, y: gy, r: gr, h: gh } = GAUGE;
  const face = lid + gh;
  const ticks = radialTicks(
    gx,
    gy,
    gr - 1.6,
    26,
    5,
    face,
    [1.2, 2.6],
    P,
    GAUGE_FROM,
    GAUGE_SPAN,
  );
  add(
    <Solid paths={cylinder(gx, gy, gr + 2, TOP, 0.6, P, 56)} tone="lo" />,
    <Solid paths={cylinder(gx, gy, gr, lid, gh, P, 64, 0.6)} tone="mid" />,
    <Line d={ring(gx, gy, gr - 1, face, P, 64)} tone="lo" />,
    <Line d={ticks.minor} tone="lo" />,
    <Line d={ticks.major} tone="mid" />,
    <Line
      d={
        radialTicks(
          gx,
          gy,
          gr - 1.6,
          1,
          1,
          face,
          [3.2, 3.2],
          P,
          GAUGE_FROM + GAUGE_SPAN * 0.85,
          0,
        ).major
      }
      tone="lit"
    />,
    <g data-needle="">
      <Line d={needlePath(needleLevel(0))} tone="hi" />
    </g>,
    <Solid paths={cylinder(gx, gy, 1.8, NEEDLE_Z, 0.8, P, 20)} tone="hi" />,
    <Dots points={dotGrid(42, -42, 9, 3, 3.6, TOP, P)} size={0.5} tone="lo" />,
  );
  // Vents on the right (+x) face, and the index plate on the front.
  add(
    <g transform={sideMatrix([X1, Y1], TOP - 4, P, "right")}>
      {[14, 20, 26, 32, 38, 44].map((u) => (
        <rect
          key={u}
          className="le-slot"
          x={u}
          y={0}
          width={2.4}
          height={8}
          rx={1.2}
        />
      ))}
    </g>,
    indexPlate("roadmap"),
    leds("roadmap"),
    ticketSlot("roadmap", "top"),
  );
  return list;
}

// The ticket: one card of work, the figure's single lit part.
const TICKET = (
  <g key="ticket" data-ticket="">
    <Solid
      paths={slabOf({ x: -6.5, y: -4.5, w: 13, d: 9, r: 1 }, 0, 1.4, P, 2, 0.4)}
      tone="hi"
      lit
    />
    <Line d={lineOnTop([-4, -1.5], [3, -1.5], 1.4, P)} tone="lit" free />
  </g>
);

const LABEL =
  "An isometric drawing of a machine that turns an idea into shipped software: five stacked trays for a roadmap with a kanban board and KPI gauge, a workbench with a keyboard and a screen, a CI belt through build, test and review gates, a tray of service message lanes, and a data tray with a disk pack and a bar chart. Scrolling pulls it apart and walks one ticket through it, then puts it back together.";

const g = (id: string, children: ReactNode[]): ReactElement => (
  <g key={id}>{children}</g>
);

export function MachineArt({ className }: { className?: string }) {
  return (
    <MachineLive
      className={className}
      label={LABEL}
      ticket={TICKET}
      data={g("data", dataModule())}
      services={g("services", servicesModule())}
      pipeline={g("pipeline", pipelineModule())}
      workbench={g("workbench", workbenchModule())}
      roadmap={g("roadmap", roadmapModule())}
    />
  );
}
