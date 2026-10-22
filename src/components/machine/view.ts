import {
  axisVector,
  boxCorners,
  type Flat,
  fitProjection,
  iso,
  type Plan,
  type Point3,
} from "@/components/iso/iso-kit";

// World layout of the machine: five stacked trays on one footprint, z up,
// about one unit per px of the real thing.
export const AZIMUTH = 55;
export const WIDTH = 520;

export const X0 = -80;
export const X1 = 80;
export const Y0 = -50;
export const Y1 = 50;
export const WALL = 5;
export const FOOT: Plan = { x: X0, y: Y0, w: X1 - X0, d: Y1 - Y0, r: 1.5 };
export const FOOT_H = 5;

// Gap each tray opens to its neighbour when the stack is fully apart.
export const GAP = 46;

export type ModuleId =
  | "data"
  | "services"
  | "pipeline"
  | "workbench"
  | "roadmap";

// Bottom to top. `lift` is how many gaps a tray travels: the pipeline stays
// put, the trays above rise and the ones below drop.
export const MODULES: Record<
  ModuleId,
  { z: number; h: number; lift: number; index: string }
> = {
  data: { z: 0, h: 24, lift: -2, index: "05" },
  services: { z: 24, h: 16, lift: -1, index: "04" },
  pipeline: { z: 40, h: 14, lift: 0, index: "03" },
  workbench: { z: 54, h: 22, lift: 1, index: "02" },
  roadmap: { z: 76, h: 16, lift: 2, index: "01" },
};

export const ORDER: ModuleId[] = [
  "data",
  "services",
  "pipeline",
  "workbench",
  "roadmap",
];

export const TOP = MODULES.roadmap.z + MODULES.roadmap.h;
export const floorOf = (id: ModuleId) => MODULES[id].z + 2;
export const rimOf = (id: ModuleId) => MODULES[id].z + MODULES[id].h;

// The KPI gauge on the roadmap lid.
export const GAUGE = { x: 56, y: 14, r: 15, h: 4 };
export const GAUGE_FROM = (-130 * Math.PI) / 180;
export const GAUGE_SPAN = (260 * Math.PI) / 180;

// The head arm over the disk pack in the data tray.
export const PIVOT: [number, number] = [30, 30];
export const ARM_LEN = 44;

// The rising bar of the chart in the data tray.
export const BAR_RISE = 9;

// The screen recessed in the workbench's front face, in face units.
export const SCREEN = { u: 26, v: 3, w: 100, h: 16, lines: 3 };

const points: Point3[] = [
  ...boxCorners(FOOT, -FOOT_H + GAP * MODULES.data.lift, 0),
  ...boxCorners(FOOT, TOP, TOP + 4 + GAP * MODULES.roadmap.lift),
  ...boxCorners(
    { x: X1, y: 0, w: 18, d: 30, r: 0 },
    GAP * MODULES.data.lift,
    TOP + GAP * MODULES.roadmap.lift,
  ),
];

const PAD = 14;

function heightFor(width: number) {
  const unit = { origin: [0, 0] as Flat, scale: 1, azimuth: AZIMUTH };
  const flat = points.map((point) => iso(point, unit));
  const xs = flat.map(([x]) => x);
  const ys = flat.map(([, y]) => y);
  const ratio =
    (Math.max(...ys) - Math.min(...ys)) / (Math.max(...xs) - Math.min(...xs));
  return Math.round((width - PAD * 2) * ratio + PAD * 2);
}

export const HEIGHT = heightFor(WIDTH);
export const P = fitProjection(points, WIDTH, HEIGHT, {
  pad: PAD,
  azimuth: AZIMUTH,
});

export const at = (point: Point3) => iso(point, P);

// Screen vectors of one world unit, for moving pre-built groups.
export const EX = axisVector(P, [1, 0, 0]);
export const EY = axisVector(P, [0, 1, 0]);
export const EZ = axisVector(P, [0, 0, 1]);
