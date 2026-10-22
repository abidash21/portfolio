import {
  extrude,
  lineOnTop,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";
import {
  ARM_LEN,
  floorOf,
  GAUGE,
  GAUGE_FROM,
  GAUGE_SPAN,
  type ModuleId,
  P,
  PIVOT,
  rimOf,
  TOP,
  X1,
} from "./view";

// Parts that change shape as the story plays, rebuilt per frame.

export const ARM_REST = Math.atan2(10 - PIVOT[1], -12 - PIVOT[0]);
export const ARM_SWING = 0.42;
export const ARM_Z = floorOf("data") + 15;

export function armPaths(angle: number) {
  const [px, py] = PIVOT;
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const nx = -uy;
  const ny = ux;
  const tip = (along: number, side: number): Plane => [
    px + ux * along + nx * side,
    py + uy * along + ny * side,
  ];
  const ring: Plane[] = [
    tip(0, 5),
    tip(ARM_LEN - 6, 2),
    tip(ARM_LEN - 5, 3.2),
    tip(ARM_LEN, 3.2),
    tip(ARM_LEN, -3.2),
    tip(ARM_LEN - 5, -3.2),
    tip(ARM_LEN - 6, -2),
    tip(0, -5),
  ];
  return extrude(ring, ARM_Z, 1.2, P);
}

export const NEEDLE_Z = TOP + 0.6 + GAUGE.h;

export function needlePath(level: number) {
  const angle = GAUGE_FROM + GAUGE_SPAN * level;
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  return lineOnTop(
    [GAUGE.x - sx * 3, GAUGE.y - sy * 3],
    [GAUGE.x + sx * (GAUGE.r - 3.5), GAUGE.y + sy * (GAUGE.r - 3.5)],
    NEEDLE_Z,
    P,
  );
}

export const needleLevel = (kpi: number) => 0.24 + 0.58 * kpi;

// The ticket's route. Each stop is a world point at the assembled position
// of the tray it belongs to, so the live code adds that tray's lift. Between
// two stops the ticket is drawn in the first stop's tray, in the second
// stop's slot: "in" behind the front walls, or "top" over everything.

export type Slot = "in" | "top";
export interface Stop {
  j: number;
  tray: ModuleId;
  at: Point3;
  slot: Slot;
}

const OUT_X = X1 + 10;
const OUT_Y = 18;
const LIFT = 5;

export const COLUMNS = [-57, -23, 11];
export const TICKET_Y = 20;
export const BELT_Z = floorOf("pipeline") + 3;
export const GATES = [-30, 2, 34];
export const LANE_Y = -11;

const stops: Stop[] = [];
const stop = (j: number, tray: ModuleId, at: Point3, slot: Slot = "in") =>
  stops.push({ j, tray, at, slot });

// Leaves `from` at `fromAt`, goes over the edge and down the right side, and
// lands in `to` at `toAt`.
function hop(
  [j0, j1]: [number, number],
  from: ModuleId,
  fromAt: Point3,
  to: ModuleId,
  toAt: Point3,
) {
  const step = (j1 - j0) / 5;
  const high = from === "roadmap" ? TOP + 0.6 + LIFT : rimOf(from) + LIFT;
  const low = rimOf(to) + LIFT;
  stop(j0 + step, from, [fromAt[0], fromAt[1], high], "top");
  stop(j0 + step * 2, from, [OUT_X, OUT_Y, high], "top");
  stop(j0 + step * 3, to, [OUT_X, OUT_Y, low], "top");
  stop(j0 + step * 4, to, [toAt[0], toAt[1], low], "top");
  stop(j1, to, toAt, "in");
}

const LID = TOP + 0.6;
const WORK_AT: Point3 = [36, -22, floorOf("workbench")];
const DATA_AT: Point3 = [40, -6, floorOf("data")];

stop(0, "roadmap", [COLUMNS[0], TICKET_Y, LID], "top");
stop(0.06, "roadmap", [COLUMNS[1], TICKET_Y, LID], "top");
hop([0.06, 0.18], "roadmap", [COLUMNS[1], TICKET_Y, LID], "workbench", WORK_AT);
stop(0.28, "workbench", WORK_AT);
hop([0.28, 0.37], "workbench", WORK_AT, "pipeline", [-64, 0, BELT_Z]);
stop(0.5, "pipeline", [64, 0, BELT_Z]);
hop([0.5, 0.59], "pipeline", [64, 0, BELT_Z], "services", [
  -62,
  LANE_Y,
  floorOf("services"),
]);
stop(0.72, "services", [40, LANE_Y, floorOf("services")]);
hop(
  [0.72, 0.83],
  "services",
  [40, LANE_Y, floorOf("services")],
  "data",
  DATA_AT,
);
stop(1, "data", DATA_AT);

export const STOPS = stops;

// When the ticket passes each gate on the belt.
export const GATE_AT = GATES.map((x) => 0.37 + ((x + 64) / 128) * (0.5 - 0.37));

export const ARM_WINDOW: [number, number] = [0.8, 0.9];
export const BAR_WINDOW: [number, number] = [0.84, 0.93];

// What the workbench screen prints as the journey passes each point.
export const LOG: [number, string][] = [
  [0.01, "$ roadmap next  → FEAT-128"],
  [0.06, "> moved to doing"],
  [0.18, "$ git checkout -b feat-128"],
  [0.22, "$ vim src/feature.ts"],
  [0.26, "$ npm test   ✓ 42 passed"],
  [0.29, "$ git push -u origin feat-128"],
  [GATE_AT[0], "ci  build    ✓"],
  [GATE_AT[1], "ci  test     ✓"],
  [GATE_AT[2], "pr  review   ✓ approved"],
  [0.56, "deploy  → prod"],
  [0.68, "events  flowing"],
  [0.88, "metric  +1  ▲"],
];
export const SHIPPED = "shipped ✓";
export const IDLE = "$ _";

// Names for the status line beside the figure.
export const STAGES: Record<ModuleId, string> = {
  roadmap: "Roadmap",
  workbench: "Workbench",
  pipeline: "Pipeline",
  services: "Services",
  data: "Data",
};

// What each tray is for, shown in the status line while it is hovered.
export const ROLES: Record<ModuleId, string> = {
  roadmap: "plan, prioritise, measure",
  workbench: "code, test, commit",
  pipeline: "build, test, review",
  services: "events in flight",
  data: "store, measure",
};
